const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const notificationRoutes = require("./routes/notificationRoutes");

const authRoutes = require("./routes/authRoutes");
const auctionRoutes = require("./routes/auctionRoutes");
const bidRoutes = require("./routes/bidRoutes");
const paymentRoutes = require("./routes/paymentRoutes");
const escrowRoutes = require("./routes/escrowRoutes");
const walletRoutes = require("./routes/walletRoutes");
const autoEndAuctions = require("./utils/auctionAutoEnd");

const cron = require("node-cron");

const app = express();

app.use(cors());
app.use(express.json());
app.use("/api/notifications", notificationRoutes);
app.use("/api/wallet", walletRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/auctions", auctionRoutes);
app.use("/api/bids", bidRoutes);
app.use("/api/payments", paymentRoutes);
app.use("/api/escrow", escrowRoutes);


// MongoDB
mongoose.connect(process.env.MONGO_URI)
.then(() => console.log("MongoDB Connected"))
.catch(err => console.log(err));


// Cron Job (auto end auction)
cron.schedule("*/10 * * * * *", () => {
autoEndAuctions();
});


// Server
const PORT = process.env.PORT || 5000;

const server = app.listen(PORT, () =>
console.log(`Server running on port ${PORT}`)
);


// Socket.io
const { Server } = require("socket.io");

const io = new Server(server, {
cors: {
origin: "*"
}
});

io.on("connection", (socket) => {

console.log("User connected:", socket.id);

// join auction room
socket.on("joinAuction", (auctionId) => {
socket.join(auctionId);
});

// new bid
socket.on("newBid", (data) => {
io.to(data.auctionId).emit("bidUpdate", data);
});

socket.on("disconnect", () => {
console.log("User disconnected");
});

});

module.exports = io;