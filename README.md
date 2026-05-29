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
- NOTE-1: The server ([render](https://dashboard.render.com/)) may take a while to respond as it needs time to restart after a while not receiving any requests (about 50s, as per Render Dashboard).
- NOTE-2: When going through the page, you may see some functionalities have not been implemented yet

<img width="668" height="243" alt="image" src="https://github.com/user-attachments/assets/1a7f408d-97bd-432e-81c0-ad2157e191b6" />

### Preview

Example:

# profile.page
  <img style="width: 200px;" alt="bi151103 github io_linkedin-like-project-v5_(iPhone SE)" src="https://github.com/user-attachments/assets/9c7204ab-6e2e-4c31-8fa5-3f41f7aaca74" />

# edit-info.page - form is valid but the submit button is still disabled as the form has not been dirty
  <img style="width: 200px;"  alt="image" src="https://github.com/user-attachments/assets/0f760df1-b77e-4a3f-b835-c05602dcba4f" />


# edit-info.page - trigger validation and show error on required fields, the submit button is disabled
  <img style="width: 200px;"  alt="bi151103 github io_linkedin-like-project-v5_(iPhone SE) (5)" src="https://github.com/user-attachments/assets/37dfb5f4-158b-4e54-85c8-fa2fe44a0b8c" />

# edit-info.page - select from menu dialog
  <img style="width: 200px;" alt="bi151103 github io_linkedin-like-project-v5_(iPhone SE) (6)" src="https://github.com/user-attachments/assets/04efa0ec-0ab0-4cb4-87d4-21604db781a6" />

# edit-info.page - show leaving confirmation dialog when form becomes dirty
  <img style="width: 200px;"  alt="bi151103 github io_linkedin-like-project-v5_(iPhone SE) (7)" src="https://github.com/user-attachments/assets/d912a64c-6cd6-4ebd-92d0-e78ca25aef53" />

# edit-info.page - form becomes valid and is able to be submitted
  <img style="width: 200px;"  alt="bi151103 github io_linkedin-like-project-v5_(iPhone SE) (8)" src="https://github.com/user-attachments/assets/03900f69-b2db-41db-be0f-5660e2362317" />

# edit-info.page - submission makes the form not dirty and a success toast is shown and then disappears after 5s (this can be closed by swiping the toast downward), the submit button is disabled as the form is not dirty at this time
  <img style="width: 200px;"  alt="image" src="https://github.com/user-attachments/assets/190c46bc-9d90-43e9-9bed-978834d833a8" />

# edit-info.page - multiple toast notifications can be shown stacking on each other when the form is submitted multiple times
  https://github.com/user-attachments/assets/de043548-191c-4dc9-b145-ed7cd0033c60

# profile.page - the profile page reflects the changes from edit info page
  <img style="width: 200px;"  alt="image" src="https://github.com/user-attachments/assets/e2b92c73-c8c7-436a-b31b-2f8b84115177" />

# add-featured.page
  <img style="width: 200px;" alt="bi151103 github io_linkedin-like-project-v5_(iPhone SE) (2)" src="https://github.com/user-attachments/assets/eea79fc4-70af-422a-a4ce-f703230a0d15" />

# profile.page - after adding some featured items - thumbnail is shown corresponding to each item (retrieve pdf thumbnail using pdfjs-dist library), the carousel scrolling is made magnetic
  <img style="width: 200px;" alt="image" src="https://github.com/user-attachments/assets/93013cc9-ab2f-4a90-ad5a-b826a6f17802" />

# others
### bottom-sheet-dialog
  <img style="width: 200px;"  alt="image" src="https://github.com/user-attachments/assets/ba33d494-1252-4d19-9b9e-2ef5abc25a7e" />

### search-combobox-dialog (not complete yet)
  <img style="width: 200px;"  alt="image" src="https://github.com/user-attachments/assets/60370f35-102c-4847-b688-d5b9ad723bc3" />

### search-combobox-dialog with a confirmation dialog shown on clicking clear search button
  <img style="width: 200px;" alt="image" src="https://github.com/user-attachments/assets/0ff9d6b7-bf99-40c1-bc62-2a490c740a27" />

### search-combobox-dialog with search history replaced with an empty state after clearing
  <img style="width: 200px;" alt="image" src="https://github.com/user-attachments/assets/58f77c29-69d2-4145-9d8d-bbd07c0a483e" />


### edit-about.page
  <img style="width: 200px;" alt="bi151103 github io_linkedin-like-project-v5_(iPhone SE) (12)" src="https://github.com/user-attachments/assets/8c1d68c6-64a6-414c-981e-f506ab3b22c6" />

### full-screen-loading - is triggered to show when making an API call
  <img style="width: 200px;"  alt="image" src="https://github.com/user-attachments/assets/a9338ebc-3bfc-4c9a-9db0-b2799a81a2b6" />

### not-found.page
  <img style="width: 200px;"  alt="image" src="https://github.com/user-attachments/assets/052641cc-da29-4e43-a9ab-f7b169833bd0" />


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

- GitHub Actions (AI support)
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
 │    │    ├── overlay/ // this is actually a directive but has not been moved to the directives folder yet
 │    │    ├── primary-button/
 │    │    ├── profile-input/
 │    │    ├── toast-notification/
 │    │    └── form-leaving-confirmation-dialog/
 │    ├── directives/
 │    │    ├── bubble.directive.ts // directive to show bubble number floating on the top right corner indicating number of messages
 │    │    ├── floating-button-input.directive.ts // directive to show close button or dropdown button inside the input
 │    │    ├── floating-input-label.directive.ts // directive to show floating label which changes position property when or not focusing on the input
 │    │    └── form.directive.ts // directive to watch the dirty state and check if the user leaves the form
 │    ├── models/
 │    │    └── index.ts // some custom types created for the front-end app
 │    ├── pages/
 │    │    ├── add-feature/
 │    │    ├── edit-profile/
 │    │    ├── not-found/
 │    │    └── profile/
 │    ├── pipes/
 │    │    ├── profile-name.pipe.ts // pipe to transform firstName+lastName into displayName
 │    │    ├── time-mili-to-sec.pipe.ts // pipe to transform miliseconds to seconds
 │    │    └── tw-merge.pipe.ts // pipe to merge separate tailwind class string into one class string
 │    ├── services/
 │    │    ├── models/
 │    │    │    ├── create-feature-request.ts
 │    │    │    ├── education.ts
 │    │    │    └── user-info.ts
 │    │    ├── add-featured-store.service.ts  // to store the state of the add-featured input when navigating from the profile page and the add-featured page
 │    │    ├── base.service.ts
 │    │    ├── profile.service.ts // to store API calling functions
 │    │    ├── toast-notification.service.ts // service to attach toast notification component to the current page (through its ViewContainerRef)
 │    │    ├── user-info.service.ts // to store the cached user info (using Promise) and to store the updated state to check if it should re-call the api
 │    │    └── user.service.ts // to store the API get user info
 │    ├── app.component.ts // app root component
 │    ├── app.config.ts // app config
 │    └── app.routes.ts // app routes config
 ├── assets/
 │    ├── icons/ // svg icons
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

- TBU

---

## Technical highlights

- TBU

---

## Run locally

### 1. Install dependencies

```bash
npm install
or
npm install --legacy-peer-deps
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

## Previous versions

- [Version 1](https://github.com/bi151103/linkedin-like-project)
- [Version 2](https://github.com/bi151103/linkedin-like-project-v2)
- [Version 3](https://github.com/bi151103/linkedin-like-project-v3)
- [Version 4](https://github.com/bi151103/linkedin-like-project-v4)

---

## Future improvements
- TBU
