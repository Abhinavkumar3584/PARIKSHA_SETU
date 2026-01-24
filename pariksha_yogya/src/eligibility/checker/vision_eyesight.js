/**
 * Vision/Eyesight Eligibility Checker
 */

/**
 * Check vision/eyesight eligibility
 * @param {string} userVision - User's vision status (e.g., "6/6", "6/9", "NORMAL", "CORRECTED")
 * @param {string} examVision - Exam's vision requirement
 * @returns {{eligible: boolean, userValue: string, examRequirement: string, field: string}}
 */
export const checkVisionEyesight = (userVision, examVision) => {
    const field = 'Vision/Eyesight';
    
    // No restriction
    if (!examVision || examVision === '' || 
        examVision.toUpperCase() === 'NOT APPLICABLE' ||
        examVision.toUpperCase() === 'NA' ||
        examVision.toUpperCase() === 'ANY') {
        return {
            field,
            userValue: userVision || 'Not specified',
            examRequirement: examVision || 'Not Applicable',
            eligible: true
        };
    }
    
    if (!userVision) {
        return {
            field,
            userValue: 'Not specified',
            examRequirement: examVision,
            eligible: false
        };
    }
    
    const userUpper = userVision.toUpperCase().trim();
    const examUpper = examVision.toUpperCase().trim();
    
    // Direct match check
    const allowedValues = examUpper.split(',').map(v => v.trim());
    const eligible = allowedValues.some(allowed => 
        allowed.includes(userUpper) || userUpper.includes(allowed)
    );
    
    return {
        field,
        userValue: userVision,
        examRequirement: examVision,
        eligible
    };
};

export default {
    checkVisionEyesight
};
