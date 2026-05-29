# LinkedIn Like Project v5 - 05/29/2026

A frontend engineering project that recreates the LinkedIn Profile page experience using Angular 19 and TailwindCSS 4.

This project started as a simple HTML/CSS/JavaScript practice project and has gradually evolved through multiple rewrites. Version 5 focuses on building a scalable and maintainable frontend application with reusable components.

The goal of this project is not only to clone the LinkedIn UI, but also to practice building production-like frontend features and reusable frontend architecture.

---

## Purpose of this project

This project is developed primarily for:

- Building reusable UI systems
- Practicing frontend development concepts
- Improving Angular skills
- Preparing for frontend internship/fresher opportunities

---

## Demo

- Deployed application: [Live Demo](https://bi151103.github.io/linkedin-like-project-v5/)
- NOTE: The server ([render](https://dashboard.render.com/)) may take a while to respond as it needs time to restart after a while not receiving any requests (about 50s, as per Render Dashboard).

<img width="668" height="243" alt="image" src="https://github.com/user-attachments/assets/1a7f408d-97bd-432e-81c0-ad2157e191b6" />

### Preview

Example:

```md

```

---

## Tech stack

### Frontend

- Angular 19
  - Standalone Components
  - Signals
  - Angular CDK

- TailwindCSS 4

- TypeScript

### Tooling

- GitHub Actions
- ESLint
- Prettier

---

## Project structure

```txt
src/
 ├── app/
 │    ├── components/
 │    │    ├── dialog/
 │    │    ├── featured-carousel-item/
 │    │    ├── full-screen-loading/
 │    │    ├── icon-button/
 │    │    ├── overlay/
 │    │    ├── primary-button/
 │    │    ├── profile-input/
 │    │    ├── toast-notification/
 │    │    └── form-leaving-confirmation-dialog/
 │    ├── directives/
 │    │    ├── bubble.directive.ts
 │    │    ├── floating-button-input.directive.ts
 │    │    ├── floating-input-label.directive.ts
 │    │    └── form.directive.ts
 │    ├── models/
 │    │    └── index.ts
 │    ├── pages/
 │    │    ├── add-feature/
 │    │    ├── edit-profile/
 │    │    ├── not-found/
 │    │    └── profile/
 │    ├── pipes/
 │    │    ├── profile-name.pipe.ts
 │    │    ├── time-mili-to-sec.pipe.ts
 │    │    └── tw-merge.pipe.ts
 │    ├── services/
 │    │    ├── models/
 │    │    │    ├── create-feature-request.ts
 │    │    │    ├── education.ts
 │    │    │    └── user-info.ts
 │    │    ├── add-featured-store.service.ts
 │    │    ├── base.service.ts
 │    │    ├── profile.service.ts
 │    │    ├── profile.service.ts
 │    │    ├── user-info.service.ts
 │    │    ├── toast-notification.service.ts
 │    │    └── user.service.ts
 │    ├── app.component.ts
 │    ├── app.config.ts
 │    └── app.routes.ts
 ├── assets/
 │    ├── icons/
 │    │    ├── icons8-add-friend-100.svg
 │    │    ├── icons8-home-100.svg
 │    │    └── icons8-search-100.svg
 │    └── images/
 │         ├── background-image.jpg
 │         ├── liverpool.jpg
 │         └── naruto-funny-chibi.png
 ├── index.html
 └── styles.css
```

---

## Key features

- N/A

---

## Technical highlights

- N/A

---

## Run locally

### 1. Install dependencies

```bash
npm install
```

### 2. Start development server

```bash
npm start
```

### 3. Open in browser

```txt
http://localhost:4200
```

## Local server

To run the local server, clone this repo and run `npm start`:

- https://github.com/bi151103/linkedin-like-project-v4-server

This is the server project used for the API.

## Previous versions

- [Version 1](https://github.com/bi151103/linkedin-like-project)
- [Version 2](https://github.com/bi151103/linkedin-like-project-v2)
- [Version 3](https://github.com/bi151103/linkedin-like-project-v3)
- [Version 4](https://github.com/bi151103/linkedin-like-project-v4)

---

## Future improvements

- N/A
