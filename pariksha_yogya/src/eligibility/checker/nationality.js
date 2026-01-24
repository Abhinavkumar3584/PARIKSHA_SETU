/**
 * Nationality Eligibility Checker
 * 
 * GLOBAL ELIGIBILITY RULEBOOK - Rule Implementation for Nationality
 * 
 * FORMAT: Nationality in exam JSON can be:
 * - Empty string "" → Skip check, all eligible
 * - "ALL APPLICABLE" → All nationalities eligible
 * - "NOT APPLICABLE" → No nationality restriction (all eligible)
 * - Single value: "INDIAN"
 * - Multiple values: "INDIAN, CITIZEN OF NEPAL, CITIZEN OF BHUTAN"
 * 
 * STANDARD VALUES (from eligibilityfields.json):
 * - INDIAN
 * - CITIZEN OF NEPAL
 * - CITIZEN OF BHUTAN
 * - TIBETAN REFUGEE (PRE-1962)
 * - PERSON OF INDIAN ORIGIN (PIO) FROM PAKISTAN
 * - PERSON OF INDIAN ORIGIN (PIO) FROM BURMA/MYANMAR
 * - PERSON OF INDIAN ORIGIN (PIO) FROM SRI LANKA
 * - PERSON OF INDIAN ORIGIN (PIO) FROM KENYA
 * - PERSON OF INDIAN ORIGIN (PIO) FROM UGANDA
 * - PERSON OF INDIAN ORIGIN (PIO) FROM TANZANIA
 * - PERSON OF INDIAN ORIGIN (PIO) FROM ZAMBIA
 * - PERSON OF INDIAN ORIGIN (PIO) FROM MALAWI
 * - PERSON OF INDIAN ORIGIN (PIO) FROM ZAIRE
 * - PERSON OF INDIAN ORIGIN (PIO) FROM ETHIOPIA
 * - PERSON OF INDIAN ORIGIN (PIO) FROM VIETNAM
 * - OCI (OVERSEAS CITIZEN OF INDIA)
 * - FOREIGN NATIONALS WITH INDIAN DEGREE
 * - FOREIGN NATIONALS WITH INDIAN ORIGIN
 * 
 * DOMICILE LOGIC:
 * - If user nationality is "INDIAN" → Enable domicile dropdown
 * - If user nationality is any other → Disable domicile dropdown (not applicable)
 * 
 * EXAM DATA FORMATS:
 * 1. Non-Division: examData.nationality = "INDIAN, CITIZEN OF NEPAL, ..."
 * 2. Division-Based: examData.academies.IMA.nationality = "INDIAN, CITIZEN OF NEPAL, ..."
 */

// ============================================
// STANDARD NATIONALITY VALUES
// ============================================

/**
 * Standard nationality values from eligibilityfields.json
 * Used for validation and dropdown options
 */
export const STANDARD_NATIONALITIES = [
    'INDIAN',
    'CITIZEN OF NEPAL',
    'CITIZEN OF BHUTAN',
    'TIBETAN REFUGEE (PRE-1962)',
    'PERSON OF INDIAN ORIGIN (PIO) FROM PAKISTAN',
    'PERSON OF INDIAN ORIGIN (PIO) FROM BURMA/MYANMAR',
    'PERSON OF INDIAN ORIGIN (PIO) FROM SRI LANKA',
    'PERSON OF INDIAN ORIGIN (PIO) FROM KENYA',
    'PERSON OF INDIAN ORIGIN (PIO) FROM UGANDA',
    'PERSON OF INDIAN ORIGIN (PIO) FROM TANZANIA',
    'PERSON OF INDIAN ORIGIN (PIO) FROM ZAMBIA',
    'PERSON OF INDIAN ORIGIN (PIO) FROM MALAWI',
    'PERSON OF INDIAN ORIGIN (PIO) FROM ZAIRE',
    'PERSON OF INDIAN ORIGIN (PIO) FROM ETHIOPIA',
    'PERSON OF INDIAN ORIGIN (PIO) FROM VIETNAM',
    'OCI (OVERSEAS CITIZEN OF INDIA)',
    'FOREIGN NATIONALS WITH INDIAN DEGREE',
    'FOREIGN NATIONALS WITH INDIAN ORIGIN'
];

/**
 * Shortened versions that might appear in JSON
 * Maps short forms to full standard forms
 */
const SHORT_TO_FULL = {
    'OCI': 'OCI (OVERSEAS CITIZEN OF INDIA)',
    'PIO': 'PERSON OF INDIAN ORIGIN (PIO)',
    'PERSON OF INDIAN ORIGIN (PIO)': 'PERSON OF INDIAN ORIGIN (PIO)',
    'TIBETAN REFUGEE': 'TIBETAN REFUGEE (PRE-1962)'
};

// ============================================
// HELPER FUNCTIONS
// ============================================

/**
 * Normalize nationality value - convert short forms to full standard forms
 * @param {string} value - Nationality value from JSON or form
 * @returns {string} - Normalized full form
 */
const normalizeNationality = (value) => {
    if (!value) return '';
    const upperValue = value.trim().toUpperCase();
    
    // If it's already a full standard form, return as-is
    if (STANDARD_NATIONALITIES.includes(upperValue)) {
        return upperValue;
    }
    
    // Check if it matches a short form
    if (SHORT_TO_FULL[upperValue]) {
        return SHORT_TO_FULL[upperValue];
    }
    
    return upperValue;
};

/**
 * Parse nationality string from exam JSON into array of allowed nationalities
 * @param {string} nationalityStr - Comma-separated nationality string
 * @returns {string[]} - Array of normalized nationality values
 */
const parseNationalityString = (nationalityStr) => {
    if (!nationalityStr || typeof nationalityStr !== 'string') {
        return [];
    }
    
    return nationalityStr
        .split(',')
        .map(n => n.trim().toUpperCase())
        .filter(n => n !== '' && n !== 'ALL APPLICABLE' && n !== 'NOT APPLICABLE');
};

// ============================================
// MAIN CHECK FUNCTION
// ============================================

/**
 * Check nationality eligibility
 * 
 * @param {string} userNationality - User's nationality from form (full standard form)
 * @param {string|Object} examNationalityOrData - Exam's allowed nationalities OR full examData for division-based
 * @param {string} [divisionName] - Optional division name for division-based exams
 * @returns {{eligible: boolean, userValue: string, examRequirement: string, field: string, reason: string}}
 */
export const checkNationality = (userNationality, examNationalityOrData, divisionName = null) => {
    const field = 'nationality';
    
    // Determine exam nationality requirement
    let examNationality = '';
    
    if (typeof examNationalityOrData === 'object' && examNationalityOrData !== null) {
        // Division-based exam - extract nationality from division data
        examNationality = examNationalityOrData.nationality || '';
    } else {
        // Non-division exam - use directly
        examNationality = examNationalityOrData || '';
    }
    
    // Handle skip conditions
    if (!examNationality || examNationality === '' || examNationality === 'ALL APPLICABLE' || examNationality === 'NOT APPLICABLE') {
        return {
            field,
            userValue: userNationality || 'Not specified',
            examRequirement: examNationality || 'All nationalities allowed',
            eligible: true,
            reason: 'No nationality restriction for this exam'
        };
    }
    
    // User must specify nationality if exam has requirements
    if (!userNationality || userNationality === '') {
        return {
            field,
            userValue: 'Not specified',
            examRequirement: examNationality,
            eligible: false,
            reason: 'Please specify your nationality'
        };
    }
    
    // Normalize user's nationality
    const normalizedUserNationality = normalizeNationality(userNationality);
    
    // Parse allowed nationalities from exam
    const allowedNationalities = parseNationalityString(examNationality);
    
    // Check if user's nationality is in the allowed list
    let isEligible = false;
    
    for (const allowed of allowedNationalities) {
        const normalizedAllowed = normalizeNationality(allowed);
        
        // Exact match
        if (normalizedUserNationality === normalizedAllowed) {
            isEligible = true;
            break;
        }
        
        // Special handling for PIO - if exam allows any PIO country, check if user selected that specific country
        // e.g., If exam has "PERSON OF INDIAN ORIGIN (PIO) FROM PAKISTAN" and user selected same
        if (normalizedUserNationality.includes('PERSON OF INDIAN ORIGIN (PIO)') && 
            normalizedAllowed.includes('PERSON OF INDIAN ORIGIN (PIO)')) {
            // Check if it's the same PIO country
            if (normalizedUserNationality === normalizedAllowed) {
                isEligible = true;
                break;
            }
        }
    }
    
    return {
        field,
        userValue: userNationality,
        examRequirement: examNationality,
        eligible: isEligible,
        reason: isEligible 
            ? `Your nationality (${userNationality}) is eligible for this exam`
            : `Your nationality (${userNationality}) is not in the allowed list: ${examNationality}`
    };
};

// ============================================
// DOMICILE CONTROL FUNCTIONS
// ============================================

/**
 * Check if domicile dropdown should be enabled based on nationality
 * Only Indian nationals have domicile (state/UT of India)
 * 
 * @param {string} userNationality - User's selected nationality
 * @returns {boolean} - True if domicile should be enabled
 */
export const shouldEnableDomicile = (userNationality) => {
    if (!userNationality || userNationality === '') {
        return false; // No nationality selected yet
    }
    
    const normalized = normalizeNationality(userNationality);
    
    // Domicile is only applicable for Indian nationals
    return normalized === 'INDIAN';
};

/**
 * Check if domicile field should be shown at all for this exam
 * (based on exam requirements, not user selection)
 * 
 * @param {Object} examData - Exam JSON data
 * @returns {boolean} - True if domicile field should be shown
 */
export const shouldShowDomicileField = (examData) => {
    if (!examData) return false;
    
    // Check if nationality allows Indian candidates
    const nationality = examData.nationality || '';
    
    if (!nationality || nationality === '' || nationality === 'ALL APPLICABLE' || nationality === 'NOT APPLICABLE') {
        return true; // All nationalities allowed, show domicile for Indians
    }
    
    const allowedNationalities = parseNationalityString(nationality);
    
    // Show domicile field if INDIAN is one of the allowed nationalities
    return allowedNationalities.some(n => normalizeNationality(n) === 'INDIAN');
};

// ============================================
// DROPDOWN OPTIONS FUNCTIONS
// ============================================

/**
 * Get nationality options for dropdown based on exam requirements
 * 
 * @param {string|Object} examNationalityOrData - Exam's nationality field or division data
 * @returns {string[]} - Array of nationality options for dropdown
 */
export const getNationalityOptions = (examNationalityOrData) => {
    let examNationality = '';
    
    if (typeof examNationalityOrData === 'object' && examNationalityOrData !== null) {
        examNationality = examNationalityOrData.nationality || '';
    } else {
        examNationality = examNationalityOrData || '';
    }
    
    // If no restriction, return all standard nationalities
    if (!examNationality || examNationality === '' || examNationality === 'ALL APPLICABLE' || examNationality === 'NOT APPLICABLE') {
        return STANDARD_NATIONALITIES;
    }
    
    // Parse and return only allowed nationalities
    const allowed = parseNationalityString(examNationality);
    
    // Return normalized values, preserving order from JSON
    return allowed.map(n => {
        // Return the full standard form if it matches
        const normalized = normalizeNationality(n);
        if (STANDARD_NATIONALITIES.includes(normalized)) {
            return normalized;
        }
        // Otherwise return the original (trimmed and uppercased)
        return n;
    });
};

/**
 * Check if nationality field should be shown for this exam
 * 
 * @param {Object} examData - Exam JSON data (can be division-specific)
 * @returns {boolean} - True if nationality field should be shown
 */
export const shouldShowNationalityField = (examData) => {
    if (!examData) return false;
    
    const nationality = examData.nationality;
    
    // Show field if:
    // 1. nationality is undefined/null → show with default options
    // 2. nationality is empty string → hide (exam doesn't need this info)
    // 3. nationality is "NOT APPLICABLE" → hide
    // 4. nationality has specific values → show with those options
    
    if (nationality === '' || nationality === 'NOT APPLICABLE') {
        return false;
    }
    
    return true;
};

/**
 * Get all standard nationality values
 * @returns {string[]} - Array of all standard nationality values
 */
export const getStandardNationalities = () => {
    return [...STANDARD_NATIONALITIES];
};

// ============================================
// UTILITY FUNCTIONS
// ============================================

/**
 * Check if a nationality value is valid (exists in standard list)
 * @param {string} nationality - Nationality to validate
 * @returns {boolean} - True if valid
 */
export const isValidNationality = (nationality) => {
    if (!nationality) return false;
    const normalized = normalizeNationality(nationality);
    return STANDARD_NATIONALITIES.includes(normalized);
};

/**
 * Get the normalized form of a nationality
 * @param {string} nationality - Nationality value
 * @returns {string} - Normalized nationality
 */
export const getNormalizedNationality = (nationality) => {
    return normalizeNationality(nationality);
};

// ============================================
// DEFAULT EXPORT
// ============================================

export default {
    checkNationality,
    shouldEnableDomicile,
    shouldShowDomicileField,
    getNationalityOptions,
    shouldShowNationalityField,
    getStandardNationalities,
    isValidNationality,
    getNormalizedNationality,
    STANDARD_NATIONALITIES
};
