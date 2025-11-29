module.exports.fbLogic = (req, res) => {
  if (!req.user) {
    return res.status(400).send("Facebook login failed!");
  }

  const { user, token } = req.user;
  const expiresIn = Date.now() + 10 * 24 * 60 * 60 * 1000;

  const encodedUser = encodeURIComponent(JSON.stringify(user));

  console.log("Facebook login successful:", user);

  return res.redirect(
    `http://localhost:4000/public/facebook-callback.html?user=${encodedUser}&token=${token}&expiresIn=${expiresIn}`
  );
};
