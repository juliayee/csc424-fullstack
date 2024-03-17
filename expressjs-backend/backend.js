const express = require('express');
const mongoose = require('mongoose');
const authRoutes = require('./authRoutes');
const app = express();
const port = 8000;
const cookieParser = require('cookie-parser');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
const cors = require("cors");
const bcrypt = require('bcrypt');
const https = require("https");
const fs = require("fs");

const {isPasswordValid} = require('./passwordReqs');
const userServices = require('./user-services');
const user1 = require('./user');

// get config vars
dotenv.config();
// access config var
const TOKEN_SECRET = process.env.TOKEN_SECRET;

app.use(cors({
    origin: 'https://localhost:${port}',
    credentials: true
}));
app.use(express.json());
app.use(cookieParser());

// const users = {
//     users_list: [
//         { username: 'bj', password: 'pass424', },
//         { username: 'user1', password: 'pass1', },
//         { username: 'user2', password: 'pass2', },
//     ]
// };

// app.listen(port, () => {
//     console.log(`Example app listening at http://localhost:${port}`);
// });

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
                return res.status(403);
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
    try{
        const user = await userServices.authUser(req.body);
        
        if(user){
            console.log(result.token);

            res.cookie('token', result.token, { httpOnly: true, secure: true });
            res.status(200).json({message: 'Successful login.'});
        }
        else{
            return res.sendStatus(401).send("Failed login.");
        }
    }
    catch (error) {
        console.log(error);
        res.status(500).send('Server error login.')
    }
});

app.post('/register', async(req, res) => {
    const { user, password, confirmPassword } = req.body;

    try{
        if(await isPasswordValid(password)){
            if(password != confirmPassword){
                res.status(400).send('Passwords do not match');
            }
            else{
                const token = generateToken({username: user});
                const bcryptPass = await bcrypt.hash(password, 10);
                const userProfile = {username: user, password: bcryptPass, token: token};

                const result = await userServices.addUser(userProfile);
                console.log(result);

                if(result === false){
                    res.sendStatus(409).send('User already exists.');
                }
                else{
                    res.cookie('token', token, {httpOnly: true, secure: true});
                    res.sendStatus(200).send('Registered successfully.');
                }

            }
        }

    }
    catch (error) {
        console.log(error);
        res.sendStatus(500).send('Server error register.');
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
