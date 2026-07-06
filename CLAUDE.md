# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

---

## Project

FlowForge AI is a SaaS landing page for a fictional AI workflow company. The goal is a production-quality, highly converting landing page that drives visitors to book a free consultation. It is also a portfolio project demonstrating professional frontend skills.

---

## Tech Stack

**Mandatory:** HTML5, CSS3, Vanilla JavaScript (ES6+) only.

**Prohibited:** React, Vue, Angular, Next.js, Tailwind CSS, Bootstrap, jQuery, TypeScript, or any CSS/JS framework. Everything must be built from scratch.

---

## Running the Project

No build step. Open `index.html` directly in a browser. There is no dev server, package manager, or bundler.

---

## Architecture

- `index.html` — single-page entry point; all sections live here
- `css/` — stylesheets organized by concern (e.g. `base.css`, `components.css`, `sections.css`)
- `js/` — ES6 modules organized by feature (e.g. `main.js`, `animations.js`, `nav.js`)
- `assets/` — images, fonts, and other static files

Keep JavaScript modular (ES6 `import`/`export`). Keep CSS organized and scoped — avoid global overrides. Reuse existing design tokens (colors, spacing, typography) defined at the top of the stylesheet rather than adding new arbitrary values.

---

## Design Constraints

Every section must justify its existence by answering at least one of: why trust FlowForge AI, what problem is solved, why it's better than alternatives, what results users get, how the process works, or why to act now.

The design must feel premium and minimal — consistent spacing, strong typography hierarchy, subtle animations, generous whitespace. Avoid visual clutter, inconsistent spacing, and excessive animation.

---

## Decision Priorities

When trade-offs arise:

1. Correctness
2. User Experience
3. Accessibility
4. Performance
5. Maintainability
6. Conversion Rate
7. Visual Polish

---

## Definition of Done

A task is complete only when: the feature works, the UI looks premium, the page is responsive (no horizontal scroll on any device), accessibility requirements are met (semantic HTML, keyboard navigation, visible focus states, sufficient color contrast), there are no console errors, no duplicated or dead code, and the CTA still functions correctly.
