(async () => {
  const getWorks = async () => {
    const data = await fetch("http://localhost:5678/api/works");
    return data.json();
  };

  window.selectFilter = (id) => {
    let activeFilter = "tous";
    const buttons = document.getElementsByClassName("filter-button");

    // Supprimer la classe "active" de tous les boutons
    for (let button of buttons) {
      button.classList.remove("active");
    }
    activeFilter = id;

    console.log("🚀 ~ selectFilter ~ activeFilter:", activeFilter);
    const selectedButton = document.getElementById(activeFilter);

    // Ajouter la classe "active" au bouton sélectionné
    selectedButton.classList.add("active");

    return activeFilter;
  };

  // Ajouter la classe "active" au bouton "tous" par défaut
  document.getElementById("tous").classList.add("active");

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
