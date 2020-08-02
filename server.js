const express = require('express'); 
const bcrypt = require('bcrypt-nodejs');
const cors = require('cors');
const knex = require('knex');

//local imports
const register = require('./controllers/register');
const signin = require('./controllers/signin');
const profile = require('./controllers/profile');
const imageCount = require('./controllers/image');

const db = knex({
    client: 'pg',
    connection: {
      host : '127.0.0.1',
      user : 'yossinewmark',
      password : '',
      database : 'smart-brain'
    }
});

const app = express();

app.use(express.json());
app.use(cors())


//website endpoints
app.get('/', (req, res) => {
    res.send('Root Screen')
})

app.post('/signin', (req, res) => {
    signin.handleSignin(req, res, db, bcrypt)
})

app.post('/register', (req, res) => { 
    register.handleRegister(req, res, db, bcrypt)
})

app.get('/profile/:id', (req, res) => {
    profile.handleProfileGet(req, res, db)
});

app.put('/image', (req, res) => {
    imageCount.handleImageCount(req, res, db)
});

app.post('/imageurl', (req, res) => {
    imageCount.handleApiCall(req, res)
});


//port
app.listen(3000, () => {
    console.log('app is running on port 3000')
});

/*
Routes:
 1. '/' -> responds with 'this is working'
 2. '/signin' -> POST => success/fail
    i) even though we're not creating a new user by signin endpoint, we send a POST because any time that we're sending a password, we don't really want to send it as a query string (plain text)
    ii) we wanna send the password inside of the body, ideally in https, so that it is hidden from the "man-in-the-middle-attack" and is thus secure
 3. '/register' -> POST => user object (that gets created in registration)
 4. '/profile/:userId' -> GET => user (homescreen to access the user's profile)
 5. '/image' --> PUT => user object (updated version)
    - works with ranking -> every time user posts a neew photo, we wanna make sure that thier count of how many photos that they've submitted goes up so maybe you have a variable that keeps score by going up by one every time a user submits these photos and then checks against other users to see who has submitted the most, and give them a rank
    - this is a PUT and not a POST because we are updating the rank and not recreating it each time it changes
    - can return an updated user object or perhaps a count of some sort that then gets used to calculate the user's rank
*/ 

