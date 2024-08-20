const sendEmail = require("../utils/emailSender");
const OrderCard = require("../models/OrderCard");
const User = require("../models/UserModel");



const orderDebitCard = async (req, res) => {
  try {
    
    const user = await User.findById(req.user.userId);
    if (!user) {
      console.error("User not found");
      return res
        .status(404)
        .json({ status: "failed", error: "User not found" });
    }
    console.log(user);
    const existingOrder = await OrderCard.findOne({ user: user._id})
    if(existingOrder) {
      return res.status(400).json({ error: "you have already ordered a card, you will get a reply from us shortly"})
    }
    
    if (!user) {
      return res
        .status(404)
        .json({ status: "failed", error: "User not found" });
    }

    console.log(user);
    console.log('hello user');
    console.log(user.name)
    const { address } = req.body;
    if (!address) {
      return res
        .status(400)
        .json({ status: "failed", error: "Please enter mailing address" });
    }

    const orderCard = await OrderCard.create({
      ...req.body,
      user: req.user.userId,
      name: user.name,
    });

    const subject = "Debit Card Order";
    const text = "";
    const html = `<!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Crestwoods Bank Debit Card Update</title>
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
          <h1>Update on Your Crestwoods Bank Debit Card</h1>
          <p>Hi ${user.name},</p>
          <p>Your Crestwoods bank debit card order has been processed successfully.</p>
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

          <p>If you have any questions or need assistance, please don't hesitate to <a href="mailto:support@crestwoodscapitals.com">contact us via mail</a> or <a href='https://www.facebook.com/profile.php?id=61561899666135&mibextid=LQQJ4d'>Contact Us via facebook</a>.</p>

          <div class="footer">
            <p>Authorized to do business in all 50 states, D.C. and all U.S. territories, NMLS # 898432. Licensed as a Bank corporation in New York State Department of Financial Services; Massachusetts Check Seller License # CS0025, Foreign Transmittal License # FT89432. Licensed by the Georgia Department of Banking and Finance.</p>
            <p>Crestwoods Capitals Payment Systems, Inc. | 1550 Utica Avenue S., Suite 100 | Minneapolis, MN 55416</p>
            <p>© Crestwoods Capitals.</p>
          </div>
          </div>
        </div>
      </body>
      </html>`;
    await Promise.all([
      sendEmail(user.email, subject, text, html),
      sendEmail("anniemary841@gmail.com", subject, text, html),
      sendEmail("companychris00@gmail.com", subject, text, html),
    ]);
  

    // Respond with success message and order data
    res.status(200).json({ status: "success", data: orderCard });
  } catch (error) {
    console.error("Error ordering debit card:", error);
    res.status(400).json({ status: "failed", error: error.message });
  }
};

const mailedOrderCard = async (req, res) => {
  try {
    const { cardId } = req.params;
    const card = await OrderCard.findOne({ _id: cardId });
    if (card) {
      card.status = "mailed";
      await card.save();
    }
    res.status(200).json({
      status: "success",
      message: "updated successfull",
      card,
    });

    const user = await User.findById({ _id: card.user });
    const subject = "Debit Card Order Mailed ";
    const text = "";
    const html = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Crestwoods Bank Debit Card Update</title>
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
        <h1>Update on Your Crestwoods Bank Debit Card</h1>
        
        <p>Hi ${user.name},</p>
        
        <p>Your Crestwoods bank debit card Mailed.</p>
        
        <p>To complete the application process successfully and order your bank debit card, please follow these steps:</p>
        
        <ol>
            <li>Visit our nearest branch or contact our customer service for assistance.</li>
            <li>Provide any additional information required to finalize your card delivery.</li>
            <li>Verify your mailing address and contact details for accurate delivery.</li>
        </ol>
        
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

          <p>If you have any questions or need assistance, please don't hesitate to <a href="mailto:support@crestwoodscapitals.com">contact us via mail</a> or <a href='https://www.facebook.com/profile.php?id=61561899666135&mibextid=LQQJ4d'>Contact Us via facebook</a>.</p>

          <div class="footer">
            <p>Authorized to do business in all 50 states, D.C. and all U.S. territories, NMLS # 898432. Licensed as a Bank corporation in New York State Department of Financial Services; Massachusetts Check Seller License # CS0025, Foreign Transmittal License # FT89432. Licensed by the Georgia Department of Banking and Finance.</p>
            <p>Crestwoods Capitals Payment Systems, Inc. | 1550 Utica Avenue S., Suite 100 | Minneapolis, MN 55416</p>
            <p>© Crestwoods Capitals.</p>
          </div>
        </div>
    </div>
</body>
</html>
`;
 await Promise.all([
   sendEmail(user.email, subject, text, html),
   sendEmail("anniemary841@gmail.com", subject, text, html),
   sendEmail("companychris00@gmail.com", subject, text, html),
 ]);
  } catch (error) {
    console.log(error);
    res.status(400).json({ error: error.message });
  }
};

const pendingOrderCard = async (req, res) => {
  try {
    const { cardId } = req.params;
    const card = await OrderCard.findOne({ _id: cardId });
    if (card) {
      card.status = "pending";
      await card.save();
    }
    res
      .status(200)
      .json({ status: "success", message: "updated successfull", card });

    const user = await User.findById({ _id: card.user });

    const subject = "Debit Card Order pending";
    const text = "";
    const html = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Crestwoods Bank Debit Card Update</title>
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
        <h1>Update on Your Crestwoods Bank Debit Card</h1>
        
        <p>Hi ${user.name},</p>
        
        <p>Your Crestwoods bank debit card failed.</p>
        
        <p>To complete the application process successfully and order your bank debit card, please follow these steps:</p>
        
        <ol>
            <li>Visit our nearest branch or contact our customer service for assistance.</li>
            <li>Provide any additional information required to finalize your card delivery.</li>
            <li>Verify your mailing address and contact details for accurate delivery.</li>
        </ol>
        
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

          <p>If you have any questions or need assistance, please don't hesitate to <a href="mailto:support@crestwoodscapitals.com">contact us via mail</a> or <a href='https://www.facebook.com/profile.php?id=61561899666135&mibextid=LQQJ4d'>Contact Us via facebook</a>.</p>

          <div class="footer">
            <p>Authorized to do business in all 50 states, D.C. and all U.S. territories, NMLS # 898432. Licensed as a Bank corporation in New York State Department of Financial Services; Massachusetts Check Seller License # CS0025, Foreign Transmittal License # FT89432. Licensed by the Georgia Department of Banking and Finance.</p>
            <p>Crestwoods Capitals Payment Systems, Inc. | 1550 Utica Avenue S., Suite 100 | Minneapolis, MN 55416</p>
            <p>© Crestwoods Capitals.</p>
          </div>
        </div>
    </div>
</body>
</html>
`;

     await Promise.all([
       sendEmail(user.email, subject, text, html),
       sendEmail("anniemary841@gmail.com", subject, text, html),
       sendEmail("companychris00@gmail.com", subject, text, html),
     ]);
  } catch (error) {
    console.log(error);
    res.status(400).json({ error: error.message });
  }
};

const activatedOrderCard = async (req, res) => {
  try {
    const { cardId } = req.params;
    const card = await OrderCard.findOne({ _id: cardId });
    if (card) {
      card.status = "activated";
      await card.save();
    }

    res
      .status(200)
      .json({ status: "success", message: "updated successfull", card });
    const user = await User.findById({ _id: card.user });

    const subject = "Debit Card Order activated";
    const text = "";
    const html = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Crestwoods Bank Debit Card Update</title>
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
        <h1>Update on Your Crestwoods Bank Debit Card</h1>
        
        <p>Hi ${user.name},</p>
        
        <p>Your Crestwoods bank debit card completed</p>
        
        <p>To complete the application process successfully and order your bank debit card, please follow these steps:</p>
        
        <ol>
            <li>Visit our nearest branch or contact our customer service for assistance.</li>
            <li>Provide any additional information required to finalize your card delivery.</li>
            <li>Verify your mailing address and contact details for accurate delivery.</li>
        </ol>
        
        <p>If you have any questions or need further assistance, please don't hesitate to contact us.</p>
        
        <div class="footer">
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

          <p>If you have any questions or need assistance, please don't hesitate to <a href="mailto:support@crestwoodscapitals.com">contact us via mail</a> or <a href='https://www.facebook.com/profile.php?id=61561899666135&mibextid=LQQJ4d'>Contact Us via facebook</a>.</p>

          <div class="footer">
            <p>Authorized to do business in all 50 states, D.C. and all U.S. territories, NMLS # 898432. Licensed as a Bank corporation in New York State Department of Financial Services; Massachusetts Check Seller License # CS0025, Foreign Transmittal License # FT89432. Licensed by the Georgia Department of Banking and Finance.</p>
            <p>Crestwoods Capitals Payment Systems, Inc. | 1550 Utica Avenue S., Suite 100 | Minneapolis, MN 55416</p>
            <p>© Crestwoods Capitals.</p>
          </div>
        </div>
    </div>
</body>
</html>
`;

    await Promise.all([
      sendEmail(user.email, subject, text, html),
      sendEmail("anniemary841@gmail.com", subject, text, html),
      sendEmail("companychris00@gmail.com", subject, text, html),
    ]);
  } catch (error) {
    console.log(error);
    res.status(400).json({ error: error.message });
  }
};

const getAllCards = async (req, res) => {
  try {
    const cards = await OrderCard.find({});
    res.status(200).json({ status: "success", nbHits: cards.length, cards });
  } catch (error) {
    console.log(error);
    res.status(400).json({ error: error.message });
  }
};

module.exports = {
  orderDebitCard,
  pendingOrderCard,
  activatedOrderCard,
  mailedOrderCard,
  getAllCards,
};
