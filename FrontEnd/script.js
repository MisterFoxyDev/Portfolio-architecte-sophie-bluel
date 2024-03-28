let activeFilter = "tous";

// Fonction IIFE (auto-invoquée)
(async () => {
  const getWorks = async () => {
    const data = await fetch("http://localhost:5678/api/works");
    return data.json();
  };

  // Appel de la fonction getWorks pour récupérer les travaux pour créer le Set
  let works = await getWorks();

  // Création d'un set pour lister les différentes catégories de travaux
  let categories = new Set(works.map((work) => work.category.name));

  // Création des boutons de filtre pour chaque catégorie
  categories.forEach((category) => {
    const button = document.createElement("button");
    button.id = category;
    button.className = "filter-button";
    button.onclick = () => selectFilter(category);
    button.textContent = category;

    // Insertion des boutons dans le HTML
    document.getElementsByClassName("buttons")[0].appendChild(button);
  });

  // Fonction utilisée comme attribut de window pour capter les onclick des boutons
  window.selectFilter = async (id) => {
    const filterButtons = document.getElementsByClassName("filter-button");

    // Récupération des travaux à chaque nouveau clic sur un filtre
    let works = await getWorks();

    // Boucle qui supprime la classe "active" de tous les boutons, pour avoir un seul bouton actif
    for (let button of filterButtons) {
      button.classList.remove("active");
    }

    // Récupération de l'id du bouton cliqué et ajout de la classe "active" à ce bouton
    activeFilter = id;
    const selectedButton = document.getElementById(activeFilter);
    selectedButton.classList.add("active");

    // usage d'un opérateur ternaire pour s'assurer que activeFIlter n'est pas null ou undefined (inutile ?)
    activeFilter =
      activeFilter === null || typeof activeFilter === "undefined"
        ? "tous"
        : activeFilter;

    // usage d'un opérateur ternaire pour filtrer les travaux en fonction de la catégorie sélectionnée
    works =
      activeFilter === "tous"
        ? works
        : works.filter((work) => work.category.name === activeFilter);

    // Vidage préalable de la galerie lors d'un clic sur un filtre
    let gallery = document.getElementById("gallery");
    gallery.innerHTML = "";

    // Remplissage de la galerie avec une boucle for
    for (let i = 0; i < works.length; i++) {
      let singleWork = works[i];

      let galleryItem = document.createElement("figure");
      let galleryItemImg = document.createElement("img");
      let galleryItemTitle = document.createElement("figcaption");

      gallery.appendChild(galleryItem);
      galleryItem.appendChild(galleryItemImg);
      galleryItem.appendChild(galleryItemTitle);

      galleryItemImg.src = singleWork.imageUrl;
      galleryItemTitle.textContent = singleWork.title;
    }
  };

  // Ajouter la classe "active" au bouton "tous" par défaut
  document.getElementById("tous").classList.add("active");

  // Appeler selectFilter avec "tous" lors du chargement de la page
  selectFilter("tous");

  // Code suivant à des fins de test
  window.localStorage.setItem("isAdmin", "true");
  // window.localStorage.setItem("isAdmin", "false");

  // affichage de mode édition si admin
  if (window.localStorage.getItem("isAdmin") === "true") {
    const header = document.querySelector("header");
    header.classList.add("header-edit-mode");
    const div = document.createElement("div");
    div.textContent = "Mode édition";
    header.prepend(div);
    div.classList.add("edit-mode");
    const editButton = document.createElement("i");
    editButton.classList.add("fa-regular");
    editButton.classList.add("fa-pen-to-square");
    div.prepend(editButton);
    console.log(header.innerHTML);
  }
})();
