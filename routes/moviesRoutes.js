const express = require("express");
const router = express.Router();

const moviesController = require("../controllers/moviesController");
const { verify, verifyAdmin } = require("../auth");

router.get("/getMovies", verify, moviesController.getAllMovies);

router.get("/getMovie/:id", verify, moviesController.getMovieById);

router.get("/getComments/:id", verify, moviesController.getMovieComments);

router.post("/addMovie", verify, verifyAdmin, moviesController.addMovie); 

router.delete("/deleteMovie/:id", verify, verifyAdmin, moviesController.deleteMovie); 

router.patch("/updateMovie/:id", verify, verifyAdmin, moviesController.updateMovie); 

router.patch("/addComment/:id", verify, moviesController.addMovieComment); 


module.exports = router;
