/**
 * CPL (Commercial Pilot License) Holder Eligibility Checker
 */

/**
 * Check CPL holder eligibility
 * @param {string} userCplHolder - User's CPL holder status (YES, NO)
 * @param {string} examCplHolder - Exam's CPL holder requirement
 * @returns {{eligible: boolean, userValue: string, examRequirement: string, field: string}}
 */
export const checkCplHolder = (userCplHolder, examCplHolder) => {
    const field = 'CPL Holder';
    
    // No restriction
    if (!examCplHolder || examCplHolder === '' || 
        examCplHolder.toUpperCase() === 'NOT REQUIRED' || 
        examCplHolder.toUpperCase() === 'NOT APPLICABLE' ||
        examCplHolder.toUpperCase() === 'NA') {
        return {
            field,
            userValue: userCplHolder || 'Not specified',
            examRequirement: examCplHolder || 'Not Required',
            eligible: true
        };
    }
    
    if (!userCplHolder) {
        return {
            field,
            userValue: 'Not specified',
            examRequirement: examCplHolder,
            eligible: false
        };
    }
    
    const userUpper = userCplHolder.toUpperCase().trim();
    const examUpper = examCplHolder.toUpperCase().trim();
    
    // If exam requires CPL
    if (examUpper === 'YES' || examUpper === 'REQUIRED') {
        const eligible = userUpper === 'YES' || userUpper === 'HAVE';
        return {
            field,
            userValue: userCplHolder,
            examRequirement: 'Required',
            eligible
        };
    }
    
    // If exam allows CPL holders
    if (examUpper === 'OPTIONAL' || examUpper === 'PREFERRED') {
        return {
            field,
            userValue: userCplHolder,
            examRequirement: examCplHolder,
            eligible: true
        };
    }
    
    return {
        field,
        userValue: userCplHolder,
        examRequirement: examCplHolder,
        eligible: true
    };
};

export default {
    checkCplHolder
};
