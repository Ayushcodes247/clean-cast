const initialState = {
  user: localStorage.getItem("CCUser")
    ? JSON.parse(localStorage.getItem("CCUser"))
    : null,
  token: localStorage.getItem("CCToken") || null,
  loading: false,
  error: false,
};

export const loginReducer = (state = initialState, action) => {
  try {
    switch (action.type) {
      case "USER_LOGIN_REQUEST":
        return { ...state, loading: true, error: null };

      case "USER_LOGIN_SUCCESS":
      case "USER_PROFILE_SUCCESS":
        return {
          ...state,
          loading: false,
          user: action.payload.user,
          token: action.payload.token,
          error: null,
        };

      case "USER_LOGIN_FAIL":
        return { ...state, loading: false, error: action.payload };

      case "USER_LOGOUT":
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        localStorage.removeItem("tokenExpiry");
        return { user: null, token: null, loading: false, error: null };

      default:
        return state;
    }
  } catch (err) {
    throw new Error(err);
  }
};
