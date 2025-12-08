const express = require('express');
const router = express.Router();
const tmdbService = require('../services/tmdb');

// Helper function to validate page number
function validatePage(page) {
  if (page && (isNaN(page) || parseInt(page) < 1)) {
    throw new Error('Page must be a positive integer');
  }
  return page ? parseInt(page) : 1;
}

/**
 * GET /api/movies/search
 * Search for movies by query
 */
router.get('/search', async (req, res, next) => {
  try {
    const { query, page } = req.query;
    
    if (!query) {
      return res.status(400).json({ error: 'Query parameter is required' });
    }

    const validPage = validatePage(page);
    const data = await tmdbService.searchMovies(query, validPage);
    res.json(data);
  } catch (error) {
    next(error);
  }
});

/**
 * GET /api/movies/popular
 * Get popular movies
 */
router.get('/popular', async (req, res, next) => {
  try {
    const { page } = req.query;
    const validPage = validatePage(page);
    const data = await tmdbService.getPopularMovies(validPage);
    res.json(data);
  } catch (error) {
    next(error);
  }
});

/**
 * GET /api/movies/trending
 * Get trending movies
 */
router.get('/trending', async (req, res, next) => {
  try {
    const { timeWindow, page } = req.query;
    const validPage = validatePage(page);
    const data = await tmdbService.getTrendingMovies(timeWindow, validPage);
    res.json(data);
  } catch (error) {
    next(error);
  }
});

/**
 * GET /api/movies/top-rated
 * Get top rated movies
 */
router.get('/top-rated', async (req, res, next) => {
  try {
    const { page } = req.query;
    const validPage = validatePage(page);
    const data = await tmdbService.getTopRatedMovies(validPage);
    res.json(data);
  } catch (error) {
    next(error);
  }
});

/**
 * GET /api/movies/now-playing
 * Get now playing movies
 */
router.get('/now-playing', async (req, res, next) => {
  try {
    const { page } = req.query;
    const validPage = validatePage(page);
    const data = await tmdbService.getNowPlayingMovies(validPage);
    res.json(data);
  } catch (error) {
    next(error);
  }
});

/**
 * GET /api/movies/upcoming
 * Get upcoming movies
 */
router.get('/upcoming', async (req, res, next) => {
  try {
    const { page } = req.query;
    const validPage = validatePage(page);
    const data = await tmdbService.getUpcomingMovies(validPage);
    res.json(data);
  } catch (error) {
    next(error);
  }
});

/**
 * GET /api/movies/:id
 * Get movie details by ID
 */
router.get('/:id', async (req, res, next) => {
  try {
    const { id } = req.params;
    const data = await tmdbService.getMovieById(id);
    res.json(data);
  } catch (error) {
    next(error);
  }
});

module.exports = router;
