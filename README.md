# 🎬 Movie Watchlist

A simple, browser-based web app that lets you save and manage movies you want to watch — no sign-up, no server, no frameworks required.

> **Midterm Project — Front-End Web Development**

---

## Description

Movie Watchlist is a front-end web application that allows users to keep track of movies they want to watch. Users can add movies to their watchlist, mark them as watched, and manage their list through a clean, modern interface. All data is saved automatically using the browser's built-in `localStorage`, so the list persists between sessions.

---

## Features

| # | Feature | Description |
|---|---------|-------------|
| 1 | **Add Movies** | Enter a title and optional genre, then click Add (or press Enter) |
| 2 | **Display List** | All saved movies render as cards in a scrollable list |
| 3 | **Remove Movies** | Click the × button on any card to delete it |
| 4 | **Mark as Watched** | Check the checkbox on a card to toggle its watched status |
| 5 | **Local Storage** | The watchlist is automatically saved and restored between sessions |

**Bonus:**
- Filter tabs — view All, Unwatched, or Watched movies
- Auto-skip landing page if you already have a saved watchlist

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Structure | HTML5 |
| Styling | CSS3 (custom properties, flexbox, animations) |
| Logic | Vanilla JavaScript (ES6+) |
| Storage | Browser `localStorage` API |

No frameworks, no libraries, no build tools — just plain HTML, CSS, and JavaScript.

---

## Project Structure

```
movie-watchlist/
├── index.html   # App shell — landing page + main app (single page)
├── style.css    # All styles and responsive layout
├── script.js    # App logic: add, remove, toggle, filter, persist
├── .gitignore   # Files excluded from version control
└── README.md    # This file
```

---

## Getting Started

1. Clone or download the project folder.
2. Open `index.html` in any modern web browser.
3. No installation or build step needed.

```bash
# Optional: serve locally with Python
python3 -m http.server 8080
# then open http://localhost:8080
```

---

## How to Use

1. Click **"Start Your Watchlist"** on the landing page.
2. Type a movie title in the input field (add a genre if you like).
3. Click **+ Add** or press **Enter** to save it.
4. Check the checkbox on a card to mark the movie as watched.
5. Click **×** on a card to remove it from the list.
6. Use the **All / Unwatched / Watched** tabs to filter the list.
7. Click **Clear All** to reset the entire watchlist.

---

## Author

**Jasmine Butterfield**
Front-End Web Development — Midterm Project
