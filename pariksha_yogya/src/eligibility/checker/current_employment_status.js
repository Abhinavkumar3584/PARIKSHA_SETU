/**
 * Current Employment Status Eligibility Checker
 */

/**
 * Check current employment status eligibility
 * @param {string} userEmploymentStatus - User's current employment status
 * @param {string} examEmploymentStatus - Exam's employment status requirement
 * @returns {{eligible: boolean, userValue: string, examRequirement: string, field: string}}
 */
export const checkCurrentEmploymentStatus = (userEmploymentStatus, examEmploymentStatus) => {
    const field = 'Employment Status';
    
    // No restriction
    if (!examEmploymentStatus || examEmploymentStatus === '' || 
        examEmploymentStatus.toUpperCase() === 'NOT APPLICABLE' ||
        examEmploymentStatus.toUpperCase() === 'NA' ||
        examEmploymentStatus.toUpperCase() === 'ANY') {
        return {
            field,
            userValue: userEmploymentStatus || 'Not specified',
            examRequirement: examEmploymentStatus || 'Not Applicable',
            eligible: true
        };
    }
    
    if (!userEmploymentStatus) {
        return {
            field,
            userValue: 'Not specified',
            examRequirement: examEmploymentStatus,
            eligible: false
        };
    }
    
    const userUpper = userEmploymentStatus.toUpperCase().trim();
    const examUpper = examEmploymentStatus.toUpperCase().trim();
    
    // Check if user's status matches required status
    const allowedStatuses = examUpper.split(',').map(v => v.trim());
    const eligible = allowedStatuses.some(allowed => 
        allowed.includes(userUpper) || userUpper.includes(allowed)
    );
    
    return {
        field,
        userValue: userEmploymentStatus,
        examRequirement: examEmploymentStatus,
        eligible
    };
};

export default {
    checkCurrentEmploymentStatus
};
