
import { 
  collection,
  doc, 
  addDoc,
  getDoc,
  getDocs,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  serverTimestamp
} from 'firebase/firestore';
import { db } from '../../firebase/config';
import { validatePensum } from '../../data/pensumSchema';
import { validatePrerequisites } from '../../utils/pensumValidation';
import { timestampToISOString } from '../../utils/dateUtils';

const COLLECTION_NAME = 'pensums';

/**
 * Create a new curriculum/pensum in the database
 * @param {Object} pensumData - The pensum data with university-agnostic structure
 * @param {String} userId - The user ID who owns this pensum
 * @returns {Promise<Object>} - The created pensum with its ID
 */
export const createPensum = async (pensumData, userId, userName) => {
  try {
    // Validación completa usando el schema
    const structureValidation = validatePensum(pensumData);
    if (!structureValidation.valid) {
      throw new Error(`Estructura de pensum inválida: ${structureValidation.errors.join(', ')}`);
    }
    
    // La validación de prerrequisitos la convertimos en advertencia
    const prerequisiteValidation = validatePrerequisites(pensumData);
    if (!prerequisiteValidation.valid) {
      console.warn(`Advertencia: Prerrequisitos no estándar: ${prerequisiteValidation.errors.join(', ')}`);
      // Ya no bloqueamos la importación por errores en prerrequisitos
    }

    // Create the document with metadata
    const newPensum = {
      ...pensumData,
      userId,
      userName,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
      isPublic: pensumData.isPublic || false,
      progress: pensumData.progress || {},
      version: pensumData.version || '1.0'
    };

    const docRef = await addDoc(collection(db, COLLECTION_NAME), newPensum);
    
    // Al devolver el nuevo pensum, los timestamps son objetos de Firestore
    // que no se han guardado aún, así que proporcionamos fechas serializables
    const returnData = {
      ...newPensum,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    return {
      id: docRef.id,
      ...returnData
    };
  } catch (error) {
    console.error('Error creating pensum:', error);
    throw error;
  }
};

/**
 * Get a specific pensum by ID
 * @param {String} pensumId - The ID of the pensum to retrieve
 * @returns {Promise<Object|null>} - The pensum data or null if not found
 */
export const getPensumById = async (pensumId) => {
  try {
    const docRef = doc(db, COLLECTION_NAME, pensumId);
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
      // Convert timestamps before returning
      const data = convertTimestamps(docSnap.data());
      return { 
        id: docSnap.id, 
        ...data 
      };
    } else {
      return null;
    }
  } catch (error) {
    console.error('Error getting pensum:', error);
    throw error;
  }
};

/**
 * Update a pensum with new data
 * @param {String} pensumId - The ID of the pensum to update
 * @param {Object} updatedData - The data to update
 * @returns {Promise<void>}
 */
export const updatePensum = async (pensumId, updatedData) => {
  try {
    const docRef = doc(db, COLLECTION_NAME, pensumId);
    
    // Add metadata
    const dataToUpdate = {
      ...updatedData,
      updatedAt: serverTimestamp()
    };
    
    await updateDoc(docRef, dataToUpdate);
  } catch (error) {
    console.error('Error updating pensum:', error);
    throw error;
  }
};

/**
 * Update only the progress field of a pensum
 * @param {String} pensumId - The ID of the pensum
 * @param {Object} progress - The progress data (map of subject codes to status)
 * @returns {Promise<void>}
 */
export const updatePensumProgress = async (pensumId, progress) => {
  try {
    const docRef = doc(db, COLLECTION_NAME, pensumId);
    await updateDoc(docRef, { 
      progress, 
      updatedAt: serverTimestamp() 
    });
  } catch (error) {
    console.error('Error updating pensum progress:', error);
    throw error;
  }
};

/**
 * Delete a pensum by ID
 * @param {String} pensumId - The ID of the pensum to delete
 * @returns {Promise<void>}
 */
export const deletePensum = async (pensumId) => {
  try {
    const docRef = doc(db, COLLECTION_NAME, pensumId);
    await deleteDoc(docRef);
  } catch (error) {
    console.error('Error deleting pensum:', error);
    throw error;
  }
};

/**
 * Get all pensums for a specific user
 * @param {String} userId - The user ID
 * @returns {Promise<Array>} - Array of pensum objects
 */
/**
 * Helper to convert Firestore timestamp to serializable format
 */
const convertTimestamps = (data) => {
  const result = { ...data };
  
  // Convert timestamp fields to ISO strings if they exist
  if (result.createdAt) {
    result.createdAt = timestampToISOString(result.createdAt) || result.createdAt;
  }
  
  if (result.updatedAt) {
    result.updatedAt = timestampToISOString(result.updatedAt) || result.updatedAt;
  }
  
  return result;
};

export const getPensumsByUser = async (userId) => {
  try {
    const q = query(
      collection(db, COLLECTION_NAME),
      where('userId', '==', userId),
      orderBy('updatedAt', 'desc')
    );
    
    const querySnapshot = await getDocs(q);
    const pensums = [];
    
    querySnapshot.forEach((doc) => {
      // Convert timestamps before adding to result
      const data = convertTimestamps(doc.data());
      pensums.push({
        id: doc.id,
        ...data
      });
    });
    
    return pensums;
  } catch (error) {
    console.error('Error getting user pensums:', error);
    throw error;
  }
};

/**
 * Get all public pensums
 * @param {Object} options - Query options like limit
 * @returns {Promise<Array>} - Array of public pensum objects
 */
export const getPublicPensums = async (options = {}) => {
  try {
    const q = query(
      collection(db, COLLECTION_NAME),
      where('isPublic', '==', true),
      orderBy('updatedAt', 'desc')
    );
    
    const querySnapshot = await getDocs(q);
    const pensums = [];
    
    querySnapshot.forEach((doc) => {
      // Convert timestamps before adding to result
      const data = convertTimestamps(doc.data());
      pensums.push({
        id: doc.id,
        ...data
      });
    });
    
    return pensums;
  } catch (error) {
    console.error('Error getting public pensums:', error);
    throw error;
  }
};

/**
 * Search for pensums by career, faculty or title
 * @param {String} searchTerm - The search term
 * @param {Boolean} publicOnly - Whether to search only public pensums
 * @returns {Promise<Array>} - Array of matching pensum objects
 */
export const searchPensums = async (searchTerm, publicOnly = true) => {
  try {
    // Note: This is a simple implementation that gets all documents and filters
    // In a production app, you might want to use Firestore's full-text search capabilities
    // or integrate with a search service like Algolia
    
    let q;
    if (publicOnly) {
      q = query(
        collection(db, COLLECTION_NAME),
        where('isPublic', '==', true)
      );
    } else {
      q = query(collection(db, COLLECTION_NAME));
    }
    
    const querySnapshot = await getDocs(q);
    const searchTermLower = searchTerm.toLowerCase();
    const results = [];
    
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      const matchesSearch = 
        data.career?.toLowerCase().includes(searchTermLower) ||
        data.title?.toLowerCase().includes(searchTermLower) ||
        data.faculty?.toLowerCase().includes(searchTermLower);
      
      if (matchesSearch) {
        // Convert timestamps before adding to results
        const convertedData = convertTimestamps(data);
        results.push({
          id: doc.id,
          ...convertedData
        });
      }
    });
    
    return results;
  } catch (error) {
    console.error('Error searching pensums:', error);
    throw error;
  }
};

export default {
  createPensum,
  getPensumById,
  updatePensum,
  updatePensumProgress,
  deletePensum,
  getPensumsByUser,
  getPublicPensums,
  searchPensums
};
