const loginSubmit = async () => {
  let email = document.getElementById("email").value;
  let password = document.getElementById("password").value;
  await fetch("http://localhost:5678/api/users/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      email: email,
      password: password,
    }),
  })
    .then((response) => {
      if (response.status === 200) {
        window.localStorage.setItem("isAdmin", "true");
        // ! A des fins de test uniquement
        window.localStorage.setItem("token", "gwEtS=KfKfR^zxJP83ULiw");
        window.location.href = "index.html";
      } else {
        alert("Erreur dans l’identifiant ou le mot de passe");
      }
    })
    .catch((error) => {
      console.error("Erreur:", error);
    });
};
