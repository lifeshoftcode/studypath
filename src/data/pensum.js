/**
 * Example curriculum data
 * This is just sample data used for demonstration and development purposes
 * It follows the structure defined in models.js and pensumSchema.js
 */

export const curriculum = {
  career: "SISTEMAS COMPUTACIONALES",
  title: "INGENIERIA EN SISTEMAS COMPUTACIONALES",
  version: "12023",
  faculty: "ARQUITECTURA E INGENIERIA",
  university: "Universidad Ejemplo",
  terms: [
    {
      number: 1,
      name: "Primer Cuatrimestre",
      subjects: [
        { code: "ESP-181", name: "LENGUA ESPAÑOLA I", credits: 4, theoryHours: 4, practiceHours: 0, prerequisites: [] },
        { code: "INF-117", name: "ALGORITMOS COMPUTACIONALES", credits: 4, theoryHours: 2, practiceHours: 4, prerequisites: [] },
        { code: "ING-105", name: "INGLES I", credits: 0, theoryHours: 4, practiceHours: 0, prerequisites: [] },
        { code: "MAT-115", name: "MATEMATICA DISCRETA", credits: 4, theoryHours: 4, practiceHours: 0, prerequisites: [] },
        { code: "MAT-160", name: "PRE-CALCULO", credits: 4, theoryHours: 4, practiceHours: 0, prerequisites: [] },
        { code: "MED-750", name: "QUIMICA INORGANICA I", credits: 3, theoryHours: 3, practiceHours: 0, prerequisites: [] },
        { code: "MED-755", name: "LAB. QUIM. INORGAN. I", credits: 1, theoryHours: 0, practiceHours: 2, prerequisites: [] },
        { code: "ORI-112", name: "ORIENTACION UNIVERSITARIA", credits: 2, theoryHours: 2, practiceHours: 0, prerequisites: [] },
        { code: "SOC-182", name: "REFLEXION FILOSOFICA", credits: 3, theoryHours: 3, practiceHours: 0, prerequisites: [] }
      ]
    },
    {
      number: 2,
      name: "Segundo Cuatrimestre",
      subjects: [
        { code: "ESP-189", name: "LENGUA ESPAÑOLA II", credits: 4, theoryHours: 4, practiceHours: 0, prerequisites: ["ESP181"] },
        { code: "INF-164", name: "PROGRAMACION I", credits: 3, theoryHours: 3, practiceHours: 0, prerequisites: ["INF117", "MAT115"], corequisites: ["INF165"] },
        { code: "INF-165", name: "LAB PROGRAMACION I", credits: 1, theoryHours: 0, practiceHours: 2, prerequisites: ["INF117", "MAT115"], corequisites: ["INF164"] },
        { code: "INF-204", name: "LOGICA COMPUTACIONAL", credits: 4, theoryHours: 2, practiceHours: 4, prerequisites: ["INF117", "MAT115"] },
        { code: "ING-115", name: "INGLES II", credits: 0, theoryHours: 4, practiceHours: 0, prerequisites: ["ING105"] },
        { code: "MAT-170", name: "CALCULO I", credits: 4, theoryHours: 4, practiceHours: 0, prerequisites: ["MAT160"] },
        { code: "MAT-190", name: "FISICA I", credits: 4, theoryHours: 4, practiceHours: 0, prerequisites: ["MAT160"], corequisites: ["MAT191"] },
        { code: "MAT-191", name: "LAB. FISICA I", credits: 1, theoryHours: 0, practiceHours: 2, prerequisites: ["MAT160"], corequisites: ["MAT190"] }
      ]
    },
    {
      number: 3,
      name: "Tercer Cuatrimestre",
      subjects: [
        { code: "ESP-302", name: "REDACCION PROFESIONAL", credits: 3, theoryHours: 3, practiceHours: 0, prerequisites: ["ESP189"] },
        { code: "INF-121", name: "ANALISIS DE SISTEMAS", credits: 4, theoryHours: 4, practiceHours: 0, prerequisites: ["INF164", "INF165"] },
        { code: "INF-167", name: "PROGRAMACION II", credits: 3, theoryHours: 3, practiceHours: 0, prerequisites: ["INF164", "INF165"], corequisites: ["INF168"] },
        { code: "INF-168", name: "LAB PROGRAMACION II", credits: 1, theoryHours: 0, practiceHours: 2, prerequisites: ["INF164", "INF165"], corequisites: ["INF167"] },
        { code: "ING-125", name: "INGLES III", credits: 0, theoryHours: 4, practiceHours: 0, prerequisites: ["ING115"] },
        { code: "MAT-306", name: "PENSAMIENTO LOGICO", credits: 3, theoryHours: 3, practiceHours: 0, prerequisites: ["MAT160", "SOC182"] },
        { code: "MAT-340", name: "CALCULO II", credits: 4, theoryHours: 4, practiceHours: 0, prerequisites: ["MAT170"] },
        { code: "MAT-500", name: "FISICA II", credits: 4, theoryHours: 4, practiceHours: 0, prerequisites: ["MAT190", "MAT191"], corequisites: ["MAT501"] },
        { code: "MAT-501", name: "LAB. FISICA II", credits: 1, theoryHours: 0, practiceHours: 2, prerequisites: ["MAT190", "MAT191"], corequisites: ["MAT500"] },
        { code: "SOC-114", name: "METODOLOGÍA DE LA INVESTIGACIÓN I", credits: 3, theoryHours: 2, practiceHours: 2, prerequisites: [] }
      ]
    },
    {
      number: 4,
      name: "Cuarto Cuatrimestre",
      subjects: [
        { code: "IEL-100", name: "ELECTRICIDAD BASICA", credits: 3, theoryHours: 3, practiceHours: 0, prerequisites: ["MAT500", "MAT501"], corequisites: ["IEL105"] },
        { code: "IEL-105", name: "TALLER ELECT. BASICA", credits: 1, theoryHours: 0, practiceHours: 2, prerequisites: ["MAT500", "MAT501"], corequisites: ["IEL100"] },
        { code: "INF-171", name: "DISEÑO DE SISTEMAS", credits: 4, theoryHours: 4, practiceHours: 0, prerequisites: ["INF121", "INF167", "INF168"] },
        { code: "INF-172", name: "PROGRAMACION III", credits: 3, theoryHours: 3, practiceHours: 0, prerequisites: ["INF121", "INF167", "INF168"], corequisites: ["INF173"] },
        { code: "INF-173", name: "LAB. DE PROGRAMACION III", credits: 1, theoryHours: 0, practiceHours: 2, prerequisites: ["INF121", "INF167", "INF168"], corequisites: ["INF172"] },
        { code: "INF-385", name: "BASE DE DATOS I", credits: 3, theoryHours: 3, practiceHours: 0, prerequisites: ["INF121", "INF167", "INF168"], corequisites: ["INF387"] },
        { code: "INF-387", name: "LAB. DE BASE DE DATOS I", credits: 1, theoryHours: 0, practiceHours: 2, prerequisites: ["INF121", "INF167", "INF168"], corequisites: ["INF385"] },
        { code: "ING-135", name: "INGLES IV", credits: 0, theoryHours: 4, practiceHours: 0, prerequisites: ["ING125"] },
        { code: "MAT-134", name: "FUNDAMENTOS DE ESTADISTICA", credits: 2, theoryHours: 1, practiceHours: 2, prerequisites: ["MAT160"] },
        { code: "MAT-350", name: "CALCULO III", credits: 4, theoryHours: 4, practiceHours: 0, prerequisites: ["MAT340"] },
        { code: "SOC-118", name: "METODOLOGIA INVE. II", credits: 3, theoryHours: 3, practiceHours: 0, prerequisites: ["SOC114"], corequisites: ["MAT134"] },
        { code: "SOC-172", name: "TEMAS DE HISTORIA DOMINICANA", credits: 3, theoryHours: 3, practiceHours: 0, prerequisites: [] }
      ]
    },
    {
      number: 5,
      name: "Quinto Cuatrimestre",
      subjects: [
        { code: "DIB-520", name: "DIBUJO TECNICO", credits: 4, theoryHours: 3, practiceHours: 2, prerequisites: [] },
        { code: "IID-420", name: "SEGURIDAD E HIGIENE INDUSTRIAL", credits: 3, theoryHours: 3, practiceHours: 0, prerequisites: [] },
        { code: "INF-440", name: "ARQUITECTURA COMPUTACIONAL", credits: 1, theoryHours: 1, practiceHours: 0, prerequisites: ["IEL100", "IEL105", "INF204"], corequisites: ["INF445"] },
        { code: "INF-445", name: "LAB. DE ARQUITECTURA COMPUTACIONAL", credits: 2, theoryHours: 0, practiceHours: 4, prerequisites: ["IEL100", "IEL105", "INF204"], corequisites: ["INF440"] },
        { code: "INF-481", name: "BASE DE DATOS II", credits: 2, theoryHours: 2, practiceHours: 0, prerequisites: ["INF171", "INF385", "INF387"], corequisites: ["INF482"] },
        { code: "INF-482", name: "LAB. DE BASE DE DATOS II", credits: 1, theoryHours: 0, practiceHours: 2, prerequisites: ["INF171", "INF385", "INF387"], corequisites: ["INF481"] },
        { code: "INF-535", name: "DISEÑO Y PROGRAMACION DE PAGINAS WEB", credits: 3, theoryHours: 1, practiceHours: 4, prerequisites: ["INF171", "INF385", "INF387"] },
        { code: "MAT-360", name: "CALCULO IV", credits: 4, theoryHours: 4, practiceHours: 0, prerequisites: ["MAT350"] },
        { code: "SOC-502", name: "CIUDADANIA Y GLOBALIZACION", credits: 2, theoryHours: 2, practiceHours: 0, prerequisites: [] }
      ]
    },
    // Continuaremos con los demás cuatrimestres para mantener el archivo manejable
  ]
};

/**
 * Creates a sample progress object for demonstration
 * @returns {Object} Sample progress data
 */
export const createSampleProgress = () => {
  const progress = {};
  
  // Set first semester subjects as approved
  progress["ESP-181"] = "approved";
  progress["INF-117"] = "approved";
  progress["ING-105"] = "approved";
  progress["MAT-115"] = "approved";
  progress["MAT-160"] = "approved";
  progress["MED-750"] = "approved";
  progress["MED-755"] = "approved";
  progress["ORI-112"] = "approved";
  progress["SOC-182"] = "approved";
  
  // Set second semester as in progress
  progress["ESP-189"] = "inProgress";
  progress["INF-164"] = "inProgress";
  progress["INF-165"] = "inProgress";
  progress["INF-204"] = "inProgress";
  progress["ING-115"] = "inProgress";
  progress["MAT-170"] = "inProgress";
  progress["MAT-190"] = "inProgress";
  progress["MAT-191"] = "inProgress";
  
  return progress;
};

// Legacy local storage functions (can be removed once Firebase integration is complete)
export const saveProgress = (progress) => {
  localStorage.setItem('curriculumProgress', JSON.stringify(progress));
};

export const loadProgress = () => {
  const progress = localStorage.getItem('curriculumProgress');
  return progress ? JSON.parse(progress) : {};
};