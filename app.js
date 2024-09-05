const express = require("express");
const app = express();
const cors = require("cors");
const cookieParser = require("cookie-parser");
const { connectdb } = require("./config/mongo")

const bodyParser = require("body-parser")
const passport = require("passport")
const LocalStrategy = require("passport-local");
const User= require("./modals/userModal.js")
require('dotenv').config();

// Routers here
const listingRouter = require("./routes/listing.router.js");
const userRouter = require("./routes/user.router.js");
const reviewRouter = require("./routes/review.router.js")

// Middleware setup
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors({
    origin: 'https://wanderlust-react.vercel.app', // Replace with the origin of your React app
    credentials: true // Allow credentials (cookies)
}));

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());


// Mongo connection
connectdb(process.env.MONGO_URI);


// Session setup
const session = require("express-session");
const MongoStore = require("connect-mongo");

const store = MongoStore.create({
    mongoUrl: process.env.MONGO_URI,
    crypto: {
        secret: process.env.SESSION_SECRET,
    },
    touchAfter: 24 * 3600 // In seconds
});

app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    store: store,
    cookie: {
        expires: Date.now() + 7 * 24 * 60 * 60 * 1000, // 7 days
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
        httpOnly: true,
        secure: false,
        signed: false
    }
}));

// Initialize Passport.js and use session
app.use(passport.initialize());
app.use(passport.session());

// Passport.js setup
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


// Routes
app.use("/",listingRouter);
app.use("/",userRouter);
app.use("/",reviewRouter)

// app.use((req, res, next) => {
//     res.setHeader('Access-Control-Allow-Origin', 'http://localhost:5173');
//     res.setHeader('Access-Control-Allow-Credentials', 'true');
//     res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,OPTIONS');
//     res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
//     next();
// });


const port = process.env.PORT
app.listen(port, () => {
    console.log(`server listening at port ${port}`);
})