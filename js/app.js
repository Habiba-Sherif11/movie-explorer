// TMDB API Configuration
const API_KEY = 'YOUR_API_KEY'; // Replace with actual API key
const BASE_URL = 'https://api.themoviedb.org/3';
const IMAGE_BASE_URL = 'https://image.tmdb.org/t/p/w500';
const PLACEHOLDER_IMAGE = 'https://via.placeholder.com/500x750?text=No+Image';

// DOM Elements
const moviesGrid = document.getElementById('moviesGrid');
const categoryTitle = document.getElementById('categoryTitle');
const searchInput = document.getElementById('searchInput');
const sidebar = document.getElementById('sidebar');

// Category titles mapping
const categoryTitles = {
    'now_playing': 'Now Playing',
    'popular': 'Popular Movies',
    'top_rated': 'Top Rated',
    'upcoming': 'Upcoming Movies',
    'trending': 'Trending Movies'
};

// Current category
let currentCategory = 'popular';

/**
 * Fetch movies from TMDB API
 * @param {string} endpoint - API endpoint
 * @returns {Promise<Array>} - Array of movies
 */
async function fetchMovies(endpoint) {
    showLoading();
    
    try {
        const response = await fetch(`${BASE_URL}${endpoint}?api_key=${API_KEY}&language=en-US&page=1`);
        
        if (!response.ok) {
            throw new Error('Failed to fetch movies');
        }
        
        const data = await response.json();
        return data.results || [];
    } catch (error) {
        console.error('Error fetching movies:', error);
        showError('Failed to load movies. Please check your API key.');
        return [];
    }
}

/**
 * Load movies by category
 * @param {string} category - Movie category
 */
async function loadMovies(category) {
    currentCategory = category;
    categoryTitle.textContent = categoryTitles[category] || 'Movies';
    closeSidebar();
    
    const endpoint = category === 'trending' 
        ? '/trending/movie/week' 
        : `/movie/${category}`;
    
    const movies = await fetchMovies(endpoint);
    displayMovies(movies);
}

/**
 * Search movies by query
 */
async function searchMovies() {
    const query = searchInput.value.trim();
    
    if (!query) {
        loadMovies(currentCategory);
        return;
    }
    
    categoryTitle.textContent = `Search Results: "${query}"`;
    
    try {
        const response = await fetch(`${BASE_URL}/search/movie?api_key=${API_KEY}&query=${encodeURIComponent(query)}&language=en-US&page=1`);
        
        if (!response.ok) {
            throw new Error('Search failed');
        }
        
        const data = await response.json();
        displayMovies(data.results || []);
    } catch (error) {
        console.error('Search error:', error);
        showError('Search failed. Please try again.');
    }
}

/**
 * Display movies in the grid
 * Shows the full movie overview without any truncation
 * @param {Array} movies - Array of movie objects
 */
function displayMovies(movies) {
    if (!movies || movies.length === 0) {
        moviesGrid.innerHTML = `
            <div class="col-12 no-movies">
                <i class="fas fa-film"></i>
                <h3>No movies found</h3>
                <p>Try a different search or category</p>
            </div>
        `;
        return;
    }
    
    moviesGrid.innerHTML = movies.map(movie => createMovieCard(movie)).join('');
}

/**
 * Create a movie card HTML
 * Displays the full movie overview fetched from TMDB API
 * No substring truncation - shows complete description
 * @param {Object} movie - Movie object from TMDB API
 * @returns {string} - HTML string for movie card
 */
function createMovieCard(movie) {
    const posterPath = movie.poster_path 
        ? `${IMAGE_BASE_URL}${movie.poster_path}` 
        : PLACEHOLDER_IMAGE;
    
    const releaseDate = movie.release_date 
        ? formatDate(movie.release_date) 
        : 'Release date unknown';
    
    const rating = movie.vote_average 
        ? movie.vote_average.toFixed(1) 
        : 'N/A';
    
    // Display the complete movie overview without any truncation
    // The full description is shown in the overlay for better UX
    const overview = movie.overview || 'No description available.';
    
    return `
        <div class="col-lg-3 col-md-4 col-sm-6">
            <div class="movie-card">
                <img src="${posterPath}" alt="${escapeHtml(movie.title)}" loading="lazy">
                <div class="movie-overlay">
                    <h3>${escapeHtml(movie.title)}</h3>
                    <p class="description">${escapeHtml(overview)}</p>
                    <div class="movie-info">
                        <span class="release-date">
                            <i class="fas fa-calendar-alt"></i> ${releaseDate}
                        </span>
                        <span class="rating">
                            <i class="fas fa-star"></i>
                            <span>${rating}</span>
                        </span>
                    </div>
                </div>
            </div>
        </div>
    `;
}

/**
 * Format date to readable format
 * @param {string} dateString - ISO date string
 * @returns {string} - Formatted date
 */
function formatDate(dateString) {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-US', options);
}

/**
 * Escape HTML to prevent XSS
 * @param {string} text - Text to escape
 * @returns {string} - Escaped text
 */
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

/**
 * Show loading spinner
 */
function showLoading() {
    moviesGrid.innerHTML = `
        <div class="col-12 loading">
            <div class="spinner"></div>
        </div>
    `;
}

/**
 * Show error message
 * @param {string} message - Error message
 */
function showError(message) {
    moviesGrid.innerHTML = `
        <div class="col-12 no-movies">
            <i class="fas fa-exclamation-triangle"></i>
            <h3>Error</h3>
            <p>${escapeHtml(message)}</p>
        </div>
    `;
}

/**
 * Open sidebar
 */
function openSidebar() {
    sidebar.classList.add('open');
}

/**
 * Close sidebar
 */
function closeSidebar() {
    sidebar.classList.remove('open');
}

// Event Listeners
document.addEventListener('DOMContentLoaded', () => {
    // Load popular movies on page load
    loadMovies('popular');
    
    // Search on Enter key
    searchInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            searchMovies();
        }
    });
    
    // Close sidebar when clicking outside
    document.addEventListener('click', (e) => {
        if (!sidebar.contains(e.target) && !e.target.closest('[onclick="openSidebar()"]')) {
            closeSidebar();
        }
    });
});

// Contact form validation
const contactForm = document.getElementById('contactForm');
if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const name = document.getElementById('name').value.trim();
        const email = document.getElementById('email').value.trim();
        const phone = document.getElementById('phone').value.trim();
        const message = document.getElementById('message').value.trim();
        
        // Email validation regex
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        // Phone validation regex (at least 10 digits)
        const phoneRegex = /^[0-9]{10,}$/;
        
        if (!emailRegex.test(email)) {
            alert('Please enter a valid email address');
            return;
        }
        
        if (phone && !phoneRegex.test(phone)) {
            alert('Please enter a valid phone number (at least 10 digits)');
            return;
        }
        
        // Form is valid - in a real app, this would send data to a server
        alert('Thank you for your message! We will get back to you soon.');
        contactForm.reset();
        
        // Close modal
        const modal = bootstrap.Modal.getInstance(document.getElementById('contactModal'));
        if (modal) {
            modal.hide();
        }
    });
}
