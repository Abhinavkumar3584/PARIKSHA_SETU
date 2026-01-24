/**
 * Active Backlogs Allowed Checker
 */

/**
 * Check active backlogs eligibility
 * @param {string|number} userBacklogs - User's number of active backlogs
 * @param {string} examBacklogs - Exam's allowed backlogs policy
 * @returns {{eligible: boolean, userValue: string, examRequirement: string, field: string}}
 */
export const checkActiveBacklogsAllowed = (userBacklogs, examBacklogs) => {
    const field = 'Active Backlogs';
    
    // No restriction
    if (!examBacklogs || examBacklogs === '' || 
        examBacklogs.toUpperCase() === 'NOT APPLICABLE' ||
        examBacklogs.toUpperCase() === 'NA' ||
        examBacklogs.toUpperCase() === 'APPLICABLE') {
        return {
            field,
            userValue: userBacklogs !== undefined && userBacklogs !== '' ? String(userBacklogs) : 'Not specified',
            examRequirement: examBacklogs || 'Not Applicable',
            eligible: true
        };
    }
    
    const examUpper = examBacklogs.toUpperCase().trim();
    
    // If exam says NO backlogs allowed
    if (examUpper === 'NO' || examUpper === 'NONE' || examUpper === '0' || examUpper === 'NOT ALLOWED') {
        const userBacklogNum = parseInt(userBacklogs) || 0;
        const eligible = userBacklogNum === 0;
        return {
            field,
            userValue: userBacklogs !== undefined && userBacklogs !== '' ? String(userBacklogs) : '0',
            examRequirement: 'No backlogs allowed',
            eligible
        };
    }
    
    // If exam allows specific number
    const allowedBacklogs = parseInt(examBacklogs);
    if (!isNaN(allowedBacklogs)) {
        const userBacklogNum = parseInt(userBacklogs) || 0;
        const eligible = userBacklogNum <= allowedBacklogs;
        return {
            field,
            userValue: String(userBacklogNum),
            examRequirement: `Maximum ${allowedBacklogs} backlogs`,
            eligible
        };
    }
    
    // If exam says YES or ALLOWED
    if (examUpper === 'YES' || examUpper === 'ALLOWED') {
        return {
            field,
            userValue: userBacklogs !== undefined && userBacklogs !== '' ? String(userBacklogs) : 'Not specified',
            examRequirement: 'Backlogs allowed',
            eligible: true
        };
    }
    
    return {
        field,
        userValue: userBacklogs !== undefined && userBacklogs !== '' ? String(userBacklogs) : 'Not specified',
        examRequirement: examBacklogs,
        eligible: true
    };
};

export default {
    checkActiveBacklogsAllowed
};
