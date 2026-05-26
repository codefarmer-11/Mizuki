/** Same-origin image proxy (Vercel serverless: api/proxy-image.ts). */
export function siteProxyImageUrl(url: string): string {
	return `/api/proxy-image?url=${encodeURIComponent(url)}`;
}

/** Public CDN proxy; may be unreachable in some regions. */
export function cdnProxyImageUrl(url: string): string {
	try {
		const parsed = new URL(url);
		const hostPath = `${parsed.host}${parsed.pathname}${parsed.search}`;
		return `https://images.weserv.nl/?url=${encodeURIComponent(hostPath)}&output=png`;
	} catch {
		return `https://images.weserv.nl/?url=${encodeURIComponent(url)}&output=png`;
	}
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

async function loadFromSrc(
	src: string,
	crossOrigin: boolean,
): Promise<HTMLImageElement | null> {
	try {
		const img = await loadImageElement(src, crossOrigin);
		if (canReadPixels(img)) {
			return img;
		}
	} catch {
		/* try next */
	}
	return null;
}

/**
 * Load an image from HTTP(S) URL for canvas use (QR decode, etc.).
 * Prefers same-origin server proxy, then direct CORS, then CDN proxy.
 */
export async function loadDecodableImage(url: string): Promise<HTMLImageElement> {
	const trimmed = url.trim();
	if (!trimmed) {
		throw new Error("load");
	}

	const siteProxy = siteProxyImageUrl(trimmed);

	// Same-origin proxy: fetch → blob (most reliable for CN sites)
	const viaSiteProxy = await loadViaFetch(siteProxy);
	if (viaSiteProxy) {
		return viaSiteProxy;
	}

	const viaDirectFetch = await loadViaFetch(trimmed);
	if (viaDirectFetch) {
		return viaDirectFetch;
	}

	const sources: { src: string; crossOrigin: boolean }[] = [
		{ src: siteProxy, crossOrigin: false },
		{ src: trimmed, crossOrigin: true },
		{ src: cdnProxyImageUrl(trimmed), crossOrigin: true },
	];

	for (const { src, crossOrigin } of sources) {
		const img = await loadFromSrc(src, crossOrigin);
		if (img) {
			return img;
		}
	}

	throw new Error("load");
}
