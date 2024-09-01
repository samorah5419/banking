const { Schema, default: mongoose } = require("mongoose");

const LocalTransferSchema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    name: {
      type: String,
    },
  
    account: {
      type: String,
      required: [true, "Please choose an account"],
      enum: {
        values: ["checkings", "savings"],
        message: "{VALUE} is not supported",
      },
    },
    status: {
      type: String,
      enum: ["pending", "completed", "failed"],
      default: "failed",
    },
    amount: {
      type: Number,
      required: [true, "Please enter amount to send"],
      min: [10, "You cannot send less than $10"],
    },
    acct: {
      type: String,
      required: [true, "Please enter an account number"],
    },
    bank: {
      type: String,
      required: [true, "Please enter a bank"],
    },

    routing: {
      type: String,
      required: [true, "Please enter routing transit number"],
    },
    address: {
      type: String,
    },
    remarks: {
      type: String,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("LocalTransfer", LocalTransferSchema);
