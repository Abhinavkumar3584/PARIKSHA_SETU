/**
 * Driving License Type Eligibility Checker
 */

// Driving license type hierarchy
const LICENSE_TYPES = {
    'LMV': ['LMV', 'LIGHT MOTOR VEHICLE'],
    'MCWG': ['MCWG', 'MOTORCYCLE WITH GEAR'],
    'MCWOG': ['MCWOG', 'MOTORCYCLE WITHOUT GEAR'],
    'HMV': ['HMV', 'HEAVY MOTOR VEHICLE', 'HTV', 'HEAVY TRANSPORT VEHICLE'],
    'HGMV': ['HGMV', 'HEAVY GOODS MOTOR VEHICLE'],
    'HPV': ['HPV', 'HEAVY PASSENGER VEHICLE']
};

/**
 * Check driving license type eligibility
 * @param {string} userLicenseType - User's driving license type
 * @param {string} examLicenseType - Exam's required driving license type
 * @returns {{eligible: boolean, userValue: string, examRequirement: string, field: string}}
 */
export const checkDrivingLicenseType = (userLicenseType, examLicenseType) => {
    const field = 'Driving License';
    
    // No restriction
    if (!examLicenseType || examLicenseType === '' || 
        examLicenseType.toUpperCase() === 'NOT REQUIRED' ||
        examLicenseType.toUpperCase() === 'NOT APPLICABLE' ||
        examLicenseType.toUpperCase() === 'NA') {
        return {
            field,
            userValue: userLicenseType || 'Not specified',
            examRequirement: examLicenseType || 'Not Required',
            eligible: true
        };
    }
    
    if (!userLicenseType) {
        return {
            field,
            userValue: 'Not specified',
            examRequirement: examLicenseType,
            eligible: false
        };
    }
    
    const userUpper = userLicenseType.toUpperCase().trim();
    const examUpper = examLicenseType.toUpperCase().trim();
    
    // Get all variations for user's license type
    let userVariations = [userUpper];
    for (const [key, variations] of Object.entries(LICENSE_TYPES)) {
        if (variations.some(v => v === userUpper || userUpper.includes(v))) {
            userVariations = [...userVariations, ...variations];
            break;
        }
    }
    
    // Check if any variation matches the exam requirement
    const allowedTypes = examUpper.split(',').map(v => v.trim());
    const eligible = allowedTypes.some(allowed => 
        userVariations.some(uv => allowed.includes(uv) || uv.includes(allowed))
    );
    
    return {
        field,
        userValue: userLicenseType,
        examRequirement: examLicenseType,
        eligible
    };
};

export default {
    checkDrivingLicenseType
};
