const loginSubmit = async () => {
  console.log("🚀 ~ isAdmin:", isAdmin);
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
      console.log("🚀 ~ loginSubmit ~ response:", response);
      if (response.status === 200) {
        window.localStorage.setItem("isAdmin", true);
        window.location.href = "index.html";
      } else {
        alert("Erreur dans l’identifiant ou le mot de passe");
      }
    })
    .catch((error) => {
      console.error("Erreur:", error);
    });
};
