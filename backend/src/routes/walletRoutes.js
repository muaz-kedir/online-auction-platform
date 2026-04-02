const express = require("express");
const router = express.Router();

const {
getMyWallet,
deposit
} = require("../controllers/walletController");

const auth = require("../middleware/auth");

router.get("/", auth, getMyWallet);
router.post("/deposit", auth, deposit);

module.exports = router;