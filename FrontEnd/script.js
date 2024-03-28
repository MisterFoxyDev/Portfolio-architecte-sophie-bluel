let activeFilter = "tous";

const modalContainer = document.querySelector(".modal-container");
const toggleModal = () => {
  modalContainer.classList.toggle("active");
};

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

    // Remplissage des galeries avec une boucle for
    for (let i = 0; i < works.length; i++) {
      let singleWork = works[i];

      let galleryItem = document.createElement("figure");
      let galleryItemImg = document.createElement("img");
      let galleryItemTitle = document.createElement("figcaption");

      galleryItem.appendChild(galleryItemImg);
      galleryItem.appendChild(galleryItemTitle);

      gallery.appendChild(galleryItem);

      galleryItemImg.src = singleWork.imageUrl;
      galleryItemTitle.textContent = singleWork.title;

      let trashIcon = document.createElement("i");
      trashIcon.classList.add("fa-solid");
      trashIcon.classList.add("fa-trash-can");

      // Galerie du mode édition
      let editWorks = document.getElementById("edit-works");
      // * Clone de galleryItemImg pour pouvoir le dupliquer au lieu de le déplacer
      let editItem = galleryItemImg.cloneNode(false);
      let editItemContainer = document.createElement("div");
      editItemContainer.appendChild(editItem);
      editItemContainer.appendChild(trashIcon);
      editWorks.appendChild(editItemContainer);
    }
  };

  // Ajouter la classe "active" au bouton "tous" par défaut
  document.getElementById("tous").classList.add("active");

  // Appeler selectFilter avec "tous" lors du chargement de la page
  selectFilter("tous");

  // ! Code suivant à des fins de test
  window.localStorage.setItem("isAdmin", "true");
  // window.localStorage.setItem("isAdmin", "false");

  // * affichage du mode édition si admin

  // vérification de isAdmin dans le localStorage
  if (window.localStorage.getItem("isAdmin") === "true") {
    // ajout de la classe "header-edit-mode" à l'élément header
    const header = document.querySelector("header");
    header.classList.add("header-edit-mode");

    // création d'un élément div pour afficher "Mode édition" dans le header
    const div = document.createElement("div");
    div.textContent = "Mode édition";
    header.prepend(div);
    div.classList.add("edit-mode");

    // création de l'icône de modification dans le header
    const editIcon = document.createElement("i");
    editIcon.classList.add("fa-regular");
    editIcon.classList.add("fa-pen-to-square");
    div.prepend(editIcon);

    // création du bouton "Modifier" dans la section projets
    const projects = document.getElementById("projects");
    const editButton = document.createElement("button");
    const editButtonIcon = document.createElement("i");
    editButtonIcon.classList.add("fa-regular");
    editButtonIcon.classList.add("fa-pen-to-square");
    editButton.appendChild(editButtonIcon);
    const editText = document.createElement("button");
    editText.textContent = "modifier";
    editButton.appendChild(editText);
    editButton.classList.add("modal-btn");
    editButton.classList.add("modal-trigger");
    projects.appendChild(editButton);
    
    const modalTriggers = document.querySelectorAll(".modal-trigger");
    modalTriggers.forEach((trigger) =>
      trigger.addEventListener("click", toggleModal),
    );
  }
})();
