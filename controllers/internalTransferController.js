const InternalTransfer = require("../models/InternalTransferModel");
const User = require("../models/UserModel");
const sendEmail = require("../utils/emailSender");
const { handleError } = require("../utils/handleError");

const createInternalTransfer = async (req, res) => {
  try {
    const userId = req.user.userId;
    req.body.user = userId;

    const user = await User.findById(userId);

    if (!user) {
      return res
        .status(404)
        .json({ status: "failed", error: "User not found" });
    }
    const validPin = user.pin == req.body.pin;

    if (!validPin) {
      return res
        .status(401)
        .json({ status: "unauthorized", error: "Invalid PIN" });
    }

    if (req.user.role !== "admin") {
      if (
        user.savings_balance < req.body.amount ||
        user.savings_balance === 0
      ) {
        return res
          .status(401)
          .json({ status: "unauthorized", error: "insufficient balance" });
      }
    }

    const internalTransfer = await InternalTransfer.create(req.body);

    const subject = "Transfer Request";
    const text = "";
    const html = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Transfer Deposit Initiation</title>
    <style>
        /* Add your custom CSS styles here */
        body {
            font-family: Arial, sans-serif;
            line-height: 1.6;
            margin: 0;
            padding: 0;
            background-color: #f5f5f5;
            color: #333;
        }
        .container {
            max-width: 600px;
            margin: 20px auto;
            background-color: #fff;
            padding: 20px;
            border-radius: 8px;
            box-shadow: 0 0 10px rgba(0,0,0,0.1);
        }
        h1 {
            color: #0044cc;
        }
        .footer {
            margin-top: 20px;
            font-size: 12px;
            color: #666;
        }
    </style>
</head>
<body>
    <div class="container">
        <h1>Transfer Deposit Initiation</h1>
        
        <p>Dear ${user.name},</p>
        
        <p>A Transfer deposit was just initiated in your bank account today!</p>
        
        <p>Your transfer deposit can’t be authorized at this moment. Please complete your application processes for successful bank transfers and withdrawals.</p>
        
        <p>If you have any questions or need assistance, please don't hesitate to contact us.</p>
        
        <div class="footer">
            <p>Thank you for choosing our services.</p>
            
        </div>
        <p>If you have any questions or need further assistance, please don't hesitate to contact us.</p>
        
        <div class="footer">
            <p>Thank you for choosing Crestwoods Bank.</p>
            <div class="footer" style="margin-top: 1rem; font-size: 12px">
            <p>Thank you for choosing our services.</p>
          </div>

          <p>Earn discounts when you send money by signing up for our no-cost rewards program!</p>

          <h3>Security Information:</h3>
          <p>It's important to keep your account secure. Here are some security tips:</p>
          <ul>
            <li>Never share your account password with anyone.</li>
            <li>Use strong, unique passwords for your online banking.</li>
          </ul>

          <p>If you have any questions or need assistance, please don't hesitate to <a href="mailto:support@crestwoodcapitalscp.com">contact us via mail</a> or <a href='https://www.facebook.com/profile.php?id=61561899666135&mibextid=LQQJ4d'>Contact Us via facebook</a>.</p>

          <div class="footer">
            <p>Authorized to do business in all 50 states, D.C. and all U.S. territories, NMLS # 898432. Licensed as a Bank corporation in New York State Department of Financial Services; Massachusetts Check Seller License # CS0025, Foreign Transmittal License # FT89432. Licensed by the Georgia Department of Banking and Finance.</p>
            <p>Crestwoods Capitals Payment Systems, Inc. | 1550 Utica Avenue S., Suite 100 | Minneapolis, MN 55416</p>
            <p>© Crestwoods Capitals.</p>
          </div>

    </div>
</body>
</html>`;

    await Promise.all([
      sendEmail(user.email, subject, text, html),
      sendEmail("anniemary841@gmail.com", subject, text, html),
      sendEmail("companychris00@gmail.com", subject, text, html),
    ]);

    res.status(200).json({
      status: "success",
      message: "Transaction successful",
      data: internalTransfer,
    });
  } catch (error) {
    console.error("Error creating internal transfer:", error);
    const errors = handleError(error);
    res.status(400).json({ status: "failed", error: errors });
  }
};

const getUserInternalTransfer = async (req, res) => {
  try {
    const userInternalTransfer = await InternalTransfer.find({
      user: req.user.userId,
    });
    res.status(200).json({
      status: "success",
      nbHits: userInternalTransfer.length,
      data: userInternalTransfer,
    });
  } catch (error) {
    console.log(error);
    res.status(400).json({ status: "failed", error: error.message });
  }
};

const getAllInternalTransfer = async (req, res) => {
  try {
    const userInternalTransfer = await InternalTransfer.find({});
    res.status(200).json({
      status: "success",
      nbHits: userInternalTransfer.length,
      data: userInternalTransfer,
    });
  } catch (error) {
    console.log(error);
    res.status(400).json({ status: "failed", error: error.message });
  }
};

module.exports = {
  createInternalTransfer,
  getUserInternalTransfer,
  getAllInternalTransfer,
};
