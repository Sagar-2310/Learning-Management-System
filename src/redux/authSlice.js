import { createSlice } from "@reduxjs/toolkit";

const authSlice = createSlice({
    name: "auth",
    initialState: {
        user: null,
    },
    reducers: {
        setUser: (state, action) => {
            state.user = action.payload;
        }
    }
});

// Export actions after definition
export const { setUser } = authSlice.actions; 
export default authSlice.reducer;