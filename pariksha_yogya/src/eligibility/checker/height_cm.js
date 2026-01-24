/**
 * Height (cm) Eligibility Checker
 */

/**
 * Check height eligibility
 * @param {string|number} userHeight - User's height in cm
 * @param {string} examHeight - Exam's height requirement (can be range or minimum)
 * @returns {{eligible: boolean, userValue: string, examRequirement: string, field: string}}
 */
export const checkHeightCm = (userHeight, examHeight) => {
    const field = 'Height (cm)';
    
    // No restriction
    if (!examHeight || examHeight === '' || 
        examHeight.toUpperCase() === 'NOT APPLICABLE' ||
        examHeight.toUpperCase() === 'NA' ||
        examHeight.toUpperCase() === 'ANY') {
        return {
            field,
            userValue: userHeight ? `${userHeight} cm` : 'Not specified',
            examRequirement: examHeight || 'Not Applicable',
            eligible: true
        };
    }
    
    if (!userHeight && userHeight !== 0) {
        return {
            field,
            userValue: 'Not specified',
            examRequirement: examHeight,
            eligible: false
        };
    }
    
    const userHeightNum = parseFloat(String(userHeight));
    
    if (isNaN(userHeightNum)) {
        return {
            field,
            userValue: String(userHeight),
            examRequirement: examHeight,
            eligible: true
        };
    }
    
    // Check if examHeight contains a range (e.g., "150-180" or "150 to 180")
    if (examHeight.includes('-') || examHeight.toLowerCase().includes(' to ')) {
        const separator = examHeight.includes('-') ? '-' : / to /i;
        const parts = examHeight.split(separator).map(p => parseFloat(p.trim()));
        
        if (parts.length === 2 && !isNaN(parts[0]) && !isNaN(parts[1])) {
            const eligible = userHeightNum >= parts[0] && userHeightNum <= parts[1];
            return {
                field,
                userValue: `${userHeightNum} cm`,
                examRequirement: `${parts[0]} - ${parts[1]} cm`,
                eligible
            };
        }
    }
    
    // Single minimum value
    const examHeightNum = parseFloat(examHeight);
    if (!isNaN(examHeightNum)) {
        const eligible = userHeightNum >= examHeightNum;
        return {
            field,
            userValue: `${userHeightNum} cm`,
            examRequirement: `Minimum ${examHeightNum} cm`,
            eligible
        };
    }
    
    return {
        field,
        userValue: `${userHeightNum} cm`,
        examRequirement: examHeight,
        eligible: true
    };
};

export default {
    checkHeightCm
};
