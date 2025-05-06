
/**
 * Models for University curriculum system
 * This file defines interfaces for the main data structures used in the application
 */

/**
 * @typedef {Object} Subject - A course or subject in a curriculum
 * @property {string} code - Unique identifier/code for the subject
 * @property {string} name - Name of the subject
 * @property {number} credits - Credit hours for the subject
 * @property {number} [theoryHours] - Optional theoretical hours per week
 * @property {number} [practiceHours] - Optional practical hours per week
 * @property {number} [labHours] - Optional laboratory hours per week
 * @property {string[]} [prerequisites] - Optional array of subject codes that are prerequisites
 * @property {string[]} [corequisites] - Optional array of subject codes that are corequisites
 * @property {string} [description] - Optional description of the subject
 * @property {string} [type] - Optional type classification (Core, Elective, etc.)
 */

/**
 * @typedef {Object} Term - A term or semester in a curriculum
 * @property {number} number - Term number or sequence
 * @property {string} name - Name of the term (e.g., "First Semester")
 * @property {string} [description] - Optional description
 * @property {Subject[]} subjects - Array of subjects in this term
 * @property {number} [credits] - Optional total credits for the term
 */

/**
 * @typedef {Object} Pensum - A complete curriculum or study plan
 * @property {string} id - Unique identifier (set by Firestore)
 * @property {string} career - Name of the career or program
 * @property {string} title - Official title granted
 * @property {string} faculty - Faculty or school offering the program
 * @property {string} [version] - Optional version identifier
 * @property {string} [description] - Optional description of the program
 * @property {string} [university] - Optional university name
 * @property {Term[]} terms - Array of terms in the curriculum
 * @property {Object} [progress] - Map of subject codes to status ('approved', 'inProgress', 'pending', 'failed')
 * @property {boolean} [isPublic] - Whether this pensum is public
 * @property {string} userId - ID of the user who created it
 * @property {string} userName - Name of the user who created it
 * @property {Date|string} createdAt - Creation timestamp
 * @property {Date|string} updatedAt - Last update timestamp
 */

/**
 * @typedef {Object} UserProgress
 * @property {string} subjectCode - Subject code
 * @property {'approved' | 'inProgress' | 'pending' | 'failed'} status - Status of the subject
 * @property {number} [grade] - Optional numerical grade
 * @property {string} [term] - Optional term when it was taken
 * @property {Date} [completionDate] - Optional date when it was completed
 */

/**
 * Available subject statuses
 */
export const SUBJECT_STATUS = {
  APPROVED: 'approved',
  IN_PROGRESS: 'inProgress',
  PENDING: 'pending',
  FAILED: 'failed'
};

/**
 * Generate an empty subject structure
 * @returns {Object} Empty subject model
 */
export const createEmptySubject = () => ({
  code: '',
  name: '',
  credits: 0,
  prerequisites: [],
  corequisites: []
});

/**
 * Generate an empty term structure
 * @param {number} termNumber - The term sequence number
 * @returns {Object} Empty term model
 */
export const createEmptyTerm = (termNumber = 1) => ({
  number: termNumber,
  name: `Term ${termNumber}`,
  subjects: []
});

/**
 * Generate default progress object based on a pensum's subjects
 * @param {Object} pensum - The pensum object
 * @returns {Object} Progress object with all subjects set to 'pending'
 */
export const generateDefaultProgress = (pensum) => {
  if (!pensum || !pensum.terms) return {};
  
  const progress = {};
  
  pensum.terms.forEach(term => {
    term.subjects.forEach(subject => {
      progress[subject.code] = SUBJECT_STATUS.PENDING;
    });
  });
  
  return progress;
};

export default {
  SUBJECT_STATUS,
  createEmptySubject,
  createEmptyTerm,
  generateDefaultProgress
};
