const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const auth = require("./Routes/auth.router");
const cookieParser = require("cookie-parser");

const user = require("./Routes/user.route");
const app = express();
const dotenv = require("dotenv");

dotenv.config();

// Settings
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cookieParser());
app.use(cors())

app.use(express.static(__dirname + "/uploads"));


// Routes
app.use("/", user);
app.use("/auth", auth);




module.exports = app;
