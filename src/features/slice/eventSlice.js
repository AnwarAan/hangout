import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  isSearch: false,
};

export const eventSlice = createSlice({
  name: "event",
  initialState,
  reducers: {
    toggleSearch: (state, action) => {
      if (!state.isSearch) {
        state.searchEvents = [];
      }
      state.isSearch = action.payload;
    },
  },
});

export const { toggleSearch } = eventSlice.actions;
export default eventSlice.reducer;
