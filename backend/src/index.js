const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const http = require("http");
const routes = require("./routes");
const { setupWebsocket } = require("./websocket");

const app = express();
const server = http.Server(app); // somente o servidor http

setupWebsocket(server); // método vai ser execultado assim que
// o servidor iniciar

mongoose.connect("mongodb://localhost:27017/week10", {
  useUnifiedTopology: true,
  useNewUrlParser: true,
});

// express.json() deve vir antes
app.use(cors());
app.use(express.json());
app.use(routes);

server.listen(3333);
