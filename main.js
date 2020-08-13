const express = require("express");
const bcrypt = require("bcrypt");
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");
const { pool } = require("./dbConfig.js");
const session = require("express-session");
const flash = require("express-flash");
const passport = require('passport');
const passportLocal = require('passport-local');
const intializePassport = require('./passportConfig');

const app = express();

intializePassport(passport);


app.use(bodyParser.urlencoded());
app.use(bodyParser.json());
app.use(cookieParser());
app.use(express.static(__dirname));
app.use(flash());
app.use(session({
    secret: 'secret',
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
app.set("view engine", 'ejs');

const PORT = 8080;


app.get("/", (req, res) => {
    res.render('Login.ejs');
})

app.get("/register", (req, res) => {
    res.sendFile(__dirname + "/" + "Register.html")
})

app.post("/register", async(req, res) => {
    let { RegisterName, RegisterEmail, RegisterId, RegisterPassword } = req.body;
    let hashedPassword = await bcrypt.hash(RegisterPassword, 10);
    console.log({ RegisterName, RegisterEmail, RegisterId, hashedPassword });
    pool.query(`insert into Users(name, email, sid, password)
                values ($1, $2, $3, $4)
                returning id, password`, [RegisterName, RegisterEmail, RegisterId, hashedPassword],
        (err, results) => {
            if (err) {
                throw err;
            }
            console.log(results.rows);
            req.flash("Successfully Registered", "You have been successfully registered. Please login");
            res.redirect("/");
        })
})

app.get("/main", (req, res) => {
    res.render('main.ejs', { name: req.user.name, email: req.user.email, id: req.user.sid });
})

app.post("/", passport.authenticate("local", {
    successRedirect: "/main",
    failureRedirect: "/",
    failureFlash: true
}))

app.listen(PORT, () => {
    console.log(`server running on Port:${PORT}`)
});