const express = require('express');
const mongoose = require('mongoose');
const authRoutes = require('./authRoutes');
const app = express();
const port = 8000;
const cookieParser = require('cookie-parser');
const jwt = require('jsonwebtoken');

const users = [
    { username: 'bj', password: 'pass424', },
    { username: 'user1', password: 'pass1', },
    { username: 'user2', password: 'pass2', },
];

mongoose.connect('mongodb://localhost/CSC424', { useNewUrlParser: true, useUnifiedTopology: true });

app.use(express.json());
app.use(cookieParser());

//Verify JWT
app.use((req, res, next) => {
    const token = req.cookies.token;

    if (token) {
        jwt.verify(token, 'your-secret-key', (err, decoded) => {
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


app.post('/account/login', (req, res) => {
    const { username, password } = req.body;

    const user = users.find((u) => u.username === username && u.password === password);

    if (user) {
        const token = jwt.sign({ username }, generateToken(username), { expiresIn: '1h' });

        res.json({ token });
    }
    else {
        res.status(401).json({ error: 'Failed login' });
    }
});

app.post('/account/register', (req, res) => {
    const { username, password, confirmPassword } = req.body;

    if (!isUsernameUnique(username)) {
        return res.status(400).json({ error: 'Username already exists' });
    }

    if (password !== confirmPassword) {
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

app.get('/users', (req, res) => {
    const allUsers = getAllUsers();
    res.json({ users: allUsers });
});

app.get('/users/:username', (req, res) => {
    const { username } = req.params;
    const user = getUserByUsername(username);

    //chekc password

    if (user) {
        res.json({ user });
    } else {
        res.status(404).json({ error: 'User not found' });
    }
});


app.get('/', (req, res) => {
    res.send('Hello World!');
});

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`);
});

// Helper functions
function isUsernameUnique(username) {
    return !users.some((user) => user.username === username);
}

function isPasswordStrong(password) {
    const passwordRegex = /^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    return passwordRegex.test(password);
}
function generateToken(username) {
    return jwt.sign({ username }, secretKey, { expiresIn: '1h' });
}

function getAllUsers() {
    return users;
}

function getUserByUsername(username) {
    return users.find((user) => user.username === username);
}