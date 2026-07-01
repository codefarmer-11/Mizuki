/**
 * 顶部页面进度条 — NProgress 风格连续平滑加载
 */

let installed = false;
let progress = 0;
let trickleTimer: ReturnType<typeof setInterval> | null = null;

function getBar(): HTMLElement | null {
	return document.getElementById("page-progress-bar");
}

function setProgress(value: number): void {
	const bar = getBar();
	if (!bar) {
		return;
	}
	progress = Math.max(0, Math.min(value, 1));
	bar.style.width = `${progress * 100}%`;
}

function clearTrickle(): void {
	if (trickleTimer !== null) {
		clearInterval(trickleTimer);
		trickleTimer = null;
	}
}

function startTrickle(): void {
	clearTrickle();
	trickleTimer = setInterval(() => {
		if (progress >= 0.88) {
			return;
		}
		// 越接近完成增量越小，避免突然跳到终点
		const remaining = 0.88 - progress;
		const increment = remaining * (0.04 + Math.random() * 0.08);
		setProgress(progress + increment);
	}, 120);
}

function start(): void {
	const bar = getBar();
	if (!bar) {
		return;
	}

	clearTrickle();
	progress = 0;
	bar.classList.remove("is-hidden");
	bar.classList.add("is-active");
	bar.style.transition = "width 160ms ease-out, opacity 120ms ease-out";
	setProgress(0.08);
	startTrickle();
}

function onContentReady(): void {
	if (progress < 0.72) {
		setProgress(0.72);
	}
}

function finish(): void {
	const bar = getBar();
	if (!bar) {
		return;
	}

	clearTrickle();
	bar.style.transition = "width 220ms ease-out, opacity 280ms ease-out";
	setProgress(1);

	window.setTimeout(() => {
		bar.classList.add("is-hidden");
		bar.classList.remove("is-active");
		window.setTimeout(() => {
			setProgress(0);
			bar.classList.remove("is-hidden");
		}, 300);
	}, 220);
}

export function setupPageProgressBar(): void {
	if (installed || !window.swup?.hooks) {
		return;
	}
	installed = true;

	window.swup.hooks.on("visit:start", start);
	window.swup.hooks.on("content:replace", onContentReady);
	window.swup.hooks.on("visit:end", finish);
}
