const express = require("express");
const router = express.Router();

const { sendOutlookInfo } = require("../controllers/youngOutlookController");

router.post("/outlook", sendOutlookInfo);
// .get('/users', getAllUsers)

module.exports = router;
