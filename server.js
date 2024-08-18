require('dotenv').config()
const express = require('express')
const path = require('path')


const passport = require('passport')
const portconf = require('./passport-config')
const session = require('express-session');
const methodOverride = require('method-override');


// Initialize the Express app
const app = express()
const port = 3000

/*****************************************************/
/*                 Parse JSON Files                  */
/*****************************************************/
 
// Middleware setup
app.use(express.json());

// Parse EJS files
app.set('view engine', 'ejs');
app.use(express.urlencoded({ extended: false }));

/*****************************************************/
/*                Route Directory Paths              */
/*****************************************************/

//const ipmRoute = require('./routes/ipm');


/*****************************************************/
/*                    Passport                       */
/*****************************************************/

portconf(passport);

app.use(session({
  secret: process.env.AUTH_TOKEN,
  resave: false,
  saveUninitialized: false,
  cookie: {
    maxAge: 24 * 60 * 60 * 1000 // Session expires after 24 hours of inactivity
  }
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(methodOverride('_method'));


/*****************************************************/
/*                Route Server Paths                 */
/*****************************************************/ 

// Mount the routes
//app.use('/api', ipmRoute);


/*****************************************************/
/*           (Serve) HTML/CSS/JAVASCRIPT             */
/*****************************************************/

// Serve static files from the "public" directory
app.use(express.static(path.join(__dirname, 'public')));

// Render different EJS views based on query parameter
app.get('/', checkAuthenticated, (req, res) => {
  const view = req.query.view || 'home'; // Default to home if no query parameter is provided
  res.render(view, { name: req.user.name });
});

// Login route
app.get('/login', checkNotAuthenticated, (req, res) => {
  const message = req.session.messages ? req.session.messages[0] : null;
  req.session.messages = [];

  // Serve the index.html file from the 'public' directory
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.post('/login', checkNotAuthenticated, passport.authenticate('local', {
  successRedirect: '/',
  failureRedirect: '/login',
  failureFlash: true
}));

// Logout route
app.post('/logout', (req, res) => {
  req.logout((err) => {
    if (err) { return next(err); }
    res.redirect('/login');
  });
});

// Authentication check middleware
function checkAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect('/login');
}

function checkNotAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return res.redirect('/');
  }
  next();
}



// Start the server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
