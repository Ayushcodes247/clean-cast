import axios from "axios";

export const loginUserAction = (userData) => async (dispatch) => {
  try {
    dispatch({ type: "USER_LOGIN_REQUEST" });

    const config = {
      headers: {
        "Content-Type": "application/json",
      },
    };

    const { data, status } = await axios.post(
      `${import.meta.env.VITE_BASE_URL}users/login`,
      userData,
      config
    );

    if (status === 200 && data.user && data.token) {
      const { password, __v, ...safeUser } = data.user;

      localStorage.setItem("CCUser", JSON.stringify(safeUser));
      localStorage.setItem("CCToken", data.token);

      const expiresIn = data.expiresIn || 7 * 24 * 60 * 60 * 1000;
      const expireyTime = new Date().getTime() + expiresIn * 1000;
      localStorage.setItem("CCTokenExpirey", expireyTime);

      setTimeout(() => {
        localStorage.removeItem("CCUser");
        localStorage.removeItem("CCToken");
        localStorage.removeItem("CCTokenExpirey");
        window.location.href = "/";
      }, expiresIn * 1000);

      dispatch({
        type: "USER_LOGIN_SUCCESS",
        payload: {
          user: safeUser,
          token: data.token,
        },
      });

      return {
        user: safeUser,
        token: data.token,
        message: data.message || null,
      };
    }
  } catch (error) {
    dispatch({
      type: "USER_LOGIN_FAIL",
      payload: error.response?.data?.message || error.message,
    });

    throw error;
  }
};
