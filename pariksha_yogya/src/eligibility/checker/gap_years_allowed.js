/**
 * Gap Years Allowed Checker
 */

/**
 * Check gap years eligibility
 * @param {string|number} userGapYears - User's number of gap years
 * @param {string} examGapYears - Exam's allowed gap years policy
 * @returns {{eligible: boolean, userValue: string, examRequirement: string, field: string}}
 */
export const checkGapYearsAllowed = (userGapYears, examGapYears) => {
    const field = 'Gap Years';
    
    // No restriction or applicable means gap years are allowed
    if (!examGapYears || examGapYears === '' || 
        examGapYears.toUpperCase() === 'NOT APPLICABLE' ||
        examGapYears.toUpperCase() === 'NA' ||
        examGapYears.toUpperCase() === 'APPLICABLE' ||
        examGapYears.toUpperCase() === 'YES' ||
        examGapYears.toUpperCase() === 'ALLOWED') {
        return {
            field,
            userValue: userGapYears !== undefined && userGapYears !== '' ? String(userGapYears) : 'Not specified',
            examRequirement: examGapYears || 'Allowed',
            eligible: true
        };
    }
    
    const examUpper = examGapYears.toUpperCase().trim();
    
    // If exam says NO gap years allowed
    if (examUpper === 'NO' || examUpper === 'NONE' || examUpper === '0' || examUpper === 'NOT ALLOWED') {
        const userGapNum = parseInt(userGapYears) || 0;
        const eligible = userGapNum === 0;
        return {
            field,
            userValue: userGapYears !== undefined && userGapYears !== '' ? String(userGapYears) : '0',
            examRequirement: 'No gap years allowed',
            eligible
        };
    }
    
    // If exam allows specific number of gap years
    const allowedGapYears = parseInt(examGapYears);
    if (!isNaN(allowedGapYears)) {
        const userGapNum = parseInt(userGapYears) || 0;
        const eligible = userGapNum <= allowedGapYears;
        return {
            field,
            userValue: String(userGapNum),
            examRequirement: `Maximum ${allowedGapYears} gap years`,
            eligible
        };
    }
    
    return {
        field,
        userValue: userGapYears !== undefined && userGapYears !== '' ? String(userGapYears) : 'Not specified',
        examRequirement: examGapYears,
        eligible: true
    };
};

export default {
    checkGapYearsAllowed
};
