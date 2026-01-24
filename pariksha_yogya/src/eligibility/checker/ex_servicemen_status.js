/**
 * Ex-Servicemen Status Eligibility Checker
 */

/**
 * Check ex-servicemen status eligibility
 * @param {string} userExServicemenStatus - User's ex-servicemen status (YES, NO)
 * @param {string} examExServicemenStatus - Exam's ex-servicemen eligibility criteria
 * @returns {{eligible: boolean, userValue: string, examRequirement: string, field: string}}
 */
export const checkExServicemenStatus = (userExServicemenStatus, examExServicemenStatus) => {
    const field = 'Ex-Servicemen Status';
    
    // No restriction
    if (!examExServicemenStatus || examExServicemenStatus === '' || 
        examExServicemenStatus.toUpperCase() === 'NOT APPLICABLE' ||
        examExServicemenStatus.toUpperCase() === 'NA' ||
        examExServicemenStatus.toUpperCase() === 'ANY') {
        return {
            field,
            userValue: userExServicemenStatus || 'Not specified',
            examRequirement: examExServicemenStatus || 'Not Applicable',
            eligible: true
        };
    }
    
    if (!userExServicemenStatus) {
        return {
            field,
            userValue: 'Not specified',
            examRequirement: examExServicemenStatus,
            eligible: false
        };
    }
    
    const userUpper = userExServicemenStatus.toUpperCase().trim();
    const examUpper = examExServicemenStatus.toUpperCase().trim();
    
    // If exam is only for ex-servicemen
    if (examUpper === 'YES' || examUpper === 'REQUIRED' || examUpper === 'ONLY') {
        const eligible = userUpper === 'YES';
        return {
            field,
            userValue: userExServicemenStatus,
            examRequirement: 'Ex-servicemen only',
            eligible
        };
    }
    
    // If exam excludes ex-servicemen
    if (examUpper === 'NO' || examUpper === 'NOT ALLOWED') {
        const eligible = userUpper === 'NO';
        return {
            field,
            userValue: userExServicemenStatus,
            examRequirement: 'Not for ex-servicemen',
            eligible
        };
    }
    
    return {
        field,
        userValue: userExServicemenStatus,
        examRequirement: examExServicemenStatus,
        eligible: true
    };
};

export default {
    checkExServicemenStatus
};
