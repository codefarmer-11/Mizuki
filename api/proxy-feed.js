const MAX_BYTES = 2 * 1024 * 1024;

function isBlockedHostname(hostname) {
	const host = hostname.toLowerCase().replace(/\.$/, "");
	if (!host) return true;
	if (host === "localhost" || host.endsWith(".localhost") || host.endsWith(".local")) {
		return true;
	}
	if (host === "0.0.0.0" || host === "[::1]" || host === "::1") return true;

	const ipv4 = /^(\d{1,3})\.(\d{1,3})\.(\d{1,3})\.(\d{1,3})$/.exec(host);
	if (ipv4) {
		const a = Number(ipv4[1]);
		const b = Number(ipv4[2]);
		if (a === 10) return true;
		if (a === 127) return true;
		if (a === 0) return true;
		if (a === 169 && b === 254) return true;
		if (a === 172 && b >= 16 && b <= 31) return true;
		if (a === 192 && b === 168) return true;
	}
	if (host.startsWith("fe80:") || host.startsWith("fc") || host.startsWith("fd")) {
		return true;
	}
	return false;
}

export const config = {
	runtime: "edge",
};

export default async function handler(request) {
	const { searchParams } = new URL(request.url);
	const rawUrl = searchParams.get("url")?.trim();
	if (!rawUrl) {
		return new Response("Missing url", { status: 400 });
	}

	let target;
	try {
		target = new URL(rawUrl);
	} catch {
		return new Response("Invalid url", { status: 400 });
	}

	if (target.protocol !== "http:" && target.protocol !== "https:") {
		return new Response("Invalid protocol", { status: 400 });
	}

	if (isBlockedHostname(target.hostname)) {
		return new Response("Blocked host", { status: 403 });
	}

	try {
		const upstream = await fetch(target.toString(), {
			headers: {
				"User-Agent": "Mizuki-RSS-Proxy/1.0",
				Accept: "application/rss+xml, application/atom+xml, application/xml, text/xml, */*;q=0.8",
				Referer: `${target.origin}/`,
			},
			redirect: "follow",
		});

		if (!upstream.ok) {
			return new Response("Upstream error", { status: 502 });
		}

		const buffer = await upstream.arrayBuffer();
		if (buffer.byteLength > MAX_BYTES) {
			return new Response("Feed too large", { status: 413 });
		}

		const contentType =
			upstream.headers.get("content-type") ?? "application/xml; charset=utf-8";

		return new Response(buffer, {
			headers: {
				"Content-Type": contentType.includes("xml") || contentType.includes("text")
					? contentType
					: "application/xml; charset=utf-8",
				"Cache-Control": "public, max-age=300",
				"Access-Control-Allow-Origin": "*",
			},
		});
	} catch {
		return new Response("Fetch failed", { status: 502 });
	}
}
