//Login.js

const domain_railway = "https://musicfy-musicfy.up.railway.app";

// 💡 URL del backend dinámico (localhost o producción)
const API_URL =
  window.location.hostname === 'localhost'
    ? 'http://localhost:3000' // 🚧 Desarrollo local
    : domain_railway // ✅ Producción en Railway (cambia esto)

// Selección de elementos
const fondo = document.querySelector(".fondo");
const loginLink = document.querySelector(".login_link");
const registrarLink = document.querySelector(".register_link");

// Mostrar pantalla de login
loginLink.addEventListener("click", () => {
  fondo.classList.remove("active");
});

// Mostrar pantalla de registro
registrarLink.addEventListener("click", () => {
  fondo.classList.add("active");
});

// Manejo del formulario de login
const loginForm = document.querySelector(".login form");
loginForm.addEventListener("submit", (event) => {
  event.preventDefault();

  const correo = loginForm.querySelector("input[type='email']").value;
  const contrasena = loginForm.querySelector("input[type='password']").value;

  fetch(`${API_URL}/api/login`, {
    method: 'POST',
    credentials: 'include', // ← importante para sesiones
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ correo, contrasena })
  })
    .then(res => res.json())
    .then(data => {
      if (data.mensaje === 'Login exitoso') {
        // Use redirectTo from backend response for role-based redirection
        if (data.redirectTo) {
          window.location.href = data.redirectTo;
        } else {
          window.location.href = "/views/Inicio_sesion/Home_Sesion";
        }
      } else {
        alert(data.mensaje);
      }
    })
    .catch(error => console.error("Error:", error));
});

// Manejo del formulario de registro
const registerForm = document.querySelector(".register form");
registerForm.addEventListener("submit", (event) => {
  event.preventDefault();

  const nombre = registerForm.querySelector("#nombre").value;
  const correo = registerForm.querySelector("#email_register").value;
  const contrasena = registerForm.querySelector("#password_register").value;

  fetch(`${API_URL}/api/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ nombre, correo, contrasena }) 
  })
    .then(res => res.json())
    .then(data => {
      alert(data.mensaje);
      if (data.mensaje === 'Usuario registrado') {
        window.location.href = "/views/login";
      }
    })
    .catch(error => console.error("Error:", error));
});