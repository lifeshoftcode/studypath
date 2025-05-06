
/**
 * Utility functions for working with pensum data
 */

import { SUBJECT_STATUS } from '../data/models';

/**
 * Check if all prerequisites for a subject are met
 * @param {Object} subject - The subject to check
 * @param {Object} progress - The student's progress
 * @returns {boolean} True if all prerequisites are approved
 */
export const arePrerequisitesMet = (subject, progress) => {
  if (!subject.prerequisites || subject.prerequisites.length === 0) {
    return true;
  }
  
  return subject.prerequisites.every(prereq => progress[prereq] === SUBJECT_STATUS.APPROVED);
};

/**
 * Find available subjects that can be taken based on prerequisites
 * @param {Object} pensum - The pensum object
 * @param {Object} progress - The student's progress
 * @returns {Array} List of subjects that can be taken
 */
export const getAvailableSubjects = (pensum, progress) => {
  if (!pensum || !pensum.terms) return [];
  
  const availableSubjects = [];
  
  pensum.terms.forEach(term => {
    term.subjects.forEach(subject => {
      // If subject is not approved or in progress
      if (progress[subject.code] !== SUBJECT_STATUS.APPROVED && 
          progress[subject.code] !== SUBJECT_STATUS.IN_PROGRESS) {
        
        // Check if prerequisites are met
        if (arePrerequisitesMet(subject, progress)) {
          availableSubjects.push({
            ...subject,
            term: term.number,
            termName: term.name
          });
        }
      }
    });
  });
  
  return availableSubjects;
};

/**
 * Calculate statistics about a student's progress
 * @param {Object} pensum - The pensum object
 * @param {Object} progress - The student's progress
 * @returns {Object} Statistics about progress
 */
export const calculateStats = (pensum, progress) => {
  if (!pensum || !pensum.terms) {
    return {
      approvedCredits: 0,
      totalCredits: 0,
      approvedSubjects: 0,
      totalSubjects: 0,
      progressPercentage: 0
    };
  }
  
  let approvedCredits = 0;
  let totalCredits = 0;
  let approvedSubjects = 0;
  let totalSubjects = 0;
  
  pensum.terms.forEach(term => {
    term.subjects.forEach(subject => {
      totalSubjects++;
      totalCredits += subject.credits || 0;
      
      if (progress[subject.code] === SUBJECT_STATUS.APPROVED) {
        approvedSubjects++;
        approvedCredits += subject.credits || 0;
      }
    });
  });
  
  const progressPercentage = totalCredits > 0 
    ? Math.round((approvedCredits / totalCredits) * 100) 
    : 0;
  
  return {
    approvedCredits,
    totalCredits,
    approvedSubjects,
    totalSubjects,
    progressPercentage
  };
};

/**
 * Calculate term progress percentage
 * @param {Object} term - The term object
 * @param {Object} progress - The student's progress
 * @returns {number} Progress percentage for the term
 */
export const calculateTermProgress = (term, progress) => {
  if (!term || !term.subjects || term.subjects.length === 0) return 0;
  
  const totalSubjects = term.subjects.length;
  let approvedSubjects = 0;
  
  term.subjects.forEach(subject => {
    if (progress[subject.code] === SUBJECT_STATUS.APPROVED) {
      approvedSubjects++;
    }
  });
  
  return Math.round((approvedSubjects / totalSubjects) * 100);
};

/**
 * Convert a pensum from any university format to our standard format
 * This is a placeholder for more complex transformations that might be needed
 * @param {Object} externalData - The external pensum data
 * @returns {Object} Standardized pensum object
 */
export const convertToStandardFormat = (externalData) => {
  // This would implement specific transformations for different university formats
  // For now, we just ensure the basic structure is correct
  
  const standardPensum = {
    career: externalData.career || externalData.program || externalData.name || 'Unknown Program',
    title: externalData.title || externalData.degree || externalData.career || 'Unknown Degree',
    faculty: externalData.faculty || externalData.department || externalData.school || 'Unknown Faculty',
    version: externalData.version || new Date().toISOString().split('T')[0],
    terms: []
  };
  
  // If the external data already has terms, try to use them
  if (Array.isArray(externalData.terms)) {
    standardPensum.terms = externalData.terms.map((term, index) => {
      return {
        number: term.number || index + 1,
        name: term.name || `Term ${index + 1}`,
        subjects: Array.isArray(term.subjects) ? term.subjects.map(subject => ({
          code: subject.code || subject.id || `SUBJ-${Math.random().toString(36).substr(2, 9)}`,
          name: subject.name || subject.title || 'Unknown Subject',
          credits: subject.credits || subject.creditHours || 0,
          prerequisites: Array.isArray(subject.prerequisites) ? subject.prerequisites : [],
          corequisites: Array.isArray(subject.corequisites) ? subject.corequisites : []
        })) : []
      };
    });
  }
  
  return standardPensum;
};

export default {
  arePrerequisitesMet,
  getAvailableSubjects,
  calculateStats,
  calculateTermProgress,
  convertToStandardFormat
};
