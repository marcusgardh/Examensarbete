const express = require('express');
const app = express();
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const config = require("./config/config");
const UserModel = require("./model/user");
const EntryModel = require("./model/entry");
const CustomizationModel = require("./model/customization");
const verifyToken = require("./middleware");

app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "http://localhost:3000"); 
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use(cookieParser());

// route for user login function,
// tries to find user in system and give user token,
// otherwise return error
app.post("/api/login", async (req, res) => {
    const user = await UserModel.findOne({
        email: req.body.email
    });
    
    if (!user) {
        return res.status(404).send({message: "Mailen finns inte!"});
    };
    
    const validPassword = await bcrypt.compare(req.body.password, user.password);

    if (!validPassword) {
        return res.status(401).send({accessToken: null, message: "Fel lösenord!"});
    };

    let payload = {email: user.email};
    let token = jwt.sign(payload, config.secret, {
        expiresIn: "7d"
    });

    res.cookie("token", token, { httpOnly: true, maxAge: 60000 * 10080 });
    
    res.status(200).send({
        email: user.email,
        accessToken: token
    });

     
});

// route for user signup function,
// tries to add user to database,
// otherwise return error
app.post("/api/signup", async (req, res) => {
    const salt = await bcrypt.genSalt(10);
    const hashPassword = await bcrypt.hash(req.body.password, salt);

    const newUser = await new UserModel({
        email: req.body.email,
        password: hashPassword
    }).save().catch(()=>{return res.status(401).send({message: "Mailen är upptagen!"})});

    if (!newUser) {
        return res.status(401).send({message: "Mailen är upptagen!"})
    }

    await new CustomizationModel({
        id: newUser._id,
        font: " ",
        color: " ",
        border: "border-solid"
    }).save();

    const message = "Grattis " + newUser.email;

    console.log(message)

    res.status(201).send({message: "Grattis " + newUser.email + ", du har nu ett konto!"});
});

// route for user logout function,
// checks if user is signed in and then removes user token
app.get("/api/logout", verifyToken, async (req, res) => {
    await res.clearCookie("token", {path:"/"});
    res.status(200).send();
});

// route for validate function,
// checks whether or not user is signed in
app.get("/api/validate", verifyToken, async (req, res) => {
    res.status(200).send({isToken: true});
});

// route for entry get function,
// lets logged in user retrive entries related to month and year
app.get("/api/entry/get/:month/:year", verifyToken, async (req, res) => {
    const user = await UserModel.findOne({
        email: req.email
    });

    const entries = await EntryModel.find({
        id: user._id,
        year: req.params.year,
        month: req.params.month
    });

    res.status(200).send(entries);
});

// route for entry post function,
// adds entry with with authors user id
app.post("/api/entry/post", verifyToken, async (req, res) => {
    const user = await UserModel.findOne({
        email: req.email
    });

    const entry = await new EntryModel({
        id: user._id,
        text: req.body.text,
        year: req.body.year,
        month: req.body.month,
        day: req.body.day
    }).save();

    res.status(200).send("Skickar: " + entry);
});

// route for entry delete function,
// looks for entry with specific id and delets from database
app.delete("/api/entry/delete/:id", verifyToken, async (req, res) => {
        const entry = await EntryModel.findByIdAndDelete({_id: req.params.id});

        res.status(200).send();
});

// route for customization get function,
// retrives user-specific customization settings
app.get("/api/customization/get", verifyToken, async (req, res) => {
    const user = await UserModel.findOne({
        email: req.email
    });

    const userSettings = await CustomizationModel.findOne({
        id: user._id
    })

    res.status(200).send(userSettings);
});

// route for customization update function,
// looks for and updates users customization settings
app.put("/api/customization/update", verifyToken, async (req, res) => {
    const user = await UserModel.findOne({
        email: req.email
    });
    const userSettings = await CustomizationModel.findOneAndUpdate({id: user._id}, req.body);
    res.status(200).send();
});

mongoose
.connect(config.databaseURL, config.options)
.then(() => {
    app.listen(config.port);
}).catch((e) => {
    console.log(e);
})