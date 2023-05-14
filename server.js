if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}

const express = require('express')
const MongoClient = require('mongodb').MongoClient;
const app = express()
const bcrypt = require('bcrypt')
const passport = require('passport')
const flash = require('express-flash')
const session = require('express-session')
const methodOverride = require('method-override')
const path =require ('path');


// Connection URL
const url = 'mongodb+srv://dhirajjohare1497:12345@cluster0.l2hblfd.mongodb.net/?retryWrites=true&w=majority';

// Database Name
const dbName = 'xenon';

// Create a new MongoClient
const client = new MongoClient(url, { useUnifiedTopology: true });

// Connect to the MongoDB server
client.connect((err) => {
  if (err) {
    console.error('Failed to connect to the database:', err);
    return;
  }

  console.log('Connected successfully to the database');

  const db = client.db(dbName);
  console.log(db)

  // Start your Express server or perform any further database-related operations here
});



const initializePassport = require('./passport-config')
initializePassport(
  passport,
  email => users.find(user => user.email === email),
  id => users.find(user => user.id === id)
)

const users = []

app.set('view-engine', 'ejs')
app.use(express.static(path.join(__dirname,'views')));
app.use(express.urlencoded({ extended: false }))
app.use(flash())
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false
}))
app.use(passport.initialize())
app.use(passport.session())
app.use(methodOverride('_method'))

app.get('/', checkAuthenticated, (req, res) => {
  res.render('index.ejs', { name: req.user.name })
})

app.get('/login', checkNotAuthenticated, (req, res) => {
  res.render('login.ejs')
})

app.get('/contactus',(req,res) =>{
  res.render('contactus.ejs')
})

app.post('/login', checkNotAuthenticated, passport.authenticate('local', {
  successRedirect: '/',
  failureRedirect: '/login',
  failureFlash: true
}))

app.get('/register', checkNotAuthenticated, (req, res) => {
  res.render('register.ejs')
})

app.post('/register', checkNotAuthenticated, async (req, res) => {
  try {
    const hashedPassword = await bcrypt.hash(req.body.password, 10)
    users.push({
      id: Date.now().toString(),
      name: req.body.name,
      email: req.body.email,
      password: hashedPassword
    })
    res.redirect('/login')
  } catch {
    res.redirect('/register')
  }
})

app.delete('/logout', (req, res) => {
  req.logOut()
  res.redirect('/login')
})

app.post('/contactUs', (req, res) => {
  res.send('Got a POST request')
})

function checkAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return next()
  }

  res.redirect('/login')
}

function checkNotAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return res.redirect('/')
  }
  next()
}

app.listen(3000)