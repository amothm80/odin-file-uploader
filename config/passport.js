import passport from "passport";
import passportlocal from "passport-local";
import { validatePassword } from "../lib/passwordUtils.js";
import { getUserById,getUserByEmailForAuth } from "../model/user.js";

const LocalStrategy = passportlocal.Strategy;

//set custom username & password field names
const customFields = {
  usernameField: 'email',
  passwordField: 'password'
};


const verifyCallback = async (username, password, done) => {
  try {
    // const { rows } = await pool.query(
    //   "SELECT * FROM users WHERE username = $1",
    //   [username]
    // );
    // const user = rows[0];
    // const user = await prisma.User.
    console.log(username)
    const user = await getUserByEmailForAuth(username)
    if (!user) {
      return done(null, false, { message: "incorrect username" });
    }
    // const match = await bcrypt.compare(password, user.password);
    console.log(user)
    const isValid = validatePassword(password, user.hash, user.salt);
    if (!isValid) {
      return done(null, false, { message: "incorrect password" });
    }
    return done(null, user);
  } catch (err) {
    return done(err);
  }
};

const strategy = new LocalStrategy(customFields,verifyCallback);

passport.use(strategy);

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await getUserById(id)
    // const { rows } = await pool.query("select * from users where id = $1", [
    //   id,
    // ]);
    // const user = rows[0];
    done(null,user);
  } catch (error) {
    done(error);
  }
});
