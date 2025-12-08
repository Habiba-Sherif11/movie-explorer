// main.js

// ======= TMDb API Config =======

const API_KEY = 'YOUR_API_KEY_HERE'; // Replace with your actual TMDb API key
const BASE_URL = 'https://api.themoviedb.org/3';
const IMG_URL = 'https://image.tmdb.org/t/p/w500';

// ======= DOM Elements =======
const moviesContainer = document.getElementById('movies');
const searchInput = document.getElementById('search');
const menuBox = document.getElementById('menuBox');
const menuBtn = document.querySelector('.menu-btn');
const closeMenu = document.getElementById('closeMenu');
// Contact Form Validation
const contactForm = document.querySelector('.contact-form');
const nameInput = document.getElementById('name');
const emailInput = document.getElementById('email');
const phoneInput = document.getElementById('phone');
const ageInput = document.getElementById('age');
const passwordInput = document.getElementById('password');
const repasswordInput = document.getElementById('repassword');

// ======= Sidebar Menu Toggle =======
menuBtn.addEventListener('click', () => {
    menuBox.style.left = '0';
});

closeMenu.addEventListener('click', () => {
    menuBox.style.left = '-250px';
});

// ======= Sidebar Menu Items =======
const menuLinks = document.querySelectorAll('.menu-box ul li a');

// Map menu text to TMDb API endpoints
const menuEndpoints = {
    "Now Playing": `${BASE_URL}/movie/now_playing?api_key=${API_KEY}&language=en-US&page=1`,
    "Popular": `${BASE_URL}/movie/popular?api_key=${API_KEY}&language=en-US&page=1`,
    "Top Rated": `${BASE_URL}/movie/top_rated?api_key=${API_KEY}&language=en-US&page=1`,
    "Trending": `${BASE_URL}/trending/movie/week?api_key=${API_KEY}`,
    "Upcoming": `${BASE_URL}/movie/upcoming?api_key=${API_KEY}&language=en-US&page=1`
};

// Add click event to each menu link
menuLinks.forEach(link => {
    link.addEventListener('click', (e) => {
        e.preventDefault();
        const menuText = link.textContent.trim();

        if (menuEndpoints[menuText]) {
            fetchMovies(menuEndpoints[menuText]);
        } else if (menuText === "Contact Us") {
            // Scroll to contact section
            document.querySelector('.contact-container').scrollIntoView({ behavior: 'smooth' });
        }

        // Close menu after click
        menuBox.style.left = '-250px';
    });
});

// ======= Fetch Movies =======
async function fetchMovies(url) {
    try {
        const res = await fetch(url);
        const data = await res.json();
        displayMovies(data.results);
    } catch (error) {
        console.error('Error fetching movies:', error);
        moviesContainer.innerHTML = `<p class="text-danger">Failed to load movies. Please try again later.</p>`;
    }
}

// ======= Display Movies =======
function displayMovies(movies) {
    moviesContainer.innerHTML = '';

    if (!movies || movies.length === 0) {
        moviesContainer.innerHTML = '<p class="text-warning">No movies found!</p>';
        return;
    }

    movies.forEach(movie => {
        const { title, overview, poster_path, vote_average, release_date } = movie;

        const movieCard = document.createElement('div');
        movieCard.classList.add('col-lg-4', 'col-md-6', 'mb-4');

        movieCard.innerHTML = `
            <div class="movie-card">
                <img src="${poster_path ? IMG_URL + poster_path : 'https://via.placeholder.com/500x750?text=No+Image'}" alt="${title}">
                <div class="overlay">
                    <div class="overlay-container">
                        <div><h2>${title.substring(0, 15)}</h2></div>
                        <p>${overview ? overview.substring(0,250) + '...' : 'No description available.'}</p>
                        <p>Release Date: ${release_date || 'N/A'}</p>
                        <p>Rating: ${vote_average || 'N/A'} ⭐</p>
                    </div>
                </div>
            </div>
        `;
        moviesContainer.appendChild(movieCard);
    });
}

// ======= Initial Load: Popular Movies =======
fetchMovies(menuEndpoints["Popular"]);

// ======= Search Movies =======
searchInput.addEventListener('keyup', (e) => {
    const query = e.target.value.trim();

    if (query.length > 0) {
        fetchMovies(`${BASE_URL}/search/movie?api_key=${API_KEY}&language=en-US&query=${query}&page=1`);
    } else {
        // If search is empty, show popular movies
        fetchMovies(menuEndpoints["Popular"]);
    }
});

// ======= Password Toggle =======
const toggles = document.querySelectorAll(".togglePass");
toggles.forEach(icon => {
    icon.addEventListener("click", () => {
        const input = document.getElementById(icon.dataset.target);

        if (input.type === "password") {
            input.type = "text";
            icon.classList.remove("fa-eye-slash");
            icon.classList.add("fa-eye");
        } else {
            input.type = "password";
            icon.classList.remove("fa-eye");
            icon.classList.add("fa-eye-slash");
        }
    });
});

// ======= Contact Form Validation  (regex) =======
contactForm.addEventListener('submit', (e) => {
    e.preventDefault(); // prevent default form submission

    let valid = true;

    // ===== Name: only letters and spaces, 2-30 chars =====
    const nameRegex = /^[a-zA-Z\s]{2,30}$/;
    if (!nameRegex.test(nameInput.value)) {
        alert("Enter a valid name (letters only, 2-30 chars).");
        valid = false;
        nameInput.focus();
        return;
    }

    // ===== Email =====
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$/i;
    if (!emailRegex.test(emailInput.value)) {
        alert("Enter a valid email address.");
        valid = false;
        emailInput.focus();
        return;
    }

    // ===== Phone: 10-15 digits =====
    const phoneRegex = /^[0-9]{10,15}$/;
    if (!phoneRegex.test(phoneInput.value)) {
        alert("Enter a valid phone number (10-15 digits).");
        valid = false;
        phoneInput.focus();
        return;
    }

    // ===== Age: 1-120 =====
    const ageRegex = /^(?:1[01][0-9]|120|[1-9]?[0-9])$/;
    if (!ageRegex.test(ageInput.value)) {
        alert("Enter a valid age (1-120).");
        valid = false;
        ageInput.focus();
        return;
    }

    // ===== Password: min 6 chars, at least 1 letter & 1 number =====
    const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,}$/;
    if (!passwordRegex.test(passwordInput.value)) {
        alert("Password must be at least 6 characters with letters and numbers.");
        valid = false;
        passwordInput.focus();
        return;
    }

    // ===== Confirm Password =====
    if (passwordInput.value !== repasswordInput.value) {
        alert("Passwords do not match.");
        valid = false;
        repasswordInput.focus();
        return;
    }

    if (valid) {
        alert("Form submitted successfully!");
        contactForm.reset();
    }
});