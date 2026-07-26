const folderList = document.querySelector(".grouped-index");
const folders = [...document.querySelectorAll(".category-accordion")];

if (folderList && folders.length) {
  let closeTimer;

  const openFolder = (folder) => {
    window.clearTimeout(closeTimer);
    folderList.classList.remove("is-closing");

    folders.forEach((otherFolder) => {
      otherFolder.classList.remove("is-closing");
      if (otherFolder !== folder) otherFolder.open = false;
    });

    folderList.classList.add("has-open-folder");
    document.body.classList.add("folder-view");
    folder.open = true;
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
  });

  folderList.addEventListener("click", (event) => {
    if (event.target !== folderList) return;
    closeFolder(folders.find((folder) => folder.open));
  });

  document.addEventListener("keydown", (event) => {
    if (event.key !== "Escape") return;
    closeFolder(folders.find((folder) => folder.open));
  });
}
