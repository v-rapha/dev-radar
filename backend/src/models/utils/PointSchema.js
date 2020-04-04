const mongoose = require("mongoose");

// consultar a documentação para mais detalhes
const PointSchema = new mongoose.Schema({
  type: {
    type: String,
    enum: ["Point"],
    required: true,
  },
  coordinates: {
    type: [Number],
    required: true,
  },
});

module.exports = PointSchema;
