const express = require("express");
const router = express.Router();
const {
  authenticateUser,
  authorizePermissions,
} = require("../middleWare/authenticateUser");

const {
  orderDebitCard,
  pendingOrderCard,
  activatedOrderCard,
  mailedOrderCard,
  getAllCards,
} = require("../controllers/orderCardController");

router
  .get(
    "/all-cards/admin",
    authenticateUser,
    authorizePermissions("admin"),
    getAllCards
  )
  .post(
    "/order-card",
    authenticateUser,
    authorizePermissions("user", "admin"),
    orderDebitCard
  )
  .post(
    "/card/pending/:cardId",
    authenticateUser,
    authorizePermissions("admin"),
    pendingOrderCard
  )
  .post(
    "/card/mailed/:cardId",
    authenticateUser,
    authorizePermissions("admin"),
    mailedOrderCard
  )
  .post(
    "/card/activated/:cardId",
    authenticateUser,
    authorizePermissions("admin"),
    activatedOrderCard
  );

module.exports = router;
