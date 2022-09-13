import { createSlice } from "@reduxjs/toolkit"

const initialState = {
  data: [],
}

const genresSlice = createSlice({
  name: "genres",
  initialState,
  reducers: {
    loadGenres: (state, action) => {
      state.data = [...action.payload.genres]
    },
  },
})

export const genresActions = genresSlice.actions
export default genresSlice.reducer
