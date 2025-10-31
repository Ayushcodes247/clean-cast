const passport = require("passport");
const FacebookStrategy = require("passport-facebook").Strategy;
const userModel = require("@models/user.model");

passport.use(
  new FacebookStrategy(
    {
      clientID: process.env.FACEBOOK_APPID,
      clientSecret: process.env.FACEBOOK_APPSECRET,
      callbackURL: "http://localhost:4000/auth/facebook/callback",
      profileFields: ["id", "displayName", "emails", "gender", "age_range"],
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        // Safely extract email if available
        const email = profile.emails?.[0]?.value || null;

        // Check if user already exists
        let user = await userModel.findOne({ profileId: profile.id });

        // If user doesn't exist, create a new one
        if (!user) {
          user = await userModel.create({
            profileId: profile.id,
            username: profile.displayName || "Facebook User",
            email: email,
            age: profile._json?.age_range?.min || 16,
            gender: profile.gender || "other",
            accountType: "private",
            password: null,
          });
        }

        // Generate token if available in model
        const token = user.generateAuthToken ? user.generateAuthToken() : null;

        return done(null, { user, token });
      } catch (error) {
        console.error("Error in Facebook Strategy:", error);
        return done(error, null);
      }
    }
  )
);

// Serialize user for session storage
passport.serializeUser((user, done) => {
  done(null, user.user ? user.user.id : user.id);
});

// Deserialize user from session
passport.deserializeUser(async (id, done) => {
  try {
    const user = await userModel.findById(id);
    done(null, user);
  } catch (error) {
    done(error);
  }
});

module.exports = passport;
