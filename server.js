/*****************************************************/
/*               Dynamic Package Manager             */
/*****************************************************/

const { execSync } = require('child_process');
const { clear } = require('console');

// Function to handle installing a missing module
function installModule(moduleName) {
  console.log(`Module "${moduleName}" is missing. Installing...`);
  execSync(`npm install ${moduleName}`, { stdio: 'inherit' });
}

// Function to require a module and install it if it's not found
function include(moduleName) {
  try {
    return require(moduleName);
  } catch (err) {
    if (err.code === 'MODULE_NOT_FOUND') {
      installModule(moduleName);
      return require(moduleName); // Re-require after installation
    } else {
      throw err; // Rethrow if it's another error
    }
  }
}

/*****************************************************/
/*                      Server                       */
/*****************************************************/

include('dotenv').config()
const express = include('express')
const flash = include('express-flash');
const path = include('path')
const pool = include('./db');

const bcrypt = include('bcrypt');
const passport = include('passport')
const portconf = include('./passport-config')
const session = include('express-session');
const methodOverride = include('method-override');


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
  res.sendFile(path.join(__dirname, 'public/login', 'login.html'));
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
