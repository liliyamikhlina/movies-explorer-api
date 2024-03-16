const Movie = require('../models/movie');
const BadRequest = require('../errors/BadRequest');
const NotFound = require('../errors/NotFound');
const Forbidden = require('../errors/Forbidden');

module.exports.getMyMovies = (req, res, next) => {
  Movie.find({ owner: req.user.id })
    .then((movies) => {
      if (!movies) {
        throw new NotFound('Фильмы не найдены');
      }
      res.send(movies);
    })
    .catch(next);
};

module.exports.createMovie = (req, res, next) => {
  const {
    country, director, duration, year, description, image, trailerLink, nameRU, nameEN, thumbnail,
    movieId,
  } = req.body;

  Movie.create({
    country,
    director,
    duration,
    year,
    description,
    image,
    trailerLink,
    nameRU,
    nameEN,
    thumbnail,
    movieId,
    owner: req.user.id,
  })
    .then((movie) => res.status(201).json(movie))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new BadRequest('Некорректные данные при создании карточки'));
      } else {
        next(err);
      }
    });
};

module.exports.deleteMovie = (req, res, next) => {
  Movie.findById((req.params._id))
    .then((movie) => {
      if (!movie) {
        throw new NotFound('Карточка с указанным id не найдена');
      }
      if (movie.owner.toString() !== req.user.id) {
        return next(new Forbidden('Недостаточно прав для удаления этой карточки'));
      }
      return Movie.deleteOne({ _id: req.params._id })
        .then((delMovie) => res.send(delMovie))
        .catch(next);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new BadRequest('Переданы некорректные данные для удаления карточки'));
      } else {
        next(err);
      }
    });
};
