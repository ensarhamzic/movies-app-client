import { configureStore, combineReducers } from "@reduxjs/toolkit"
import authReducer from "./auth-slice"
import collectionsReducer from "./collections-slice"
import favoritesReducer from "./favorites-slice"
import genresReducer from "./genres-slice"

const combinedReducer = combineReducers({
  auth: authReducer,
  collections: collectionsReducer,
  favorites: favoritesReducer,
  genres: genresReducer,
})

const rootReducer = (state, action) => {
  if (action.type === "RESET") {
    localStorage.removeItem("token")
    state = undefined
  }

  return combinedReducer(state, action)
}

const store = configureStore({
  reducer: rootReducer,
})

export default store
