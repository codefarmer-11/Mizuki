<script lang="ts">
	import { onMount } from "svelte";
	import { siteConfig } from "../../../config";
	import I18nKey from "../../../i18n/i18nKey";
	import { i18n } from "../../../i18n/translation";
	import {
		formatFeedDate,
		loadFeed,
		loadSubscriptions,
		normalizeFeedUrl,
		saveSubscriptions,
		type RssItem,
		type StoredSubscription,
	} from "../../../utils/rss-reader";

	type FeedItemView = RssItem & {
		feedId: string;
		feedTitle: string;
	};

	let urlInput = $state("");
	let subscriptions = $state.raw<StoredSubscription[]>([]);
	let selectedFeedId = $state<string | "all">("all");
	let items = $state.raw<FeedItemView[]>([]);
	let loading = $state(false);
	let adding = $state(false);
	let message = $state("");
	let messageIsError = $state(false);

	const locale = $derived(
		(siteConfig.lang || "zh_CN").replace("_", "-"),
	);

	const visibleItems = $derived.by(() => {
		if (selectedFeedId === "all") return items;
		return items.filter((item) => item.feedId === selectedFeedId);
	});

	function showMessage(text: string, isError = false) {
		message = text;
		messageIsError = isError;
	}

	function persist(next: StoredSubscription[]) {
		subscriptions = next;
		saveSubscriptions(next);
	}

	async function refreshFeeds(list: StoredSubscription[] = subscriptions) {
		if (list.length === 0) {
			items = [];
			return;
		}
		loading = true;
		showMessage("");
		try {
			const results = await Promise.allSettled(
				list.map(async (sub) => {
					const feed = await loadFeed(sub.url);
					return { sub, feed };
				}),
			);

			const nextItems: FeedItemView[] = [];
			const titleUpdates: StoredSubscription[] = [];
			let failCount = 0;

			for (const result of results) {
				if (result.status === "rejected") {
					failCount += 1;
					continue;
				}
				const { sub, feed } = result.value;
				if (feed.title && feed.title !== sub.title) {
					titleUpdates.push({ ...sub, title: feed.title });
				}
				for (const item of feed.items) {
					nextItems.push({
						...item,
						feedId: sub.id,
						feedTitle: feed.title || sub.title || sub.url,
					});
				}
			}

			nextItems.sort((a, b) => b.publishedMs - a.publishedMs);
			items = nextItems;

			if (titleUpdates.length > 0) {
				const map = new Map(titleUpdates.map((s) => [s.id, s]));
				persist(
					list.map((sub) => map.get(sub.id) ?? sub),
				);
			}

			if (failCount > 0 && failCount === list.length) {
				showMessage(i18n(I18nKey.rssReaderError), true);
			} else if (failCount > 0) {
				showMessage(i18n(I18nKey.rssReaderError), true);
			}
		} finally {
			loading = false;
		}
	}

	async function addSubscription() {
		const url = normalizeFeedUrl(urlInput);
		if (!url) {
			showMessage(i18n(I18nKey.rssReaderInvalidUrl), true);
			return;
		}
		if (subscriptions.some((s) => s.url === url)) {
			showMessage(i18n(I18nKey.rssReaderDuplicate), true);
			return;
		}

		adding = true;
		showMessage("");
		try {
			const feed = await loadFeed(url);
			const sub: StoredSubscription = {
				id: crypto.randomUUID(),
				url,
				title: feed.title || url,
				addedAt: Date.now(),
			};
			const next = [...subscriptions, sub];
			persist(next);
			urlInput = "";
			selectedFeedId = sub.id;
			await refreshFeeds(next);
		} catch {
			showMessage(i18n(I18nKey.rssReaderError), true);
		} finally {
			adding = false;
		}
	}

	function removeSubscription(id: string) {
		const next = subscriptions.filter((s) => s.id !== id);
		persist(next);
		if (selectedFeedId === id) {
			selectedFeedId = "all";
		}
		void refreshFeeds(next);
	}

	function onSubmit(event: Event) {
		event.preventDefault();
		void addSubscription();
	}

	onMount(() => {
		subscriptions = loadSubscriptions();
		if (subscriptions.length > 0) {
			void refreshFeeds(subscriptions);
		}
	});
</script>

<div class="space-y-6">
	<form class="flex flex-col sm:flex-row gap-2" onsubmit={onSubmit}>
		<input
			type="url"
			bind:value={urlInput}
			autocomplete="off"
			placeholder={i18n(I18nKey.rssReaderUrlPlaceholder)}
			class="flex-1 min-w-0 rounded-lg px-3 py-2.5 text-sm bg-[var(--btn-regular-bg)] border border-transparent
				focus:border-[var(--primary)] focus:outline-none text-75 placeholder:text-50"
			disabled={adding}
		/>
		<button
			type="submit"
			class="shrink-0 px-4 py-2.5 rounded-lg text-sm font-medium transition bg-[var(--primary)]
				text-[var(--btn-content-text)] hover:opacity-90 disabled:opacity-50"
			disabled={adding || loading}
		>
			{adding ? "…" : i18n(I18nKey.rssReaderAdd)}
		</button>
		<button
			type="button"
			class="shrink-0 px-4 py-2.5 rounded-lg text-sm font-medium bg-[var(--btn-regular-bg)]
				hover:bg-[var(--btn-regular-bg-hover)] text-75 disabled:opacity-50"
			disabled={loading || subscriptions.length === 0}
			onclick={() => void refreshFeeds()}
		>
			{loading ? "…" : i18n(I18nKey.rssReaderRefresh)}
		</button>
	</form>

	{#if message}
		<p
			class={[
				"text-sm",
				messageIsError
					? "text-red-600 dark:text-red-400"
					: "text-50",
			]}
		>
			{message}
		</p>
	{/if}

	<div class="grid gap-6 lg:grid-cols-[minmax(0,14rem)_1fr]">
		<aside
			class="rounded-[var(--radius-large)] border border-black/10 dark:border-white/10 p-4 bg-[var(--card-bg)]"
		>
			<h2 class="text-sm font-bold text-75 mb-3">
				{i18n(I18nKey.rssReaderSubscriptions)}
			</h2>

			{#if subscriptions.length === 0}
				<p class="text-sm text-50 leading-relaxed">
					{i18n(I18nKey.rssReaderEmptySubs)}
				</p>
			{:else}
				<ul class="space-y-1">
					<li>
						<button
							type="button"
							class={[
								"w-full text-left rounded-lg px-3 py-2 text-sm transition",
								selectedFeedId === "all"
									? "bg-[var(--primary)] text-[var(--btn-content-text)]"
									: "text-75 hover:bg-[var(--btn-regular-bg)]",
							]}
							onclick={() => (selectedFeedId = "all")}
						>
							{i18n(I18nKey.rssReaderAllFeeds)}
						</button>
					</li>
					{#each subscriptions as sub (sub.id)}
						<li
							class="group flex items-center gap-1 rounded-lg hover:bg-[var(--btn-regular-bg)]"
						>
							<button
								type="button"
								class={[
									"flex-1 min-w-0 text-left rounded-lg px-3 py-2 text-sm transition truncate",
									selectedFeedId === sub.id
										? "bg-[var(--primary)] text-[var(--btn-content-text)]"
										: "text-75",
								]}
								onclick={() => (selectedFeedId = sub.id)}
								title={sub.url}
							>
								{sub.title}
							</button>
							<button
								type="button"
								class="shrink-0 px-2 py-1 text-xs text-50 opacity-70 hover:opacity-100 hover:text-red-500"
								onclick={() => removeSubscription(sub.id)}
								title={i18n(I18nKey.rssReaderRemove)}
							>
								×
							</button>
						</li>
					{/each}
				</ul>
			{/if}
		</aside>

		<section class="min-w-0">
			{#if loading && items.length === 0}
				<p class="text-sm text-50">{i18n(I18nKey.rssReaderLoading)}</p>
			{:else if visibleItems.length === 0}
				<p class="text-sm text-50">
					{subscriptions.length === 0
						? i18n(I18nKey.rssReaderEmptySubs)
						: i18n(I18nKey.rssReaderEmptyItems)}
				</p>
			{:else}
				<p class="mb-4 text-sm text-50">
					{visibleItems.length}
					{i18n(I18nKey.rssReaderItemCount)}
				</p>
				<ul class="space-y-3">
					{#each visibleItems as item (item.id + item.feedId)}
						<li
							class="rounded-[var(--radius-large)] border border-black/10 dark:border-white/10
								p-4 sm:p-5 bg-[var(--card-bg)] transition hover:border-[var(--primary)]"
						>
							<div class="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-50 mb-2">
								<span class="font-medium text-[var(--primary)]">
									{item.feedTitle}
								</span>
								{#if item.published}
									<time datetime={item.published}>
										{formatFeedDate(item.published, locale)}
									</time>
								{/if}
							</div>
							<h3 class="text-base sm:text-lg font-bold text-75 leading-snug">
								{#if item.link}
									<a
										href={item.link}
										target="_blank"
										rel="noopener noreferrer"
										class="hover:text-[var(--primary)] transition-colors"
									>
										{item.title}
									</a>
								{:else}
									{item.title}
								{/if}
							</h3>
							{#if item.summary}
								<p class="mt-2 text-sm text-50 leading-relaxed line-clamp-3">
									{item.summary}
								</p>
							{/if}
							{#if item.link}
								<a
									href={item.link}
									target="_blank"
									rel="noopener noreferrer"
									class="mt-3 inline-flex text-sm font-medium text-[var(--primary)] hover:underline"
								>
									{i18n(I18nKey.rssReaderOpenOriginal)} →
								</a>
							{/if}
						</li>
					{/each}
				</ul>
			{/if}
		</section>
	</div>
</div>
