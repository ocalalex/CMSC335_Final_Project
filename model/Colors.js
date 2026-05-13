const mongoose = require("mongoose");

const colorsSchema = new mongoose.Schema({
   palette: {
      type: Array,
      required: true
   },
   html: {
      type: String,
      required: true
   }
});

const Colors = mongoose.model("Colors", colorsSchema);
module.exports = Colors;