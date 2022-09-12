import { createSlice } from "@reduxjs/toolkit"

const initialState = {
  data: [],
}

const collectionsSlice = createSlice({
  name: "collections",
  initialState,
  reducers: {
    loadCollections: (state, action) => {
      state.data = [...action.payload.collections]
    },
    addCollection: (state, action) => {
      const collection = { ...action.payload.collection, movies: [] }
      state.data.push(collection)
    },
    removeCollection: (state, action) => {
      const collectionIndex = state.data.findIndex(
        (c) => c.id === action.payload.collectionId
      )
      state.data.splice(collectionIndex, 1)
    },
    addRemoveMovie: (state, action) => {
      const collectionId = parseInt(action.payload.collectionId)
      const movieId = parseInt(action.payload.movieId)

      const collectionIndex = state.data.findIndex((c) => c.id === collectionId)
      const movieIndex = state.data[collectionIndex].movies.findIndex(
        (m) => m.id === movieId
      )

      if (movieIndex === -1) {
        state.data[collectionIndex].movies.push({
          id: movieId,
          collectionId,
        })
      } else {
        state.data[collectionIndex].movies.splice(movieIndex, 1)
      }
    },
  },
})

export const collectionsActions = collectionsSlice.actions
export default collectionsSlice.reducer
