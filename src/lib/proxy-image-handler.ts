const MAX_BYTES = 5 * 1024 * 1024;

function isBlockedHostname(hostname: string): boolean {
	const host = hostname.toLowerCase().replace(/\.$/, "");
	if (!host) {
		return true;
	}
	if (host === "localhost" || host.endsWith(".localhost") || host.endsWith(".local")) {
		return true;
	}
	if (host === "0.0.0.0" || host === "[::1]" || host === "::1") {
		return true;
	}
	const ipv4 = /^(\d{1,3})\.(\d{1,3})\.(\d{1,3})\.(\d{1,3})$/.exec(host);
	if (ipv4) {
		const [, a, b] = ipv4.map(Number);
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

export async function handleProxyImage(request: Request): Promise<Response> {
	const { searchParams } = new URL(request.url);
	const rawUrl = searchParams.get("url")?.trim();
	if (!rawUrl) {
		return new Response("Missing url", { status: 400 });
	}

	let target: URL;
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
				"User-Agent": "Mizuki-QR-Proxy/1.0",
				Accept: "image/*,*/*;q=0.8",
			},
			redirect: "follow",
		});

		if (!upstream.ok) {
			return new Response("Upstream error", { status: 502 });
		}

		const contentType = upstream.headers.get("content-type") ?? "";
		if (!contentType.startsWith("image/")) {
			return new Response("Not an image", { status: 400 });
		}

		const buffer = await upstream.arrayBuffer();
		if (buffer.byteLength > MAX_BYTES) {
			return new Response("Image too large", { status: 413 });
		}

		return new Response(buffer, {
			headers: {
				"Content-Type": contentType,
				"Cache-Control": "public, max-age=3600",
				"Access-Control-Allow-Origin": "*",
			},
		});
	} catch {
		return new Response("Fetch failed", { status: 502 });
	}
}
