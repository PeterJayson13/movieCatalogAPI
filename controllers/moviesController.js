const Movie = require("../models/Movie");

module.exports.addMovie = (req, res) => {

	if (!req.user || !req.user.isAdmin) {
		return res.status(403).send({ error: "Access denied. Admins only." });
	}

	let newMovie = new Movie({
		title: req.body.title,
		director: req.body.director,
		year: req.body.year,
		description: req.body.description,
		genre: req.body.genre
	});

	newMovie.save()
		.then(savedMovie => res.status(201).send({
			message: "Movie successfully added",
			movie: savedMovie
		}))
		.catch(saveErr => {
			console.error("Error in saving the movie:", saveErr);
			return res.status(500).send({ error: 'Failed to save the movie' });
		});
};

module.exports.updateMovie = (req, res) => {

	if (!req.user || !req.user.isAdmin) {
		return res.status(403).send({ error: "Access denied. Admins only." });
	}

	let movieUpdates = {
		title: req.body.title,
		director: req.body.director,
		year: req.body.year,
		description: req.body.description,
		genre: req.body.genre
	};

	Movie.findOneAndUpdate(
		{ _id: req.params.id }, 
		movieUpdates,
		{ new: true }
	)
	.then(updatedMovie => {
		if (!updatedMovie) {
			return res.status(404).send({ error: 'Movie not found.' });
		}
		return res.status(200).send({
			message: 'Movie updated successfully',
			updatedMovie: updatedMovie
		});
	})
	.catch(err => {
		console.error("Error in updating a movie:", err);
		return res.status(500).send({ error: 'Error in updating a movie.' });
	});
};

module.exports.deleteMovie = (req, res) => {

	if (!req.user || !req.user.isAdmin) {
		return res.status(403).send({ error: "Access denied. Admins only." });
	}

	Movie.deleteOne({ _id: req.params.id }) 
	.then(deletedResult => {
		if (deletedResult.deletedCount < 1) {
			return res.status(404).send({ error: 'Movie not found.' });
		}
		return res.status(200).send({ message: 'Movie deleted successfully' });
	})
	.catch(err => {
		console.error("Error in deleting a movie:", err);
		return res.status(500).send({ error: 'Error in deleting a movie.' });
	});
};

module.exports.addMovieComment = (req, res) => {
	const { comment } = req.body;

	Movie.findById(req.params.id)
		.then(movie => {
			if (!movie) {
				return res.status(404).send({ error: "Movie not found" });
			}

			movie.comments.push({
				userId: req.user.id,
				comment
			});

			return movie.save();
		})
		.then(updatedMovie => {
			if (updatedMovie) {
				res.status(200).send({ message: "Comment added", movie: updatedMovie });
			}
		})
		.catch(err => {
			console.error("Error adding comment:", err);
			res.status(500).send({ error: "Failed to add comment" });
		});
};

module.exports.getAllMovies = (req, res) => {
	Movie.find() 
		.then(movies => {
			if (movies.length > 0) {
				return res.status(200).send({ movies });
			} else {
				return res.status(200).send({ message: 'No movies found.' });
			}
		})
		.catch(err => {
			console.error("Error finding movies:", err);
			res.status(500).send({ error: 'Error finding movies.' });
		});
};

module.exports.getMovieById = (req, res) => {

	const movieId = req.params.id;

	Movie.findById(movieId)
	.then(movie => {
		if (!movie) {
			return res.status(404).send({ error: 'Movie not found' });
		}
		return res.status(200).send({ movie });
	})
	.catch(err => {
		console.error("Error finding movies: ", err)
		return res.status(500).send({ error: 'Error finding movies.' });
	});
};

module.exports.getMovieComments = (req, res) => {
	const movieId = req.params.id;

	Movie.findById(movieId)
		.then(movie => {
			if (!movie) {
				return res.status(404).send({ error: "Movie not found" });
			}
			return res.status(200).send({ comments: movie.comments });
		})
		.catch(err => {
			console.error("Error finding movie:", err);
			return res.status(500).send({ error: "Error finding movie." });
		});
};

