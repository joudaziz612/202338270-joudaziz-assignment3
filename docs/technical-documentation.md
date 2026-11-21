# Technical Documentation — Assignment 3

This document explains how the portfolio website works: its structure, each feature, the data it stores, and how it was tested.

---

## 1. Overview

The website is a **single-page application** made of three files:

| File | Role |
|---|---|
| `index.html` | Page structure: header, navigation, five sections (About, Projects, GitHub, Skills, Contact), and footer |
| `css/styles.css` | All styling: colors (CSS variables), layout, dark mode, responsive design |
| `js/script.js` | All behavior: API, filtering, sorting, saved state, validation, timer |

There is no framework and no build step. Only one page is loaded; the navigation buttons show and hide sections with JavaScript instead of loading new pages.

---

## 2. JavaScript Structure

`script.js` is split into numbered parts, each with a comment heading:

| # | Part | Main functions |
|---|---|---|
| — | Storage helpers | `saveValue()`, `loadValue()`, `removeValue()` |
| 1 | Dark mode | `applyTheme()` |
| 2 | Visitor name + greeting | `getTimeGreeting()`, `showGreeting()` |
| 3 | Switching sections | `showSection()` |
| 4 | Project details | show/hide with `aria-expanded` |
| 5 | Filter + level + sort | `updateProjects()` |
| 6 | GitHub API | `loadRepositories()`, `showRepositories()`, `createRepoCard()` |
| 7 | Contact form | `validateName()`, `validateEmail()`, `validateMessage()`, `setFieldError()` |
| 8 | Visit timer | `formatDuration()` |
| — | Start-up | restores saved state when the page loads |

The file starts with `"use strict"` to catch common mistakes. Settings that may change (GitHub username, number of repos, cache time) are constants at the top of the file.

---

## 3. API Integration (GitHub REST API)

**Endpoint:**
```
GET https://api.github.com/users/joudaziz612/repos?sort=updated&per_page=30
```
No API key is needed because the data is public.

**Steps in `loadRepositories()`:**
1. If the repos are already on the page, or a request is already running, stop (avoids duplicate requests).
2. Check `sessionStorage` for saved data that is **less than 10 minutes old**. If found, show it without calling GitHub.
3. Show "Loading repositories…" and call `fetch()` with `async/await`.
4. If `response.ok` is false (for example `403` when the hourly limit is reached), throw an error.
5. Filter the data: remove forks and keep only repos whose name starts with `202338270-joudaziz-assignment`.
6. Save the result in `sessionStorage` with the current time.
7. Build one card per repo with `createRepoCard()`.

**Error handling:** everything is inside `try/catch`. If anything fails, the visitor sees:
> "Sorry, my GitHub projects couldn't be loaded right now. Please check your internet connection and try again."

plus a **Try Again** button that calls `loadRepositories()` again. The technical error is written to the console with `console.error` for debugging.

**Security:** repo names and descriptions are inserted with `textContent` (not `innerHTML`), so text from the API can never run as HTML or scripts. External links use `rel="noopener"`.

**Lazy loading:** the API is called only when the visitor opens the GitHub section, not when the page first loads.

---

## 4. Complex Logic

### 4.1 Filter + Level + Sort (`updateProjects()`)
Each project card stores its information in `data-` attributes:
```html
<article class="project-card" data-category="hardware" data-level="advanced"
  data-date="2023" data-name="Smart Solar Cleaning System">
```
When any of the three dropdowns changes, `updateProjects()` runs these steps:
1. **Filter** — a card is kept only if it matches the category **AND** the level (`"all"` matches everything).
2. **Sort** — by `data-date` (newest or oldest) or by `data-name` (A–Z with `localeCompare`). Dates are written as `YYYY` or `YYYY-MM`, so comparing them as text gives the correct order.
3. **Display** — all cards are hidden, then the matching cards are shown and moved into the new order with `appendChild()`.
4. **Messages** — the result count is updated ("Showing 2 of 3 projects"), a level message appears for Beginner/Advanced, and a "No projects match" message appears if the list is empty.

### 4.2 Contact Form Validation
The form uses `novalidate` so JavaScript controls all checks:

| Field | Rules |
|---|---|
| Name | not empty, at least 2 characters |
| Email | not empty, matches `/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/` |
| Message | not empty, at least 10 characters, maximum 500 |

- Each field is checked when the visitor leaves it (`blur`) and again on submit.
- On submit, **all three checks run** (not stopping at the first error), so every problem is shown at once.
- Errors appear under the field, the border turns red, and `aria-invalid` is set for screen readers.
- Only when all checks pass, a `mailto:` link opens the visitor's email app with the subject and message filled in.
- A live counter shows the number of characters typed.

### 4.3 Different Content Based on User Choice
- **Level filter:** Beginner and Advanced each show a different explanation message.
- **Greeting:** `getTimeGreeting()` checks the visitor's local hour: before 12 → "Good morning", before 18 → "Good afternoon", otherwise "Good evening".

### 4.4 Visit Timer
The start time is saved when the page loads. Every second, the difference from `Date.now()` is calculated and formatted by `formatDuration()` as `45s`, `3m 12s`, or `1h 5m 0s`. Using the real time difference (instead of adding 1 each second) keeps the timer accurate even if the browser tab was in the background.

---

## 5. State Management

| Key | Storage | Value | Purpose |
|---|---|---|---|
| `theme` | `localStorage` | `"dark"` / `"light"` | Remember the theme |
| `visitorName` | `localStorage` | e.g. `"Sara"` | Greeting + pre-fill the contact form |
| `lastSection` | `localStorage` | e.g. `"projects"` | Reopen the last viewed section |
| `repoCache` | `sessionStorage` | `{ time, repos }` | Avoid repeated API calls for 10 minutes |

- **localStorage** keeps data after the browser is closed. **sessionStorage** is cleared when the tab is closed, which suits temporary API data.
- All storage access goes through `saveValue()` / `loadValue()` / `removeValue()`, which use `try/catch`. Some browsers block storage (for example in some private modes); in that case the site still works, it just doesn't remember the choice.
- On start-up, the saved section is checked before use: if it doesn't match a real section, the site falls back to **About**.

---

## 6. Performance

| Step | Before | After |
|---|---|---|
| Image format | PNG / JPG (6 files) | WebP (5 files) |
| Total image size | ~1.2 MB | ~140 KB |
| Duplicate image | `Picture1.png` and `Picture2.png` were the same file | Duplicate removed |
| Image loading | all at once | `loading="lazy"` + fixed `width`/`height` |
| Script loading | end of `<body>` | `<head>` with `defer` |
| Dark mode CSS | every rule written twice | only CSS variables change |
| API calls | — | only when GitHub section opens + 10-minute cache |

**Lighthouse (PageSpeed Insights) on the live site:**

| Device | Performance | Accessibility | Best Practices | SEO |
|---|---|---|---|---|
| Mobile | 99 | 100 | 100 | 100 |
| Desktop | 100 | 100 | 100 | 100 |

---

## 7. Accessibility

- Every input has a `<label>`.
- Buttons use `aria-pressed` (navigation) and `aria-expanded` / `aria-controls` (View Details).
- Status messages use `role="status"` and `aria-live="polite"`, so screen readers announce results, errors, and API status.
- A clear gold focus outline appears when using the keyboard (`:focus-visible`).
- Animations are turned off for users who choose reduced motion (`prefers-reduced-motion`).
- All images have descriptive `alt` text.

---

## 8. Responsive Design and Compatibility

- Layout uses Flexbox and Grid with `flex-wrap` and `auto-fill`, so items move to new lines on small screens.
- A media query at `600px` reduces padding and puts the prototype gallery in one column.
- Only standard features supported by all modern browsers are used (`fetch`, `async/await`, CSS variables, Grid).

| Browser / Device | Result |
|---|---|
| Google Chrome (Windows) | ✅ All features work |
| Microsoft Edge (Windows) | ✅ All features work |
| Safari (iPhone) | ✅ All features work |

---

## 9. Testing Checklist

| Test | Expected result | Result |
|---|---|---|
| Save a name, reload the page | Greeting still shows the name | ✅ |
| Click Change name | Name form appears again | ✅ |
| Turn on dark mode, reload | Still dark | ✅ |
| Open Projects, reload | Projects section opens | ✅ |
| Category = Hardware, Level = Beginner | "No projects match" message | ✅ |
| Sort = Oldest first | 2023 project first | ✅ |
| Open GitHub section | 3 assignment repos appear | ✅ |
| API failure (tested by simulating an error) | Friendly message + Try Again button | ✅ |
| Submit empty contact form | Error under every field | ✅ |
| Email `bad@x` | "Please enter a valid email" | ✅ |
| Message shorter than 10 characters | Error shown | ✅ |
| Valid form | Email app opens | ✅ |
| Wait on the page | Timer counts up | ✅ |

---

## 10. Known Limitations

- Without a key, the GitHub API allows **60 requests per hour** per visitor. The 10-minute cache reduces requests, and the error message covers the case when the limit is reached.
- The contact form does not send emails by itself; it opens the visitor's email app using `mailto:`.
- Project dates are shown by year when the exact month is not known.

