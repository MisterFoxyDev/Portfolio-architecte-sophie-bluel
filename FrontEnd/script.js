let editWorksTitle = document.getElementById("edit-works-title");

// Fonction IIFE (auto-invoquée)
(async () => {
  let activeFilter = "tous";
  let gallery = document.getElementById("gallery");
  let editWorks = document.getElementById("edit-works");
  let addWorks = document.getElementById("add-works");

  const modalContainer = document.querySelector(".modal-container");
  const modal2 = document.querySelector(".modal-2");

  // Fonctions pour afficher ou masquer les modales, suppression des valeurs des inputs de la modale 2 et remplacement de l'image choisie
  const toggleModal = () => {
    modalContainer.classList.toggle("active");
    inputs.forEach((input) => (input.value = ""));
    const img = document.querySelector("#add-file img");
    if (img) {
      const icon = document.createElement("i");
      icon.className = "fa-regular fa-image";
      img.replaceWith(icon);
    }
  };
  const toggleModal2 = () => {
    modal2.classList.toggle("active");
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
  let works = await getWorks();

  // Création d'un set pour lister les différentes catégories de travaux
  let categories = new Set(works.map((work) => work.category.name));
  // Création d'une map pour associer chaque catégorie à son id
  let categoryMap = new Map(
    works.map((work) => [work.category.name, work.category.id])
  );

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

  // Création des options du select pour chaque catégorie (Modale 2)
  categories.forEach((category) => {
    const select = document.querySelector("select");
    const option = document.createElement("option");
    select.appendChild(option);
    option.value = category;
    option.textContent = category;
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

    // Vidage préalable des galeries lors d'un clic sur un filtre

    gallery.innerHTML = "";
    editWorks.innerHTML = "";

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

      // Création de l'icône de suppression du mode édition
      let trashIcon = document.createElement("i");
      trashIcon.classList.add("fa-solid");
      trashIcon.classList.add("fa-trash-can");


      TODO : // Finaliser la suppression d'un travail
      trashIcon.addEventListener("click", () => {
        // * Suppression du travail de la base de données
        if (
          confirm("Voulez-vous vraiment supprimer cette photo de la galerie ?")
        ) {
          fetch(`http://localhost:5678/api/works/${singleWork.id}`, {
            method: "DELETE",
          })
            .then((response) => {
              if (response.status === 200) {
                // * Suppression du travail de la galerie
                gallery.removeChild(galleryItem);
                editWorks.removeChild(galleryItem.parentElement);
              } else if (response.status === 401) {
                alert(
                  "Erreur : Vous n'êtes pas autorisé à effectuer cette action"
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

    // * Déclenchement des modales
    const modalTriggers = document.querySelectorAll(".modal-trigger");
    const modalTrigger2 = document.querySelector(".modal-2-trigger");

    modalTriggers.forEach((trigger) => {
      trigger.addEventListener("click", toggleModal);
      trigger.addEventListener("click", function () {
        const modal2 = document.querySelector(".modal-2");
        if (modal2) {
          modal2.classList.remove("active");
        }
      });
    });

    modalTrigger2.addEventListener("click", toggleModal2);
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
    "#add-work-form input, #add-work-form select"
  );

  // * Boucle for pour vérifier si les inputs/select sont vides, et adapter la couleur du bouton Valider
  function checkInputs() {
    for (let i = 0; i < inputs.length; i++) {
      if (!inputs[i].value) {
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
      const fileInput = document.getElementById("file-input");
      const imageFile = fileInput.files[0];

      // Création d'un objet FormData et y ajouter les données
      const formData = new FormData();
      formData.append("title", title);
      formData.append("categoryId", categoryId);
      formData.append("image", imageFile);

      for (let pair of formData.entries()) {
        console.log(pair[0] + ", " + pair[1]);
      }

      // Récupération du token depuis le localStorage
      const token = window.localStorage.getItem("token");

      // Envoyer la requête POST
      const response = await fetch("http://localhost:5678/api/works", {
        method: "POST",
        headers: {
          // ! stocké en dur à des fins de test uniquement
          Authorization: "Bearer gwEtS=KfKfR^zxJP83ULiw",
        },
        body: formData,
      });

      // Traitement de la réponse
      if (response.ok) {
        toggleModal2();
      } else {
        alert("Erreur lors de l'envoi");
        console.error("Erreur lors de la requête POST:", response.status);
      }
    });
})();
