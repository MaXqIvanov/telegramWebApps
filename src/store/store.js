import { combineReducers, configureStore } from '@reduxjs/toolkit';
import proodSlice from './proodSlice';


const rootReducer = combineReducers({
  prood: proodSlice,
});

export const store = configureStore({
  reducer: rootReducer,
});