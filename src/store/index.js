import { configureStore } from "@reduxjs/toolkit"
import authReducer from "./auth-slice"
import collectionsReducer from "./collections-slice"
import favoritesReducer from "./favorites-slice"
import genresReducer from "./genres-slice"

const store = configureStore({
  reducer: {
    auth: authReducer,
    collections: collectionsReducer,
    favorites: favoritesReducer,
    genres: genresReducer,
  },
})

export default store
