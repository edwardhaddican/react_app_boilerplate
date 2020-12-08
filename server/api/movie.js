const router = require("express").Router();
const { Movie } = require("../db/models");
const axios = require("axios");

module.exports = router;

router.get("/", async (req, res, next) => {
  try {
    const searchTitle = req.query.search;

    const searchTitleOptions = {
      method: "GET",
      url: "https://movies-tvshows-data-imdb.p.rapidapi.com/",
      params: { title: searchTitle, type: "get-movies-by-title" },
      headers: {
        "x-rapidapi-key": process.env.API_SECRET,
        "x-rapidapi-host": "movies-tvshows-data-imdb.p.rapidapi.com",
      },
    };

    const results = await axios.request(searchTitleOptions);
    const resultsData = results.data.movie_results;

    if (results.data.search_results === 0) {
      return res.json([]);
    }
    const imbdIDArray = resultsData.map((movie) => {
      return movie.imdb_id;
    });

    const moviesFromDatabase = await Movie.findAll({
      where: {
        imdb_id: imbdIDArray,
      },
    });

    const mergedResults = resultsData.map((movie) => {
      const matchingMovieFromDatabase = moviesFromDatabase.find(
        (databaseMovie) => {
          if (databaseMovie.imdb_id === movie.imdb_id) {
            return true;
          }
        }
      );

      if (!matchingMovieFromDatabase) {
        return movie;
      }

      if (matchingMovieFromDatabase) {
        return {
          ...movie,
          thumbsUp: matchingMovieFromDatabase.thumbsUp,
          thumbsDown: matchingMovieFromDatabase.thumbsDown,
        };
      }
    });

    res.json(mergedResults);
  } catch (err) {
    next(err);
  }
});

router.get("/:id", async (req, res, next) => {
  try {
    const options = {
      method: "GET",
      url: "https://movies-tvshows-data-imdb.p.rapidapi.com/",
      params: { imdb: req.params.id, type: "get-movie-details" },
      headers: {
        "x-rapidapi-key": process.env.API_SECRET,
        "x-rapidapi-host": "movies-tvshows-data-imdb.p.rapidapi.com",
      },
    };

    const result = await axios.request(options);
    const resultsData = result.data;

    const singleMovieFromDatabase = await Movie.findOne({
      where: {
        imdb_id: resultsData.imdb_id,
      },
    });

    if (!singleMovieFromDatabase) {
      res.json(resultsData);
    } else {
      res.json({
        ...resultsData,
        thumbsUp: singleMovieFromDatabase.thumbsUp,
        thumbsDown: singleMovieFromDatabase.thumbsDown,
      });
    }
  } catch (err) {
    next(err);
  }
});

router.put("/:id", async (req, res, next) => {
  try {
    const options = {
      method: "GET",
      url: "https://movies-tvshows-data-imdb.p.rapidapi.com/",
      params: { imdb: req.params.id, type: "get-movie-details" },
      headers: {
        "x-rapidapi-key": process.env.API_SECRET,
        "x-rapidapi-host": "movies-tvshows-data-imdb.p.rapidapi.com",
      },
    };

    const result = await axios.request(options);
    const resultsData = result.data;
    const { isUpvote } = req.body;

    const {
      imbd_id,
      title,
      description,
      year,
      genres,
      directors,
    } = resultsData;
    const [movie, created] = await Movie.findOrCreate({
      where: {
        imdb_id: req.params.id,
      },
      defaults: {
        thumbsUp: isUpvote ? 1 : 0,
        thumbsDown: !isUpvote ? 1 : 0,
        imbd_id,
        title,
        description,
        year,
        genres,
        directors,
      },
    });

    if (!created) {
      const updatedMovie = await movie.update({
        thumbsUp: isUpvote ? movie.thumbsUp + 1 : movie.thumbsUp,
        thumbsDown: !isUpvote ? movie.thumbsDown + 1 : movie.thumbsDown,
      });
      res.json(updatedMovie);
    } else {
      res.json(movie);
    }
  } catch (err) {
    next(err);
  }
});
