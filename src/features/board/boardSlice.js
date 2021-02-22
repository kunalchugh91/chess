import { createSlice } from '@reduxjs/toolkit';
import initialBoard from './initialBoard';

export const boardSlice = createSlice({
    name: 'board',
    initialState: initialBoard(),
    reducers: {
      addPiece: (state, action) => {
        // Redux Toolkit allows us to write "mutating" logic in reducers. It
        // doesn't actually mutate the state because it uses the Immer library,
        // which detects changes to a "draft state" and produces a brand new
        // immutable state based off those changes
        state[action.payload.position].piece = action.payload.piece;
        state[action.payload.position].color = action.payload.color;
      },
      removePiece: (state, action) => {
        delete state[action.payload.position].piece;
        delete state[action.payload.position].color;
      },
      wrongMove: (state, action) => console.log(action.payload.message),
    },
  });

export const { addPiece, removePiece, wrongMove } = boardSlice.actions;

// The function below is called a selector and allows us to select a value from
// the state. Selectors can also be defined inline where they're used instead of
// in the slice file. For example: `useSelector((state) => state.counter.value)`
export const selectBoard = state => state.board;

export default boardSlice.reducer;