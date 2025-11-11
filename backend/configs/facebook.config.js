const passport = require("passport");
const facebookStrategy = require("passport-facebook").Strategy;
const { userModel, validateUser } = require("@models/user.model");
const pidGenerator = require("@utils/pidGenerator.util");

passport.use(
  new facebookStrategy(
    {
      clientID: process.env.APP_ID,
      clientSecret: process.env.APP_SECRET,
      callbackURL: "http://localhost:4000/auth/facebook/callback",
      profileFields: ["displayName", "emails", "gender", "age_range", "photos"],
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        let user = await userModel.findOne({
          email: profile.emails?.[0]?.value,
        });
        const pid = pidGenerator();
        const username = profile?.displayName;
        const email = profile?.emails?.[0]?.value;
        const password = "";
        const age = profile.ageRange?.max;
        const gender = profile?.gender;
        const accountType = "private";
        const profilePic = profile.photos;

        if (!user) {
          if (
            validateUser({
              username,
              email,
              password,
              accountType,
              age,
              gender,
              profilePic,
              pid,
            })
          ) {
            user = await userModel.create({
              username,
              email,
              password,
              age,
              accountType,
              gender,
              profilePic,
              pid,
            });

            const token = user.generateAuthToken();

          }
        }
      } catch (error) {
        console.error("Error in Facebook Strategy:", error.message);
        return done(error, null);
      }
    }
  )
);
