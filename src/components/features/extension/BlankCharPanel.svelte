<script lang="ts">
	import I18nKey from "../../../i18n/i18nKey";
	import { i18n } from "../../../i18n/translation";

	type BlankCharKind =
		| "zeroWidthSpace"
		| "zeroWidthNonJoiner"
		| "zeroWidthJoiner"
		| "wordJoiner"
		| "brailleBlank"
		| "nobreakSpace"
		| "hangulFiller"
		| "zeroWidthNoBreakSpace";

	const CHAR_MAP: Record<BlankCharKind, string> = {
		zeroWidthSpace: "\u200B",
		zeroWidthNonJoiner: "\u200C",
		zeroWidthJoiner: "\u200D",
		wordJoiner: "\u2060",
		brailleBlank: "\u2800",
		nobreakSpace: "\u00A0",
		hangulFiller: "\u3164",
		zeroWidthNoBreakSpace: "\uFEFF",
	};

	const KIND_OPTIONS: BlankCharKind[] = [
		"zeroWidthSpace",
		"zeroWidthNonJoiner",
		"zeroWidthJoiner",
		"wordJoiner",
		"brailleBlank",
		"nobreakSpace",
		"hangulFiller",
		"zeroWidthNoBreakSpace",
	];

	const KIND_I18N: Record<BlankCharKind, I18nKey> = {
		zeroWidthSpace: I18nKey.extensionBlankKind_zeroWidthSpace,
		zeroWidthNonJoiner: I18nKey.extensionBlankKind_zeroWidthNonJoiner,
		zeroWidthJoiner: I18nKey.extensionBlankKind_zeroWidthJoiner,
		wordJoiner: I18nKey.extensionBlankKind_wordJoiner,
		brailleBlank: I18nKey.extensionBlankKind_brailleBlank,
		nobreakSpace: I18nKey.extensionBlankKind_nobreakSpace,
		hangulFiller: I18nKey.extensionBlankKind_hangulFiller,
		zeroWidthNoBreakSpace: I18nKey.extensionBlankKind_zeroWidthNoBreakSpace,
	};

	let kind: BlankCharKind = "zeroWidthSpace";
	let count = 1;
	let manualText = "";
	let testText = "";
	let copyFeedback = "";
	let selectFeedback = "";

	$: generated = CHAR_MAP[kind].repeat(Math.max(1, Math.min(500, count)));
	$: manualText = generated;
	$: testCharCount = [...testText].length;

	function clampCount(value: number) {
		return Math.max(1, Math.min(500, value));
	}

	async function copyToClipboard(text: string) {
		try {
			await navigator.clipboard.writeText(text);
			copyFeedback = i18n(I18nKey.extensionBlankCopied);
			setTimeout(() => {
				copyFeedback = "";
			}, 2000);
		} catch {
			copyFeedback = i18n(I18nKey.extensionBlankCopyFailed);
			setTimeout(() => {
				copyFeedback = "";
			}, 2500);
		}
	}

	function selectManualText() {
		const el = document.getElementById("blank-manual-text") as HTMLTextAreaElement | null;
		if (!el) {
			return;
		}
		el.focus();
		el.select();
		selectFeedback = i18n(I18nKey.extensionBlankSelected);
		setTimeout(() => {
			selectFeedback = "";
		}, 2000);
	}

	function kindLabel(k: BlankCharKind) {
		return i18n(KIND_I18N[k]);
	}
</script>

<div class="space-y-8">
	<section
		class="rounded-[var(--radius-large)] border border-black/10 dark:border-white/10 p-6 bg-[var(--card-bg)]"
	>
		<h2 class="text-xl font-bold text-75 mb-1">{i18n(I18nKey.extensionBlankWhatTitle)}</h2>
		<p class="text-sm text-50 leading-relaxed">{i18n(I18nKey.extensionBlankWhatDesc)}</p>
	</section>

	<section
		class="rounded-[var(--radius-large)] border border-black/10 dark:border-white/10 p-6 bg-[var(--card-bg)]"
	>
		<h2 class="text-xl font-bold text-75 mb-4">{i18n(I18nKey.extensionBlankGenerate)}</h2>

		<div class="grid gap-4 sm:grid-cols-2">
			<div>
				<label class="block text-sm font-medium text-75 mb-2" for="blank-kind">
					{i18n(I18nKey.extensionBlankKindLabel)}
				</label>
				<select
					id="blank-kind"
					bind:value={kind}
					class="w-full rounded-lg px-3 py-2 text-sm bg-[var(--btn-regular-bg)] border border-transparent
						focus:border-[var(--primary)] focus:outline-none text-75"
				>
					{#each KIND_OPTIONS as option}
						<option value={option}>{kindLabel(option)}</option>
					{/each}
				</select>
			</div>
			<div>
				<label class="block text-sm font-medium text-75 mb-2" for="blank-count">
					{i18n(I18nKey.extensionBlankCountLabel)}
				</label>
				<input
					id="blank-count"
					type="number"
					min="1"
					max="500"
					bind:value={count}
					on:change={() => {
						count = clampCount(Number(count) || 1);
					}}
					class="w-full rounded-lg px-3 py-2 text-sm bg-[var(--btn-regular-bg)] border border-transparent
						focus:border-[var(--primary)] focus:outline-none text-75"
				/>
			</div>
		</div>

		<div class="mt-4 flex flex-wrap gap-2">
			{#each [1, 5, 10, 50, 100] as preset}
				<button
					type="button"
					class="px-3 py-1.5 rounded-lg text-sm bg-[var(--btn-regular-bg)] hover:bg-[var(--btn-regular-bg-hover)]
						text-75 transition {count === preset ? 'ring-2 ring-[var(--primary)]' : ''}"
					on:click={() => {
						count = preset;
					}}
				>
					×{preset}
				</button>
			{/each}
		</div>

		<div class="mt-6 flex flex-wrap gap-3 items-center">
			<button
				type="button"
				class="px-4 py-2 rounded-lg text-sm font-medium transition bg-[var(--primary)]
					text-[var(--btn-content-text)] hover:opacity-90"
				on:click={() => copyToClipboard(generated)}
			>
				{i18n(I18nKey.extensionBlankCopyButton)}
			</button>
			{#if copyFeedback}
				<span class="text-sm text-[var(--primary)]">{copyFeedback}</span>
			{/if}
		</div>
	</section>

	<div class="grid gap-8 lg:grid-cols-2">
		<section
			class="rounded-[var(--radius-large)] border border-black/10 dark:border-white/10 p-6 bg-[var(--card-bg)]"
		>
			<h2 class="text-xl font-bold text-75 mb-1">{i18n(I18nKey.extensionBlankManualTitle)}</h2>
			<p class="text-sm text-50 mb-4 leading-relaxed">{i18n(I18nKey.extensionBlankManualDesc)}</p>
			<textarea
				id="blank-manual-text"
				bind:value={manualText}
				rows="4"
				readonly
				class="w-full rounded-lg px-3 py-2 text-sm bg-[var(--btn-regular-bg)] border border-transparent
					focus:border-[var(--primary)] focus:outline-none resize-y text-75 min-h-[5rem]"
			></textarea>
			<div class="mt-4 flex flex-wrap gap-3 items-center">
				<button
					type="button"
					class="px-4 py-2 rounded-lg text-sm font-medium bg-[var(--btn-regular-bg)]
						hover:bg-[var(--btn-regular-bg-hover)] text-75"
					on:click={selectManualText}
				>
					{i18n(I18nKey.extensionBlankSelectButton)}
				</button>
				{#if selectFeedback}
					<span class="text-sm text-50">{selectFeedback}</span>
				{/if}
			</div>
		</section>

		<section
			class="rounded-[var(--radius-large)] border border-black/10 dark:border-white/10 p-6 bg-[var(--card-bg)]"
		>
			<h2 class="text-xl font-bold text-75 mb-1">{i18n(I18nKey.extensionBlankTestTitle)}</h2>
			<p class="text-sm text-50 mb-4 leading-relaxed">{i18n(I18nKey.extensionBlankTestDesc)}</p>
			<textarea
				bind:value={testText}
				rows="4"
				placeholder={i18n(I18nKey.extensionBlankTestPlaceholder)}
				class="w-full rounded-lg px-3 py-2 text-sm bg-[var(--btn-regular-bg)] border border-transparent
					focus:border-[var(--primary)] focus:outline-none resize-y text-75 placeholder:text-50 min-h-[5rem]"
			></textarea>
			<p class="mt-4 text-sm text-75">
				{i18n(I18nKey.extensionBlankCharCount)}:
				<span class="font-semibold tabular-nums">{testCharCount}</span>
			</p>
		</section>
	</div>
</div>
