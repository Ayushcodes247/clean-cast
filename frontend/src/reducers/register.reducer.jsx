const initialState = {
  user: localStorage.getItem("CCUser")
    ? JSON.parse(localStorage.getItem("CCUser"))
    : null,
  token: localStorage.getItem("CCToken") || null,
  loading: false,
  error: false,
};

export const registerReducer = (state = initialState, action) => {
  switch (action.type) {
    case "USER_REGISTER_REQUEST":
      return { ...state, loading: true, error: null };

    case "USER_REGISTER_SUCCESS":
    case "USER_PROFILE_SUCCESS":
      return {
        ...state,
        loading: false,
        user: action.payload.user,
        token: action.payload.token,
        error: null,
      };

    case "USER_REGISTER_FAIL":
      return { ...state, loading: false, error: action.payload };

    case "USER_LOGOUT":
      localStorage.removeItem("CCUser");
      localStorage.removeItem("CCToken");
      localStorage.removeItem("CCTokenExpiry");
      return { user: null, token: null, loading: false, error: null };

    default:
      return state;
  }
};
