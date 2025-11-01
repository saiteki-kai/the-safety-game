export const initNavigation = (root: HTMLElement | Document = document) => {
	const nav = root.querySelector<HTMLElement>("[data-site-nav]");
	const toggleButton = root.querySelector<HTMLButtonElement>("[data-mobile-toggle]");
	const mobilePanel = root.querySelector<HTMLElement>("[data-mobile-panel]");

	if (!nav) {
		return;
	}

	const srText = toggleButton?.querySelector<HTMLElement>("[data-sr-text]");
	const openIcon = toggleButton?.querySelector<HTMLElement>('[data-icon="open"]');
	const closeIcon = toggleButton?.querySelector<HTMLElement>('[data-icon="close"]');
	const navLinks = Array.from(document.querySelectorAll<HTMLAnchorElement>("[data-nav-link]"));
	const mobileLinks = Array.from(document.querySelectorAll<HTMLAnchorElement>("[data-mobile-link]"));

	const setActiveLinks = (currentSection: string) => {
		const updateGroup = (links: Iterable<HTMLAnchorElement>, activeClass: string) => {
			for (const link of links) {
				if (link.hasAttribute("data-nav-ignore-active")) {
					link.removeAttribute("aria-current");
					continue;
				}
				const sectionId = link.getAttribute("data-section");
				const isActive = Boolean(sectionId) && sectionId === currentSection;
				link.classList.toggle(activeClass, isActive);
				if (isActive) {
					link.setAttribute("aria-current", "true");
				} else {
					link.removeAttribute("aria-current");
				}
			}
		};

		updateGroup(navLinks, "nav-link--active");
		updateGroup(mobileLinks, "mobile-nav-link--active");
	};

	// When the home section is active, mark the nav with the hero theme class so
	// theme-aware nav styles can target the nav directly (avoids DOM-order problems).
	const updateNavHeroTheme = (currentSection: string) => {
		nav.classList.toggle("hero-theme-cosmic", currentSection === "home");
	};

	const setExpandedState = (expanded: boolean) => {
		if (!toggleButton) {
			return;
		}
		toggleButton.setAttribute("aria-expanded", expanded ? "true" : "false");
		openIcon?.classList.toggle("hidden", expanded);
		closeIcon?.classList.toggle("hidden", !expanded);
		if (srText) {
			srText.textContent = expanded ? "Chiudi il menu" : "Apri il menu";
		}
	};

	// Progressive nav background fade: interpolate from transparent to black over NAV_FADE_PX pixels
	const NAV_FADE_PX = 140;
	let latestScrollY = 0;
	let ticking = false;

	const applyNavFade = (scrollY: number) => {
		const p = Math.max(0, Math.min(scrollY / NAV_FADE_PX, 1));
		if (p <= 0) {
			nav.style.background = "transparent";
			nav.style.boxShadow = "none";
		} else {
			nav.style.background = `rgba(0,0,0,${p})`;
			const shadowOpacity = 0.12 * p;
			nav.style.boxShadow = `0 6px 30px rgba(2,6,23,${shadowOpacity})`;
		}

		// maintain the scrolled class once fully opaque (useful for other styles)
		if (p >= 1) {
			nav.classList.add("site-nav--scrolled");
		} else {
			nav.classList.remove("site-nav--scrolled");
		}
	};

	const scheduleNavUpdate = (scrollY: number) => {
		latestScrollY = scrollY;
		if (!ticking) {
			ticking = true;
			window.requestAnimationFrame(() => {
				applyNavFade(latestScrollY);
				ticking = false;
			});
		}
	};

	const updateActiveSection = () => {
		const sections = Array.from(document.querySelectorAll<HTMLElement>("section[id]"));
		const navOffset = nav.offsetHeight + 8;
		const scrollPosition = window.scrollY + navOffset;

		let currentSection = "";

		for (const section of sections) {
			const sectionTop = section.offsetTop;
			const sectionHeight = section.offsetHeight;

			if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
				currentSection = section.id;
				break;
			}
		}

		setActiveLinks(currentSection);
		updateNavHeroTheme(currentSection);
	};

	const closeMenu = () => {
		if (!mobilePanel) {
			return;
		}
		mobilePanel.classList.add("hidden");
		setExpandedState(false);
	};

	const smoothScrollToSection = (targetId: string) => {
		const target = document.getElementById(targetId);
		if (!target) {
			return;
		}

		const navHeight = nav.offsetHeight;
		const targetOffset = target.getBoundingClientRect().top + window.scrollY;
		const destination = Math.max(targetOffset - navHeight + 8, 0);

		window.scrollTo({
			top: destination,
			behavior: "smooth",
		});
	};

	const handleNavClick = (event: Event) => {
		const link = event.currentTarget as HTMLAnchorElement;
		const href = link.getAttribute("href");

		if (!href || !href.startsWith("#")) {
			return;
		}

		event.preventDefault();
		const targetId = href.substring(1);

		setActiveLinks(targetId);
		smoothScrollToSection(targetId);

		if (mobilePanel && !mobilePanel.classList.contains("hidden")) {
			closeMenu();
		}
	};

	toggleButton?.addEventListener("click", () => {
		if (!mobilePanel) return;
		const isHidden = mobilePanel.classList.toggle("hidden");
		setExpandedState(!isHidden);
	});

	navLinks.forEach((link) => {
		link.addEventListener("click", handleNavClick);
	});

	mobileLinks.forEach((link) => {
		link.addEventListener("click", handleNavClick);
	});

	// Use event delegation for other in-page anchors (hero buttons, other CTAs)
	// This ensures anchors added later in the DOM will still be handled.
	document.addEventListener("click", (event) => {
		const target = event.target as HTMLElement | null;
		if (!target) return;
		const anchor = target.closest("a[href^='#']") as HTMLAnchorElement | null;
		if (!anchor) return;
		// ignore nav links which are handled separately
		if (anchor.hasAttribute("data-nav-link") || anchor.hasAttribute("data-mobile-link")) {
			return;
		}
		// let external/empty hashes through
		const href = anchor.getAttribute("href");
		if (!href || !href.startsWith("#")) return;
		event.preventDefault();
		const targetId = href.substring(1);
		setActiveLinks(targetId);
		smoothScrollToSection(targetId);
		if (mobilePanel && !mobilePanel.classList.contains("hidden")) {
			closeMenu();
		}
	});

	const handleScroll = () => {
		scheduleNavUpdate(window.scrollY);
		updateActiveSection();
	};

	window.addEventListener("scroll", handleScroll, { passive: true });
	window.addEventListener("resize", () => {
		scheduleNavUpdate(window.scrollY);
		updateActiveSection();
		if (window.innerWidth >= 1000) {
			closeMenu();
		}
	});

	// init nav offset variable and initial states
	applyNavFade(window.scrollY);
	updateActiveSection();
};

if (typeof window !== "undefined") {
	window.requestAnimationFrame(() => initNavigation());
}
