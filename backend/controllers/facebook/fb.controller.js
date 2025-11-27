module.exports.fbLogic = (req, res) => {
  const { user, token } = req.user;

  // set cookie
  res.cookie("auth_token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    maxAge: 7 * 24 * 60 * 60 * 1000,
    sameSite: "lax",
  });

  // instead of sending JSON directly in popup
  // redirect popup to React so it can read cookie + send postMessage
  const FRONTEND_REDIRECT = "http://localhost:5173/oauth/facebook/callback";

  return res.redirect(
    `${FRONTEND_REDIRECT}?user=${encodeURIComponent(
      JSON.stringify(user)
    )}&token=${token}&expiry=${7 * 24 * 60 * 60 * 1000}`
  );
};
