const LocalStrategy = require('passport-local').Strategy;
const flash = require('connect-flash');
const bcrypt = require('bcrypt');
const createPool = require('./auth');

async function initialize(passport) {
  const pool = await createPool();

  const authenticateUser = async (username, password, done) => {
    const hashedPassword = await bcrypt.hash(password, 10);
    console.log(hashedPassword);
    try {
      const [rows] = await pool.query('SELECT * FROM USERS WHERE username = ?', [username]);
      const user = rows[0];
      if (!user) {
        console.log("No user with name exists");
        return done(null, false, { message: 'No user with that username' });
      }

      const isMatch = await bcrypt.compare(password, user.password);
      if (isMatch) {
        console.log("Successful login");
        return done(null, user);
      } else {
        console.log("Incorrect password");
        return done(null, false, { message: 'Password incorrect' });
      }
    } catch (error) {
      return done(error);
    }
  };

  passport.use(new LocalStrategy({ usernameField: 'username' }, authenticateUser));
  passport.serializeUser((user, done) => done(null, user.partner_id));
  passport.deserializeUser(async (partner_id, done) => {
    try {
      const [rows] = await pool.query('SELECT * FROM USERS WHERE partner_id = ?', [partner_id]);
      const user = rows[0];
      done(null, user);
    } catch (error) {
      done(error);
    }
  });
}

module.exports = initialize;
