const userModel = require("@models/user.model");
const generatePID = require("@utils/pid.util");

module.exports.createUser = async ({
  username,
  email,
  password,
  accountType,
  gender,
  age,
}) => {
  if (!username || !email || !accountType || !age || !gender) {
    throw new Error(
      "Required fields are missing: username, email, accountType, gender, age."
    );
  }

  let hashedPassword = null;
  const pid = generatePID();

  if (password) {
    hashedPassword = await userModel.hashPassword(password);
  }

  const user = await userModel.create({
    profileId: pid,
    username,
    email,
    password: hashedPassword,
    accountType,
    gender,
    age,
  });

  return user;
};
