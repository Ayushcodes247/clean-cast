const passport = require("passport");
const FacebookStrategy = require("passport-facebook").Strategy;
const jwt = require("jsonwebtoken");
const { userModel, validateUser } = require("@models/user.model");
const pidGenerator = require("@utils/pidGenerator.util");
const generatePass = require("@utils/fbpassgenerator.util");

passport.use(
  new FacebookStrategy(
    {
      clientID: process.env.APP_ID,
      clientSecret: process.env.APP_SECRET,
      callbackURL: "http://localhost:4000/auth/facebook/callback",
      profileFields: ["id", "displayName", "emails", "birthday", "photos"],
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        let user = await userModel.findOne({
          email: profile.emails?.[0]?.value,
        });

        const genPass = generatePass(12);
        const hashPass = await userModel.hashPassword(genPass);
        const pid = pidGenerator();
        
        if (!user) {
          const userData = {
            username: profile.displayName,
            email: profile.emails?.[0]?.value,
            password: hashPass,
            age: 17,
            gender: "other",
            accountType: "private",
            pid: pid,
            profilePic: "http://localhost:4000/images/avatar.jpg",
          };

          const { error } = await validateUser(userData);

          if (error) {
            console.error("Error while validating user:", error.message);
            return done(error, null);
          }

          user = await userModel.create(userData);

          const token = user.generateAuthToken();

          return done(null,{ user , token });
        };

        const token = user.generateAuthToken();

        return done(null, { user , token });
      } catch (error) {
        console.error("Facebook authentication error:", error.message);
        return done(error, null);
      }
    }
  )
);

passport.serializeUser((user, done) => {
  done(null, user.user?._id || user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await userModel.findById(id);
    done(null, user);
  } catch (error) {
    done(error);
  }
});

module.exports = passport;
