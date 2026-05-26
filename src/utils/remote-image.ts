/** Load a remote image so canvas pixel reads (e.g. QR decode) are allowed. */
export function proxyImageUrl(url: string): string {
	return `https://images.weserv.nl/?url=${encodeURIComponent(url)}&output=png`;
}

function loadImageElement(
	src: string,
	crossOrigin = false,
): Promise<HTMLImageElement> {
	return new Promise((resolve, reject) => {
		const img = new Image();
		if (crossOrigin) {
			img.crossOrigin = "anonymous";
		}
		img.decoding = "async";
		img.onload = () => resolve(img);
		img.onerror = () => reject(new Error("load"));
		img.src = src;
	});
}

async function loadViaFetch(url: string): Promise<HTMLImageElement | null> {
	try {
		const res = await fetch(url, { mode: "cors", credentials: "omit" });
		if (!res.ok) {
			return null;
		}
		const blob = await res.blob();
		const objectUrl = URL.createObjectURL(blob);
		try {
			return await loadImageElement(objectUrl);
		} finally {
			URL.revokeObjectURL(objectUrl);
		}
	} catch {
		return null;
	}
}

function canReadPixels(img: HTMLImageElement): boolean {
	if (!img.naturalWidth || !img.naturalHeight) {
		return false;
	}
	const canvas = document.createElement("canvas");
	canvas.width = 1;
	canvas.height = 1;
	const ctx = canvas.getContext("2d");
	if (!ctx) {
		return false;
	}
	ctx.drawImage(img, 0, 0, 1, 1);
	try {
		ctx.getImageData(0, 0, 1, 1);
		return true;
	} catch {
		return false;
	}
}

/**
 * Load an image from HTTP(S) URL for canvas use (QR decode, etc.).
 * Tries CORS fetch, then direct load, then a public image proxy.
 */
export async function loadDecodableImage(url: string): Promise<HTMLImageElement> {
	const trimmed = url.trim();
	if (!trimmed) {
		throw new Error("load");
	}

	const viaFetch = await loadViaFetch(trimmed);
	if (viaFetch) {
		return viaFetch;
	}

	for (const src of [trimmed, proxyImageUrl(trimmed)]) {
		try {
			const img = await loadImageElement(src, true);
			if (canReadPixels(img)) {
				return img;
			}
		} catch {
			/* try next source */
		}
	}

	throw new Error("load");
}
