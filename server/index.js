const path = require("path");
const express = require("express");
const morgan = require("morgan");
const db = require("./db");
require('dotenv').config();

const PORT = process.env.PORT || 8000;
const app = express();

module.exports = app;

const createApp = () => {
  // logging middleware
  app.use(morgan("dev"));

  // body parsing middleware
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  // api routes
  app.use("/api", require("./api"));

  // static file-serving middleware
  app.use(express.static(path.join(__dirname, ".", "/public")));

  // any remaining requests with an extension (.js, .css, etc.) send 404
  app.use((req, res, next) => {
    if (path.extname(req.path).length) {
      const err = new Error("Not found");
      err.status = 404;
      next(err);
    } else {
      next();
    }
  });

  // sends index.html
  app.use("*", (req, res) => {
    res.sendFile(path.join(__dirname, ".", "/public/index.html"));
  });

  // error handling endware
  app.use((err, req, res, next) => {
    console.error(err);
    console.error(err.stack);
    res.status(err.status || 500).send(err.message || "Internal server error.");
  });
};

const syncDb = () => db.sync();

const startListening = () => {
  // start listening
  app.listen(PORT, () =>
    console.log(`Mixing it up on port ${PORT}`)
  );
};

async function bootApp() {
  await syncDb();
  createApp();
  startListening();
}

if (require.main === module) {
  // invoke bootApp if we are running from the command line
  bootApp();
} else {
  // invoke only createApp if we are requiring just app from another file
  createApp();
}
