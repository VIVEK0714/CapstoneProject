const express = require('express');
const app = express();
const { initializeApp } = require('firebase-admin/app');
const { getFirestore } = require('firebase-admin/firestore');
const serviceAccount = require("./key.json");
const admin = require('firebase-admin');
const bodyParser = require('body-parser'); 
admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
});
const db = getFirestore();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public')); 
app.get('/signup_page', function (req, res) {
    res.sendFile(__dirname + "/public/signup_page.html");
});
app.post('/submit_signup', function (req, res) {
    const { name, email, password } = req.body; 

    if (!name || !email || !password) {
        res.send("Error: All fields are required.");
        return;
    }
    db.collection("users").add({
        FullName: name,
        Email: email,
        Password: password,
    })
    .then(() => {
        res.send("Signup successful! Data stored in Firebase.");
    })
    .catch((error) => {
        res.send("Error: " + error.message);
    });
});
app.get('/login_page', function (req, res) {
    res.sendFile(__dirname + "/public/login_page.html");
});
app.post('/submit_login', function (req, res) {
    const { email, password } = req.body; 
    if (!email || !password) {
        res.send("Error: Email and password are required.");
        return;
    }
    db.collection("users")
        .where("Email", "==", email)
        .where("Password", "==", password)
        .get()
        .then((docs) => {
            if (docs.size > 0) {
                res.send("Login successful!");
            } else {
                res.send("Invalid credentials. Please try again.");
            }
        })
        .catch((error) => {
            res.send("Error: " + error.message);
        });
});
const port = process.env.PORT || 1000;
app.listen(port, function () {
    console.log('Example app listening on port ' + port + '!');
});
