export const initAccordion = (rootSelector: string | HTMLElement = "[data-accordion]") => {
	const roots: HTMLElement[] =
		typeof rootSelector === "string"
			? Array.from(document.querySelectorAll<HTMLElement>(rootSelector))
			: ([rootSelector].filter(Boolean) as HTMLElement[]);

	roots.forEach((root) => {
		const items = Array.from(root.querySelectorAll<HTMLElement>("[data-accordion-item]"));

		const get = (item: HTMLElement, sel: string) => item.querySelector<HTMLElement>(sel);

		const closeItem = (item: HTMLElement) => {
			const trigger = get(item, "[data-accordion-trigger]");
			const content = get(item, "[data-accordion-content]");
			const icon = get(item, "[data-accordion-icon]");
			if (!trigger || !content || !icon) return;
			trigger.setAttribute("aria-expanded", "false");
			content.classList.add("hidden");
			icon.classList.remove("rotate-180");
		};

		const openItem = (item: HTMLElement) => {
			const trigger = get(item, "[data-accordion-trigger]");
			const content = get(item, "[data-accordion-content]");
			const icon = get(item, "[data-accordion-icon]");
			if (!trigger || !content || !icon) return;
			trigger.setAttribute("aria-expanded", "true");
			content.classList.remove("hidden");
			icon.classList.add("rotate-180");
		};

		items.forEach((item) => {
			const trigger = get(item, "[data-accordion-trigger]");
			if (!trigger) return;
			trigger.addEventListener("click", () => {
				const isExpanded = trigger.getAttribute("aria-expanded") === "true";
				items.forEach(closeItem);
				if (!isExpanded) openItem(item);
			});
		});
	});
};

if (typeof window !== "undefined") {
	window.addEventListener("DOMContentLoaded", () => initAccordion());
}

export default initAccordion;
