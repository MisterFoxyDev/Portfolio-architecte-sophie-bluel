const loginSubmit = async () => {
  let email = document.getElementById("email").value;
  let password = document.getElementById("password").value;
  try {
    const response = await fetch("http://localhost:5678/api/users/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: email,
        password: password,
      }),
    });
    const data = await response.json();
    if (data.token) {
      localStorage.setItem("authToken", data.token);
      location.href = "index.html";
    } else {
      alert("Email ou mot de passe incorrect");
    }
  } catch (error) {
    console.error("Erreur :", error);
  }
};