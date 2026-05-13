<script lang="ts">
	import I18nKey from "../../../i18n/i18nKey";
	import { i18n } from "../../../i18n/translation";

	let genText = "";
	let genDataUrl: string | null = null;
	let genBusy = false;

	let decodeText = "";
	let decodeError = "";
	let imageUrlInput = "";
	let fileRevoke: string | null = null;
	let decodeBusy = false;
	let decodeAttempted = false;

	const maxDecodeSide = 1600;

	async function generateQr() {
		genBusy = true;
		genDataUrl = null;
		try {
			const QRCode = await import("qrcode");
			const text = genText.trim() || " ";
			genDataUrl = await QRCode.toDataURL(text, {
				width: 280,
				margin: 2,
				color: {
					dark: "#111827",
					light: "#ffffff",
				},
				errorCorrectionLevel: "M",
			});
		} catch {
			genDataUrl = null;
		} finally {
			genBusy = false;
		}
	}

	function downloadPng() {
		if (!genDataUrl) {
			return;
		}
		const a = document.createElement("a");
		a.href = genDataUrl;
		a.download = "qrcode.png";
		a.click();
	}

	async function decodeFromImage(img: HTMLImageElement): Promise<string | null> {
		const w0 = img.naturalWidth;
		const h0 = img.naturalHeight;
		if (!w0 || !h0) {
			return null;
		}
		let w = w0;
		let h = h0;
		const scale = Math.min(1, maxDecodeSide / Math.max(w, h));
		w = Math.max(1, Math.floor(w * scale));
		h = Math.max(1, Math.floor(h * scale));

		const canvas = document.createElement("canvas");
		canvas.width = w;
		canvas.height = h;
		const ctx = canvas.getContext("2d");
		if (!ctx) {
			return null;
		}
		ctx.drawImage(img, 0, 0, w, h);
		let imageData: ImageData;
		try {
			imageData = ctx.getImageData(0, 0, w, h);
		} catch {
			throw new Error("cors");
		}
		const jsQR = (await import("jsqr")).default;
		const result = jsQR(imageData.data, imageData.width, imageData.height, {
			inversionAttempts: "attemptBoth",
		});
		return result?.data ?? null;
	}

	function resetDecodeState() {
		decodeText = "";
		decodeError = "";
		if (fileRevoke) {
			URL.revokeObjectURL(fileRevoke);
			fileRevoke = null;
		}
	}

	async function onPickFile(ev: Event) {
		const input = ev.currentTarget as HTMLInputElement;
		const file = input.files?.[0];
		resetDecodeState();
		if (!file) {
			return;
		}
		decodeBusy = true;
		try {
			const objectUrl = URL.createObjectURL(file);
			fileRevoke = objectUrl;
			const img = new Image();
			img.decoding = "async";
			img.src = objectUrl;
			await new Promise<void>((resolve, reject) => {
				img.onload = () => resolve();
				img.onerror = () => reject(new Error("load"));
			});
			const data = await decodeFromImage(img);
			decodeText = data ?? "";
			if (!data) {
				decodeError = i18n(I18nKey.extensionQrNoResult);
			}
		} catch (e) {
			decodeError =
				e instanceof Error && e.message === "cors"
					? i18n(I18nKey.extensionQrCorsHint)
					: i18n(I18nKey.extensionQrError);
		} finally {
			decodeAttempted = true;
			decodeBusy = false;
			input.value = "";
		}
	}

	async function loadFromUrl() {
		resetDecodeState();
		const raw = imageUrlInput.trim();
		if (!raw) {
			return;
		}
		decodeBusy = true;
		try {
			const img = new Image();
			img.crossOrigin = "anonymous";
			img.decoding = "async";
			img.src = raw;
			await new Promise<void>((resolve, reject) => {
				img.onload = () => resolve();
				img.onerror = () => reject(new Error("load"));
			});
			const data = await decodeFromImage(img);
			decodeText = data ?? "";
			if (!data) {
				decodeError = i18n(I18nKey.extensionQrNoResult);
			}
		} catch (e) {
			decodeError =
				e instanceof Error && e.message === "cors"
					? i18n(I18nKey.extensionQrCorsHint)
					: i18n(I18nKey.extensionQrError);
		} finally {
			decodeAttempted = true;
			decodeBusy = false;
		}
	}
</script>

<div class="grid gap-8 lg:grid-cols-2">
	<section class="rounded-[var(--radius-large)] border border-black/10 dark:border-white/10 p-6 bg-[var(--card-bg)]">
		<h2 class="text-xl font-bold text-75 mb-1">{i18n(I18nKey.extensionQrGenerate)}</h2>
		<p class="text-sm text-50 mb-4">{i18n(I18nKey.extensionQrPlaceholder)}</p>
		<textarea
			bind:value={genText}
			rows="5"
			class="w-full rounded-lg px-3 py-2 text-sm bg-[var(--btn-regular-bg)] border border-transparent
				focus:border-[var(--primary)] focus:outline-none resize-y text-75 placeholder:text-50"
			placeholder={i18n(I18nKey.extensionQrPlaceholder)}
		></textarea>
		<div class="mt-4 flex flex-wrap gap-3 items-center">
			<button
				type="button"
				class="px-4 py-2 rounded-lg text-sm font-medium transition bg-[var(--primary)]
					text-[var(--btn-content-text)] hover:opacity-90 disabled:opacity-50"
				disabled={genBusy}
				on:click={generateQr}
			>
				{genBusy ? "…" : i18n(I18nKey.extensionQrGenButton)}
			</button>
			{#if genDataUrl}
				<button
					type="button"
					class="px-4 py-2 rounded-lg text-sm bg-[var(--btn-regular-bg)] hover:bg-[var(--btn-regular-bg-hover)] text-75"
					on:click={downloadPng}
				>
					{i18n(I18nKey.extensionQrDownload)}
				</button>
			{/if}
		</div>
		{#if genDataUrl}
			<div class="mt-6 flex justify-center rounded-lg bg-white p-4 dark:bg-black/40">
				<img src={genDataUrl} alt="QR" class="max-w-full h-auto" width="280" height="280" />
			</div>
		{/if}
	</section>

	<section class="rounded-[var(--radius-large)] border border-black/10 dark:border-white/10 p-6 bg-[var(--card-bg)]">
		<h2 class="text-xl font-bold text-75 mb-4">{i18n(I18nKey.extensionQrDecode)}</h2>

		<div class="space-y-4">
			<div>
				<label class="block text-sm font-medium text-75 mb-2" for="qr-file">{i18n(
					I18nKey.extensionQrPickFile,
				)}</label>
				<input
					id="qr-file"
					type="file"
					accept="image/*"
					class="block w-full text-sm text-50 file:mr-3 file:rounded-md file:border-0 file:px-3 file:py-2
						file:bg-[var(--btn-regular-bg)] file:text-75 file:cursor-pointer"
					disabled={decodeBusy}
					on:change={onPickFile}
				/>
			</div>

			<div>
				<label class="block text-sm font-medium text-75 mb-2" for="qr-url">{i18n(
					I18nKey.extensionQrImageUrl,
				)}</label>
				<div class="flex flex-col sm:flex-row gap-2">
					<input
						id="qr-url"
						type="url"
						bind:value={imageUrlInput}
						autocomplete="off"
						placeholder="https://"
						class="flex-1 min-w-0 rounded-lg px-3 py-2 text-sm bg-[var(--btn-regular-bg)] border border-transparent
							focus:border-[var(--primary)] focus:outline-none text-75"
						disabled={decodeBusy}
					/>
					<button
						type="button"
						class="shrink-0 px-4 py-2 rounded-lg text-sm font-medium bg-[var(--btn-regular-bg)]
							hover:bg-[var(--btn-regular-bg-hover)] text-75 disabled:opacity-50"
						disabled={decodeBusy}
						on:click={loadFromUrl}
					>
						{i18n(I18nKey.extensionQrLoadUrl)}
					</button>
				</div>
				<p class="mt-2 text-xs text-50 leading-relaxed">{i18n(I18nKey.extensionQrCorsHint)}</p>
			</div>
		</div>

		<div class="mt-6">
			<div class="text-sm font-medium text-75 mb-2">{i18n(I18nKey.extensionQrDecoded)}</div>
			{#if decodeBusy}
				<p class="text-sm text-50">…</p>
			{:else if decodeError}
				<p class="text-sm text-red-600 dark:text-red-400 whitespace-pre-wrap">{decodeError}</p>
			{:else if decodeText}
				<pre
					class="text-sm p-4 rounded-lg bg-[var(--btn-regular-bg)] text-75 whitespace-pre-wrap break-words max-h-64 overflow-auto"
				>{decodeText}</pre>
			{:else if decodeAttempted}
				<p class="text-sm text-50">{i18n(I18nKey.extensionQrNoResult)}</p>
			{:else}
				<p class="text-sm text-50">{i18n(I18nKey.extensionQrStartHint)}</p>
			{/if}
		</div>
	</section>
</div>
