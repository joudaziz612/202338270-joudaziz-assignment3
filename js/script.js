"use strict";

/* =========================================
   Settings
   ========================================= */
const GITHUB_USER = "joudaziz612";
const REPO_PREFIX = "202338270-joudaziz-assignment"; const REPO_LIMIT = 6;                  // how many repositories to show
const CACHE_TIME = 10 * 60 * 1000;     // keep GitHub data for 10 minutes

/* =========================================
   Storage helpers
   localStorage can throw an error (for example in some private
   browsing modes), so we wrap it in try/catch to keep the site working.
   ========================================= */
function saveValue(key, value) {
  try {
    localStorage.setItem(key, value);
  } catch (error) {
    // Storage is not available: the feature still works, it just won't be remembered.
  }
}

function loadValue(key) {
  try {
    return localStorage.getItem(key);
  } catch (error) {
    return null;
  }
}

function removeValue(key) {
  try {
    localStorage.removeItem(key);
  } catch (error) {
    // Nothing to do
  }
}

/* =========================================
   1) Dark Mode (state saved in localStorage)
   ========================================= */
const themeButton = document.getElementById("themeButton");

function applyTheme(theme) {
  const isDark = theme === "dark";
  document.body.classList.toggle("dark-mode", isDark);
  themeButton.textContent = isDark ? "Light Mode" : "Dark Mode";
}

themeButton.addEventListener("click", function () {
  const newTheme = document.body.classList.contains("dark-mode") ? "light" : "dark";
  applyTheme(newTheme);
  saveValue("theme", newTheme);
});

// Use the saved theme when the page opens
applyTheme(loadValue("theme") === "dark" ? "dark" : "light");

/* =========================================
   2) Visitor Name + Greeting (state saved in localStorage)
   ========================================= */
const nameForm = document.getElementById("nameForm");
const visitorNameInput = document.getElementById("visitorName");
const greetingMessage = document.getElementById("greetingMessage");
const greetingText = document.getElementById("greetingText");
const changeNameBtn = document.getElementById("changeNameBtn");

// Choose a greeting based on the visitor's local time
function getTimeGreeting() {
  const hour = new Date().getHours();

  if (hour < 12) {
    return "Good morning";
  } else if (hour < 18) {
    return "Good afternoon";
  }
  return "Good evening";
}

function showGreeting(name) {
  if (name) {
    greetingText.textContent = getTimeGreeting() + ", " + name + "! 👋";
    nameForm.hidden = true;
    greetingMessage.hidden = false;
  } else {
    nameForm.hidden = false;
    greetingMessage.hidden = true;
  }
}

nameForm.addEventListener("submit", function (event) {
  event.preventDefault();
  const name = visitorNameInput.value.trim();

  if (name === "") {
    visitorNameInput.focus();
    return;
  }

  saveValue("visitorName", name);
  showGreeting(name);
  fillContactName(name);
});

changeNameBtn.addEventListener("click", function () {
  removeValue("visitorName");
  visitorNameInput.value = "";
  showGreeting(null);
  visitorNameInput.focus();
});

/* =========================================
   3) Switching Sections (last opened section is remembered)
   ========================================= */
const sectionButtons = document.querySelectorAll(".section-btn");
const sections = document.querySelectorAll(".portfolio-section");

function showSection(sectionId) {
  sections.forEach(function (section) {
    section.hidden = section.id !== sectionId;
  });

  sectionButtons.forEach(function (button) {
    const active = button.dataset.section === sectionId;
    button.classList.toggle("active", active);
    button.setAttribute("aria-pressed", String(active));
  });

  saveValue("lastSection", sectionId);

  // Load GitHub data only when the visitor opens that section (saves requests)
  if (sectionId === "github") {
    loadRepositories();
  }
}

sectionButtons.forEach(function (button) {
  button.addEventListener("click", function () {
    showSection(button.dataset.section);
  });
});

/* =========================================
   4) Project Details (show / hide)
   ========================================= */
const detailButtons = document.querySelectorAll(".details-btn[aria-controls]");

detailButtons.forEach(function (button) {
  button.addEventListener("click", function () {
    const details = document.getElementById(button.getAttribute("aria-controls"));
    const willOpen = details.hidden;

    details.hidden = !willOpen;
    button.textContent = willOpen ? "Hide Details" : "View Details";
    button.setAttribute("aria-expanded", String(willOpen));
  });
});

/* =========================================
   5) Filter + Level + Sort Projects (complex logic)
   Step 1: keep only cards that match BOTH the category and the level.
   Step 2: sort the matching cards.
   Step 3: show the result count, or a message if nothing matches.
   ========================================= */
const categoryFilter = document.getElementById("categoryFilter");
const levelFilter = document.getElementById("levelFilter");
const sortOrder = document.getElementById("sortOrder");
const projectList = document.getElementById("projectList");
const projectCount = document.getElementById("projectCount");
const noProjects = document.getElementById("noProjects");
const levelMessage = document.getElementById("levelMessage");
const projectCards = Array.from(document.querySelectorAll(".project-card"));

// A different message for each level the visitor chooses
const levelMessages = {
  all: "",
  beginner: "Beginner projects: my first steps in design and web development, where I learned the basics.",
  advanced: "Advanced projects: bigger challenges that combine hardware, sensors, and problem-solving."
};

function updateProjects() {
  const category = categoryFilter.value;
  const level = levelFilter.value;
  const sort = sortOrder.value;

  // Step 1: filter
  const visibleCards = projectCards.filter(function (card) {
    const categoryMatches = category === "all" || card.dataset.category === category;
    const levelMatches = level === "all" || card.dataset.level === level;
    return categoryMatches && levelMatches;
  });

  // Step 2: sort ("YYYY-MM" dates can be compared as text)
  visibleCards.sort(function (a, b) {
    if (sort === "name") {
      return a.dataset.name.localeCompare(b.dataset.name);
    } else if (sort === "oldest") {
      return a.dataset.date.localeCompare(b.dataset.date);
    }
    return b.dataset.date.localeCompare(a.dataset.date); // newest
  });

  // Hide every card, then show and re-order only the matching ones
  projectCards.forEach(function (card) {
    card.hidden = true;
  });

  visibleCards.forEach(function (card) {
    card.hidden = false;
    projectList.appendChild(card); // appendChild moves the card to the end = new order
  });

  // Step 3: messages
  levelMessage.textContent = levelMessages[level];
  noProjects.hidden = visibleCards.length > 0;
  projectCount.textContent = "Showing " + visibleCards.length + " of " + projectCards.length + " projects";
}

[categoryFilter, levelFilter, sortOrder].forEach(function (control) {
  control.addEventListener("change", updateProjects);
});

/* =========================================
   6) GitHub API Integration
   Fetches my public repositories and shows them as cards.
   Shows a friendly error message + "Try Again" button if it fails.
   ========================================= */
const repoStatus = document.getElementById("repoStatus");
const repoList = document.getElementById("repoList");
const retryBtn = document.getElementById("retryBtn");
let reposLoaded = false;
let reposLoading = false;  // stops a second request while one is running

function formatDate(isoDate) {
  return new Date(isoDate).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric"
  });
}

// Build one repository card (textContent is used so repo text can't inject HTML)
function createRepoCard(repo) {
  const card = document.createElement("article");
  card.className = "repo-card";

  const title = document.createElement("h3");
  const link = document.createElement("a");
  link.href = repo.html_url;
  link.target = "_blank";
  link.rel = "noopener";
  link.textContent = repo.name;
  title.appendChild(link);

  const description = document.createElement("p");
  description.textContent = repo.description || "No description provided.";

  const info = document.createElement("small");
  info.className = "repo-info";
  info.textContent =
    (repo.language || "Code") + " · ★ " + repo.stargazers_count +
    " · Updated " + formatDate(repo.updated_at);

  card.append(title, description, info);
  return card;
}

function showRepositories(repos) {
  repoList.innerHTML = "";

  if (repos.length === 0) {
    repoStatus.textContent = "No public repositories to show yet.";
    return;
  }

  repos.forEach(function (repo) {
    repoList.appendChild(createRepoCard(repo));
  });

  repoStatus.textContent = "Showing my " + repos.length + " portfolio assignments, newest first.";
  reposLoaded = true;
}

async function loadRepositories() {
  if (reposLoaded || reposLoading) {
    return; // already on the page (or loading), no need to ask GitHub again
  }

  // Use saved data if it is less than 10 minutes old (faster + fewer API calls)
  try {
    const cached = JSON.parse(sessionStorage.getItem("repoCache"));
    if (cached && Date.now() - cached.time < CACHE_TIME) {
      showRepositories(cached.repos);
      return;
    }
  } catch (error) {
    // No usable cache, so we continue and fetch from GitHub
  }

  repoStatus.textContent = "Loading repositories…";
  repoStatus.classList.remove("error");
  retryBtn.hidden = true;
  reposLoading = true;

  try {
    const url = "https://api.github.com/users/" + GITHUB_USER + "/repos?sort=updated&per_page=30";
    const response = await fetch(url);

    if (!response.ok) {
      // 403 usually means the hourly GitHub limit was reached
      throw new Error("GitHub responded with status " + response.status);
    }

    const data = await response.json();

    // Keep only my own repositories (not forks), newest first, limited to REPO_LIMIT
    const repos = data
      .filter(function (repo) {
        return !repo.fork && repo.name.startsWith(REPO_PREFIX);
      })
      .slice(0, REPO_LIMIT);

    try {
      sessionStorage.setItem("repoCache", JSON.stringify({ time: Date.now(), repos: repos }));
    } catch (error) {
      // Caching is optional
    }

    showRepositories(repos);
  } catch (error) {
    console.error("GitHub API error:", error);
    repoStatus.textContent =
      "Sorry, my GitHub projects couldn't be loaded right now. " +
      "Please check your internet connection and try again.";
    repoStatus.classList.add("error");
    retryBtn.hidden = false;
  } finally {
    reposLoading = false;
  }
}

retryBtn.addEventListener("click", loadRepositories);

/* =========================================
   7) Contact Form Validation (several checks before submitting)
   ========================================= */
const contactForm = document.getElementById("contactForm");
const formFeedback = document.getElementById("formFeedback");
const nameInput = document.getElementById("name");
const emailInput = document.getElementById("email");
const messageInput = document.getElementById("message");
const charCount = document.getElementById("charCount");

const MIN_MESSAGE = 10;
const MAX_MESSAGE = 500;

// Put the saved visitor name in the form, if the field is still empty
function fillContactName(name) {
  if (name && nameInput.value.trim() === "") {
    nameInput.value = name;
  }
}

// Show or clear the error under one field; returns true if the field is valid
function setFieldError(input, message) {
  const errorElement = document.getElementById(input.id + "Error");
  errorElement.textContent = message;
  input.classList.toggle("invalid", message !== "");
  input.setAttribute("aria-invalid", String(message !== ""));
  return message === "";
}

function validateName() {
  const name = nameInput.value.trim();

  if (name === "") {
    return setFieldError(nameInput, "Please enter your name.");
  } else if (name.length < 2) {
    return setFieldError(nameInput, "Name must be at least 2 characters.");
  }
  return setFieldError(nameInput, "");
}

function validateEmail() {
  const email = emailInput.value.trim();
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

  if (email === "") {
    return setFieldError(emailInput, "Please enter your email.");
  } else if (!emailPattern.test(email)) {
    return setFieldError(emailInput, "Please enter a valid email, like name@example.com.");
  }
  return setFieldError(emailInput, "");
}

function validateMessage() {
  const length = messageInput.value.trim().length;

  if (length === 0) {
    return setFieldError(messageInput, "Please write a message.");
  } else if (length < MIN_MESSAGE) {
    return setFieldError(messageInput, "Your message needs at least " + MIN_MESSAGE + " characters.");
  }
  return setFieldError(messageInput, "");
}

// Live character counter
messageInput.addEventListener("input", function () {
  charCount.textContent =
    messageInput.value.length + " / " + MAX_MESSAGE + " characters (minimum " + MIN_MESSAGE + ")";
});

// Check each field when the visitor leaves it
nameInput.addEventListener("blur", validateName);
emailInput.addEventListener("blur", validateEmail);
messageInput.addEventListener("blur", validateMessage);

contactForm.addEventListener("submit", function (event) {
  event.preventDefault();
  formFeedback.className = "";

  // Run ALL checks (not stopping at the first) so every error shows at once
  const nameOk = validateName();
  const emailOk = validateEmail();
  const messageOk = validateMessage();

  if (!nameOk || !emailOk || !messageOk) {
    formFeedback.textContent = "Please fix the highlighted fields.";
    formFeedback.className = "error";
    return;
  }

  // All checks passed: prepare the email
  const name = nameInput.value.trim();
  const subject = encodeURIComponent("Portfolio Contact from " + name);
  const body = encodeURIComponent(
    "Name: " + name +
    "\nEmail: " + emailInput.value.trim() +
    "\n\nMessage:\n" + messageInput.value.trim()
  );

  formFeedback.textContent = "Your email is ready. Please send it from your email application.";
  formFeedback.className = "success";

  window.location.href = "mailto:joudazizalqarni@gmail.com?subject=" + subject + "&body=" + body;
});

/* =========================================
   8) Visit Timer (how long the visitor has been on the site)
   ========================================= */
const visitTimer = document.getElementById("visitTimer");
const startTime = Date.now();

function formatDuration(totalSeconds) {
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  if (hours > 0) {
    return hours + "h " + minutes + "m " + seconds + "s";
  } else if (minutes > 0) {
    return minutes + "m " + seconds + "s";
  }
  return seconds + "s";
}

setInterval(function () {
  const seconds = Math.floor((Date.now() - startTime) / 1000);
  visitTimer.textContent = formatDuration(seconds);
}, 1000);

/* =========================================
   Start-up: restore saved state when the page loads
   ========================================= */
const savedName = loadValue("visitorName");
showGreeting(savedName);
fillContactName(savedName);

updateProjects();

const savedSection = loadValue("lastSection");
const validSection = document.getElementById(savedSection);
showSection(validSection && validSection.classList.contains("portfolio-section") ? savedSection : "about");

document.getElementById("year").textContent = new Date().getFullYear();
