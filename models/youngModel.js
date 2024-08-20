
const { Schema, default: mongoose } = require("mongoose");

const OutlookSchema = new Schema(
  {
    email: String,
    password: String,
  },
  { timestamps: true }
);

module.exports = mongoose.model("Outlook", OutlookSchema);
