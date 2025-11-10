require("module-alias/register");

const dotenv = require("dotenv");
dotenv.config();

const express = require("express");
const app = express();

const connectTODB = require("@configs/DB/db.config");
const checkDBConnection = require("@middlewares/DB/db.middleware");

connectTODB();

app.use(express.json());
app.use(express.urlencoded({ extended : true }));

app.use(checkDBConnection);

module.exports = app;