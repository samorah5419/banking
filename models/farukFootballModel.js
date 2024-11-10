const mongoose = require("mongoose");

const PlayerSchema = new mongoose.Schema({
  name: { type: String, required: true },
  dob: { type: Date, required: true },
  phoneNumber: { type: String, required: true },
  position: { type: String, required: true },
  jerseyNumber: { type: Number, required: true },
});

const ManagerSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  contactAddress: { type: String, required: true },
  phoneNumber: { type: String, required: true },
  localGovernment: { type: String, required: true },
});

const TeamSchema = new mongoose.Schema({
  teamName: { type: String, required: true },
  teamPhoto: { type: String, default: null }, // URL or path to image
  players: [PlayerSchema],
  manager: ManagerSchema,
});

const Team = mongoose.model("Team", TeamSchema);

module.exports = Team;
