/**
 * Exam Data Loader Utility
 * For PRATIYOGITA YOGYA - Exam Eligibility Tracker
 * 
 * This module handles loading exam data from JSON files and allexamnames.json
 */

import allExamNames from '../../examsdata/allexamnames.json';

// ============================================
// EXAM DATA IMPORTS (Static imports for Vite)
// ============================================

// Import all exam JSON files statically for Vite bundling
const examDataModules = import.meta.glob('../../examsdata/**/*.json', { eager: true });

// ============================================
// EXAM NAMES AND CATEGORIES
// ============================================

/**
 * Get all exam categories (folder names)
 * @returns {string[]} - Array of category names like "DEFENCE_ED", "UG_ED", etc.
 */
export const getAllCategories = () => {
    return Object.keys(allExamNames);
};

/**
 * Get all exams in a specific category
 * @param {string} category - Category name like "DEFENCE_ED"
 * @returns {Array} - Array of exam objects
 */
export const getExamsByCategory = (category) => {
    return allExamNames[category] || [];
};

/**
 * Get only exams that have linked JSON files (data available)
 * @returns {Array} - Array of {category, exam} objects
 */
export const getLinkedExams = () => {
    const linkedExams = [];
    
    Object.entries(allExamNames).forEach(([category, exams]) => {
        exams.forEach(exam => {
            if (exam.linked_json_file && exam.linked_json_file !== '') {
                linkedExams.push({
                    category,
                    exam_name: exam.exam_name,
                    exam_code: exam.exam_code,
                    linked_json_file: exam.linked_json_file,
                    has_divisions: exam.has_divisions || false
                });
            }
        });
    });
    
    return linkedExams;
};

/**
 * Get exam info by exam name
 * @param {string} examName - Exam name like "CDS"
 * @returns {Object|null} - Exam object with category info or null
 */
export const getExamByName = (examName) => {
    for (const [category, exams] of Object.entries(allExamNames)) {
        const exam = exams.find(e => 
            e.exam_name.toUpperCase() === examName.toUpperCase() ||
            e.exam_code.toUpperCase() === examName.toUpperCase()
        );
        if (exam) {
            return {
                category,
                ...exam
            };
        }
    }
    return null;
};

// ============================================
// EXAM DATA LOADING
// ============================================

/**
 * Cache for loaded exam data
 */
const examDataCache = {};

/**
 * Load exam JSON data dynamically
 * @param {string} linkedJsonFile - Path like "DEFENCE_ED/cds.json"
 * @returns {Promise<Object|null>} - Exam data object or null
 */
export const loadExamData = async (linkedJsonFile) => {
    if (!linkedJsonFile) return null;
    
    // Check cache first
    if (examDataCache[linkedJsonFile]) {
        return examDataCache[linkedJsonFile];
    }
    
    try {
        // Find the matching module from the glob imports
        const modulePath = Object.keys(examDataModules).find(path => 
            path.includes(linkedJsonFile)
        );
        
        if (modulePath && examDataModules[modulePath]) {
            const data = examDataModules[modulePath].default || examDataModules[modulePath];
            // Cache the data
            examDataCache[linkedJsonFile] = data;
            return data;
        }
        
        console.error(`No matching module found for: ${linkedJsonFile}`);
        return null;
    } catch (error) {
        console.error(`Error loading exam data from ${linkedJsonFile}:`, error);
        return null;
    }
};

/**
 * Load exam data by exam name
 * @param {string} examName - Exam name like "CDS"
 * @returns {Promise<Object|null>} - Exam data object or null
 */
export const loadExamDataByName = async (examName) => {
    const examInfo = getExamByName(examName);
    if (!examInfo || !examInfo.linked_json_file) {
        console.warn(`No linked JSON file found for exam: ${examName}`);
        return null;
    }
    
    return await loadExamData(examInfo.linked_json_file);
};

/**
 * Preload all available exam data into cache
 * @returns {Promise<Object>} - Object with exam names as keys and data as values
 */
export const preloadAllExamData = async () => {
    const linkedExams = getLinkedExams();
    const loadedData = {};
    
    await Promise.all(
        linkedExams.map(async (examInfo) => {
            const data = await loadExamData(examInfo.linked_json_file);
            if (data) {
                loadedData[examInfo.exam_name] = data;
            }
        })
    );
    
    return loadedData;
};

// ============================================
// EXAM OPTIONS FOR DROPDOWNS
// ============================================

/**
 * Get exam options for dropdown (only exams with linked data)
 * @returns {Array} - Array of {value, label, category, hasDivisions} objects
 */
export const getExamDropdownOptions = () => {
    const linkedExams = getLinkedExams();
    
    return linkedExams.map(exam => ({
        value: exam.exam_code,
        label: exam.exam_name,
        category: exam.category,
        hasDivisions: exam.has_divisions,
        linkedFile: exam.linked_json_file
    }));
};

/**
 * Get exam options grouped by category
 * @returns {Object} - Object with categories as keys and arrays of exam options
 */
export const getExamOptionsGroupedByCategory = () => {
    const linkedExams = getLinkedExams();
    const grouped = {};
    
    linkedExams.forEach(exam => {
        const categoryLabel = formatCategoryName(exam.category);
        if (!grouped[categoryLabel]) {
            grouped[categoryLabel] = [];
        }
        grouped[categoryLabel].push({
            value: exam.exam_code,
            label: exam.exam_name,
            hasDivisions: exam.has_divisions,
            linkedFile: exam.linked_json_file
        });
    });
    
    return grouped;
};

/**
 * Format category name for display
 * @param {string} category - Category like "DEFENCE_ED"
 * @returns {string} - Formatted name like "Defence"
 */
export const formatCategoryName = (category) => {
    if (!category) return '';
    
    const categoryMap = {
        'SSC_ED': 'SSC Exams',
        'DEFENCE_ED': 'Defence Exams',
        'UG_ED': 'Undergraduate Exams',
        'PG_ED': 'Postgraduate Exams',
        'BANKING_ED': 'Banking Exams',
        'RAILWAY_ED': 'Railway Exams',
        'TEACHING_ED': 'Teaching Exams',
        'CIVIL_SERVICES_ED': 'Civil Services',
        'POLICE_ED': 'Police Exams',
        'ENGINEERING_RECRUITING_ED': 'Engineering Recruitment',
        'INSURANCE_ED': 'Insurance Exams',
        'JUDICIARY_ED': 'Judiciary Exams',
        'MBA_ED': 'MBA Exams',
        'SCHOOL_ED': 'School Level Exams',
        'NURSING_ED': 'Nursing Exams',
        'REGULATORY_BODY_ED': 'Regulatory Body Exams',
        'OTHER_GOV_ED': 'Other Government Exams',
        'OTHERS_ED': 'Other Exams',
        'CAMPUS_PLACEMENT_ED': 'Campus Placement',
        'ACCOUNTING_COMMERCE_ED': 'Accounting & Commerce'
    };
    
    return categoryMap[category] || category.replace('_ED', '').replace(/_/g, ' ');
};

// ============================================
// DIVISION HANDLING
// ============================================

/**
 * Get divisions for an exam
 * @param {Object} examData - Loaded exam data
 * @returns {Array} - Array of {value, label} objects for dropdown
 */
export const getDivisionOptions = (examData) => {
    if (!examData || !examData.posts_classes_courses_departments_academies) {
        return [];
    }
    
    const divisionsStr = examData.posts_classes_courses_departments_academies;
    const divisions = divisionsStr.split(',').map(d => d.trim()).filter(d => d !== '');
    
    return divisions.map(div => ({
        value: div,
        label: div
    }));
};

/**
 * Get division-specific data
 * @param {Object} examData - Loaded exam data
 * @param {string} divisionName - Division name like "IMA"
 * @returns {Object|null} - Division data or null
 */
export const getDivisionData = (examData, divisionName) => {
    if (!examData || !examData.academies || !divisionName) {
        return null;
    }
    return examData.academies[divisionName] || null;
};

/**
 * Check if exam has divisions
 * @param {Object} examData - Loaded exam data
 * @returns {boolean}
 */
export const examHasDivisions = (examData) => {
    return examData && 
           examData.posts_classes_courses_departments_academies && 
           examData.posts_classes_courses_departments_academies.trim() !== '' &&
           examData.academies !== undefined;
};

// ============================================
// EXAM SESSION HANDLING
// ============================================

/**
 * Get available exam sessions from exam data
 * Checks multiple session-based fields: between_dob, between_age, minimum_dob, maximum_dob, starting_age, ending_age
 * @param {Object} examData - Exam data (can be division-specific)
 * @returns {Array} - Array of {value, label} objects for dropdown
 */
export const getExamSessionOptions = (examData) => {
    if (!examData) {
        return [];
    }
    
    // List of fields that can have session-based data (including no_age_limit for exams without age restriction)
    const sessionFields = ['between_dob', 'between_age', 'minimum_dob', 'maximum_dob', 'starting_age', 'ending_age', 'no_age_limit'];
    
    for (const fieldName of sessionFields) {
        let fieldData = examData[fieldName];
        
        if (!fieldData) continue;
        
        // Handle nested structure (regular_candidates, CPL_holders)
        if (fieldData.regular_candidates) {
            fieldData = fieldData.regular_candidates;
        }
        
        // Check if it's an object with session keys (not a simple string)
        if (typeof fieldData === 'object' && !Array.isArray(fieldData)) {
            const keys = Object.keys(fieldData);
            // Verify at least one key looks like a session (contains year)
            if (keys.length > 0 && keys.some(k => /\d{4}/.test(k))) {
                return keys.map(session => ({
                    value: session,
                    label: session.replace(/-/g, ' ')
                }));
            }
        }
    }
    
    return [];
};

export default {
    getAllCategories,
    getExamsByCategory,
    getLinkedExams,
    getExamByName,
    loadExamData,
    loadExamDataByName,
    preloadAllExamData,
    getExamDropdownOptions,
    getExamOptionsGroupedByCategory,
    formatCategoryName,
    getDivisionOptions,
    getDivisionData,
    examHasDivisions,
    getExamSessionOptions
};
