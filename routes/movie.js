const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const { isLoggedIn, isOwner, validateMovie, isAdmin } = require("../middleware.js");
const movieController = require("../controllers/movies.js");

router
    .route("/")
    .get(wrapAsync(movieController.index))
    .post(isLoggedIn, wrapAsync(movieController.createMovie));

router.get("/new", isLoggedIn, isAdmin, movieController.renderNewForm);

router
    .route("/:id")
    .get(wrapAsync(movieController.showMovie))
    .put(isLoggedIn, isOwner, validateMovie, wrapAsync(movieController.updateMovie))
    .delete(isLoggedIn, isOwner, wrapAsync(movieController.destroyMovie));

router.get("/:id/confirm", wrapAsync(movieController.confirmBooking));

    // Edit Route

router.get("/:id/edit", isLoggedIn, isOwner, wrapAsync(movieController.renderEditForm));



module.exports = router;