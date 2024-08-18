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

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public/login', 'login.html'));
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
