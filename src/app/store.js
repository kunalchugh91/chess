import { configureStore } from '@reduxjs/toolkit';
import nextPlayerReducer from '../features/board/nextPlayerSlice';
import boardReducer from '../features/board/boardSlice';

export default configureStore({
  reducer: {
    board: boardReducer,
    nextPlayer: nextPlayerReducer,
  },
});
