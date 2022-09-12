import { configureStore } from "@reduxjs/toolkit"
import authReducer from "./auth-slice"
import collectionsReducer from "./collections-slice"
import favoritesReducer from "./favorites-slice"

const store = configureStore({
  reducer: {
    auth: authReducer,
    collections: collectionsReducer,
    favorites: favoritesReducer,
  },
})

export default store
