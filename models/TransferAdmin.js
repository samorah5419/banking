const { Schema, default: mongoose } = require("mongoose");

const TransferAdminSchema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    amount: {
      type: Number,
      required: [true, " enter the amount wey u wan send"],
    },

    status: {
      type: String,
      enum: ["pending", "completed", "failed"],
      default: "completed",
    },
    
       date: {
      type: String,
    },
    account_number: {
      type: String,
      required: [true, " enter account number"],
    },
    remarks: {
      type: String,
      default: "transfer",
    },
    account: {
      type: String,
      required: [true, " choose an account"],
      enum: {
        values: ["checkings", "savings"],
        message: " {VALUE} is not supported, na checkings or savings",
      },
    },
  },

  { timestamps: true }
);

module.exports = mongoose.model("TransferAdmin", TransferAdminSchema);
