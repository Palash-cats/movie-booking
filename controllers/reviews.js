const Review = require("../models/review.js");
const Movie = require("../models/movie.js");

module.exports.createReview = async(req, res) => {
    let movie = await Movie.findById(req.params.id);
    let newReview = new Review(req.body.review);
    newReview.author = req.user._id;

    movie.reviews.push(newReview);

    await newReview.save();
    await movie.save();
    req.flash("success", "New Review Created!");
    console.log("new review saved");
    res.redirect(`/movies/${movie._id}`);
}

module.exports.destroyReview = async(req, res) => {
    let { id, reviewId } = req.params;
    await Movie.findByIdAndUpdate(id, {$pull: {reviews: reviewId}});
    await Review.findByIdAndDelete(reviewId);
    req.flash("success", "Review Deleted!");
    res.redirect(`/movies/${id}`);
}