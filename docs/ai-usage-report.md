# AI Usage Report — Assignment 3

**Student:** Joud Aziz Alqarni
**Student ID:** 202338270
**Course assignment:** Assignment 3 – Advanced Functionality

---

## 1. Tools Used & Use Cases

I used **one AI tool** in this assignment: **Claude (model: Claude Opus 5.5)** through claude.ai. All of my AI use happened in **one conversation (C01)**, so the full process is in one place.

| Use case | How I used Claude |
|---|---|
| **Planning** | I shared the assignment instructions and asked Claude to guide me step by step, from creating the repository to the final submission. |
| **Git & GitHub help** | Claude explained how to clone, commit, push, keep an empty folder with `.gitkeep`, and publish with GitHub Pages. |
| **Reusing my Assignment 2** | Claude read my Assignment 2 repository and built the new version on top of it, keeping my content and design. |
| **Code generation** | Claude generated the new HTML, CSS, and JavaScript features: GitHub API, filter + sort, saved state, form validation, and visit timer. |
| **Code explanation** | Claude explained what each feature does and which assignment requirement it covers. |
| **Performance** | Claude converted my images to WebP and found that two images in Assignment 2 were duplicates. |
| **Testing** | Claude tested the site in a browser before giving it to me, including a simulated API failure to check the error message. |
| **Debugging** | I asked how to hide repositories I didn't want shown (a duplicate repo and `demo1`), and Claude gave me a filter. |
| **Documentation** | Claude drafted the README, the technical documentation, and this report, which I then reviewed and edited. |

I did **not** use any other AI tool (no ChatGPT, Copilot, or others) for this assignment.

---

## 2. Benefits & Challenges

### Benefits
- **Saved time:** I had to finish the assignment in one day. Step-by-step instructions helped me know exactly what to do next.
- **Clear explanations:** Claude explained Git and GitHub steps that I wasn't sure about, like why an empty folder doesn't upload and what `git push` does.
- **Better quality:** Claude found problems I hadn't noticed, like the duplicate image from Assignment 2, and made the images much smaller.
- **Testing:** the site was tested before I received it, so I had fewer bugs to fix.

### Challenges
- **Wrong information:** in its first message, Claude used a different student's name and ID for my repository name. This caused me to create an extra repository by mistake, which I later deleted. This showed me I must check every detail the AI gives me.
- **Guessed content:** Claude did not know when I made my projects, so it put guessed dates. I had to replace them with the real years.
- **Too many repositories:** the first version of the GitHub section showed all my repositories, including a test repo and a duplicate. I had to ask for a change so only my assignments appear.
- **Following along:** some steps were not clear to me at first (for example, how to save the evidence files and what F5 means), so I had to ask for simpler explanations.

---

## 3. Learning Outcomes

- **APIs:** how to get data from an API with `fetch()` and `async/await`, check `response.ok`, and handle errors with `try/catch`.
- **State management:** the difference between `localStorage` (stays after closing the browser) and `sessionStorage` (cleared when the tab closes), and how to restore saved data when the page loads.
- **Complex logic:** how to combine two filters with AND, then sort the results, using `data-` attributes and `Array.filter()` / `Array.sort()`.
- **Form validation:** checking all fields at once and showing an error under each field.
- **Performance:** why WebP images, lazy loading, and `defer` make a page faster, and how to test speed with Lighthouse / PageSpeed Insights.
- **CSS variables:** how changing a few variables can switch the whole theme without repeating code.
- **Git workflow:** committing after each feature with clear messages and crediting AI with `Assisted-by`.
- **Using AI responsibly:** AI output can be wrong, so I need to check it, test it, and understand it before submitting.
- **Personal reflection:** The most useful thing I learned was how a website can show live data from another service. Before this assignment, my site only showed content I wrote by hand, but now the GitHub section updates by itself whenever I create a new repository.
---

## 4. Responsible Use & Modifications

- **Reviewed:** I read the code and the explanation of each feature, and I can explain how each part works.
- **Modified:**
  - Replaced the guessed project dates with the real years (SCC: 2023, Plant Care App: 2026).
  - Asked for and applied a filter so the GitHub section only shows my three assignment repositories.
  - Reviewed and edited the documentation so it describes my real work and my real test results.
- **Verified:**
  - Tested every feature myself (name, greeting, dark mode, filters, sorting, GitHub section, contact form, timer).
  - Tested on **Chrome** and **Edge** on my laptop and on **Safari on my iPhone**.
  - Ran **PageSpeed Insights (Lighthouse)**: Mobile 99/100/100/100, Desktop 100/100/100/100.
- **Credited:** every commit that contains AI-assisted code or documentation ends with `Assisted-by: Claude (Claude Opus 5.5)`. One exception: the early setup commit `3627090` (folder structure and the `.gitignore` content suggested by Claude) was pushed without this line by mistake, so I am declaring it here.
- **Evidence:** the full, unedited conversation and the original AI outputs (before my edits) are in the AI Evidence ZIP submitted on Blackboard. They are not committed to this repository.

---

## 5. Usage Log

| ID | Tool (model) | Date | Purpose | Files affected | What I changed and how I verified it |
|---|---|---|---|---|---|
| C01 | Claude (Claude Opus 5.5) | 2026-11-21 | Full step-by-step guidance for Assignment 3: setup, Git help, code, testing, deployment, and documentation | All project files | Followed the steps, asked for clearer explanations when needed, and checked each step in VS Code, GitHub, and the browser. Deleted an extra repository created because of a wrong name in Claude's first message. |
| A01 | Claude (Claude Opus 5.5) | 2026-11-21 | Website code built on my Assignment 2: HTML, CSS, JavaScript, and optimized WebP images | `index.html`, `css/styles.css`, `js/script.js`, `assets/images/*.webp` | Replaced the guessed project dates with real years. Tested all features on Chrome, Edge, and iPhone Safari. |
| A02 | Claude (Claude Opus 5.5) | 2026-11-21 | Filter so the GitHub section shows only my assignment repositories | `js/script.js` | Applied the three edits, then checked that only assignments 1, 2, and 3 appear. |
| A03 | Claude (Claude Opus 5.5) | 2026-11-21 | Drafts of the README, technical documentation, and AI usage report | `README.md`, `docs/technical-documentation.md`, `docs/ai-usage-report.md` | Reviewed every section, corrected details to match my real work and test results, and checked all links. |

---

## 6. AI Usage Declaration

I declare that this report and the attached evidence document all of my AI use in this assignment, with complete and unedited conversations, and that I understand and can explain all the code I submitted. I understand that undeclared AI use or a false declaration will be treated as plagiarism according to KFUPM regulations.

**Name:** Joud Aziz Alqarni
**Student ID:** 202338270
**Date:** November 21, 2026


