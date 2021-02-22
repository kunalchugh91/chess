import { createSlice } from '@reduxjs/toolkit';

const Red = 'Player 1';
const Blue = 'Player 2';
export const Player = Object.freeze({ Red, Blue }); 

export const nextPlayerSlice = createSlice({
    name: 'nextPlayer',
    initialState: { player: Red },
    reducers: {
      changeNextPlayer: state => {
        // Redux Toolkit allows us to write "mutating" logic in reducers. It
        // doesn't actually mutate the state because it uses the Immer library,
        // which detects changes to a "draft state" and produces a brand new
        // immutable state based off those changes
        state.player = (state.player === Red ? Blue : Red);
      },
    },
  });

export const { changeNextPlayer } = nextPlayerSlice.actions;

// The function below is called a selector and allows us to select a value from
// the state. Selectors can also be defined inline where they're used instead of
// in the slice file. For example: `useSelector((state) => state.counter.value)`
export const selectNextPlayer = state => state.nextPlayer;

export default nextPlayerSlice.reducer;