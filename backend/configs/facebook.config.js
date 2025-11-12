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
      profileFields: [
        "id",
        "displayName",
        "emails",
        "birthday",
        "photos",
      ],
    },
    async (accessToken, refreshToken, profile, done) => {
      try {

        console.log("Profile:", Number(profile.birthday));

        const email =
          profile.emails?.[0]?.value || `${profile.id}@facebook.com`;
        const username = profile.displayName || "Facebook User";
        const age = profile.ageRange?.max;

        let gender = profile.gender?.toLowerCase();
        if (!["male", "female", "other"].includes(gender)) gender = "other";      
        const accountType = "private";
        const profilePic = profile.photos?.[0]?.value || null;

        // generate alphanumeric pid
        const pid = pidGenerator().replace(/[^a-zA-Z0-9]/g, "");

        let user = await userModel.findOne({ email });

        if (!user) {
          console.log(age);
          const plainPass = generatePass(16);
          const hashedPassword = await userModel.hashPassword(plainPass);

          const newUserData = {
            username,
            email,
            password : hashedPassword,
            age : Number(age),
            gender,
            accountType,
            profilePic,
            pid,
          };

          const { error } = validateUser(newUserData);
          if (error) {
            console.error("Validation failed:", error.details[0].message);
            return done(error, null);
          }

          user = await userModel.create(newUserData);
        }

        const token =
          typeof user.generateAuthToken === "function"
            ? user.generateAuthToken()
            : jwt.sign(
                { id: user._id, email: user.email, pid: user.pid },
                process.env.JWT_SECRET,
                { expiresIn: "7d" }
              );

        return done(null, { user, token });
      } catch (error) {
        console.error("Error in Facebook Strategy:", error.message);
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
