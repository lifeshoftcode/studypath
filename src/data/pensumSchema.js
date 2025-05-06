
/**
 * Standard Schema for University Curriculum/Pensum
 * This schema is flexible and can accommodate various university structures
 */

/**
 * Example of a minimal valid pensum structure
 */
export const exampleMinimalPensum = {
  career: "Computer Science",
  title: "Bachelor of Science in Computer Science",
  faculty: "Engineering and Computer Science",
  terms: [
    {
      number: 1,
      name: "First Term",
      subjects: [
        {
          code: "CS101",
          name: "Introduction to Programming",
          credits: 3,
          prerequisites: []
        }
      ]
    }
  ]
};

/**
 * Example of a comprehensive pensum structure with all possible fields
 */
export const exampleFullPensum = {
  // Basic Information (Required)
  career: "Computer Science",
  title: "Bachelor of Science in Computer Science",
  faculty: "Engineering and Computer Science",
  version: "2023-A",
  
  // Additional Information (Optional)
  description: "This program prepares students for careers in software development and computer systems.",
  totalCredits: 120,
  degreeType: "Bachelor", // Diploma, Certificate, Associate, Bachelor, Master, Doctorate
  university: "Example University",
  department: "Computer Science Department",
  programCoordinator: "Dr. Jane Smith",
  
  // Academic Structure (Required)
  terms: [
    {
      number: 1,
      name: "First Term",
      description: "Foundation courses introducing core concepts.",
      credits: 15, // Total credits for the term
      
      // Subjects in this term
      subjects: [
        {
          // Basic Subject Information (Required)
          code: "CS101",
          name: "Introduction to Programming",
          credits: 3,
          
          // Course Hours (Optional)
          theoryHours: 2,
          practiceHours: 2,
          labHours: 0,
          totalHours: 4,
          
          // Academic Requirements (Optional)
          prerequisites: [], // Array of course codes
          corequisites: [], // Array of course codes
          
          // Additional Course Information (Optional)
          description: "An introduction to programming concepts using Python.",
          objectives: ["Understand basic programming concepts", "Write simple programs"],
          topics: ["Variables", "Control structures", "Functions"],
          evaluationMethod: "Assignments (40%), Midterm (25%), Final Exam (35%)",
          
          // Classification (Optional)
          type: "Core", // Core, Elective, General Education, etc.
          area: "Programming Fundamentals",
        }
      ]
    }
  ],
  
  // Graduation Requirements (Optional)
  requirements: {
    minimumGPA: 2.0,
    requiredProjects: ["Capstone Project"],
    internshipHours: 120,
    otherRequirements: ["120 community service hours", "English proficiency"]
  },
  
  // Custom Fields (Optional - for university-specific information)
  customFields: {
    accreditation: "Accredited by Example Accreditation Board",
    specialTracks: ["AI", "Cybersecurity", "Data Science"]
  }
};

/**
 * Creates a new empty pensum structure with required fields
 * @param {Object} basicInfo - Basic required information
 * @returns {Object} - Empty pensum structure
 */
export const createEmptyPensum = (basicInfo) => {
  const { career, title, faculty } = basicInfo;
  
  if (!career || !title || !faculty) {
    throw new Error("Career, title, and faculty are required fields");
  }
  
  return {
    career,
    title,
    faculty,
    version: new Date().toISOString().split('T')[0],
    terms: []
  };
};

/**
 * Validates a pensum structure against the required schema
 * @param {Object} pensum - The pensum to validate
 * @returns {Object} - Validation result { valid: boolean, errors: string[] }
 */
export const validatePensum = (pensum) => {
  const errors = [];
  
  // Check required top-level fields
  ['career', 'title', 'faculty', 'terms'].forEach(field => {
    if (!pensum[field]) {
      errors.push(`Missing required field: ${field}`);
    }
  });
  
  // Check electives structure if it exists
  if (pensum.electives) {
    if (!Array.isArray(pensum.electives)) {
      errors.push('Electives must be an array');
    }
    // No need to validate further, as this is optional
  }
  
  // Check terms structure if it exists
  if (pensum.terms) {
    if (!Array.isArray(pensum.terms)) {
      errors.push('Terms must be an array');
    } else {
      // Check each term
      pensum.terms.forEach((term, termIndex) => {
        if (!term.number) {
          errors.push(`Term at index ${termIndex} is missing a number`);
        }
        if (!term.name) {
          errors.push(`Term at index ${termIndex} is missing a name`);
        }
        if (!term.subjects || !Array.isArray(term.subjects)) {
          errors.push(`Term ${term.number || termIndex} is missing subjects array`);
        } else {
          // Check each subject
          term.subjects.forEach((subject, subjectIndex) => {
            if (!subject.code) {
              errors.push(`Subject at index ${subjectIndex} in term ${term.number || termIndex} is missing a code`);
            }
            if (!subject.name) {
              errors.push(`Subject at index ${subjectIndex} in term ${term.number || termIndex} is missing a name`);
            }
            if (subject.credits === undefined) {
              errors.push(`Subject ${subject.code || ''} in term ${term.number || termIndex} is missing credits`);
            }
            
            // Check prerequisites and corequisites are arrays if they exist
            if (subject.prerequisites && !Array.isArray(subject.prerequisites)) {
              errors.push(`Prerequisites for subject ${subject.code} must be an array`);
            }
            if (subject.corequisites && !Array.isArray(subject.corequisites)) {
              errors.push(`Corequisites for subject ${subject.code} must be an array`);
            }
          });
        }
      });
    }
  }
  
  return {
    valid: errors.length === 0,
    errors
  };
};

/**
 * Creates a subject template with all possible fields
 * @returns {Object} - Subject template
 */
export const createSubjectTemplate = () => {
  return {
    code: "",
    name: "",
    credits: 0,
    theoryHours: 0,
    practiceHours: 0,
    labHours: 0,
    prerequisites: [],
    corequisites: [],
    description: "",
    type: "Core"
  };
};

/**
 * Creates a term template with all possible fields
 * @param {Number} termNumber - The term number
 * @returns {Object} - Term template
 */
export const createTermTemplate = (termNumber) => {
  return {
    number: termNumber,
    name: `Term ${termNumber}`,
    description: "",
    subjects: []
  };
};

export default {
  createEmptyPensum,
  validatePensum,
  createSubjectTemplate,
  createTermTemplate,
  exampleMinimalPensum,
  exampleFullPensum
};
