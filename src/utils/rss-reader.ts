export type RssItem = {
	id: string;
	title: string;
	link: string;
	summary: string;
	published: string;
	publishedMs: number;
};

export type RssFeed = {
	title: string;
	link: string;
	description: string;
	items: RssItem[];
};

export type StoredSubscription = {
	id: string;
	url: string;
	title: string;
	addedAt: number;
};

const STORAGE_KEY = "mizuki-rss-subscriptions";

export function loadSubscriptions(): StoredSubscription[] {
	if (typeof localStorage === "undefined") return [];
	try {
		const raw = localStorage.getItem(STORAGE_KEY);
		if (!raw) return [];
		const parsed = JSON.parse(raw) as StoredSubscription[];
		return Array.isArray(parsed) ? parsed : [];
	} catch {
		return [];
	}
}

export function saveSubscriptions(list: StoredSubscription[]): void {
	if (typeof localStorage === "undefined") return;
	localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
}

function textContent(el: Element | null | undefined): string {
	return (el?.textContent ?? "").replace(/\s+/g, " ").trim();
}

function attr(el: Element | null | undefined, name: string): string {
	return el?.getAttribute(name)?.trim() ?? "";
}

function firstChild(parent: Element, names: string[]): Element | null {
	for (const name of names) {
		const found = parent.getElementsByTagName(name)[0];
		if (found) return found;
	}
	return null;
}

function stripHtml(html: string): string {
	if (!html) return "";
	const doc = new DOMParser().parseFromString(html, "text/html");
	return (doc.body.textContent ?? "").replace(/\s+/g, " ").trim();
}

function parseDate(value: string): { iso: string; ms: number } {
	if (!value) return { iso: "", ms: 0 };
	const ms = Date.parse(value);
	if (Number.isNaN(ms)) return { iso: value, ms: 0 };
	return { iso: new Date(ms).toISOString(), ms };
}

function itemLink(el: Element): string {
	const linkEls = el.getElementsByTagName("link");
	for (const link of Array.from(linkEls)) {
		const href = attr(link, "href");
		if (href) return href;
		const text = textContent(link);
		if (text.startsWith("http")) return text;
	}
	const guid = firstChild(el, ["guid"]);
	const guidText = textContent(guid);
	if (guidText.startsWith("http")) return guidText;
	return "";
}

function itemContent(el: Element): string {
	const encoded = firstChild(el, ["content:encoded", "encoded"]);
	if (encoded) return textContent(encoded) || (encoded.textContent ?? "").trim();
	const content = firstChild(el, ["content"]);
	if (content) {
		const type = attr(content, "type");
		const raw = content.textContent ?? "";
		if (type === "html" || raw.includes("<")) return raw.trim();
		return textContent(content);
	}
	const summary = firstChild(el, ["summary", "description"]);
	return summary?.textContent?.trim() ?? textContent(summary);
}

export function parseFeedXml(xmlText: string): RssFeed {
	const doc = new DOMParser().parseFromString(xmlText, "application/xml");
	const parseError = doc.querySelector("parsererror");
	if (parseError) {
		throw new Error("parse");
	}

	const feedRoot = doc.querySelector("feed");
	if (feedRoot) {
		const title = textContent(firstChild(feedRoot, ["title"])) || "Untitled";
		const linkEl =
			Array.from(feedRoot.getElementsByTagName("link")).find(
				(l) => !attr(l, "rel") || attr(l, "rel") === "alternate",
			) ?? feedRoot.getElementsByTagName("link")[0];
		const link = attr(linkEl, "href") || textContent(linkEl);
		const description = textContent(firstChild(feedRoot, ["subtitle", "summary"]));
		const entries = Array.from(feedRoot.getElementsByTagName("entry"));
		const items = entries.map((entry, index) => {
			const itemTitle = textContent(firstChild(entry, ["title"])) || "(untitled)";
			const itemLinkHref = itemLink(entry);
			const rawContent = itemContent(entry);
			const dateRaw =
				textContent(firstChild(entry, ["published", "updated", "dc:date"])) ||
				"";
			const { iso, ms } = parseDate(dateRaw);
			const id =
				textContent(firstChild(entry, ["id"])) ||
				itemLinkHref ||
				`${itemTitle}-${index}`;
			return {
				id,
				title: itemTitle,
				link: itemLinkHref,
				summary: stripHtml(rawContent).slice(0, 400),
				published: iso || dateRaw,
				publishedMs: ms,
			};
		});
		items.sort((a, b) => b.publishedMs - a.publishedMs);
		return { title, link, description, items };
	}

	const channel = doc.querySelector("channel") ?? doc.querySelector("rss");
	if (!channel) {
		throw new Error("parse");
	}

	const channelEl = doc.querySelector("channel") ?? channel;
	const title = textContent(firstChild(channelEl, ["title"])) || "Untitled";
	const link = textContent(firstChild(channelEl, ["link"]));
	const description = textContent(firstChild(channelEl, ["description"]));
	const itemNodes = Array.from(doc.getElementsByTagName("item"));
	const items = itemNodes.map((item, index) => {
		const itemTitle = textContent(firstChild(item, ["title"])) || "(untitled)";
		const itemLinkHref = itemLink(item);
		const rawContent = itemContent(item);
		const dateRaw =
			textContent(
				firstChild(item, ["pubDate", "published", "dc:date", "date"]),
			) || "";
		const { iso, ms } = parseDate(dateRaw);
		const id =
			textContent(firstChild(item, ["guid"])) ||
			itemLinkHref ||
			`${itemTitle}-${index}`;
		return {
			id,
			title: itemTitle,
			link: itemLinkHref,
			summary: stripHtml(rawContent).slice(0, 400),
			published: iso || dateRaw,
			publishedMs: ms,
		};
	});
	items.sort((a, b) => b.publishedMs - a.publishedMs);
	return { title, link, description, items };
}

function siteProxyFeedUrl(url: string): string {
	return `/api/proxy-feed?url=${encodeURIComponent(url)}`;
}

function publicCorsProxyUrl(url: string): string {
	return `https://api.allorigins.win/raw?url=${encodeURIComponent(url)}`;
}

async function fetchText(url: string): Promise<string> {
	const res = await fetch(url, {
		mode: "cors",
		credentials: "omit",
		headers: {
			Accept: "application/rss+xml, application/atom+xml, application/xml, text/xml, */*;q=0.8",
		},
	});
	if (!res.ok) {
		throw new Error(`http-${res.status}`);
	}
	return res.text();
}

/** Fetch feed XML with direct → site proxy → public CORS proxy fallbacks. */
export async function fetchFeedXml(feedUrl: string): Promise<string> {
	const candidates = [
		feedUrl,
		siteProxyFeedUrl(feedUrl),
		publicCorsProxyUrl(feedUrl),
	];
	let lastError: unknown;
	for (const candidate of candidates) {
		try {
			const text = await fetchText(candidate);
			if (text.trim().startsWith("<") || text.includes("<rss") || text.includes("<feed")) {
				return text;
			}
			lastError = new Error("not-xml");
		} catch (e) {
			lastError = e;
		}
	}
	throw lastError instanceof Error ? lastError : new Error("fetch");
}

export async function loadFeed(feedUrl: string): Promise<RssFeed> {
	const xml = await fetchFeedXml(feedUrl);
	return parseFeedXml(xml);
}

export function formatFeedDate(value: string, locale: string): string {
	if (!value) return "";
	const ms = Date.parse(value);
	if (Number.isNaN(ms)) return value;
	try {
		return new Intl.DateTimeFormat(locale, {
			year: "numeric",
			month: "short",
			day: "numeric",
			hour: "2-digit",
			minute: "2-digit",
		}).format(ms);
	} catch {
		return new Date(ms).toLocaleString();
	}
}

export function normalizeFeedUrl(input: string): string {
	const trimmed = input.trim();
	if (!trimmed) return "";
	try {
		const withProtocol = /^https?:\/\//i.test(trimmed)
			? trimmed
			: `https://${trimmed}`;
		const url = new URL(withProtocol);
		if (url.protocol !== "http:" && url.protocol !== "https:") return "";
		return url.toString();
	} catch {
		return "";
	}
}
