/**
 * Weight (kg) Eligibility Checker
 */

/**
 * Check weight eligibility
 * @param {string|number} userWeight - User's weight in kg
 * @param {string} examWeight - Exam's weight requirement (can be range or minimum)
 * @returns {{eligible: boolean, userValue: string, examRequirement: string, field: string}}
 */
export const checkWeightKg = (userWeight, examWeight) => {
    const field = 'Weight (kg)';
    
    // No restriction
    if (!examWeight || examWeight === '' || 
        examWeight.toUpperCase() === 'NOT APPLICABLE' ||
        examWeight.toUpperCase() === 'NA' ||
        examWeight.toUpperCase() === 'ANY') {
        return {
            field,
            userValue: userWeight ? `${userWeight} kg` : 'Not specified',
            examRequirement: examWeight || 'Not Applicable',
            eligible: true
        };
    }
    
    if (!userWeight && userWeight !== 0) {
        return {
            field,
            userValue: 'Not specified',
            examRequirement: examWeight,
            eligible: false
        };
    }
    
    const userWeightNum = parseFloat(String(userWeight));
    
    if (isNaN(userWeightNum)) {
        return {
            field,
            userValue: String(userWeight),
            examRequirement: examWeight,
            eligible: true
        };
    }
    
    // Check if examWeight contains a range (e.g., "50-80" or "50 to 80")
    if (examWeight.includes('-') || examWeight.toLowerCase().includes(' to ')) {
        const separator = examWeight.includes('-') ? '-' : / to /i;
        const parts = examWeight.split(separator).map(p => parseFloat(p.trim()));
        
        if (parts.length === 2 && !isNaN(parts[0]) && !isNaN(parts[1])) {
            const eligible = userWeightNum >= parts[0] && userWeightNum <= parts[1];
            return {
                field,
                userValue: `${userWeightNum} kg`,
                examRequirement: `${parts[0]} - ${parts[1]} kg`,
                eligible
            };
        }
    }
    
    // Single minimum value
    const examWeightNum = parseFloat(examWeight);
    if (!isNaN(examWeightNum)) {
        const eligible = userWeightNum >= examWeightNum;
        return {
            field,
            userValue: `${userWeightNum} kg`,
            examRequirement: `Minimum ${examWeightNum} kg`,
            eligible
        };
    }
    
    return {
        field,
        userValue: `${userWeightNum} kg`,
        examRequirement: examWeight,
        eligible: true
    };
};

export default {
    checkWeightKg
};
