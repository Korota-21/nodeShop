const path = require('path')
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const rateLimit = require("express-rate-limit")
const { default: mongoose } = require('mongoose');

'use strict';

const config = require('./config');
const passportJWT = require("./middlewares/passportJWT")()
const errorHandler = require('./middlewares/errorHandler')

const authRoutes = require("./routes/auth.js");
const productRoutes = require("./routes/product.js");
const cartProductRoutes = require("./routes/cart_product.js");
const wishProductRoutes = require("./routes/wish_product");
const app = express();

app.use(cors());
// Data baes connection
mongoose.Promise = global.Promise;
mongoose.connect(config.mongoURI, { useNewUrlParser: true })


const Limiter = rateLimit({
    windowMs: 15 * 1000, // 15 sec
    max: 50, // Limit each IP to 100 requests per `window` (here, per 15 minutes)
})

// Apply the rate limiting middleware to API calls
app.use(Limiter)

app.use(passportJWT.initialize())

app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, "public")));
// routes
app.use('/api/auth', authRoutes)
app.use('/api/product', productRoutes)
app.use('/api/cartProduct', passportJWT.authenticate(), cartProductRoutes);
app.use('/api/wishProduct', passportJWT.authenticate(), wishProductRoutes);


app.use(errorHandler)


const port = process.env.PORT || 8080;

app.listen(port, () => console.log(`listening on ${port} ...`));