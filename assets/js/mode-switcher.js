window.addEventListener("load", () => {
  const TRAINING_MODE_KEY = "trainingMode";
  const TRAINING_MODE_NORMAL = "normal";
  const TRAINING_MODE_EXPERT = "expert";

  // Add expert mode switch to navigation
  const template = `
      <li class="mode-switch-item nav-item mr-5 mb-2 mb-lg-0 d-flex align-items-center">
        <label for="mode-switch-input" class="mb-0 mr-2">Expert Mode:</label>
        <label class="switch mb-0">
          <input type="checkbox" id="mode-switch-input">
          <span class="slider"></span>
        </label>
      </li>
    `;
  const nav = document.getElementById("main_navbar");
  nav.querySelector("ul").insertAdjacentHTML("afterbegin", template);

  const input = document.getElementById("mode-switch-input");
  const initialMode = readMode();
  input.addEventListener("change", onModeChange);
  input.checked = initialMode === TRAINING_MODE_EXPERT;
  updateDetailsOpenState(initialMode);

  function readMode() {
    return localStorage.getItem(TRAINING_MODE_KEY) || TRAINING_MODE_NORMAL;
  }

  function saveMode(mode) {
    localStorage.setItem(TRAINING_MODE_KEY, mode || TRAINING_MODE_NORMAL);
  }

  function onModeChange(event) {
    const mode = event.currentTarget.checked
      ? TRAINING_MODE_EXPERT
      : TRAINING_MODE_NORMAL;
    saveMode(mode);
    updateDetailsOpenState(mode);
  }

  function updateDetailsOpenState(mode) {
    document.querySelectorAll("details").forEach((details) => {
      // Only open detail elements with data-mode="normalexpertmode" attributes
      if (details.dataset.mode === "normalexpertmode") {
        if (mode === TRAINING_MODE_EXPERT) {
          details.removeAttribute("open");
          details.classList.remove("normalmode");
        } else {
          details.setAttribute("open", "true");
          details.classList.add("normalmode");
        }
      }
    });
  }
});
