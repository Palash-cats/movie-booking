if(process.env.NODE_ENV != "production") {
    require('dotenv').config();
}

const mongoose = require("mongoose");
const initData = require("./data.js");
const Movie = require("../models/movie.js");

main().then(() => {
    console.log("connected to DB");
}).catch((err) => {
    console.log(err);
});

async function main() {
    await mongoose.connect("mongodb://127.0.0.1:27017/movie-booking");
}

const initDB = async () => {
    await Movie.deleteMany({});
    initData.data = initData.data.map((obj) => ({...obj, owner: "65f498de938bbbafdcf350b8"}))
    await Movie.insertMany(initData.data);
    console.log("data was initialized");
}

initDB();