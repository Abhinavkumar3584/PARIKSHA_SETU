/**
 * Language Proficiency Eligibility Checker
 */

/**
 * Check language proficiency eligibility
 * @param {string|Array} userLanguages - User's language proficiencies
 * @param {string} examLanguages - Exam's language requirements
 * @returns {{eligible: boolean, userValue: string, examRequirement: string, field: string}}
 */
export const checkLanguageProficiency = (userLanguages, examLanguages) => {
    const field = 'Language Proficiency';
    
    // No restriction
    if (!examLanguages || examLanguages === '' || 
        examLanguages.toUpperCase() === 'NOT APPLICABLE' ||
        examLanguages.toUpperCase() === 'NA' ||
        examLanguages.toUpperCase() === 'ANY') {
        return {
            field,
            userValue: userLanguages ? (Array.isArray(userLanguages) ? userLanguages.join(', ') : userLanguages) : 'Not specified',
            examRequirement: examLanguages || 'Not Applicable',
            eligible: true
        };
    }
    
    if (!userLanguages) {
        return {
            field,
            userValue: 'Not specified',
            examRequirement: examLanguages,
            eligible: false
        };
    }
    
    // Convert to arrays for comparison
    const userLangArray = Array.isArray(userLanguages) 
        ? userLanguages.map(l => l.toUpperCase().trim())
        : userLanguages.toUpperCase().split(',').map(l => l.trim());
    
    const requiredLanguages = examLanguages.toUpperCase().split(',').map(l => l.trim());
    
    // Check if user knows at least one of the required languages (OR condition)
    // or all required languages (AND condition) - typically OR for exams
    const eligible = requiredLanguages.some(required => 
        userLangArray.some(user => user.includes(required) || required.includes(user))
    );
    
    return {
        field,
        userValue: Array.isArray(userLanguages) ? userLanguages.join(', ') : userLanguages,
        examRequirement: examLanguages,
        eligible
    };
};

export default {
    checkLanguageProficiency
};
