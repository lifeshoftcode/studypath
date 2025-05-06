/**
 * Validates that all prerequisite courses exist within the pensum
 * @param {Object} pensum - The pensum object to validate
 * @returns {Object} - Validation result with valid flag and errors array
 */
export const validatePrerequisites = (pensum) => {
  const errors = [];
  const allCodes = new Set();
  
  // Collect all subject codes first
  pensum.terms.forEach(term => {
    term.subjects.forEach(subject => {
      allCodes.add(subject.code);
    });
  });

  // Add elective subjects if they exist
  if (pensum.electives && Array.isArray(pensum.electives)) {
    pensum.electives.forEach(subject => {
      allCodes.add(subject.code);
    });
  }
  
  // Check prerequisites
  pensum.terms.forEach(term => {
    term.subjects.forEach(subject => {
      if (subject.prerequisites && subject.prerequisites.length > 0) {
        subject.prerequisites.forEach(prereqCode => {
          // Skip validation for special prerequisites like "Aprobar todas las asignaturas..."
          if (typeof prereqCode === 'string' && !allCodes.has(prereqCode) && 
              !prereqCode.startsWith("Aprobar") && 
              !prereqCode.includes("cuatrimestre")) {
            errors.push(`Prerequisite "${prereqCode}" for subject "${subject.code}" does not exist in the pensum`);
          }
        });
      }
      
      if (subject.corequisites && subject.corequisites.length > 0) {
        subject.corequisites.forEach(coreqCode => {
          // Skip validation for special corequisites
          if (typeof coreqCode === 'string' && !allCodes.has(coreqCode) && 
              !coreqCode.startsWith("Aprobar") && 
              !coreqCode.includes("cuatrimestre")) {
            errors.push(`Corequisite "${coreqCode}" for subject "${subject.code}" does not exist in the pensum`);
          }
        });
      }
    });
  });
  
  return {
    valid: errors.length === 0,
    errors
  };
};
