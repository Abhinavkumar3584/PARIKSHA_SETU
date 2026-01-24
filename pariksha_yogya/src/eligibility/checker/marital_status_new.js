/**
 * Marital Status Eligibility Checker
 * 
 * Handles both division-based and non-division-based exams
 * 
 * SUPPORTS TWO FORMATS:
 * 
 * 1. String Format (applies to all genders):
 *    "marital_status": "UNMARRIED, MARRIED, WIDOW"
 * 
 * 2. Gender-Specific Object Format:
 *    "marital_status": {
 *        "MALE": "UNMARRIED",
 *        "FEMALE": "UNMARRIED, SEPARATED, DIVORCEE, WIDOW"
 *    }
 * 
 * Standard Values (from eligibilityfields.json):
 * - "" (empty): No restriction defined → skip this check
 * - "ALL APPLICABLE": Everyone passes this criterion
 * - "NOT APPLICABLE": Criterion not considered → everyone passes
 * - Specific values: "UNMARRIED", "MARRIED", "WIDOW", "WIDOWER", "DIVORCEE", "DIVORCED", "SEPARATED"
 * - Multiple values: Comma-separated (e.g., "UNMARRIED, WIDOW, DIVORCEE")
 * 
 * Gender-based marital status options (for dropdown):
 * - MALE: UNMARRIED, MARRIED, SEPARATED, DIVORCED, WIDOWER
 * - FEMALE: UNMARRIED, MARRIED, SEPARATED, DIVORCEE, WIDOW
 * - TRANSGENDER: UNMARRIED, MARRIED, SEPARATED, DIVORCED, DIVORCEE, WIDOW, WIDOWER
 */

/**
 * Normalize value for comparison
 * @param {string} value - Value to normalize
 * @returns {string} - Normalized uppercase trimmed value
 */
const normalizeValue = (value) => {
    if (!value || typeof value !== 'string') return '';
    return value.trim().toUpperCase();
};

/**
 * Parse comma-separated values into array
 * @param {string} value - Comma-separated string
 * @returns {string[]} - Array of normalized values
 */
const parseMultipleValues = (value) => {
    if (!value || typeof value !== 'string') return [];
    return value.split(',').map(v => normalizeValue(v)).filter(v => v !== '');
};

/**
 * Check if exam data is division-based
 * @param {Object} examData - Complete exam data object
 * @returns {{isDivisionBased: boolean, divisionKey: string|null, divisions: Object|null}}
 */
const detectDivisionStructure = (examData) => {
    if (!examData || typeof examData !== 'object') {
        return {
            isDivisionBased: false,
            divisionKey: null,
            divisions: null
        };
    }
    
    const divisionKeys = ['academies', 'posts', 'divisions', 'departments', 'branches', 'courses'];
    
    for (const key of divisionKeys) {
        if (examData[key] && typeof examData[key] === 'object' && !Array.isArray(examData[key])) {
            return {
                isDivisionBased: true,
                divisionKey: key,
                divisions: examData[key]
            };
        }
    }
    
    return {
        isDivisionBased: false,
        divisionKey: null,
        divisions: null
    };
};

/**
 * Check if marital_status value is in gender-specific object format
 * @param {any} maritalStatusValue - The marital_status field value
 * @returns {boolean} - true if object format with gender keys
 */
const isGenderSpecificFormat = (maritalStatusValue) => {
    if (!maritalStatusValue || typeof maritalStatusValue !== 'object') {
        return false;
    }
    // Check if it has gender keys (MALE, FEMALE, TRANSGENDER)
    const keys = Object.keys(maritalStatusValue).map(k => k.toUpperCase());
    return keys.some(k => ['MALE', 'FEMALE', 'TRANSGENDER'].includes(k));
};

/**
 * Get marital status options based on gender (for dropdown)
 * @param {string} gender - User's gender (MALE, FEMALE, TRANSGENDER)
 * @returns {string[]} - Array of applicable marital status options
 */
export const getMaritalStatusOptionsByGender = (gender) => {
    const normalizedGender = normalizeValue(gender);
    
    switch (normalizedGender) {
        case 'MALE':
            return ['UNMARRIED', 'MARRIED', 'SEPARATED', 'DIVORCED', 'WIDOWER'];
        case 'FEMALE':
            return ['UNMARRIED', 'MARRIED', 'SEPARATED', 'DIVORCEE', 'WIDOW'];
        case 'TRANSGENDER':
            return ['UNMARRIED', 'MARRIED', 'SEPARATED', 'DIVORCED', 'DIVORCEE', 'WIDOW', 'WIDOWER'];
        default:
            // Return all options if gender not specified
            return ['UNMARRIED', 'MARRIED', 'SEPARATED', 'DIVORCED', 'DIVORCEE', 'WIDOW', 'WIDOWER'];
    }
};

/**
 * Validate if marital status is valid for given gender
 * @param {string} maritalStatus - User's marital status
 * @param {string} gender - User's gender
 * @returns {boolean} - true if valid combination
 */
export const isValidMaritalStatusForGender = (maritalStatus, gender) => {
    const validOptions = getMaritalStatusOptionsByGender(gender);
    return validOptions.includes(normalizeValue(maritalStatus));
};

/**
 * Check marital status eligibility for a single requirement value (string format)
 * @param {string} userMaritalStatus - User's marital status
 * @param {string} examMaritalStatusValue - Exam's allowed marital statuses string
 * @returns {{eligible: boolean, reason: string}}
 */
const checkSingleMaritalStatusEligibility = (userMaritalStatus, examMaritalStatusValue) => {
    const normalizedUserStatus = normalizeValue(userMaritalStatus);
    const normalizedExamStatus = normalizeValue(examMaritalStatusValue);
    
    // "" (empty) - No restriction defined → everyone passes
    if (normalizedExamStatus === '') {
        return {
            eligible: true,
            reason: 'No marital status restriction defined'
        };
    }
    
    // "ALL APPLICABLE" - Everyone passes this criterion
    if (normalizedExamStatus === 'ALL APPLICABLE') {
        return {
            eligible: true,
            reason: 'All marital statuses are eligible'
        };
    }
    
    // "NOT APPLICABLE" - Criterion not considered → everyone passes
    if (normalizedExamStatus === 'NOT APPLICABLE') {
        return {
            eligible: true,
            reason: 'Marital status criterion not applicable'
        };
    }
    
    // User must have specified a marital status for specific value matching
    if (!normalizedUserStatus) {
        return {
            eligible: false,
            reason: 'User marital status not specified'
        };
    }
    
    // Specific values - User must match at least one
    const allowedStatuses = parseMultipleValues(examMaritalStatusValue);
    const isEligible = allowedStatuses.includes(normalizedUserStatus);
    
    return {
        eligible: isEligible,
        reason: isEligible 
            ? `Marital status ${userMaritalStatus} is eligible` 
            : `Marital status ${userMaritalStatus} is not eligible. Allowed: ${allowedStatuses.join(', ')}`
    };
};

/**
 * Check marital status eligibility for gender-specific object format
 * @param {string} userMaritalStatus - User's marital status
 * @param {string} userGender - User's gender
 * @param {Object} examMaritalStatusObject - Exam's marital status object with gender keys
 * @returns {{eligible: boolean, reason: string, genderRequirement: string}}
 */
const checkGenderSpecificMaritalStatus = (userMaritalStatus, userGender, examMaritalStatusObject) => {
    const normalizedUserGender = normalizeValue(userGender);
    const normalizedUserStatus = normalizeValue(userMaritalStatus);
    
    if (!normalizedUserGender) {
        return {
            eligible: false,
            reason: 'User gender not specified (required for gender-specific marital status check)',
            genderRequirement: 'Unknown'
        };
    }
    
    // Find the marital status requirement for user's gender
    // Try exact match first, then case-insensitive match
    let genderRequirement = null;
    for (const [genderKey, statusValue] of Object.entries(examMaritalStatusObject)) {
        if (normalizeValue(genderKey) === normalizedUserGender) {
            genderRequirement = statusValue;
            break;
        }
    }
    
    // If no specific requirement for this gender, check if there's a default or allow
    if (genderRequirement === null || genderRequirement === undefined) {
        return {
            eligible: true,
            reason: `No marital status restriction for ${userGender}`,
            genderRequirement: 'Not specified for this gender'
        };
    }
    
    // Now check against the gender-specific requirement
    const result = checkSingleMaritalStatusEligibility(userMaritalStatus, genderRequirement);
    
    return {
        ...result,
        genderRequirement: genderRequirement
    };
};

/**
 * Main marital status eligibility checker
 * 
 * NOW REQUIRES userGender parameter for gender-specific checks!
 * 
 * @param {string} userMaritalStatus - User's marital status
 * @param {string|Object} examMaritalStatusOrData - Either marital_status field value or full exam data object
 * @param {string} userGender - User's gender (required for gender-specific marital status checks)
 * @returns {{eligible: boolean, eligibleDivisions: string[], field: string, userValue: string, examRequirement: string, reason: string}}
 */
export const checkMaritalStatus = (userMaritalStatus, examMaritalStatusOrData, userGender = null) => {
    const field = 'marital_status';
    
    // Case 1: Simple string value passed (applies to all genders)
    if (typeof examMaritalStatusOrData === 'string') {
        const result = checkSingleMaritalStatusEligibility(userMaritalStatus, examMaritalStatusOrData);
        return {
            field,
            userValue: userMaritalStatus || 'Not specified',
            examRequirement: examMaritalStatusOrData || 'No restriction',
            eligible: result.eligible,
            reason: result.reason,
            eligibleDivisions: result.eligible ? ['ALL'] : [],
            ineligibleDivisions: result.eligible ? [] : [{ division: 'ALL', reason: result.reason }]
        };
    }
    
    // Case 2: Gender-specific object format
    if (isGenderSpecificFormat(examMaritalStatusOrData)) {
        const result = checkGenderSpecificMaritalStatus(userMaritalStatus, userGender, examMaritalStatusOrData);
        return {
            field,
            userValue: userMaritalStatus || 'Not specified',
            userGender: userGender || 'Not specified',
            examRequirement: result.genderRequirement || 'Gender-specific',
            eligible: result.eligible,
            reason: result.reason,
            eligibleDivisions: result.eligible ? ['ALL'] : [],
            ineligibleDivisions: result.eligible ? [] : [{ division: 'ALL', reason: result.reason }]
        };
    }
    
    // Case 3: Full exam data object passed - extract marital_status field
    const examData = examMaritalStatusOrData;
    const { isDivisionBased, divisions } = detectDivisionStructure(examData);
    
    if (isDivisionBased && divisions) {
        // Division-based exam: check each division
        const eligibleDivisions = [];
        const ineligibleDivisions = [];
        
        for (const [divisionName, divisionData] of Object.entries(divisions)) {
            const divisionMaritalStatus = divisionData?.marital_status;
            let result;
            
            if (isGenderSpecificFormat(divisionMaritalStatus)) {
                // Gender-specific format
                result = checkGenderSpecificMaritalStatus(userMaritalStatus, userGender, divisionMaritalStatus);
            } else {
                // String format
                result = checkSingleMaritalStatusEligibility(userMaritalStatus, divisionMaritalStatus || '');
            }
            
            if (result.eligible) {
                eligibleDivisions.push(divisionName);
            } else {
                ineligibleDivisions.push({
                    division: divisionName,
                    reason: result.reason,
                    requirement: divisionMaritalStatus
                });
            }
        }
        
        const overallEligible = eligibleDivisions.length > 0;
        
        return {
            field,
            userValue: userMaritalStatus || 'Not specified',
            userGender: userGender || 'Not specified',
            examRequirement: 'Division-based (varies)',
            eligible: overallEligible,
            eligibleDivisions,
            ineligibleDivisions,
            reason: overallEligible 
                ? `Eligible for ${eligibleDivisions.length} division(s): ${eligibleDivisions.join(', ')}`
                : `Not eligible for any division based on marital status`
        };
    } else {
        // Non-division-based exam
        const examMaritalStatus = examData?.marital_status;
        let result;
        
        if (isGenderSpecificFormat(examMaritalStatus)) {
            result = checkGenderSpecificMaritalStatus(userMaritalStatus, userGender, examMaritalStatus);
        } else {
            result = checkSingleMaritalStatusEligibility(userMaritalStatus, examMaritalStatus || '');
        }
        
        return {
            field,
            userValue: userMaritalStatus || 'Not specified',
            userGender: userGender || 'Not specified',
            examRequirement: examMaritalStatus || 'No restriction',
            eligible: result.eligible,
            reason: result.reason,
            eligibleDivisions: result.eligible ? ['ALL'] : [],
            ineligibleDivisions: result.eligible ? [] : [{ division: 'ALL', reason: result.reason }]
        };
    }
};

/**
 * Check marital status for non-division-based exam (explicit function)
 */
export const checkMaritalStatusNonDivision = (userMaritalStatus, examData, userGender = null) => {
    return checkMaritalStatus(userMaritalStatus, examData, userGender);
};

/**
 * Check marital status for division-based exam (explicit function)
 */
export const checkMaritalStatusDivisionBased = (userMaritalStatus, examData, userGender = null) => {
    return checkMaritalStatus(userMaritalStatus, examData, userGender);
};

/**
 * Check if marital status field should be shown in form
 * @param {Object} examData - Exam data object
 * @returns {boolean} - true if field should be shown
 */
export const shouldShowMaritalStatusField = (examData) => {
    const { isDivisionBased, divisions } = detectDivisionStructure(examData);
    
    if (isDivisionBased && divisions) {
        return Object.values(divisions).some(div => {
            const status = div?.marital_status;
            if (!status) return false;
            if (typeof status === 'string') {
                return normalizeValue(status) !== '';
            }
            // Object format - check if any gender has requirements
            return Object.values(status).some(v => normalizeValue(v) !== '');
        });
    }
    
    const status = examData?.marital_status;
    if (!status) return false;
    if (typeof status === 'string') {
        return normalizeValue(status) !== '';
    }
    return Object.values(status).some(v => normalizeValue(v) !== '');
};

export default {
    checkMaritalStatus,
    checkMaritalStatusNonDivision,
    checkMaritalStatusDivisionBased,
    getMaritalStatusOptionsByGender,
    isValidMaritalStatusForGender,
    shouldShowMaritalStatusField
};
