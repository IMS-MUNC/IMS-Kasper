import { configureStore } from '@reduxjs/toolkit';
import userDataReducer from './userDataSlice';

const store = configureStore({
  reducer: {
    userData: userDataReducer,
  },
});

export default store;


// import { configureStore } from '@reduxjs/toolkit';
// import userReducer from '../userSlice';

// export const store = configureStore({
//   reducer: {
//     users: userReducer,
//   },
// });
