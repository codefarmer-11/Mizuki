import { handleProxyImage } from "../src/lib/proxy-image-handler";

export const config = {
	runtime: "edge",
};

export default function handler(request: Request): Promise<Response> {
	return handleProxyImage(request);
}
