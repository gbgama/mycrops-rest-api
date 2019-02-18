const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Create Schema
const HubSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: "users"
  },
  name: {
    type: String,
    required: true,
    max: 50
  },
  updated: {
      type: Date,
      default: Date.now
  },
  airTemperature: {
    type: Number,
    required: true
  },
  airHumidity: {
    type: Number,
    required: true
  },
  crops: {
    type: Array,
    required: true
  },
  readings: {
    type: Array,
    required: false
  },
  notes: {
    type: Array,
    required: false
  }
});

module.exports = Hub = mongoose.model('hubs', HubSchema);