const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const Review = require("./review.js")

const movieSchema = new Schema({
    title: {
        type: String,
        required: true,
    },
    description: String,
    image: {
        url: String,
        filename: String,
    },
    price: Number,
    location: String,
    reviews: [
        {
            type: Schema.Types.ObjectId,
            ref: "Review",
        },
    ],
    owner: {
        type: Schema.Types.ObjectId,
        ref: "User",
    },
});

movieSchema.post("findOneAndDelete", async (movie) => {
    if(movie) {
        await Review.deleteMany({_id : {$in: movie.reviews}});
    }
})

const Movie = mongoose.model("Movie", movieSchema);
module.exports = Movie;