const MAX_DECODE_SIDE = 2400;

type BarcodeDetectorLike = {
	detect(source: ImageBitmapSource): Promise<Array<{ rawValue?: string }>>;
};

function getBarcodeDetector(): BarcodeDetectorLike | null {
	if (typeof window === "undefined") {
		return null;
	}
	const ctor = (
		window as Window & {
			BarcodeDetector?: new (opts: { formats: string[] }) => BarcodeDetectorLike;
		}
	).BarcodeDetector;
	if (!ctor) {
		return null;
	}
	try {
		return new ctor({ formats: ["qr_code"] });
	} catch {
		return null;
	}
}

function imageDataFromCanvas(
	ctx: CanvasRenderingContext2D,
	w: number,
	h: number,
): ImageData {
	try {
		return ctx.getImageData(0, 0, w, h);
	} catch {
		throw new Error("cors");
	}
}

function cloneImageData(imageData: ImageData): ImageData {
	return new ImageData(
		new Uint8ClampedArray(imageData.data),
		imageData.width,
		imageData.height,
	);
}

function toGrayscale(imageData: ImageData): ImageData {
	const out = cloneImageData(imageData);
	const { data } = out;
	for (let i = 0; i < data.length; i += 4) {
		const gray =
			0.2126 * data[i] + 0.7152 * data[i + 1] + 0.0722 * data[i + 2];
		data[i] = gray;
		data[i + 1] = gray;
		data[i + 2] = gray;
	}
	return out;
}

function toBinary(imageData: ImageData, threshold = 128): ImageData {
	const out = cloneImageData(imageData);
	const { data } = out;
	for (let i = 0; i < data.length; i += 4) {
		const v = data[i] > threshold ? 255 : 0;
		data[i] = v;
		data[i + 1] = v;
		data[i + 2] = v;
	}
	return out;
}

async function decodeWithJsQR(imageData: ImageData): Promise<string | null> {
	const jsQR = (await import("jsqr")).default;
	const variants = [
		imageData,
		toGrayscale(imageData),
		toBinary(toGrayscale(imageData)),
		toBinary(toGrayscale(imageData), 160),
	];

	for (const variant of variants) {
		const result = jsQR(variant.data, variant.width, variant.height, {
			inversionAttempts: "attemptBoth",
		});
		if (result?.data) {
			return result.data;
		}
	}
	return null;
}

async function decodeWithBarcodeDetector(
	source: ImageBitmapSource,
): Promise<string | null> {
	const detector = getBarcodeDetector();
	if (!detector) {
		return null;
	}
	try {
		const codes = await detector.detect(source);
		const value = codes.find((c) => c.rawValue)?.rawValue;
		return value ?? null;
	} catch {
		return null;
	}
}

function buildScales(w0: number, h0: number): number[] {
	const maxSide = Math.max(w0, h0);
	const scales = new Set<number>();

	scales.add(Math.min(1, MAX_DECODE_SIDE / maxSide));
	for (const factor of [0.5, 0.75, 1.25, 1.5, 2, 3, 4]) {
		const scale = Math.min(1, MAX_DECODE_SIDE / maxSide) * factor;
		if (scale > 0 && maxSide * scale <= MAX_DECODE_SIDE * 2) {
			scales.add(scale);
		}
	}
	if (maxSide < 400) {
		scales.add(400 / maxSide);
	}
	if (maxSide < 800) {
		scales.add(800 / maxSide);
	}

	return [...scales].sort((a, b) => a - b);
}

/** Decode QR content from a loaded image (canvas + jsQR / BarcodeDetector). */
export async function decodeQrFromImage(
	img: HTMLImageElement,
): Promise<string | null> {
	const w0 = img.naturalWidth;
	const h0 = img.naturalHeight;
	if (!w0 || !h0) {
		return null;
	}

	const barcodeResult = await decodeWithBarcodeDetector(img);
	if (barcodeResult) {
		return barcodeResult;
	}

	const scales = buildScales(w0, h0);
	for (const scale of scales) {
		const w = Math.max(1, Math.floor(w0 * scale));
		const h = Math.max(1, Math.floor(h0 * scale));
		const canvas = document.createElement("canvas");
		canvas.width = w;
		canvas.height = h;
		const ctx = canvas.getContext("2d", { willReadFrequently: true });
		if (!ctx) {
			continue;
		}
		ctx.imageSmoothingEnabled = scale !== 1;
		ctx.drawImage(img, 0, 0, w, h);

		const bitmapResult = await decodeWithBarcodeDetector(canvas);
		if (bitmapResult) {
			return bitmapResult;
		}

		const imageData = imageDataFromCanvas(ctx, w, h);
		const jsResult = await decodeWithJsQR(imageData);
		if (jsResult) {
			return jsResult;
		}
	}

	return null;
}
