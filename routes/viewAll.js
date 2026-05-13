const express = require('express');
const router = express.Router();

const path = require("path");
require("dotenv").config({
   path: path.resolve(__dirname, "credentialsDontPost/.env"),
});
const mongoose = require("mongoose");



router.get("/", async (request, response) => {
    await mongoose.connect(process.env.MONGO_CONNECTION_STRING);
    const Colors = require("../model/Colors.js");

    let palettes = await Colors.find({});
    let palettesHTML = ``;
    palettes.forEach(elem => {
        palettesHTML += elem.html + `<br>`;
    });
    let variables = {palettes: palettesHTML};
    response.render("view", variables);
});

router.post("/deleteAll", async (request, response) => {
    await mongoose.connect(process.env.MONGO_CONNECTION_STRING);
    const Colors = require("../model/Colors.js");
    await Colors.deleteMany({});

    response.redirect("/viewAll");

});

module.exports = router;
