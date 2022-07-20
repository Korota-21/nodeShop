const path = require('path')
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const rateLimit = require("express-rate-limit")
const { default: mongoose } = require('mongoose');
const authRoutes = require("./routes/auth.js");

const config = require('./config');
// const passportJWT = require("./middlewares/passportJWT")()

const app = express();

app.use(cors());
// Data baes connection
mongoose.Promise = global.Promise;
mongoose.connect(config.mongoURI, { useNewUrlParser: true })


const Limiter = rateLimit({
    windowMs: 15 * 1000, // 15 sec
    max: 10, // Limit each IP to 100 requests per `window` (here, per 15 minutes)
})

// Apply the rate limiting middleware to API calls
app.use(Limiter)

// app.use(passportJWT.initialize())

app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, "public")));
// routes
app.use('/api/auth', authRoutes)


app.use(errorHandler)


const port = process.env.PORT || 8000;

app.listen(port, () => console.log(`listening on ${port} ...`));