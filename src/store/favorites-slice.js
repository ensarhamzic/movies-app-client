import { createSlice } from "@reduxjs/toolkit"

const initialState = {
  data: [],
}

const favoritesSlice = createSlice({
  name: "favorites",
  initialState,
  reducers: {
    loadFavorites: (state, action) => {
      state.data = [...action.payload.favorites]
    },
    addRemoveFavorite: (state, action) => {
      const movieId = parseInt(action.payload.movieId)

      const movieIndex = state.data.findIndex((f) => f.id === movieId)

      if (movieIndex === -1) {
        state.data.push({
          id: movieId,
        })
      } else {
        state.data.splice(movieIndex, 1)
      }
    },
  },
})

export const favoritesActions = favoritesSlice.actions
export default favoritesSlice.reducer
