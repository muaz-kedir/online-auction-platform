const express = require("express");
const router = express.Router();

const {
getMyNotifications,
markAsRead
} = require("../controllers/notificationController");

const auth = require("../middleware/auth");

router.get("/", auth, getMyNotifications);
router.put("/:id/read", auth, markAsRead);

module.exports = router;