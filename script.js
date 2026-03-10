// =====================================================================
// script.js — Movie Watchlist
// Sections:
//   1. State & Storage
//   2. DOM References
//   3. Landing Page → App Transition
//   4. Render Functions
//   5. Add Movie
//   6. Remove Movie
//   7. Toggle Watched
//   8. Filter Logic
//   9. Clear All
//  10. Event Listeners
//  11. Init
// =====================================================================


// ---- 1. State & Storage ----
// The single source of truth for all movies.
// Each movie is an object: { id, title, genre, watched }
const STORAGE_KEY = 'movieWatchlist';

/**
 * Load the watchlist array from localStorage.
 * Returns an empty array if nothing is saved yet.
 */
function loadMovies() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
  } catch {
    return [];
  }
}

/**
 * Persist the current movies array to localStorage.
 * Called whenever the list changes.
 */
function saveMovies(movies) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(movies));
}

// In-memory list, loaded from storage on startup
let movies = loadMovies();

// Active filter: 'all' | 'unwatched' | 'watched'
let activeFilter = 'all';


// ---- 2. DOM References ----
const landingSection  = document.getElementById('landing');
const appSection      = document.getElementById('app');
const startBtn        = document.getElementById('start-btn');
const movieTitleInput = document.getElementById('movie-title');
const movieGenreInput = document.getElementById('movie-genre');
const addBtn          = document.getElementById('add-btn');
const errorMsg        = document.getElementById('error-msg');
const movieList       = document.getElementById('movie-list');
const emptyMsg        = document.getElementById('empty-msg');
const movieCount      = document.getElementById('movie-count');
const clearBtn        = document.getElementById('clear-btn');
const filterTabs      = document.querySelectorAll('.tab');


// ---- 3. Landing Page → App Transition ----
/**
 * Hide the landing section and show the main app.
 * Called once when the user clicks "Start Your Watchlist".
 */
startBtn.addEventListener('click', () => {
  landingSection.classList.add('hidden');
  appSection.classList.remove('hidden');

  // Focus the title input so the user can start typing right away
  movieTitleInput.focus();
});


// ---- 4. Render Functions ----
/**
 * Re-render the entire movie list based on the active filter.
 * Also updates the count badge and toggles helper UI elements.
 */
function render() {
  // Filter the movies array based on the active tab
  const filtered = movies.filter(movie => {
    if (activeFilter === 'watched')   return movie.watched;
    if (activeFilter === 'unwatched') return !movie.watched;
    return true; // 'all'
  });

  // Clear the list before re-painting
  movieList.innerHTML = '';

  if (filtered.length === 0) {
    // Show the empty state message
    emptyMsg.classList.remove('hidden');
  } else {
    emptyMsg.classList.add('hidden');

    // Build and append a card for each movie
    filtered.forEach(movie => {
      movieList.appendChild(createMovieCard(movie));
    });
  }

  // Update the count badge ("3 movies" / "1 movie")
  const total = movies.length;
  movieCount.textContent = `${total} ${total === 1 ? 'movie' : 'movies'}`;

  // Show "Clear All" only when there is at least one movie
  if (movies.length > 0) {
    clearBtn.classList.remove('hidden');
  } else {
    clearBtn.classList.add('hidden');
  }
}

/**
 * Build and return a <li> element representing a single movie card.
 * @param {Object} movie - { id, title, genre, watched }
 * @returns {HTMLElement}
 */
function createMovieCard(movie) {
  const li = document.createElement('li');
  li.className = `movie-card${movie.watched ? ' watched' : ''}`;
  li.dataset.id = movie.id;

  // Checkbox — marks movie as watched / unwatched
  const checkbox = document.createElement('input');
  checkbox.type = 'checkbox';
  checkbox.className = 'watch-checkbox';
  checkbox.checked = movie.watched;
  checkbox.title = movie.watched ? 'Mark as unwatched' : 'Mark as watched';
  checkbox.addEventListener('change', () => toggleWatched(movie.id));

  // Text block (title + optional genre)
  const info = document.createElement('div');
  info.className = 'movie-info';

  const titleEl = document.createElement('p');
  titleEl.className = 'movie-title';
  titleEl.textContent = movie.title;

  info.appendChild(titleEl);

  if (movie.genre) {
    const genreEl = document.createElement('p');
    genreEl.className = 'movie-genre';
    genreEl.textContent = movie.genre;
    info.appendChild(genreEl);
  }

  // Remove button (×)
  const removeBtn = document.createElement('button');
  removeBtn.className = 'remove-btn';
  removeBtn.textContent = '×';
  removeBtn.title = 'Remove from watchlist';
  removeBtn.addEventListener('click', () => removeMovie(movie.id));

  li.appendChild(checkbox);
  li.appendChild(info);
  li.appendChild(removeBtn);

  return li;
}


// ---- 5. Add Movie ----
/**
 * Read the title input, validate it, create a new movie object,
 * push it to the array, persist, and re-render.
 */
function addMovie() {
  const title = movieTitleInput.value.trim();
  const genre = movieGenreInput.value;

  // Validate: title must not be empty
  if (!title) {
    errorMsg.classList.remove('hidden');
    movieTitleInput.focus();
    return;
  }

  // Hide any previous error
  errorMsg.classList.add('hidden');

  // Create a new movie object
  const newMovie = {
    id: Date.now(),        // simple unique id using timestamp
    title,
    genre,
    watched: false,
  };

  movies.push(newMovie);
  saveMovies(movies);

  // Reset the form fields
  movieTitleInput.value = '';
  movieGenreInput.value = '';
  movieTitleInput.focus();

  // Switch to "All" filter so the new movie is immediately visible
  setFilter('all');

  render();
}

// Trigger addMovie when the Add button is clicked
addBtn.addEventListener('click', addMovie);

// Also trigger when the user presses Enter in the title field
movieTitleInput.addEventListener('keydown', e => {
  if (e.key === 'Enter') addMovie();
});

// Hide error message while the user is typing
movieTitleInput.addEventListener('input', () => {
  if (movieTitleInput.value.trim()) {
    errorMsg.classList.add('hidden');
  }
});


// ---- 6. Remove Movie ----
/**
 * Remove a movie from the array by its id, persist, and re-render.
 * @param {number} id - The movie's unique id
 */
function removeMovie(id) {
  movies = movies.filter(m => m.id !== id);
  saveMovies(movies);
  render();
}


// ---- 7. Toggle Watched ----
/**
 * Flip the watched boolean for a given movie, persist, and re-render.
 * @param {number} id - The movie's unique id
 */
function toggleWatched(id) {
  movies = movies.map(m =>
    m.id === id ? { ...m, watched: !m.watched } : m
  );
  saveMovies(movies);
  render();
}


// ---- 8. Filter Logic ----
/**
 * Set the active filter and update the tab UI.
 * @param {string} filter - 'all' | 'unwatched' | 'watched'
 */
function setFilter(filter) {
  activeFilter = filter;

  // Update the active class on each tab button
  filterTabs.forEach(tab => {
    if (tab.dataset.filter === filter) {
      tab.classList.add('active');
    } else {
      tab.classList.remove('active');
    }
  });
}

// Attach click handlers to each filter tab
filterTabs.forEach(tab => {
  tab.addEventListener('click', () => {
    setFilter(tab.dataset.filter);
    render();
  });
});


// ---- 9. Clear All ----
/**
 * Remove every movie from the watchlist after a confirmation prompt.
 */
clearBtn.addEventListener('click', () => {
  if (!confirm('Clear your entire watchlist? This cannot be undone.')) return;

  movies = [];
  saveMovies(movies);
  render();
});


// ---- 11. Init ----
// On page load, if the user already has saved movies, go straight to the app.
// Otherwise show the landing page (already shown by default).
(function init() {
  if (movies.length > 0) {
    landingSection.classList.add('hidden');
    appSection.classList.remove('hidden');
  }

  // Do an initial render so saved movies appear immediately
  render();
}());
