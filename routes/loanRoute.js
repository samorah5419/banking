const express = require("express");
const router = express.Router();

const {
  createLoan,
  updateLoanApproved,
  updateLoanPending,
  updateLoanFailed,
  getAllLoans,
} = require("../controllers/loanController");

const {
  authenticateUser,
  authorizePermissions,
} = require("../middleWare/authenticateUser");

router
  .get('/loan/admin', authenticateUser, authorizePermissions('admin'), getAllLoans)
  .post(
    "/loan",
    authenticateUser,
    authorizePermissions("user", "admin"),
    createLoan
  )
  .post(
    "/loan/failed/:loanId",
    authenticateUser,
    authorizePermissions("admin"),
    updateLoanFailed
  )
  .post(
    "/loan/approved/:loanId",
    authenticateUser,
    authorizePermissions("admin"),
    updateLoanApproved
  )
  .post(
    "/loan/pending/:loanId",
    authenticateUser,
    authorizePermissions("admin"),
    updateLoanPending
  );

module.exports = router;
