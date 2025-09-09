import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import BASE_URL from '../../pages/config/config';

// ✅ Async thunk to fetch user data by ID
export const fetchUserData = createAsyncThunk(
  'userData/fetchUserData',
  async (userId, thunkAPI) => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(`${BASE_URL}api/user/userdata/${userId}`,{
          headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      
      // Check for .data structure if API returns { success, data }
      if (response?.data?.success && response?.data?.data) {
        return response.data.data;
      }

      // Else assume it directly returns user data
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || 'Failed to fetch user data'
      );
    }
  }
);

// ✅ Slice
const userDataSlice = createSlice({
  name: 'userData',
  initialState: {
    userData: null,
    loading: false,
    error: null,
    success: false,
  },
  reducers: {
    resetUserDataState: (state) => {
      state.loading = false;
      state.error = null;
      state.success = false;
      state.userData = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchUserData.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(fetchUserData.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.userData = action.payload;
      })
      .addCase(fetchUserData.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.success = false;
      });
  },
});

export const { resetUserDataState } = userDataSlice.actions;
export default userDataSlice.reducer;




// import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
// import axios from 'axios';
// import BASE_URL from '../../pages/config/config';

// // Async thunk to fetch user data by ID
// export const fetchUserData = createAsyncThunk(
//   'users/fetchUserData',
//   async (userId, thunkAPI) => {
//     try {
//       const res = await axios.get(`${BASE_URL}api/user/userdata/${userId}`);
//       return res.data;
//     } catch (error) {
//       return thunkAPI.rejectWithValue(error.response?.data?.message || 'Failed to fetch user data');
//     }
//   }
// );

// const userDataSlice = createSlice({
//   name: 'userData',
//   initialState: {
//     userData: null,
//     loading: false,
//     error: null,
//     success: false,
//   },
//   reducers: {
//     resetUserDataState: (state) => {
//       state.loading = false;
//       state.error = null;
//       state.success = false;
//       state.userData = null;
//     }
//   },
//   extraReducers: (builder) => {
//     builder
//       .addCase(fetchUserData.pending, (state) => {
//         state.loading = true;
//         state.error = null;
//       })
//       .addCase(fetchUserData.fulfilled, (state, action) => {
//         state.loading = false;
//         state.success = true;
//         state.userData = action.payload;
//       })
//       .addCase(fetchUserData.rejected, (state, action) => {
//         state.loading = false;
//         state.error = action.payload || 'Failed to fetch user data';
//       });
//   }
// });

// export const { resetUserDataState } = userDataSlice.actions;
// export default userDataSlice.reducer;
