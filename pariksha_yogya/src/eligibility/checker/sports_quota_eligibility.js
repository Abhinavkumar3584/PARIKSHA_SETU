/**
 * Sports Quota Eligibility Checker
 */

/**
 * Check sports quota eligibility
 * @param {string} userSportsQuota - User's sports quota status/level
 * @param {string} examSportsQuota - Exam's sports quota eligibility criteria
 * @returns {{eligible: boolean, userValue: string, examRequirement: string, field: string}}
 */
export const checkSportsQuotaEligibility = (userSportsQuota, examSportsQuota) => {
    const field = 'Sports Quota';
    
    // No restriction
    if (!examSportsQuota || examSportsQuota === '' || 
        examSportsQuota.toUpperCase() === 'NOT APPLICABLE' ||
        examSportsQuota.toUpperCase() === 'NA') {
        return {
            field,
            userValue: userSportsQuota || 'Not specified',
            examRequirement: examSportsQuota || 'Not Applicable',
            eligible: true
        };
    }
    
    if (!userSportsQuota) {
        return {
            field,
            userValue: 'Not specified',
            examRequirement: examSportsQuota,
            eligible: false
        };
    }
    
    const userUpper = userSportsQuota.toUpperCase().trim();
    const examUpper = examSportsQuota.toUpperCase().trim();
    
    // Check if user qualifies for sports quota
    const allowedLevels = examUpper.split(',').map(v => v.trim());
    const eligible = allowedLevels.some(allowed => 
        allowed.includes(userUpper) || userUpper.includes(allowed)
    );
    
    return {
        field,
        userValue: userSportsQuota,
        examRequirement: examSportsQuota,
        eligible
    };
};

export default {
    checkSportsQuotaEligibility
};
