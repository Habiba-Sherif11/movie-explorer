// API Configuration
const API_BASE_URL = '/api/movies';
const IMAGE_BASE_URL = 'https://image.tmdb.org/t/p/w500';
const PLACEHOLDER_IMAGE = 'https://via.placeholder.com/500x750?text=No+Image';

// DOM Elements
const searchInput = document.getElementById('searchInput');
const searchBtn = document.getElementById('searchBtn');
const moviesGrid = document.getElementById('moviesGrid');
const loading = document.getElementById('loading');
const error = document.getElementById('error');
const sectionTitle = document.getElementById('sectionTitle');
const movieModal = document.getElementById('movieModal');
const movieDetails = document.getElementById('movieDetails');
const closeModal = document.querySelector('.close');
const tabButtons = document.querySelectorAll('.tab-btn');
const contactForm = document.getElementById('contactForm');
const contactSuccess = document.getElementById('contactSuccess');

// Current state
let currentCategory = 'popular';

// Event Listeners
searchBtn.addEventListener('click', handleSearch);
searchInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        handleSearch();
    }
});

tabButtons.forEach(btn => {
    btn.addEventListener('click', (e) => {
        const category = e.target.dataset.category;
        switchCategory(category);
    });
});

closeModal.addEventListener('click', () => {
    movieModal.style.display = 'none';
});

window.addEventListener('click', (e) => {
    if (e.target === movieModal) {
        movieModal.style.display = 'none';
    }
});

contactForm.addEventListener('submit', handleContactForm);

// Functions
async function handleSearch() {
    const query = searchInput.value.trim();
    if (!query) {
        showError('Please enter a search term');
        return;
    }

    showLoading();
    hideError();

    try {
        const response = await fetch(`${API_BASE_URL}/search?query=${encodeURIComponent(query)}`);
        if (!response.ok) {
            throw new Error('Failed to search movies');
        }
        const data = await response.json();
        sectionTitle.textContent = `Search Results for "${query}"`;
        displayMovies(data.results);
    } catch (err) {
        showError(err.message);
    } finally {
        hideLoading();
    }
}

async function switchCategory(category) {
    currentCategory = category;
    
    // Update active tab
    tabButtons.forEach(btn => {
        btn.classList.remove('active');
        if (btn.dataset.category === category) {
            btn.classList.add('active');
        }
    });

    // Clear search
    searchInput.value = '';

    // Update title
    const titles = {
        'popular': 'Popular Movies',
        'trending': 'Trending Movies',
        'top-rated': 'Top Rated Movies',
        'now-playing': 'Now Playing',
        'upcoming': 'Upcoming Movies'
    };
    sectionTitle.textContent = titles[category] || 'Movies';

    // Fetch movies
    showLoading();
    hideError();

    try {
        const response = await fetch(`${API_BASE_URL}/${category}`);
        if (!response.ok) {
            throw new Error('Failed to fetch movies');
        }
        const data = await response.json();
        displayMovies(data.results);
    } catch (err) {
        showError(err.message);
    } finally {
        hideLoading();
    }
}

function displayMovies(movies) {
    moviesGrid.innerHTML = '';

    if (!movies || movies.length === 0) {
        moviesGrid.innerHTML = '<p style="grid-column: 1/-1; text-align: center; padding: 40px;">No movies found</p>';
        return;
    }

    movies.forEach(movie => {
        const movieCard = createMovieCard(movie);
        moviesGrid.appendChild(movieCard);
    });
}

function createMovieCard(movie) {
    const card = document.createElement('div');
    card.className = 'movie-card';
    card.onclick = () => showMovieDetails(movie.id);

    const posterPath = movie.poster_path 
        ? `${IMAGE_BASE_URL}${movie.poster_path}` 
        : PLACEHOLDER_IMAGE;

    const releaseYear = movie.release_date 
        ? new Date(movie.release_date).getFullYear() 
        : 'N/A';

    const rating = movie.vote_average 
        ? movie.vote_average.toFixed(1) 
        : 'N/A';

    card.innerHTML = `
        <img src="${posterPath}" alt="${movie.title}" onerror="this.src='${PLACEHOLDER_IMAGE}'">
        <div class="movie-info">
            <h3 class="movie-title">${movie.title}</h3>
            <div class="movie-meta">
                <span class="year">${releaseYear}</span>
                <span class="rating">⭐ ${rating}</span>
            </div>
        </div>
    `;

    return card;
}

async function showMovieDetails(movieId) {
    showLoading();
    movieModal.style.display = 'block';
    movieDetails.innerHTML = '';

    try {
        const response = await fetch(`${API_BASE_URL}/${movieId}`);
        if (!response.ok) {
            throw new Error('Failed to fetch movie details');
        }
        const movie = await response.json();
        displayMovieDetails(movie);
    } catch (err) {
        movieDetails.innerHTML = `<p style="color: red; padding: 20px;">Error loading movie details: ${err.message}</p>`;
    } finally {
        hideLoading();
    }
}

function displayMovieDetails(movie) {
    const posterPath = movie.poster_path 
        ? `${IMAGE_BASE_URL}${movie.poster_path}` 
        : PLACEHOLDER_IMAGE;

    const backdropPath = movie.backdrop_path 
        ? `https://image.tmdb.org/t/p/original${movie.backdrop_path}` 
        : '';

    const releaseDate = movie.release_date 
        ? new Date(movie.release_date).toLocaleDateString() 
        : 'N/A';

    const runtime = movie.runtime 
        ? `${Math.floor(movie.runtime / 60)}h ${movie.runtime % 60}m` 
        : 'N/A';

    const rating = movie.vote_average 
        ? movie.vote_average.toFixed(1) 
        : 'N/A';

    const genres = movie.genres 
        ? movie.genres.map(g => `<span class="genre-tag">${g.name}</span>`).join('') 
        : '';

    movieDetails.innerHTML = `
        ${backdropPath ? `<img src="${backdropPath}" style="width: 100%; border-radius: 15px 15px 0 0; margin-bottom: 20px;">` : ''}
        <div class="movie-detail-header">
            <div class="movie-detail-poster">
                <img src="${posterPath}" alt="${movie.title}" onerror="this.src='${PLACEHOLDER_IMAGE}'">
            </div>
            <div class="movie-detail-info">
                <h2>${movie.title}</h2>
                ${movie.tagline ? `<p style="font-style: italic; color: #666; margin-bottom: 15px;">"${movie.tagline}"</p>` : ''}
                <div class="movie-detail-meta">
                    <div class="meta-item">
                        <strong>⭐ Rating:</strong> ${rating}/10 (${movie.vote_count} votes)
                    </div>
                    <div class="meta-item">
                        <strong>📅 Release:</strong> ${releaseDate}
                    </div>
                    <div class="meta-item">
                        <strong>⏱️ Runtime:</strong> ${runtime}
                    </div>
                </div>
                ${genres ? `<div class="genres">${genres}</div>` : ''}
                ${movie.budget ? `<p><strong>Budget:</strong> $${movie.budget.toLocaleString()}</p>` : ''}
                ${movie.revenue ? `<p><strong>Revenue:</strong> $${movie.revenue.toLocaleString()}</p>` : ''}
                ${movie.homepage ? `<p><a href="${movie.homepage}" target="_blank" style="color: #667eea;">Official Website</a></p>` : ''}
            </div>
        </div>
        ${movie.overview ? `
            <div class="movie-overview">
                <h3>Overview</h3>
                <p>${movie.overview}</p>
            </div>
        ` : ''}
    `;
}

function handleContactForm(e) {
    e.preventDefault();
    
    // Form handling - displays success message locally
    // In a production app, this would send data to a backend endpoint
    const formData = {
        name: document.getElementById('name').value,
        email: document.getElementById('email').value,
        message: document.getElementById('message').value
    };
    
    // Show success message
    contactSuccess.style.display = 'block';
    contactForm.reset();

    // Hide success message after 5 seconds
    setTimeout(() => {
        contactSuccess.style.display = 'none';
    }, 5000);
}

function showLoading() {
    loading.style.display = 'block';
    moviesGrid.style.display = 'none';
}

function hideLoading() {
    loading.style.display = 'none';
    moviesGrid.style.display = 'grid';
}

function showError(message) {
    error.textContent = message;
    error.style.display = 'block';
    setTimeout(() => {
        error.style.display = 'none';
    }, 5000);
}

function hideError() {
    error.style.display = 'none';
}

// Initialize app
switchCategory('popular');
