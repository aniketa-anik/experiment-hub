(function () {
  const DUMMY_EMAIL = "demo@experimentshub.com";
  const DUMMY_PASSWORD = "Demo@12345";

  const form = document.getElementById("authForm");
  const message = document.getElementById("formMessage");
  const password = document.getElementById("password");
  const togglePassword = document.getElementById("togglePassword");
  const switchModeLink = document.getElementById("switchModeLink");
  const submitBtn = document.getElementById("submitBtn");
  let isLoginMode = false;

  function setMode(loginMode) {
    isLoginMode = loginMode;
    const title = document.querySelector(".form-head h1");
    const subtext = document.querySelector(".form-head p");
    const firstInput = document.getElementById("firstName");
    const lastInput = document.getElementById("lastName");
    const companyInput = document.getElementById("company");
    const termsInput = document.getElementById("terms");
    const first = firstInput.closest("label");
    const last = lastInput.closest("label");
    const company = companyInput.closest("label");
    const terms = termsInput.closest(".terms-row");

    if (isLoginMode) {
      title.textContent = "Log in to Experiment Hub";
      subtext.innerHTML = `Use demo credentials: <strong>${DUMMY_EMAIL}</strong> / <strong>${DUMMY_PASSWORD}</strong><br />Need an account? <a href="#" id="switchModeLink">Create one</a>`;
      submitBtn.textContent = "Log in";
      first.style.display = "none";
      last.style.display = "none";
      company.style.display = "none";
      terms.style.display = "none";
      firstInput.required = false;
      lastInput.required = false;
      companyInput.required = false;
      termsInput.required = false;
    } else {
      title.textContent = "Create your workspace";
      subtext.innerHTML = 'Already have an account? <a href="#" id="switchModeLink">Log in</a>';
      submitBtn.textContent = "Create account";
      first.style.display = "grid";
      last.style.display = "grid";
      company.style.display = "grid";
      terms.style.display = "flex";
      firstInput.required = true;
      lastInput.required = true;
      companyInput.required = true;
      termsInput.required = true;
    }

    document.getElementById("switchModeLink").addEventListener("click", onModeClick);
  }

  function onModeClick(event) {
    event.preventDefault();
    setMode(!isLoginMode);
  }

  togglePassword.addEventListener("click", () => {
    const hidden = password.type === "password";
    password.type = hidden ? "text" : "password";
    togglePassword.textContent = hidden ? "Hide" : "Show";
    togglePassword.setAttribute("aria-label", hidden ? "Hide password" : "Show password");
  });

  switchModeLink.addEventListener("click", onModeClick);

  form.addEventListener("submit", (event) => {
    event.preventDefault();

    if (!form.checkValidity()) {
      message.textContent = "Please complete all required fields correctly.";
      message.style.color = "#ff9090";
      return;
    }

    const email = document.getElementById("email").value.trim();
    const enteredPassword = password.value;

    if (isLoginMode && (email !== DUMMY_EMAIL || enteredPassword !== DUMMY_PASSWORD)) {
      message.textContent = `Invalid credentials. Use ${DUMMY_EMAIL} / ${DUMMY_PASSWORD}`;
      message.style.color = "#ff9090";
      return;
    }

    message.textContent = "";
    window.location.href = "home.html";
  });
})();
