const http = require("http");
const express = require("express");
const path = require("path");
const app = express();
const server = http.createServer(app);

//
app.use("/public", express.static(path.join(__dirname, "./../../public")));

//
server.listen(process.env.PORT || 3000, () => {
    console.log("listening on *:3000");
});