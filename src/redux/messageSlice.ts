// redux/messageSlice.ts
import { createSlice } from '@reduxjs/toolkit';

interface MessageState {
  text: string;
  type: 'success' | 'error' | '';
}

const initialState: MessageState = {
  text: '',
  type: '',
};

const messageSlice = createSlice({
  name: 'message',
  initialState,
  reducers: {
    setMessage(state, action) {
      state.text = action.payload.text;
      state.type = action.payload.type;
    },
    clearMessage(state) {
      state.text = '';
      state.type = '';
    },
  },
});

export const { setMessage, clearMessage } = messageSlice.actions;
export default messageSlice.reducer;
