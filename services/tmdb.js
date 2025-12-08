const axios = require('axios');

const TMDB_BASE_URL = 'https://api.themoviedb.org/3';
const API_KEY = process.env.TMDB_API_KEY;

if (!API_KEY) {
  console.warn('WARNING: TMDB_API_KEY is not set. API calls will fail.');
}

class TMDBService {
  /**
   * Search for movies by query
   */
  async searchMovies(query, page = 1) {
    try {
      const response = await axios.get(`${TMDB_BASE_URL}/search/movie`, {
        params: {
          api_key: API_KEY,
          query,
          page
        }
      });
      return response.data;
    } catch (error) {
      throw new Error(`Error searching movies: ${error.message}`);
    }
  }

  /**
   * Get movie details by ID
   */
  async getMovieById(id) {
    try {
      const response = await axios.get(`${TMDB_BASE_URL}/movie/${id}`, {
        params: {
          api_key: API_KEY,
          append_to_response: 'credits,videos,similar'
        }
      });
      return response.data;
    } catch (error) {
      throw new Error(`Error fetching movie details: ${error.message}`);
    }
  }

  /**
   * Get popular movies
   */
  async getPopularMovies(page = 1) {
    try {
      const response = await axios.get(`${TMDB_BASE_URL}/movie/popular`, {
        params: {
          api_key: API_KEY,
          page
        }
      });
      return response.data;
    } catch (error) {
      throw new Error(`Error fetching popular movies: ${error.message}`);
    }
  }

  /**
   * Get trending movies
   */
  async getTrendingMovies(timeWindow = 'day', page = 1) {
    try {
      const response = await axios.get(`${TMDB_BASE_URL}/trending/movie/${timeWindow}`, {
        params: {
          api_key: API_KEY,
          page
        }
      });
      return response.data;
    } catch (error) {
      throw new Error(`Error fetching trending movies: ${error.message}`);
    }
  }

  /**
   * Get top rated movies
   */
  async getTopRatedMovies(page = 1) {
    try {
      const response = await axios.get(`${TMDB_BASE_URL}/movie/top_rated`, {
        params: {
          api_key: API_KEY,
          page
        }
      });
      return response.data;
    } catch (error) {
      throw new Error(`Error fetching top rated movies: ${error.message}`);
    }
  }

  /**
   * Get now playing movies
   */
  async getNowPlayingMovies(page = 1) {
    try {
      const response = await axios.get(`${TMDB_BASE_URL}/movie/now_playing`, {
        params: {
          api_key: API_KEY,
          page
        }
      });
      return response.data;
    } catch (error) {
      throw new Error(`Error fetching now playing movies: ${error.message}`);
    }
  }

  /**
   * Get upcoming movies
   */
  async getUpcomingMovies(page = 1) {
    try {
      const response = await axios.get(`${TMDB_BASE_URL}/movie/upcoming`, {
        params: {
          api_key: API_KEY,
          page
        }
      });
      return response.data;
    } catch (error) {
      throw new Error(`Error fetching upcoming movies: ${error.message}`);
    }
  }
}

module.exports = new TMDBService();
