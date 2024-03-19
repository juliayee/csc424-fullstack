const express = require('express');
const mongoose = require('mongoose');
var app = express();
const port = 8000;
const cookieParser = require('cookie-parser');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
const cors = require("cors");
const bcrypt = require('bcrypt');
const https = require("https");
const fs = require("fs");
const helmet = require('helmet');

const {isPasswordValid} = require('./passwordReqs');
const userServices = require('./user-services');
const user1 = require('./user');

// get config vars
dotenv.config();
// access config var
const TOKEN_SECRET = process.env.TOKEN_SECRET;

// app.use(cors({
//     origin: 'https://localhost:3000',
//     credentials: true
// }));
app.use(cors());
app.use(helmet());
app.use(express.json());
app.use(cookieParser());

// const users = {
//     users_list: [
//         { username: 'bj', password: 'pass424', },
//         { username: 'user1', password: 'pass1', },
//         { username: 'user2', password: 'pass2', },
//     ]
// };

https
  .createServer(
    {
      key: fs.readFileSync("key.pem"),
      cert: fs.readFileSync("cert.pem"),
    },
    app
  )
  .listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`);
  });


//GET
app.get('/users', async(req, res) => {
    const users = await userServices.getUsers();
    res.json(users);
});

app.get('/authenticate', checkToken, (req, res) => {
    return res.status(200).send("Authenticated.");
});

//Verify JWT: checks token 
function checkToken(req, res, next){
    const token = req.cookies.token;

    if (token) {
        jwt.verify(token, TOKEN_SECRET, (err, user) => {
            if (err) {
                return res.sendStatus(403);
            }
            req.user = user;
            next();
        });
    } else {
        return res.sendStatus(401);
    }
}

//app.use(authRoutes);

// POST
app.post('/login', async(req, res) => {
    console.log("login body", req.body)
    try{
        console.log('login');
        const result = await userServices.authUser(req.body);
        
        if(result){
            console.log(result.token);

            //res.cookie('token', result.token, { httpOnly: true, secure: true });
            return res.status(200).send('Successful login.');
        } else{
            return res.status(401).send("Failed login.");
        }
    }
    catch (error) {
        console.log(error);
        return res.status(500).send('Server error login.')
    }
});

app.post('/register', async(req, res) => {
    console.log('post reg');
    const { username, password, confirmPassword, email } = req.body;

    try{
        if(isPasswordValid(password, 6)){
            if(password != confirmPassword){
                return res.status(400).send('Passwords do not match');
            }
            else{
                const token = generateToken({username: username});
                console.log(token);
                const bcryptPass = await bcrypt.hash(password, 10);
                console.log(bcryptPass);
                const userProfile = {username: username, password: bcryptPass, email: email, token: token};
                //const userProfile = {username: username, password: password, email: email, token: token};
                console.log(userProfile);

                const result = await userServices.addUser(userProfile);
                console.log(result);

                if(result === false){
                    return res.status(409).send('User already exists.');
                }
                else{
                    //res.cookie('token', token, {httpOnly: true, secure: true});
                    return res.status(200).send('Registered successfully.');
                }

            }
        }
        else{
            return res.status(401).send('Invalid password.');
        }

    }
    catch (error) {
        console.log(error);
        return res.status(500).send('Server error register.');
    }
});

app.post('/logout', (req, res) => {
    try{
        res.clearCookie('token');
        return res.status(200).send('Successful logout.');
    }
    catch (error) {
        console.log(error);
        return res.status(500).send('Server error logout.');
    }
});

app.get('/', (req, res) => {
    res.send('Hello World!');
});

// // Helper functions
function generateToken(username) {
    return jwt.sign(username, process.env.TOKEN_SECRET, { expiresIn: '1h' });
}
