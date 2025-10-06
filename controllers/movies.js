const Movie = require("../models/movie.js");
const ExpressError = require("../utils/ExpressError.js");
const { movieSchema } = require("../schema.js");

module.exports.index = async (req, res) => {
    const allMovies = await Movie.find({});
    res.render("movies/index.ejs", {allMovies});
}

module.exports.renderNewForm = (req, res) => {
    res.render("movies/new.ejs");
}

module.exports.showMovie = async (req, res) => {
    let {id} = req.params;
    const movie = await Movie.findById(id)
        .populate({
            path: "reviews",
            populate: {
                path: "author",
            },
        })
        .populate("owner");
    if(!movie) {
        req.flash("error", "Movie not available!");
        res.redirect("/movies");
    }
    res.render("movies/show.ejs", {movie, currUser: req.user});
    console.log(movie);
}

module.exports.confirmBooking = async (req, res) => {
  const { id } = req.params;
  const movie = await Movie.findById(id);
  if (!movie) {
    req.flash('error', 'Movie not found!');
    return res.redirect('/movies');
  }
  res.render('movies/confirm.ejs', { movie });
};

module.exports.createMovie = async (req, res, next) => {
    let url = req.file.path;
    let filename = req.file.filename;
    const newMovie = new Movie(req.body.movie);
    newMovie.image = { url, filename };
    await newMovie.save();
    req.flash("success", "New Movie Added!");
    res.redirect("/movies");
}

module.exports.renderEditForm = async (req, res) => {
    let {id} = req.params;
    const movie = await Movie.findById(id);
    if(!movie) {
        req.flash("error", "Movie does not exist!");
        res.redirect("/movies");
    }
    
    let originalImageUrl = movie.image.url;
    originalImageUrl = originalImageUrl.replace("/upload", "/upload/w_250");
    res.render("movies/edit.ejs", { movie, originalImageUrl });
}

module.exports.updateMovie = async (req, res) => {
    let {id} = req.params;
    let movie = await Movie.findByIdAndUpdate(id, {...req.body.movie});

    if(typeof req.file !== "undefined") {
        let url = req.file.path;
        let filename = req.file.filename;
        movie.image = { url, filename };
        await movie.save();
    }

    req.flash("success", "Movie Updated!");
    res.redirect(`/movies/${id}`);
}

module.exports.destroyMovie = async (req, res) => {
    let {id} = req.params;
    let deletedMovie = await Movie.findByIdAndDelete(id);
    console.log(deletedMovie);
    req.flash("success", "Movie Deleted!");
    res.redirect("/movies");
}