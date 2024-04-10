const editWorksTitle = document.getElementById("edit-works-title");
const authToken = localStorage.getItem("authToken");
let works;

// Fonction IIFE (auto-invoquée)
(async () => {
  let activeFilter = "tous";
  const gallery = document.getElementById("gallery");
  const editWorks = document.getElementById("edit-works");
  const addWorks = document.getElementById("add-works");

  const modalContainer = document.querySelector(".modal-container");
  const modal2 = document.querySelector(".modal-2");

  // Afficher ou masquer les modales, suppression des valeurs des inputs de la modale 2 et remplacement de l'image choisie

  const toggleModal = (modal) => {
    modal.classList.toggle("active");
    inputs.forEach((input) => (input.value = ""));
    const img = document.querySelector("#add-file img");
    if (img) {
      const icon = document.createElement("i");
      icon.className = "fa-regular fa-image";
      img.replaceWith(icon);
    }
  };

  addWorks.addEventListener("click", () => {
    document.querySelector(".modal-2").classList.add("active");
  });

  const getWorks = async () => {
    const data = await fetch("http://localhost:5678/api/works");
    return data.json();
  };

  // Appel de la fonction getWorks pour récupérer les travaux pour créer le Set
  works = await getWorks();

  // Création d'un set pour lister les différentes catégories de travaux
  const categories = new Set(works.map((work) => work.category.name));
  // Création d'une map pour associer chaque catégorie à son id
  const categoryMap = new Map(
    works.map((work) => [work.category.name, work.category.id]),
  );

  // Création des boutons de filtre pour chaque catégorie
  categories.forEach((category) => {
    const button = document.createElement("button");
    button.id = category;
    button.className = "filter-button";
    button.addEventListener("click", () => selectFilter(category));
    button.textContent = category;

    // Insertion des boutons dans le HTML
    document.getElementsByClassName("buttons")[0].appendChild(button);
  });
  
  // écouteur pour le bouton "Tous"
  document
    .getElementById("tous")
    .addEventListener("click", () => selectFilter("tous"));

  // Création des options du select pour chaque catégorie (Modale 2)
  categories.forEach((category) => {
    const select = document.querySelector("select");
    const option = document.createElement("option");
    select.appendChild(option);
    option.value = category;
    option.textContent = category;
  });

  // Fonction utilisée comme attribut de window pour capter les onclick des boutons
  const selectFilter = async (id) => {
    const filterButtons = document.getElementsByClassName("filter-button");

    // Récupération des travaux à chaque nouveau clic sur un filtre
    works = await getWorks();

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

    // Vidage préalable des galeries lors d'un clic sur un filtre

    gallery.innerHTML = "";
    editWorks.innerHTML = "";

    // Remplissage des galeries avec une boucle for
    for (const element of works) {
      let singleWork = element;

      const galleryItem = document.createElement("figure");
      const galleryItemImg = document.createElement("img");
      const galleryItemTitle = document.createElement("figcaption");

      galleryItem.appendChild(galleryItemImg);
      galleryItem.appendChild(galleryItemTitle);

      gallery.appendChild(galleryItem);

      galleryItemImg.src = singleWork.imageUrl;
      galleryItemTitle.textContent = singleWork.title;

      // Création de l'icône de suppression du mode édition
      const trashIcon = document.createElement("i");
      trashIcon.classList.add("fa-solid");
      trashIcon.classList.add("fa-trash-can");

      // Finaliser la suppression d'un travail
      trashIcon.addEventListener("click", () => {
        // * Suppression du travail de la base de données
        if (
          confirm("Voulez-vous vraiment supprimer cette photo de la galerie ?")
        ) {
          fetch(`http://localhost:5678/api/works/${singleWork.id}`, {
            method: "DELETE",
            headers: {
              Authorization: `Bearer ${authToken}`,
            },
          })
            .then((response) => {
              if (response.status === 200) {
                // * Suppression du travail de la galerie
                gallery.removeChild(galleryItem);
                editWorks.removeChild(galleryItem.parentElement);
              } else if (response.status === 401) {
                alert(
                  "Erreur : Vous n'êtes pas autorisé à effectuer cette action",
                );
              }
            })
            .catch((error) => {
              console.error("Erreur:", error);
            });
        }
      });

      // Galerie du mode édition
      // * Clone de galleryItemImg pour pouvoir le dupliquer au lieu de le déplacer
      const editItem = galleryItemImg.cloneNode(false);
      const editItemContainer = document.createElement("div");
      editItemContainer.appendChild(editItem);
      editItemContainer.appendChild(trashIcon);
      editWorks.appendChild(editItemContainer);
    }
  };

  // Ajouter la classe "active" au bouton "tous" par défaut
  document.getElementById("tous").classList.add("active");

  // Appeler selectFilter avec "tous" lors du chargement de la page
  selectFilter("tous");

  // * affichage du mode édition si admin

  // vérification de authToken dans le localStorage
  if (localStorage.getItem("authToken")) {
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

    // * Déclenchement des modales
    const modalTriggers = document.querySelectorAll(".modal-trigger");
    const modalTrigger2 = document.querySelector(".modal-2-trigger");

    modalTriggers.forEach((trigger) => {
      trigger.addEventListener("click", () => toggleModal(modalContainer));
      trigger.addEventListener("click", function () {
        const modal2 = document.querySelector(".modal-2");
        if (modal2) {
          modal2.classList.remove("active");
        }
      });
    });

    modalTrigger2.addEventListener("click", () => toggleModal(modal2));
  }

  // * Modale 2
  // Affichage de la miniature dans la modale 2
  const fileInput = document.querySelector("#file-input");
  const addFileButton = document.querySelector("#add-file");

  // * Affichage de la miniature

  window.displayImage = function (e) {
    const file = e.target.files[0];
    const currentImageOrIcon = addFileButton.querySelector("img, .fa-image");
    //Supression si icône ou image existante
    if (currentImageOrIcon) {
      currentImageOrIcon.remove();
    }
    // Création d'un fileReader si une image a été sélectionnée
    if (file) {
      const reader = new FileReader();
      reader.onload = function (e) {
        const img = document.createElement("img");
        img.src = e.target.result;
        img.width = 70;
        img.height = 65;
        addFileButton.insertBefore(img, fileInput);
      };
      reader.readAsDataURL(file);
    } else {
      // Remise en place de l'icône si pas d'image sélectionnée
      const icon = document.createElement("i");
      icon.className = "fa-regular fa-image";
      addFileButton.insertBefore(icon, fileInput);
    }
  };

  // Sélection du bouton Valider bouton et des éléments input/select de la modale 2
  const validateButton = document.querySelector("#add-work-button");
  const inputs = document.querySelectorAll(
    "#add-work-form input, #add-work-form select",
  );

  // * Boucle for pour vérifier si les inputs/select sont vides, et adapter la couleur du bouton Valider
  function checkInputs() {
    for (const element of inputs) {
      if (!element.value) {
        validateButton.style.backgroundColor = "#A7A7A7";
        return;
      }
    }
    validateButton.style.backgroundColor = "#1d6154";
  }

  // Ecouteur d'évènements sur les inputs/select
  inputs.forEach((input) => {
    input.addEventListener("change", checkInputs);
  });

  // Vérification des inputs au chargement de la page
  checkInputs();

  // * Envoi du formulaire
  document
    .getElementById("add-work-form")
    .addEventListener("submit", async function (e) {
      e.preventDefault();

      // Récupération des valeurs des inputs et du select
      const title = document.getElementById("titre").value;
      const categoryName = document.getElementById("categorie").value;
      const categoryId = categoryMap.get(categoryName);

      // Création du formData
      const formData = new FormData();
      formData.append("title", title);
      formData.append("category", categoryId);
      formData.append("image", fileInput.files[0]);
      formData.append("userId", 1);

      console.log("🚀 ~ formData:", formData);

      // Envoyer la requête POST
      const response = await fetch("http://localhost:5678/api/works", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
        body: formData,
      });

      // Traitement de la réponse
      if (response.ok) {
        toggleModal(modal2);
      } else {
        alert("Erreur lors de l'envoi");
        console.log("Erreur lors de la requête POST:", response.status);
      }
    });
})();
