import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  apiKey: localStorage.getItem('aiApiKey') || '',
  modelSettings: {
    temperature: 0.7,
    maxTokens: 1024,
    model: 'gemini-1.5-flash'
  },
  enabled: true
};

const aiSlice = createSlice({
  name: 'ai',
  initialState,
  reducers: {
    setApiKey: (state, action) => {
      state.apiKey = action.payload;
      localStorage.setItem('aiApiKey', action.payload);
    },
    setModelSettings: (state, action) => {
      state.modelSettings = { ...state.modelSettings, ...action.payload };
    },
    toggleAI: (state) => {
      state.enabled = !state.enabled;
    }
  }
});

export const { setApiKey, setModelSettings, toggleAI } = aiSlice.actions;
export default aiSlice.reducer;