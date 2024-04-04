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
    .then((response) => response.json())
    .then((data) => {
      if (data.token) {
        window.localStorage.setItem("authToken", data.token);

        window.location.href = "index.html";
      } else {
        alert("Erreur dans l’identifiant ou le mot de passe");
      }
    })
    .catch((error) => {
      console.error("Erreur:", error);
    });
};
