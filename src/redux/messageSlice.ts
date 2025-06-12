import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface Message {
  type: 'success' | 'error';
  text: string;
}

interface MessageState {
  message: Message | null;
}

const initialState: MessageState = {
  message: null,
};

const messageSlice = createSlice({
  name: 'message',
  initialState,
  reducers: {
    setMessage: (state, action: PayloadAction<Message>) => {
      state.message = action.payload;
    },
    clearMessage: (state) => {
      state.message = null;
    },
  },
});

export const { setMessage, clearMessage } = messageSlice.actions;
export default messageSlice.reducer;