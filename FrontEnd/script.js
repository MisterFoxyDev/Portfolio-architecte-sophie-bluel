let activeFilter = "tous";

// Fonction IIFE (auto-invoquée)
(async () => {
  const getWorks = async () => {
    const data = await fetch("http://localhost:5678/api/works");
    return data.json();
  };

  // Fonction utilisée comme attribut de window pour capter les onclick des boutons
  window.selectFilter = async (id) => {
    const buttons = document.getElementsByClassName("filter-button");

    // Boucle qui supprime la classe "active" de tous les boutons, pour avoir un seul bouton actif
    for (let button of buttons) {
      button.classList.remove("active");
    }

    // Récupération de l'id du bouton cliqué et ajout de la classe "active" à ce bouton
    activeFilter = id;
    const selectedButton = document.getElementById(activeFilter);
    selectedButton.classList.add("active");

    // Appel de la fonction getWorks pour récupérer les travaux
    let works = await getWorks();

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
})();
