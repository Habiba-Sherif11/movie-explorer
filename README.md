# Movie Explorer 🎬

A dynamic movie web application that fetches data from The Movie Database (TMDB) API with an interactive UI and contact form.

## Features

- 🔍 **Search Movies** - Search for any movie by title
- 📊 **Multiple Categories** - Browse popular, trending, top-rated, now playing, and upcoming movies
- 📝 **Detailed Information** - View comprehensive movie details including cast, ratings, and more
- 💬 **Contact Form** - Get in touch with questions or suggestions
- 🎨 **Beautiful UI** - Modern, responsive design with smooth animations
- ⚡ **Fast & Efficient** - Built with Express.js for optimal performance

## Prerequisites

- Node.js (v14 or higher)
- TMDB API Key (get one for free at [https://www.themoviedb.org/settings/api](https://www.themoviedb.org/settings/api))

## Installation

1. Clone the repository:
```bash
git clone https://github.com/Habiba-Sherif11/movie-explorer.git
cd movie-explorer
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the root directory:
```bash
cp .env.example .env
```

4. Add your TMDB API key to the `.env` file:
```
TMDB_API_KEY=your_actual_api_key_here
PORT=3000
```

## Usage

Start the server:
```bash
npm start
```

The application will be available at `http://localhost:3000`

## API Endpoints

### Search Movies
```
GET /api/movies/search?query={search_term}&page={page_number}
```
Search for movies by title.

**Parameters:**
- `query` (required): Search term
- `page` (optional): Page number for pagination (default: 1)

**Example:**
```bash
curl "http://localhost:3000/api/movies/search?query=avengers&page=1"
```

### Get Popular Movies
```
GET /api/movies/popular?page={page_number}
```
Get a list of popular movies.

**Parameters:**
- `page` (optional): Page number for pagination (default: 1)

### Get Trending Movies
```
GET /api/movies/trending?timeWindow={day|week}&page={page_number}
```
Get trending movies.

**Parameters:**
- `timeWindow` (optional): Time window - 'day' or 'week' (default: 'day')
- `page` (optional): Page number for pagination (default: 1)

### Get Top Rated Movies
```
GET /api/movies/top-rated?page={page_number}
```
Get top-rated movies.

### Get Now Playing Movies
```
GET /api/movies/now-playing?page={page_number}
```
Get movies currently in theaters.

### Get Upcoming Movies
```
GET /api/movies/upcoming?page={page_number}
```
Get upcoming movie releases.

### Get Movie Details
```
GET /api/movies/:id
```
Get detailed information about a specific movie.

**Parameters:**
- `id` (required): TMDB movie ID

**Example:**
```bash
curl "http://localhost:3000/api/movies/550"
```

## Project Structure

```
movie-explorer/
├── public/
│   ├── index.html      # Main HTML file
│   ├── styles.css      # Stylesheet
│   └── app.js          # Frontend JavaScript
├── routes/
│   └── movies.js       # API route handlers
├── services/
│   └── tmdb.js         # TMDB API service
├── server.js           # Express server setup
├── package.json        # Project dependencies
├── .env.example        # Environment variables template
├── .gitignore          # Git ignore rules
└── README.md           # Documentation
```

## Technologies Used

- **Backend:**
  - Node.js
  - Express.js
  - Axios
  - dotenv
  - CORS

- **Frontend:**
  - HTML5
  - CSS3
  - Vanilla JavaScript

- **API:**
  - TMDB (The Movie Database) API

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License.

## Acknowledgments

- Movie data provided by [The Movie Database (TMDB)](https://www.themoviedb.org/)
- This product uses the TMDB API but is not endorsed or certified by TMDB
