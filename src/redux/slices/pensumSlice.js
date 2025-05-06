import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import pensumService from '../../services/pensum/pensumService';
import { validatePensum } from '../../data/pensumSchema';

// Action to create a new pensum
export const createPensum = createAsyncThunk(
  'pensum/create',
  async (pensumData, { rejectWithValue, getState }) => {
    try {
      // Validate pensum structure
      const validation = validatePensum(pensumData);
      if (!validation.valid) {
        return rejectWithValue(`Invalid pensum structure: ${validation.errors.join(', ')}`);
      }

      const { auth } = getState();
      const result = await pensumService.createPensum(
        pensumData, 
        auth.user.uid, 
        auth.user.displayName
      );
      return result;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Action to get all pensums for the current user
export const getUserPensums = createAsyncThunk(
  'pensum/getUserPensums',
  async (_, { rejectWithValue, getState }) => {
    try {
      const { auth } = getState();
      const pensums = await pensumService.getPensumsByUser(auth.user.uid);
      return pensums;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Action to search public pensums
export const searchPublicPensums = createAsyncThunk(
  'pensum/searchPublic',
  async (searchTerm, { rejectWithValue }) => {
    try {
      const results = await pensumService.searchPensums(searchTerm, true);
      return results;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Action to get a specific pensum by ID
export const getPensumById = createAsyncThunk(
  'pensum/getById',
  async (pensumId, { rejectWithValue }) => {
    try {
      const pensum = await pensumService.getPensumById(pensumId);
      if (!pensum) {
        return rejectWithValue('El pensum solicitado no existe');
      }
      return pensum;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Action to update a pensum's progress
export const updatePensumProgress = createAsyncThunk(
  'pensum/updateProgress',
  async ({ pensumId, progress }, { rejectWithValue }) => {
    try {
      await pensumService.updatePensumProgress(pensumId, progress);
      
      // Get the updated pensum data with the new progress
      const updated = await pensumService.getPensumById(pensumId);
      return updated;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Action to update a pensum
export const updatePensum = createAsyncThunk(
  'pensum/update',
  async ({ pensumId, updatedData }, { rejectWithValue }) => {
    try {
      // Validate pensum structure
      const validation = validatePensum(updatedData);
      if (!validation.valid) {
        return rejectWithValue(`Invalid pensum structure: ${validation.errors.join(', ')}`);
      }
      
      await pensumService.updatePensum(pensumId, updatedData);
      
      // Get the updated pensum data
      const updated = await pensumService.getPensumById(pensumId);
      return updated;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Action to delete a pensum
export const deletePensum = createAsyncThunk(
  'pensum/delete',
  async (pensumId, { rejectWithValue }) => {
    try {
      await pensumService.deletePensum(pensumId);
      return pensumId;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);



const initialState = {
  currentPensum: null,
  userPensums: [],
  publicPensums: [],
  isLoading: false,
  error: null,
};

const pensumSlice = createSlice({
  name: 'pensum',
  initialState,
  reducers: {
    resetPensumState: (state) => {
      state.currentPensum = null;
      state.error = null;
    },
    setCurrentPensum: (state, action) => {
      state.currentPensum = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      // Crear pensum
      .addCase(createPensum.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(createPensum.fulfilled, (state, action) => {
        state.isLoading = false;
        state.userPensums.push(action.payload);
        state.currentPensum = action.payload;
      })
      .addCase(createPensum.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      // Obtener pensums del usuario
      .addCase(getUserPensums.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getUserPensums.fulfilled, (state, action) => {
        state.isLoading = false;
        state.userPensums = action.payload;
      })
      .addCase(getUserPensums.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      // Buscar pensums públicos
      .addCase(searchPublicPensums.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(searchPublicPensums.fulfilled, (state, action) => {
        state.isLoading = false;
        state.publicPensums = action.payload;
      })
      .addCase(searchPublicPensums.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      // Obtener pensum por ID
      .addCase(getPensumById.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getPensumById.fulfilled, (state, action) => {
        state.isLoading = false;
        state.currentPensum = action.payload;
      })
      .addCase(getPensumById.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      // Actualizar progreso de pensum
      .addCase(updatePensumProgress.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(updatePensumProgress.fulfilled, (state, action) => {
        state.isLoading = false;
        if (state.currentPensum?.id === action.payload.pensumId) {
          state.currentPensum.progress = action.payload.progress;
        }
        const index = state.userPensums.findIndex(p => p.id === action.payload.pensumId);
        if (index !== -1) {
          state.userPensums[index].progress = action.payload.progress;
        }
      })
      .addCase(updatePensumProgress.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      // Actualizar pensum completo
      .addCase(updatePensum.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(updatePensum.fulfilled, (state, action) => {
        state.isLoading = false;
        state.currentPensum = action.payload;
        
        // Actualiza el elemento en el array de pensums del usuario
        const index = state.userPensums.findIndex(p => p.id === action.payload.id);
        if (index !== -1) {
          state.userPensums[index] = action.payload;
        }
      })
      .addCase(updatePensum.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      // Eliminar pensum
      .addCase(deletePensum.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(deletePensum.fulfilled, (state, action) => {
        state.isLoading = false;
        state.userPensums = state.userPensums.filter(p => p.id !== action.payload);
        if (state.currentPensum?.id === action.payload) {
          state.currentPensum = null;
        }
      })
      .addCase(deletePensum.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });
  },
});

export const { resetPensumState, setCurrentPensum } = pensumSlice.actions;

export default pensumSlice.reducer;