// 友情链接页面处理脚本
// 此脚本作为全局脚本加载，不受 Swup 页面切换影响

(() => {
	console.log("[links Global] Script loaded");

	// 使用全局变量存储状态
	if (typeof window.linksPageState === "undefined") {
		window.linksPageState = {
			initialized: false,
			eventListeners: [],
			mutationObserver: null,
			copySuccessText: "已复制", // 默认值，会被页面覆盖
		};
	}

	// 初始化函数
	function initlinksPage() {
		console.log("[links Global] initlinksPage called");

		var searchInput = document.getElementById("links-search");
		var linksGrid = document.getElementById("links-grid");
		var noResults = document.getElementById("no-results");

		// 如果关键元素不存在，直接返回
		if (!searchInput || !linksGrid || !noResults) {
			return false;
		}

		var tagFilters = document.querySelectorAll(".filter-tag");
		var friendCards = document.querySelectorAll(".link-card");
		var copyButtons = document.querySelectorAll(".copy-link-btn");

		console.log("[links Global] Found elements:", {
			cards: friendCards.length,
			filters: tagFilters.length,
			copyButtons: copyButtons.length,
		});

		// 从页面获取复制成功文本
		var copySuccessTextElement = document.getElementById(
			"links-copy-success-text",
		);
		if (copySuccessTextElement) {
			window.linksPageState.copySuccessText =
				copySuccessTextElement.textContent;
		}

		// 清理旧的事件监听器
		if (window.linksPageState.eventListeners.length > 0) {
			console.log(
				"[links Global] Cleaning",
				window.linksPageState.eventListeners.length,
				"old listeners",
			);
			for (
				var i = 0;
				i < window.linksPageState.eventListeners.length;
				i++
			) {
				var listener = window.linksPageState.eventListeners[i];
				var element = listener[0];
				var type = listener[1];
				var handler = listener[2];
				if (element && element.removeEventListener) {
					element.removeEventListener(type, handler);
				}
			}
			window.linksPageState.eventListeners = [];
		}

		var currentTag = "all";
		var searchTerm = "";

		// 过滤函数
		function filterlinks() {
			var visibleCount = 0;
			for (var i = 0; i < friendCards.length; i++) {
				var card = friendCards[i];
				var title = (
					card.getAttribute("data-title") || ""
				).toLowerCase();
				var desc = (card.getAttribute("data-desc") || "").toLowerCase();
				var tags = card.getAttribute("data-tags") || "";

				var matchesSearch =
					!searchTerm ||
					title.indexOf(searchTerm) >= 0 ||
					desc.indexOf(searchTerm) >= 0;
				var matchesTag =
					currentTag === "all" ||
					tags.split(",").indexOf(currentTag) >= 0;

				if (matchesSearch && matchesTag) {
					card.style.display = "";
					visibleCount++;
				} else {
					card.style.display = "none";
				}
			}

			if (visibleCount === 0) {
				noResults.classList.remove("hidden");
				linksGrid.classList.add("hidden");
			} else {
				noResults.classList.add("hidden");
				linksGrid.classList.remove("hidden");
			}
		}

		// 搜索功能
		var searchHandler = (e) => {
			searchTerm = e.target.value.toLowerCase();
			filterlinks();
		};
		searchInput.addEventListener("input", searchHandler);
		window.linksPageState.eventListeners.push([
			searchInput,
			"input",
			searchHandler,
		]);

		// 标签筛选
		for (var i = 0; i < tagFilters.length; i++) {
			((button) => {
				var clickHandler = () => {
					// 更新选中状态
					for (var j = 0; j < tagFilters.length; j++) {
						var btn = tagFilters[j];
						btn.classList.remove("active");
					}
					button.classList.add("active");

					currentTag = button.getAttribute("data-tag") || "all";
					filterlinks();
				};
				button.addEventListener("click", clickHandler);
				window.linksPageState.eventListeners.push([
					button,
					"click",
					clickHandler,
				]);
			})(tagFilters[i]);
		}

		// 复制链接功能
		for (var i = 0; i < copyButtons.length; i++) {
			((button) => {
				var clickHandler = () => {
					var url = button.getAttribute("data-url");
					if (!url) return;

					if (navigator.clipboard && navigator.clipboard.writeText) {
						navigator.clipboard
							.writeText(url)
							.then(() => {
								var originalHTML = button.innerHTML;
								button.innerHTML =
									'<div class="flex items-center gap-1"><svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path></svg><span class="text-xs">' +
									window.linksPageState.copySuccessText +
									"</span></div>";
								button.classList.add("text-green-500");
								setTimeout(() => {
									button.innerHTML = originalHTML;
									button.classList.remove("text-green-500");
								}, 2000);
							})
							.catch((err) => {
								console.error(
									"[links Global] Copy failed:",
									err,
								);
							});
					}
				};
				button.addEventListener("click", clickHandler);
				window.linksPageState.eventListeners.push([
					button,
					"click",
					clickHandler,
				]);
			})(copyButtons[i]);
		}

		window.linksPageState.initialized = true;
		console.log(
			"[links Global] ✅ Initialization complete with",
			window.linksPageState.eventListeners.length,
			"listeners",
		);
		return true;
	}

	// 带重试的初始化
	function tryInit(retries) {
		retries = retries || 0;
		if (initlinksPage()) {
			console.log("[links Global] Init succeeded");
			return;
		}
		if (retries < 5) {
			setTimeout(() => {
				tryInit(retries + 1);
			}, 100);
		}
	}

	// MutationObserver 监听 DOM 变化
	function setupMutationObserver() {
		if (window.linksPageState.mutationObserver) {
			window.linksPageState.mutationObserver.disconnect();
		}

		window.linksPageState.mutationObserver = new MutationObserver(
			(mutations) => {
				var shouldInit = false;
				for (var i = 0; i < mutations.length; i++) {
					var mutation = mutations[i];
					if (mutation.addedNodes && mutation.addedNodes.length > 0) {
						for (var j = 0; j < mutation.addedNodes.length; j++) {
							var node = mutation.addedNodes[j];
							if (node.nodeType === 1) {
								if (
									node.id === "links-grid" ||
									node.id === "links-search" ||
									(node.querySelector &&
										node.querySelector("#links-grid"))
								) {
									shouldInit = true;
									break;
								}
							}
						}
					}
					if (shouldInit) break;
				}

				if (shouldInit) {
					console.log("[links Global] DOM mutation detected");
					window.linksPageState.initialized = false;
					setTimeout(() => {
						tryInit();
					}, 50);
				}
			},
		);

		window.linksPageState.mutationObserver.observe(document.body, {
			childList: true,
			subtree: true,
		});
	}

	// 页面加载时初始化
	if (document.readyState === "loading") {
		document.addEventListener("DOMContentLoaded", () => {
			console.log("[links Global] DOMContentLoaded");
			tryInit();
		});
	} else {
		tryInit();
	}

	// 启动 MutationObserver
	setupMutationObserver();

	// 监听所有可能的页面切换事件
	var events = [
		"swup:contentReplaced",
		"swup:pageView",
		"astro:page-load",
		"astro:after-swap",
	];

	for (var i = 0; i < events.length; i++) {
		((eventName) => {
			document.addEventListener(eventName, () => {
				console.log("[links Global] Event:", eventName);
				window.linksPageState.initialized = false;
				setTimeout(() => {
					tryInit();
				}, 100);
			});
		})(events[i]);
	}

	console.log("[links Global] All listeners registered");
})();
