(async () => {
  const getWorks = async () => {
    const data = await fetch("http://localhost:5678/api/works");
    return data.json();
  };

  let works = await getWorks();
  console.log("🚀 ~ works:", works);

  let singleWork;

  for (let i = 0; i < works.length; i++) {
    singleWork = works[i];
    console.log("🚀 ~ singleWork:", singleWork);

    let gallery = document.getElementById("gallery");
    let galleryItem = document.createElement("figure");
    let galleryItemImg = document.createElement("img");
    let galleryItemTitle = document.createElement("figcaption");

    gallery.appendChild(galleryItem);
    galleryItem.appendChild(galleryItemImg);
    galleryItem.appendChild(galleryItemTitle);

    galleryItemImg.src = singleWork.imageUrl;
    galleryItemTitle.textContent = singleWork.title;
  }
})();
