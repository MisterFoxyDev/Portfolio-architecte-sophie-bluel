(async () => {
  // !!!!! Définition des fonctions !!!!!

  // ***** Galerie *****
  // Récupère les travaux depuis l'API
  const getWorks = async () => {
    const response = await fetch("http://localhost:5678/api/works");

    if (!response.ok) {
      throw new Error(
        `Erreur lors de la récupération des travaux : ${response.statusText}`,
      );
    }

    return response.json();
  };

  // Récupère les catégories uniques à partir des travaux
  const setCategories = async () => {
    const works = await getWorks();
    const categories = new Set(works.map((work) => work.category.name));
    return categories;
  };

  // Crée les boutons de filtre
  const createFilterButtons = (categories) => {
    document
      .getElementById("tous")
      .addEventListener("click", () => applyFilter("tous"));
    addFilterButtons(categories);
  };

  // Ajoute les boutons de filtre au DOM
  const addFilterButtons = (categories) => {
    categories.forEach((category) => {
      const button = document.createElement("button");
      button.id = category;
      button.className = "filter-button";
      button.addEventListener("click", () => applyFilter(category));
      button.textContent = category;
      document.getElementsByClassName("buttons")[0].appendChild(button);
    });
  };

  // Supprime la classe active de tous les boutons de filtre
  const removeAllActiveClasses = (filterButtons) => {
    for (let button of filterButtons) {
      button.classList.remove("active");
    }
  };

  // Ajoute la classe active au bouton de filtre actif
  const addActiveClass = (activeFilter) => {
    document.getElementById(activeFilter).classList.add("active");
  };

  // Applique le filtre sur les boutons
  const applyFilterOnButtons = (id) => {
    const filterButtons = document.getElementsByClassName("filter-button");
    const activeFilter = id || "tous";
    removeAllActiveClasses(filterButtons);
    addActiveClass(activeFilter);
  };

  // Supprime toutes les galeries
  const clearGalleries = () => {
    const gallery = document.getElementById("gallery");
    const editModeGallery = document.getElementById("edit-mode-gallery");

    if (gallery) {
      gallery.innerHTML = "";
    }

    if (editModeGallery) {
      editModeGallery.innerHTML = "";
    }
  };

  // Applique le filtre sur les galeries
  const applyFilter = (id = "tous") => {
    applyFilterOnButtons(id);
    clearGalleries();
    applyFilterOnGalleries(id);
  };

  // Applique le filtre sur les galeries en fonction de l'ID
  const applyFilterOnGalleries = async (id) => {
    const editModeGallery = document.getElementById("edit-mode-gallery");

    let works = await getWorks();
    works =
      id === "tous" ? works : works.filter((work) => work.category.name === id);
    for (const singleWork of works) {
      const galleryItem = document.createElement("figure");
      const galleryItemImg = document.createElement("img");
      const galleryItemTitle = document.createElement("figcaption");

      galleryItemImg.src = singleWork.imageUrl;
      galleryItemTitle.textContent = singleWork.title;

      const editItem = galleryItemImg.cloneNode(true);
      const editItemContainer = document.createElement("div");
      const trashIcon = createTrashIcon(singleWork);

      editItemContainer.appendChild(editItem);
      editItemContainer.appendChild(trashIcon);
      editModeGallery.appendChild(editItemContainer);
      galleryItem.appendChild(galleryItemImg);
      galleryItem.appendChild(galleryItemTitle);

      document.getElementById("gallery").appendChild(galleryItem);
    }
  };

  // ***** Mode édition *****

  // Crée l'en-tête du mode d'édition
  const createEditModeHeader = () => {
    const header = document.querySelector("header");
    header.classList.add("header-edit-mode");
    const div = document.createElement("div");
    div.textContent = "Mode édition";
    header.prepend(div);
    div.classList.add("edit-mode");
    return div;
  };

  // Crée l'icône du mode d'édition
  const createEditModeIcon = (div) => {
    const editIcon = document.createElement("i");
    editIcon.classList.add("fa-regular");
    editIcon.classList.add("fa-pen-to-square");
    div.prepend(editIcon);
  };

  // Crée le bouton d'édition
  const createEditButton = () => {
    const editButton = document.createElement("button");
    editButton.classList.add("modal-btn");
    editButton.classList.add("modal-trigger");
    const editButtonIcon = document.createElement("i");
    editButtonIcon.classList.add("fa-regular");
    editButtonIcon.classList.add("fa-pen-to-square");
    const editText = document.createElement("button");
    editText.textContent = "modifier";

    document.getElementById("projects").appendChild(editButton);
    editButton.appendChild(editText);
    editButton.appendChild(editButtonIcon);
  };

  // Passe en mode d'édition si l'utilisateur est connecté
  const switchToEditMode = () => {
    const div = createEditModeHeader();
    createEditModeIcon(div);
    createEditButton();
  };

  // Vérifie si l'utilisateur est connecté
  const checkConnection = () => {
    if (localStorage.getItem("authToken")) {
      switchToEditMode();
    }
  };

  // ***** Gestion des modales *****

  // Ouvre ou ferme la modale
  const toggleModal = (modal) => {
    const inputs = document.querySelectorAll(
      "#add-work-form input, #add-work-form select",
    );

    modal.classList.toggle("active");
    inputs.forEach((input) => (input.value = ""));
    const img = document.querySelector("#add-file img");
    if (img) {
      const icon = document.createElement("i");
      icon.className = "fa-regular fa-image";
      img.replaceWith(icon);
    }
  };

  // Ouvre la modale 2
  const openModal2 = async () => {
    document.getElementById("add-works").addEventListener("click", () => {
      document.querySelector(".modal-2").classList.add("active");
    });
    const fileInput = document.querySelector("#file-input");
    fileInput.addEventListener("change", displayThumbnail);
    fileInput.addEventListener("change", checkInputs);

    const inputs = document.querySelectorAll(
      "#add-work-form input, #add-work-form select",
    );
    inputs.forEach((input) => {
      input.addEventListener("change", checkInputs);
    });

    const categories = await setCategories();
    showSelectOptions(categories);
  };

  // Ferme la modale 2
  const closeModal2 = () => {
    const modal2 = document.querySelector(".modal-2");
    if (modal2) {
      modal2.classList.remove("active");
    }
  };

  // Ouvre les modales
  const openModals = () => {
    const modalTriggers = document.querySelectorAll(".modal-trigger");
    const modalTrigger2 = document.querySelector(".modal-2-trigger");
    const modalContainer = document.querySelector(".modal-container");
    const modal2 = document.querySelector(".modal-2");

    modalTriggers.forEach((trigger) => {
      trigger.addEventListener("click", () => toggleModal(modalContainer));
      trigger.addEventListener("click", () => closeModal2());
    });
    modalTrigger2.addEventListener("click", () => toggleModal(modal2));
    openModal2();
  };

  // ***** Modale 1 (suppression de travaux) *****

  // Crée l'icône de la corbeille pour supprimer un travail
  const createTrashIcon = (singleWork) => {
    const trashIcon = document.createElement("i");
    trashIcon.classList.add("fa-solid", "fa-trash-can");
    trashIcon.addEventListener("click", () => deleteWork(singleWork));
    return trashIcon;
  };

  // Supprime un travail
  const deleteWork = async (singleWork) => {
    const authToken = localStorage.getItem("authToken");
    const gallery = document.getElementById("gallery");
    const editModeGallery = document.getElementById("edit-mode-gallery");
    const galleryItem = document.querySelector(`#work-${singleWork.id}`);
    if (confirm("Voulez-vous vraiment supprimer cette photo de la galerie ?")) {
      fetch(`http://localhost:5678/api/works/${singleWork.id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      })
        .then((response) => {
          if (response.status === 200) {
            gallery.removeChild(galleryItem);
            editModeGallery.removeChild(galleryItem.parentElement);
          } else if (response.status === 401) {
            alert("Erreur : Vous n'êtes pas autorisé à effectuer cette action");
          }
        })
        .catch((error) => {
          console.error("Erreur:", error);
        });
    }
  };

  // ***** Modale 2 (ajout de travaux) *****

  // Affiche la miniature de l'image sélectionnée
  const displayThumbnail = (e) => {
    const fileInput = e.target;
    const addFileButton = document.querySelector("#add-file");
    const file = e.target.files[0];
    const currentImageOrIcon = addFileButton.querySelector("img, .fa-image");

    if (currentImageOrIcon) {
      currentImageOrIcon.remove();
    }
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
      const icon = document.createElement("i");
      icon.className = "fa-regular fa-image";
      addFileButton.insertBefore(icon, fileInput);
    }
  };

  // Affiche les options de sélection pour les catégories
  const showSelectOptions = (categories) => {
    categories.forEach((category) => {
      const select = document.querySelector("select");
      const option = document.createElement("option");
      select.appendChild(option);
      option.value = category;
      option.textContent = category;
    });
  };

  // Vérifie si tous les champs du formulaire sont remplis
  const checkInputs = () => {
    const validateButton = document.querySelector("#add-work-button");
    const fileInput = document.querySelector("#file-input");
    const inputs = document.querySelectorAll(
      "#add-work-form input, #add-work-form select",
    );
    for (const element of inputs) {
      if (!element.value) {
        validateButton.style.backgroundColor = "#A7A7A7";
        return;
      }
    }
    validateButton.style.backgroundColor = "#1d6154";
    document.getElementById("add-work-form").addEventListener("submit", (e) => {
      e.preventDefault();
      sendFormData(fileInput);
    });
  };

  // Crée un objet FormData à partir des données du formulaire
  const createFormData = async (fileInput) => {
    const works = await getWorks();
    const categoryMap = new Map(
      works.map((work) => [work.category.name, work.category.id]),
    );
    const title = document.getElementById("titre").value;
    const categoryName = document.getElementById("categorie").value;
    const categoryId = categoryMap.get(categoryName);
    const formData = new FormData();
    formData.append("title", title);
    formData.append("category", categoryId);
    formData.append("image", fileInput.files[0]);
    formData.append("userId", 1);
    return formData;
  };

  // Envoie les données du formulaire à l'API
  const sendFormData = async (fileInput) => {
    const modal2 = document.querySelector(".modal-2");
    const formData = await createFormData(fileInput);
    const authToken = localStorage.getItem("authToken");

    const response = await fetch("http://localhost:5678/api/works", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${authToken}`,
      },
      body: formData,
    });
    if (response.ok) {
      toggleModal(modal2);
    } else {
      alert("Erreur lors de l'envoi");
      console.error("Erreur lors de la requête POST:", response.status);
    }
  };

  // !!!!! Application des fonctions !!!!!

  try {
    document.getElementById("tous").classList.add("active");
    const categories = await setCategories();
    createFilterButtons(categories);
    applyFilter("tous");
    checkConnection();
    openModals();
  } catch (error) {
    console.error(error);
  }
})();
