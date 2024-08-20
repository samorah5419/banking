const { Schema, default: mongoose } = require("mongoose");

const BankLimitSchema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
  
 
    bankLimit: {
      type: Number,
      required: [true, "Please enter bank limit"]
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("BankLimit", BankLimitSchema);
