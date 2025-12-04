import axios from "axios";

export const registerAction = (userdata) => async (dispatch) => {
  try {
    dispatch({ type: "USER_REGISTER_REQUEST" });

    const config = {
      headers: {
        "Content-type": "application/json",
      },
    };

    const { data, status } = await axios.post(
      `${import.meta.env.VITE_BASE_URL}users/register`,
      userdata,
      config
    );

    if (status === 201 && data.token && data.user) {
      const { password, __v, ...safeUser } = data.user;

      localStorage.setItem("CCUser", JSON.stringify(safeUser));
      localStorage.setItem("CCToken", data.token);

      const expiresIn = data.expiresIn || 24 * 60 * 60;
      const expiryTime = new Date().getTime() + expiresIn * 1000;
      localStorage.setItem("CCTokenExpiry", expiryTime);

      setTimeout(() => {
        localStorage.removeItem("CCUser");
        localStorage.removeItem("CCToken");
        localStorage.removeItem("CCTokenExpiry");
        window.location.href = "/";
      }, expiresIn * 1000);

      dispatch({
        type: "USER_REGISTER_SUCCESSFULL",
        payload: { user: safeUser, token: data.token },
      });

      return { user: safeUser, token: data.token };
    } else {
      throw new Error("Registration failed: Invalid response from the server");
    }
  } catch (error) {
    console.error("Error in register action:", error);
    dispatch({
      type: "USER_REGISTER_FAIL",
      payload: error.response?.data?.message || error.message,
    });
    throw new Error(error);
  }
};
