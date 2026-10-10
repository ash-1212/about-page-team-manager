# About Page with Team Management

About page with company information cards and a dynamic team section, plus an admin panel to add, edit and delete team members. Built with HTML, CSS, JavaScript and Bootstrap 5 as a Week 1 task of a web development internship.

## Features

- About section with mission, vision, services and values cards
- Team member cards loaded from a JSON file
- Search team members by name or role
- Filter by role
- Hover overlay with social links and a modal with the full member profile
- Admin panel (`admin.html`) to add, edit and delete members, with toast notifications
- Dark/light mode toggle saved in localStorage
- Scroll animations (AOS), lazy-loaded images and a sticky navbar
- Responsive layout and keyboard-visible focus rings

## Tech Stack

| Technology | Use |
|---|---|
| HTML5 | Page structure |
| CSS3 | Styling, card layouts, dark/light themes |
| JavaScript (vanilla) | Rendering, search, filter, modal and admin CRUD |
| Bootstrap 5.3 and Bootstrap Icons | Grid, modal component, icons |
| AOS | Scroll-triggered animations |
| JSON and localStorage | Team data and persistence |

## Project Structure

```
about-page-team-manager/
├── index.html
├── admin.html
├── css/
│   └── style.css
├── js/
│   ├── app.js
│   └── admin.js
├── data/
│   └── team.json
└── README.md
```

## Run Locally

The page loads `data/team.json` with `fetch`, so it must be served over HTTP. Opening the file directly will not work.

```bash
git clone https://github.com/ash-1212/about-page-team-manager.git
cd about-page-team-manager
```

Open the folder in VS Code, right-click `index.html` and choose **Open with Live Server**. The admin panel is at `admin.html`. You can also serve the folder with XAMPP.

## Notes

- Admin changes are saved in the browser's localStorage. They persist after a refresh in the same browser, but they are not shared between users and the project has no backend.
- Bootstrap, AOS and fonts load from CDNs, so an internet connection is required.

## Author

**Ayesha Nazish**
[GitHub](https://github.com/ash-1212) · [LinkedIn](https://www.linkedin.com/in/ayeshanazish-452048274)