const LOGO_DEV_HOST = "img.logo.dev";

export function isLogoDevUrl(imgurl: string): boolean {
	try {
		return new URL(imgurl).hostname === LOGO_DEV_HOST;
	} catch {
		return false;
	}
}

/** Build light/dark logo.dev URLs (PNG + theme) for resources page cards. */
export function getLogoDevUrls(imgurl: string): { light: string; dark: string } {
	const base = new URL(imgurl);

	const light = new URL(base);
	light.searchParams.set("format", "png");
	light.searchParams.set("theme", "light");
	if (!light.searchParams.has("size")) {
		light.searchParams.set("size", "128");
	}

	const dark = new URL(base);
	dark.searchParams.set("format", "png");
	dark.searchParams.set("theme", "dark");
	if (!dark.searchParams.has("size")) {
		dark.searchParams.set("size", "128");
	}

	return { light: light.toString(), dark: dark.toString() };
}
