const express = require('express');
const mongoose = require('mongoose');
const authRoutes = require('./authRoutes');
const app = express();
const port = 8000;
const cookieParser = require('cookie-parser');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');

// get config vars
dotenv.config();
// access config var
process.env.TOKEN_SECRET;

app.use(cors());
app.use(express.json());
app.use(cookieParser());

const users = {
    users_list: [
        { username: 'bj', password: 'pass424', },
        { username: 'user1', password: 'pass1', },
        { username: 'user2', password: 'pass2', },
    ]
};

mongoose.connect('mongodb://localhost:27017', { useNewUrlParser: true, useUnifiedTopology: true });

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
app.get('/users', (req, res) => {
    const name = req.query.name;
    if (name != undefined) {
        let result = getUserByUsername(name);
        result = { users_list: result };
        res.send(result);
    }
    else {
        res.send(users);
    }

});

app.get('/users/:username', (req, res) => {
    const user  = req.params.username;
    let result = getUserByUsername(user);

    if (user) {
        result = {users_list: result};
        res.send(result);
    } else {
        res.status(404).json({ error: 'User not found' });
    }
});


app.get('/', (req, res) => {
    res.send('Hello World!');
});

//USE
//Verify JWT
app.use((req, res, next) => {
    const token = req.cookies.token;
    const myToken = generateToken();

    if (token) {
        jwt.verify(token, myToken, (err, decoded) => {
            if (err) {
                return res.status(401).json({ message: 'Unauthorized' });
            }
            req.userId = decoded.userId;
            next();
        });
    } else {
        next();
    }
});

app.use(authRoutes);

// POST
app.post('/account/login', (req, res) => {
    const { username, password } = req.body;

    const user = users.find((u) => u.username === username && u.password === password);

    if (user) {
        const token = generateToken({ username: req.body.username });
        res.json(token);
        res.cookie('token', token, { httpOnly: true });
    }
    else {
        res.status(401).json({ error: 'Failed login' });
    }
});

app.post('/account/register', (req, res) => {
    const { username, password, confirmPassword } = req.body;

    if (userAlreadyExists(username)) {
        return res.status(400).json({ error: 'User already exists' });
    }
    if (password != confirmPassword) {
        return res.status(400).json({ error: 'Passwords do not match' });
    }
    if (!isPasswordStrong(password)) {
        return res.status(400).json({ error: 'Password does not meet strength requirements' });
    }

    const newUser = {
        username,
        password,
    };

    users.push(newUser);

    res.json({ message: 'User registered successfully' });
});

app.post('/users', (req, res) => {
    const userToAdd = req.body;
    addUser(userToAdd);
    res.status(201).send(userToAdd).end();
});

// Helper functions
const userAlreadyExists = (newUsername) => {
    const usernameExists = users.users_list.some(user => user.username === newUsername);
    return !usernameExists;
};

function isPasswordStrong(password) {
    const passwordRegex = /^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    return passwordRegex.test(password);
}

function generateToken(username) {
    return jwt.sign(username, process.env.TOKEN_SECRET, { expiresIn: '1h' });
}

const getUserByUsername = (name) => {
    return users['users_list'].filter((user) => user['name'] === name);
}

function addUser(user){
    users['users_list'].push(user);
}