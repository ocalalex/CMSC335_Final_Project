const express = require("express");
const app = express();
const path = require("path");
const viewAll = require("./routes/viewAll");

const portNumber = 7003;
const bodyParser = require("body-parser");
const mongoose = require("mongoose");

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static("public"));
app.set("view engine", "ejs");
app.set("views", path.resolve(__dirname, "templates"));

app.use("/viewAll", viewAll);

app.get("/", async (req, res) => {
   res.render("index");
});

app.get("/create_new", async (req, res) => {
   res.render("color_form");
});


function hexToRgb(hex) {

    const r = parseInt(hex.substring(1, 3), 16);
    const g = parseInt(hex.substring(3, 5), 16);
    const b = parseInt(hex.substring(5, 7), 16);
    const rgbArr = [r, g, b];
    return rgbArr;
}

app.post("/generate", async (req, res) => {
    console.log(hexToRgb(req.body.color));
    
    let reqArray = [hexToRgb(req.body.color)];
    while (reqArray.length < 5) {
        reqArray.push("N");
    }
    console.log(reqArray);
    var url = "http://colormind.io/api/";
    var data = {
        model : "default",
        input : reqArray
    }

    fetch(url, {
    method: "POST",
    headers: {
        "Content-Type": "application/json"
    },
    body: JSON.stringify(data)
    }).then(response => response.json())
    .then(result => {
        let rawPalette = result.result;
        console.log(result.result);
        let htmlPalette = ``;
        rawPalette.forEach(elem => {
            htmlPalette += `<div style="border: 2px solid black; display: inline-block; width: 70px; height: 70px; background-color: rgb(${elem[0]}, ${elem[1]}, ${elem[2]})"></div>`
        });
         console.log(htmlPalette);
        let colInput = `<input type="color" name="color" value="rgb(${rawPalette[0][0]}, ${rawPalette[0][1]}, ${rawPalette[0][2]})">`
        const variables = { 
            color_input: colInput,
            palette: htmlPalette,
            rawPalette: rawPalette};
        res.render("color_form_confirm", variables);
    }).catch(error => {
        console.error(error);
    });
});

app.post("/save", async (req, res) => {
    try {
        const paletteArray = JSON.parse(req.body.paletteData);

        await mongoose.connect(process.env.MONGO_CONNECTION_STRING);
        const Colors = require("./model/Colors.js");

        let paletteHTML = ``;
        paletteArray.forEach(elem => {
            paletteHTML += `<div style="border: 2px solid black; display: inline-block; width: 70px; height: 70px; background-color: rgb(${elem[0]}, ${elem[1]}, ${elem[2]})"></div>`
        });
        const newPal = new Colors({
         palette: paletteArray,
         html: paletteHTML
      });
      await newPal.save();
      mongoose.disconnect();
      res.render("color_form", {message: "Palette Saved!"});
    } catch (err) {
        console.error(err);
        res.status(500).send("Error saving palette");
    }
});


app.listen(portNumber);
console.log(`main URL http://localhost:${portNumber}/`);
