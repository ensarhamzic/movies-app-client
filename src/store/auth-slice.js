import { createSlice } from "@reduxjs/toolkit"

const initialState = {
  token: null,
  isAuth: false,
  user: {
    id: null,
    firstName: null,
    lastName: null,
    email: null,
  },
}

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    login: (state, action) => {
      state.token = action.payload.token
      state.isAuth = true
      const { id, firstName, lastName, email } = action.payload.user
      state.user = {
        id,
        firstName,
        lastName,
        email,
      }
      localStorage.setItem("token", action.payload.token)
    },
    logout: (state) => {
      state.token = initialState.token
      state.isAuth = initialState.isAuth
      state.user = { ...initialState.user }
      localStorage.removeItem("token")
    },
    changeName: (state, action) => {
      state.user = {
        ...state.user,
        firstName: action.payload.firstName,
        lastName: action.payload.lastName,
      }
    },
  },
})

export const authActions = authSlice.actions
export default authSlice.reducer
