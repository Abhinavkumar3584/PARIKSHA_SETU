/**
 * Work Experience Years Eligibility Checker
 */

/**
 * Check work experience years eligibility
 * @param {string|number} userExperienceYears - User's work experience in years
 * @param {string} examExperienceYears - Exam's required work experience
 * @returns {{eligible: boolean, userValue: string, examRequirement: string, field: string}}
 */
export const checkWorkExperienceYears = (userExperienceYears, examExperienceYears) => {
    const field = 'Work Experience';
    
    // No restriction
    if (!examExperienceYears || examExperienceYears === '' || 
        examExperienceYears.toUpperCase() === 'NOT REQUIRED' ||
        examExperienceYears.toUpperCase() === 'NOT APPLICABLE' ||
        examExperienceYears.toUpperCase() === 'NA' ||
        examExperienceYears === '0') {
        return {
            field,
            userValue: userExperienceYears !== undefined && userExperienceYears !== '' 
                ? `${userExperienceYears} years` : 'Not specified',
            examRequirement: examExperienceYears || 'Not Required',
            eligible: true
        };
    }
    
    if (userExperienceYears === undefined || userExperienceYears === '') {
        return {
            field,
            userValue: 'Not specified',
            examRequirement: examExperienceYears,
            eligible: false
        };
    }
    
    const userYears = parseFloat(String(userExperienceYears));
    
    // Check if examExperienceYears contains a range
    if (examExperienceYears.includes('-') || examExperienceYears.toLowerCase().includes(' to ')) {
        const separator = examExperienceYears.includes('-') ? '-' : / to /i;
        const parts = examExperienceYears.split(separator).map(p => parseFloat(p.trim()));
        
        if (parts.length === 2 && !isNaN(parts[0]) && !isNaN(parts[1])) {
            const eligible = userYears >= parts[0] && userYears <= parts[1];
            return {
                field,
                userValue: `${userYears} years`,
                examRequirement: `${parts[0]} - ${parts[1]} years`,
                eligible
            };
        }
    }
    
    // Single minimum value
    const examYears = parseFloat(examExperienceYears);
    if (!isNaN(examYears)) {
        const eligible = userYears >= examYears;
        return {
            field,
            userValue: `${userYears} years`,
            examRequirement: `Minimum ${examYears} years`,
            eligible
        };
    }
    
    return {
        field,
        userValue: `${userYears} years`,
        examRequirement: examExperienceYears,
        eligible: true
    };
};

export default {
    checkWorkExperienceYears
};
