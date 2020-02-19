const express = require("express");
const dotenv = require("dotenv");
const colors = require("colors");
const connectDB = require("./config/db");

// Load env vars
dotenv.config({ path: "./config/config.env" });

// Connect to database
connectDB();

const app = express();

app.set("view engine", "ejs");

app.use(express.static("public"));

app.get("/", (req, res) => {
  res.render("index");
});

const PORT = process.env.PORT || 7000;

const server = app.listen(
  PORT,
  console.log(
    `Server running in ${process.env.NODE_ENV} mode on ${PORT}`.yellow.bold
  )
);

// Handle unhandled promise rejections
process.on("unhandledRejection", (err, promise) => {
  console.log(`Error: ${err.message}`.red);
  // Close server & exit process
  server.close(() => process.exit(1));
});

// Include socket.io
const io = require("socket.io")(server);

io.on("connection", socket => {
  console.log("A new client has been connected");

  socket.username = "Anonymous";

  socket.on("new_message", data => {
    io.sockets.emit("new_message", {
      message: data.message,
      username: socket.username
    });

    socket.on("change_username", data => {
      socket.username = data.username;
    });

    socket.on("typing", data => {
      socket.broadcast.emit("typing", { username: socket.username });
    });
  });
});
