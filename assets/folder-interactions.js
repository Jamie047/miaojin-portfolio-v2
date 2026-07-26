const folderList = document.querySelector(".grouped-index");
const folders = [...document.querySelectorAll(".category-accordion")];

if (folderList && folders.length) {
  const updateFolderView = () => {
    const openFolder = folders.find((folder) => folder.open);
    folderList.classList.toggle("has-open-folder", Boolean(openFolder));
    document.body.classList.toggle("folder-view", Boolean(openFolder));
  };

  folders.forEach((folder) => {
    folder.addEventListener("toggle", () => {
      if (folder.open) {
        folders.forEach((otherFolder) => {
          if (otherFolder !== folder) otherFolder.open = false;
        });
      }
      requestAnimationFrame(updateFolderView);
    });
  });

  document.addEventListener("keydown", (event) => {
    if (event.key !== "Escape") return;
    const openFolder = folders.find((folder) => folder.open);
    if (openFolder) openFolder.open = false;
  });

  updateFolderView();
}
