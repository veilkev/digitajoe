require('dotenv').config()
const express = require('express')
const session = require('express-session')
const flash = require('connect-flash')
const path = require('path')
const bcrypt = require('bcrypt')
const passport = require('passport')
const portconf = require('./passport-config')
const methodOverride = require('method-override')

// Initialize the Express app
const app = express()
const port =
  process.env.NODE_ENV === 'DEV' ? process.env.DEV_PORT : process.env.LIVE_PORT

/*****************************************************/
/*                 Parse JSON Files                  */
/*****************************************************/

// Middleware setup
app.use(express.json())
app.use(express.urlencoded({ extended: false }))

// Parse EJS files
app.set('view engine', 'ejs')

/*****************************************************/
/*                Route Directory Paths              */
/*****************************************************/

//const ipmRoute = require('./routes/ipm');

/*****************************************************/
/*                    Passport                       */
/*****************************************************/

// Initialize Passport configuration
portconf(passport)

app.use(
  session({
    secret: process.env.AUTH_TOKEN,
    resave: false,
    saveUninitialized: false,
    cookie: {
      maxAge: 24 * 60 * 60 * 1000, // Session expires after 24 hours of inactivity
    },
  })
)

// Initialize connect-flash
app.use(flash())

// Initialize Passport and restore authentication state, if any, from the session
app.use(passport.initialize())
app.use(passport.session())

// Method override for supporting PUT and DELETE in forms
app.use(methodOverride('_method'))

/*****************************************************/
/*           Flash Messages Middleware               */
/*****************************************************/

// Make flash messages available in all views
app.use((req, res, next) => {
  res.locals.success_msg = req.flash('success_msg')
  res.locals.error_msg = req.flash('error_msg')
  res.locals.error = req.flash('error') // Passport's default flash message
  next()
})

/*****************************************************/
/*                Route Server Paths                 */
/*****************************************************/

// Mount the routes
//app.use('/api', ipmRoute);

/*****************************************************/
/*           (Serve) HTML/CSS/JAVASCRIPT             */
/*****************************************************/

// Serve static files from the "public" directory
app.use(express.static(path.join(__dirname, 'public')))

// Render different EJS views based on query parameter
app.get('/', checkAuthenticated, (req, res) => {
  //res.render(view, { name: req.user.name });
  res.sendFile(path.join(__dirname, 'public/home', 'home.html'))
})

// Login route
app.get('/login', checkNotAuthenticated, (req, res) => {
  const message = req.session.messages ? req.session.messages[0] : null
  req.session.messages = []

  // Serve the login.html file from the 'public' directory
  res.sendFile(path.join(__dirname, 'public/login', 'login.html'))
})

app.post(
  '/login',
  checkNotAuthenticated,
  passport.authenticate('local', {
    successRedirect: '/',
    failureRedirect: '/login',
    failureFlash: true,
  })
)

// Logout route
app.post('/logout', (req, res) => {
  req.logout(err => {
    if (err) {
      return next(err)
    }
    res.redirect('/login')
  })
})

// Authentication check middleware
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

// Start the server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`)
})
