/**
 * Exam Basis Eligibility Checker
 * 
 * This module handles the "Exam Basis" search mode:
 * User selects a specific exam first, then fills their details 
 * to check if they're eligible for that specific exam.
 */

import {
    checkFullEligibility,
    getDisplayDetails
} from "./eligibilityChecker";

import {
    getExamDropdownOptions,
    loadExamData,
    getDivisionOptions,
    getDivisionData,
    examHasDivisions,
    getExamSessionOptions
} from "./examDataLoader";

// ============================================
// EXTRACT OPTIONS FROM EXAM DATA
// ============================================

/**
 * Extract unique values for a field from exam data (including all divisions)
 */
export const extractOptionsFromExamData = (examData, fieldName) => {
    if (!examData) return [];
    
    const uniqueValues = new Set();
    
    // Check if exam has divisions (academies, posts, etc.)
    const divisionFields = ['academies', 'posts', 'departments', 'courses', 'classes'];
    let hasDivisions = false;
    let divisionsData = null;
    
    for (const field of divisionFields) {
        if (examData[field] && typeof examData[field] === 'object') {
            hasDivisions = true;
            divisionsData = examData[field];
            break;
        }
    }
    
    if (hasDivisions && divisionsData) {
        // Extract from all divisions
        Object.values(divisionsData).forEach(divisionData => {
            if (divisionData && divisionData[fieldName]) {
                const values = divisionData[fieldName].toString().split(',').map(v => v.trim().toUpperCase());
                values.forEach(v => {
                    if (v && v !== '' && v !== 'NOT APPLICABLE' && v !== 'ALL APPLICABLE') {
                        uniqueValues.add(v);
                    }
                });
            }
        });
    } else {
        // Non-division exam - extract directly
        if (examData[fieldName]) {
            const values = examData[fieldName].toString().split(',').map(v => v.trim().toUpperCase());
            values.forEach(v => {
                if (v && v !== '' && v !== 'NOT APPLICABLE' && v !== 'ALL APPLICABLE') {
                    uniqueValues.add(v);
                }
            });
        }
    }
    
    return Array.from(uniqueValues);
};

/**
 * Extract nationality values from exam data (special handling for comma-separated values)
 */
export const extractNationalityFromExamData = (examData) => {
    if (!examData) return [];
    
    const uniqueValues = new Set();
    
    // Check if exam has divisions
    const divisionFields = ['academies', 'posts', 'departments', 'courses', 'classes'];
    let hasDivisions = false;
    let divisionsData = null;
    
    for (const field of divisionFields) {
        if (examData[field] && typeof examData[field] === 'object') {
            hasDivisions = true;
            divisionsData = examData[field];
            break;
        }
    }
    
    const parseNationalityText = (text) => {
        if (!text) return;
        // Split by comma and add each value separately
        const values = text.toString().split(',').map(v => v.trim());
        values.forEach(v => {
            if (v && v !== '' && v.toUpperCase() !== 'NOT APPLICABLE' && v.toUpperCase() !== 'ALL APPLICABLE') {
                uniqueValues.add(v);
            }
        });
    };
    
    if (hasDivisions && divisionsData) {
        // Extract from all divisions
        Object.values(divisionsData).forEach(divisionData => {
            if (divisionData && divisionData.nationality) {
                parseNationalityText(divisionData.nationality);
            }
        });
    } else {
        // Non-division exam
        if (examData.nationality) {
            parseNationalityText(examData.nationality);
        }
    }
    
    return Array.from(uniqueValues);
};

/**
 * Convert extracted values to dropdown options format
 */
export const valuesToOptions = (values, labelMap = {}) => {
    return values.map(value => ({
        value: value,
        label: labelMap[value] || value.charAt(0) + value.slice(1).toLowerCase().replace(/_/g, ' ')
    }));
};

// ============================================
// EXAM DATA LOADING
// ============================================

/**
 * Load exam data and extract all necessary information
 * @param {string} examCode - The exam code to load
 * @param {Array} examOptions - List of available exam options
 * @returns {Object} - { examData, displayDetails, hasDivisions, divisions, error }
 */
export const loadExamDataForBasis = async (examCode, examOptions) => {
    if (!examCode) {
        return {
            examData: null,
            displayDetails: null,
            hasDivisions: false,
            divisions: [],
            error: null
        };
    }

    // Find the exam info
    const examInfo = examOptions.find(e => e.value === examCode);
    if (!examInfo || !examInfo.linkedFile) {
        return {
            examData: null,
            displayDetails: null,
            hasDivisions: false,
            divisions: [],
            error: "Exam data not available"
        };
    }

    try {
        const data = await loadExamData(examInfo.linkedFile);
        if (!data) {
            return {
                examData: null,
                displayDetails: null,
                hasDivisions: false,
                divisions: [],
                error: "Failed to load exam data"
            };
        }

        const displayDetails = getDisplayDetails(data);
        const hasDiv = examHasDivisions(data);
        
        let divisionsList = [];
        if (hasDiv) {
            const divOpts = getDivisionOptions(data);
            divisionsList = divOpts.map(d => d.value);
        }

        return {
            examData: data,
            displayDetails,
            hasDivisions: hasDiv,
            divisions: divisionsList,
            error: null
        };
    } catch (err) {
        return {
            examData: null,
            displayDetails: null,
            hasDivisions: false,
            divisions: [],
            error: "Error loading exam data: " + err.message
        };
    }
};

// ============================================
// ELIGIBILITY CHECKING
// ============================================

/**
 * Education key mapping from UI format to checker format
 */
const EDUCATION_KEY_MAPPING = {
    'POST DOCTORATE': 'post_doctorate',
    'PHD': 'phd',
    'POST GRADUATION': 'post_graduation',
    'GRADUATION': 'graduation',
    'DIPLOMA / ITI (POLYTECHNIC, ITI, DPHARM, PGDCA)': 'diploma',
    '(12TH)HIGHER SECONDARY': '12th_higher_secondary',
    '(12TH) HIGHER SECONDARY': '12th_higher_secondary',
    '(10TH)SECONDARY': '10th_secondary',
    '(10TH) SECONDARY': '10th_secondary'
};

/**
 * Prepare user input for eligibility checking
 * @param {Object} formData - The form data from UI
 * @param {Object} educationTableData - Education table data from UI
 * @returns {Object} - Prepared user input for eligibility checker
 */
export const prepareUserInput = (formData, educationTableData) => {
    // Convert DOB to DD-MM-YYYY format for checking
    let dobFormatted = '';
    if (formData.date_of_birth) {
        const dobParts = formData.date_of_birth.split('-');
        dobFormatted = `${dobParts[2]}-${dobParts[1]}-${dobParts[0]}`;
    }

    // Convert educationTableData keys to JSON format expected by checker
    const educationLevelsForChecker = {};

    Object.entries(educationTableData).forEach(([uiKey, levelData]) => {
        const jsonKey = EDUCATION_KEY_MAPPING[uiKey] || uiKey.toLowerCase().replace(/ /g, '_');
        if (levelData && (levelData.course || levelData.marks || levelData.subject)) {
            educationLevelsForChecker[jsonKey] = {
                course: levelData.course || '',
                subject: levelData.subject || '',
                marks_percentage: levelData.marks || '',
                status: levelData.completionStatus || '',
                completed_year: levelData.completedYear || ''
            };
        }
    });

    return {
        ...formData,
        date_of_birth: dobFormatted,
        education_levels: educationLevelsForChecker
    };
};

/**
 * Check eligibility for a specific exam (Exam Basis mode)
 * @param {Object} userInput - Prepared user input
 * @param {Object} examData - The loaded exam data
 * @param {boolean} hasDivisions - Whether exam has divisions
 * @param {Array} divisions - List of divisions (if any)
 * @param {string} selectedExam - The selected exam code
 * @returns {Array} - Array of eligibility results for all divisions/sessions
 */
export const checkExamBasisEligibility = (userInput, examData, hasDivisions, divisions, selectedExam) => {
    const allResults = [];

    if (hasDivisions && divisions.length > 0) {
        // Check eligibility for EACH division
        divisions.forEach(divisionName => {
            const divData = getDivisionData(examData, divisionName);
            if (divData) {
                // Get all sessions for this division
                const sessionOptions = getExamSessionOptions(divData);
                
                if (sessionOptions.length > 0) {
                    // Check eligibility for EACH session
                    sessionOptions.forEach(sessionOpt => {
                        const eligibilityResult = checkFullEligibility(
                            userInput,
                            divData,
                            sessionOpt.value
                        );

                        allResults.push({
                            ...eligibilityResult,
                            examName: examData.exam_name || selectedExam,
                            division: divisionName,
                            session: sessionOpt.label,
                            divisionData: divData
                        });
                    });
                } else {
                    // No sessions - single check for division
                    const eligibilityResult = checkFullEligibility(
                        userInput,
                        divData,
                        null
                    );

                    allResults.push({
                        ...eligibilityResult,
                        examName: examData.exam_name || selectedExam,
                        division: divisionName,
                        session: "N/A",
                        divisionData: divData
                    });
                }
            }
        });
    } else {
        // No divisions - check sessions directly from examData
        const sessionOptions = getExamSessionOptions(examData);
        
        if (sessionOptions.length > 0) {
            // Check eligibility for EACH session
            sessionOptions.forEach(sessionOpt => {
                const eligibilityResult = checkFullEligibility(
                    userInput,
                    examData,
                    sessionOpt.value
                );

                allResults.push({
                    ...eligibilityResult,
                    examName: examData.exam_name || selectedExam,
                    division: "N/A",
                    session: sessionOpt.label,
                    divisionData: null
                });
            });
        } else {
            // No sessions - single check
            const eligibilityResult = checkFullEligibility(
                userInput,
                examData,
                null
            );

            allResults.push({
                ...eligibilityResult,
                examName: examData.exam_name || selectedExam,
                division: "N/A",
                session: "N/A",
                divisionData: null
            });
        }
    }

    return allResults;
};

// Re-export functions from examDataLoader for convenience
export { getExamDropdownOptions, loadExamData, getDivisionOptions, getDivisionData, examHasDivisions, getExamSessionOptions };
export { getDisplayDetails };
