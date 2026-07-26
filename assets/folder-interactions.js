const folderList = document.querySelector(".grouped-index");
const folders = [...document.querySelectorAll(".category-accordion")];

if (folderList && folders.length) {
  let closeTimer;
  let pageScrollBeforeOpen = window.scrollY;
  let isPageLocked = false;
  const folderStateKey = "portfolio-folder-state";
  const bodyStyleBeforeLock = {};

  const restorePageScroll = (scrollTop) => {
    const root = document.documentElement;
    const previousScrollBehavior = root.style.scrollBehavior;
    root.style.scrollBehavior = "auto";
    window.scrollTo(0, scrollTop);
    requestAnimationFrame(() => {
      root.style.scrollBehavior = previousScrollBehavior;
    });
  };

  const lockPageScroll = () => {
    if (isPageLocked) return;

    ["position", "top", "left", "right", "width"].forEach((property) => {
      bodyStyleBeforeLock[property] = document.body.style[property];
    });

    document.body.style.position = "fixed";
    document.body.style.top = `-${pageScrollBeforeOpen}px`;
    document.body.style.left = "0";
    document.body.style.right = "0";
    document.body.style.width = "100%";
    isPageLocked = true;
  };

  const unlockPageScroll = () => {
    if (!isPageLocked) {
      restorePageScroll(pageScrollBeforeOpen);
      return;
    }

    Object.entries(bodyStyleBeforeLock).forEach(([property, value]) => {
      document.body.style[property] = value;
    });

    isPageLocked = false;
    restorePageScroll(pageScrollBeforeOpen);
    requestAnimationFrame(() => restorePageScroll(pageScrollBeforeOpen));
  };

  const saveFolderState = (folder) => {
    const folderIndex = folders.indexOf(folder);
    if (folderIndex < 0) return;

    sessionStorage.setItem(
      folderStateKey,
      JSON.stringify({
        folderIndex,
        pageScroll: pageScrollBeforeOpen,
        overlayScroll: folderList.scrollTop,
      }),
    );
  };

  const openFolder = (folder, options = {}) => {
    window.clearTimeout(closeTimer);
    folderList.classList.remove("is-closing");

    if (!folderList.classList.contains("has-open-folder")) {
      pageScrollBeforeOpen = options.pageScroll ?? window.scrollY;
    }

    folders.forEach((otherFolder) => {
      otherFolder.classList.remove("is-closing");
      if (otherFolder !== folder) otherFolder.open = false;
    });

    folderList.classList.add("has-open-folder");
    document.body.classList.add("folder-view");
    lockPageScroll();
    folder.open = true;

    requestAnimationFrame(() => {
      folderList.scrollTop = options.overlayScroll ?? 0;
    });
  };

  const closeFolder = (folder) => {
    if (!folder?.open || folderList.classList.contains("is-closing")) return;

    folderList.classList.add("is-closing");
    folder.classList.add("is-closing");

    closeTimer = window.setTimeout(() => {
      folder.open = false;
      folder.classList.remove("is-closing");
      folderList.classList.remove("is-closing", "has-open-folder");
      document.body.classList.remove("folder-view");
      sessionStorage.removeItem(folderStateKey);
      unlockPageScroll();
    }, 200);
  };

  folders.forEach((folder) => {
    const summary = folder.querySelector("summary");
    if (!summary) return;

    summary.addEventListener("click", (event) => {
      event.preventDefault();
      if (folder.open) closeFolder(folder);
      else openFolder(folder);
    });

    folder.querySelectorAll(".index-row").forEach((projectLink) => {
      projectLink.addEventListener("click", () => saveFolderState(folder));
    });
  });

  folderList.addEventListener("click", (event) => {
    if (event.target !== folderList) return;
    closeFolder(folders.find((folder) => folder.open));
  });

  document.addEventListener("keydown", (event) => {
    if (event.key !== "Escape") return;
    closeFolder(folders.find((folder) => folder.open));
  });

  window.addEventListener("pageshow", (event) => {
    if (!event.persisted && performance.getEntriesByType("navigation")[0]?.type !== "back_forward") {
      return;
    }

    const savedState = sessionStorage.getItem(folderStateKey);
    if (!savedState) return;

    try {
      const state = JSON.parse(savedState);
      const folder = folders[state.folderIndex];
      if (!folder) return;
      restorePageScroll(Number(state.pageScroll) || 0);
      openFolder(folder, {
        pageScroll: Number(state.pageScroll) || 0,
        overlayScroll: Number(state.overlayScroll) || 0,
      });
    } catch {
      sessionStorage.removeItem(folderStateKey);
    }
  });
}

const contactMenus = [...document.querySelectorAll(".contact-menu")];

if (contactMenus.length) {
  const closeContacts = (exceptMenu = null) => {
    contactMenus.forEach((menu) => {
      if (menu !== exceptMenu) menu.open = false;
    });
  };

  contactMenus.forEach((menu) => {
    menu.addEventListener("toggle", () => {
      if (menu.open) closeContacts(menu);
    });

    menu.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", () => {
        menu.open = false;
      });
    });
  });

  document.addEventListener("click", (event) => {
    if (contactMenus.some((menu) => menu.contains(event.target))) return;
    closeContacts();
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") closeContacts();
  });
}

const annotationHotspots = [...document.querySelectorAll(".annotation-hotspot")];

if (annotationHotspots.length) {
  const closeHotspots = (exceptHotspot = null) => {
    annotationHotspots.forEach((hotspot) => {
      if (hotspot !== exceptHotspot) {
        hotspot.classList.remove("is-open");
        hotspot.blur();
      }
    });
  };

  annotationHotspots.forEach((hotspot) => {
    hotspot.addEventListener("click", (event) => {
      event.stopPropagation();
      const shouldOpen = !hotspot.classList.contains("is-open");
      closeHotspots();
      hotspot.classList.toggle("is-open", shouldOpen);
      if (!shouldOpen) hotspot.blur();
    });
  });

  document.addEventListener("click", () => closeHotspots());
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") closeHotspots();
  });
}
