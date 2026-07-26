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

document.querySelectorAll(".temple-zone-map").forEach((map) => {
  const zoneLabels = [...map.querySelectorAll(".zone-label[data-zone]")];

  const activateZone = (label) => {
    map.dataset.activeZone = label.dataset.zone;
  };

  const clearZone = (label) => {
    if (map.dataset.activeZone === label.dataset.zone) {
      delete map.dataset.activeZone;
    }
  };

  zoneLabels.forEach((label) => {
    label.addEventListener("pointerenter", () => activateZone(label));
    label.addEventListener("pointerleave", () => clearZone(label));
    label.addEventListener("focus", () => activateZone(label));
    label.addEventListener("blur", () => clearZone(label));
  });
});

const enhanceGreenBloomPrototypes = () => {
  const greenBloomImages = [
    ...document.querySelectorAll(
      'img[alt^="自然教育课程协作平台｜Green Bloom 作品展示"]',
    ),
  ];

  if (greenBloomImages.length !== 4) return;

  const annotations = [
    [
      {
        title: "个人中心",
        text: "将课程、照片和反馈整理为可分享成果。",
        x: "76%",
        y: "31%",
        edge: "end",
      },
    ],
    [
      {
        title: "课程设计指导",
        text: "通过分步模板生成目标、活动和安全计划。",
        x: "50%",
        y: "68%",
      },
    ],
    [
      {
        title: "一键发布与招募",
        text: "生成活动海报和报名二维码。",
        x: "18%",
        y: "70%",
        edge: "start",
      },
      {
        title: "反馈收集",
        text: "统一收集参与者反馈和教学数据。",
        x: "28%",
        y: "70%",
      },
    ],
    [
      {
        title: "首页",
        text: "快捷身份选择。",
        x: "50%",
        y: "41%",
      },
    ],
  ];

  greenBloomImages.forEach((image, imageIndex) => {
    if (image.closest(".green-bloom-prototype")) return;

    const figure = document.createElement("figure");
    figure.className =
      "ppt-figure annotated-prototype green-bloom-prototype";
    image.replaceWith(figure);
    figure.append(image);

    annotations[imageIndex].forEach((annotation) => {
      const hotspot = document.createElement("button");
      hotspot.type = "button";
      hotspot.className = "annotation-hotspot";
      if (annotation.edge) {
        hotspot.classList.add(`hotspot-tooltip-${annotation.edge}`);
      }
      hotspot.style.setProperty("--hotspot-x", annotation.x);
      hotspot.style.setProperty("--hotspot-y", annotation.y);
      hotspot.setAttribute("aria-label", `查看${annotation.title}说明`);

      const dot = document.createElement("span");
      dot.className = "hotspot-dot";
      dot.setAttribute("aria-hidden", "true");

      const tooltip = document.createElement("span");
      tooltip.className = "hotspot-tooltip";
      tooltip.setAttribute("role", "tooltip");

      const title = document.createElement("strong");
      title.textContent = annotation.title;

      const text = document.createElement("span");
      text.textContent = annotation.text;

      tooltip.append(title, text);
      hotspot.append(dot, tooltip);
      figure.append(hotspot);
    });
  });
};

enhanceGreenBloomPrototypes();

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
