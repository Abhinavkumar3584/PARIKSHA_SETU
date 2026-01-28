/**
 * Eligibility Basis Checker
 * 
 * This module handles the "Eligibility Basis" search mode:
 * User fills their details first, and we show them all exams 
 * they're eligible for based on their profile.
 */

import {
    checkFullEligibility,
    getDisplayDetails
} from "./eligibilityChecker";

import {
    getExamDropdownOptions,
    loadExamData,
    getDivisionOptions,
    getDivisionData,
    examHasDivisions,
    getExamSessionOptions
} from "./examDataLoader";

import { prepareUserInput } from "./exambasis";

// ============================================
// ELIGIBILITY BASIS CHECKING
// ============================================

/**
 * Check eligibility for ALL available exams based on user profile
 * @param {Object} formData - The form data from UI
 * @param {Object} educationTableData - Education table data from UI
 * @param {Function} onProgress - Optional callback for progress updates (examName, current, total)
 * @returns {Promise<Array>} - Array of results with eligible exams
 */
export const checkEligibilityBasis = async (formData, educationTableData, onProgress = null) => {
    const examOptions = getExamDropdownOptions();
    const allEligibleResults = [];
    const allIneligibleResults = [];
    
    // Prepare user input once
    const userInput = prepareUserInput(formData, educationTableData);
    
    // Check each exam
    for (let i = 0; i < examOptions.length; i++) {
        const examOption = examOptions[i];
        
        // Progress callback
        if (onProgress) {
            onProgress(examOption.label, i + 1, examOptions.length);
        }
        
        if (!examOption.linkedFile) continue;
        
        try {
            const examData = await loadExamData(examOption.linkedFile);
            if (!examData) continue;
            
            const hasDiv = examHasDivisions(examData);
            
            if (hasDiv) {
                // Check each division
                const divOpts = getDivisionOptions(examData);
                
                for (const divOpt of divOpts) {
                    const divData = getDivisionData(examData, divOpt.value);
                    if (!divData) continue;
                    
                    // Get sessions for this division
                    const sessionOptions = getExamSessionOptions(divData);
                    
                    if (sessionOptions.length > 0) {
                        // Check each session
                        for (const sessionOpt of sessionOptions) {
                            const result = checkFullEligibility(
                                userInput,
                                divData,
                                sessionOpt.value
                            );
                            
                            const resultObj = {
                                ...result,
                                examCode: examOption.value,
                                examName: examData.exam_name || examOption.label,
                                examLabel: examOption.label,
                                division: divOpt.value,
                                session: sessionOpt.label,
                                linkedFile: examOption.linkedFile,
                                displayDetails: getDisplayDetails(examData)
                            };
                            
                            if (result.eligible) {
                                allEligibleResults.push(resultObj);
                            } else {
                                allIneligibleResults.push(resultObj);
                            }
                        }
                    } else {
                        // No sessions - single check
                        const result = checkFullEligibility(
                            userInput,
                            divData,
                            null
                        );
                        
                        const resultObj = {
                            ...result,
                            examCode: examOption.value,
                            examName: examData.exam_name || examOption.label,
                            examLabel: examOption.label,
                            division: divOpt.value,
                            session: "N/A",
                            linkedFile: examOption.linkedFile,
                            displayDetails: getDisplayDetails(examData)
                        };
                        
                        if (result.eligible) {
                            allEligibleResults.push(resultObj);
                        } else {
                            allIneligibleResults.push(resultObj);
                        }
                    }
                }
            } else {
                // No divisions - check exam directly
                const sessionOptions = getExamSessionOptions(examData);
                
                if (sessionOptions.length > 0) {
                    // Check each session
                    for (const sessionOpt of sessionOptions) {
                        const result = checkFullEligibility(
                            userInput,
                            examData,
                            sessionOpt.value
                        );
                        
                        const resultObj = {
                            ...result,
                            examCode: examOption.value,
                            examName: examData.exam_name || examOption.label,
                            examLabel: examOption.label,
                            division: "N/A",
                            session: sessionOpt.label,
                            linkedFile: examOption.linkedFile,
                            displayDetails: getDisplayDetails(examData)
                        };
                        
                        if (result.eligible) {
                            allEligibleResults.push(resultObj);
                        } else {
                            allIneligibleResults.push(resultObj);
                        }
                    }
                } else {
                    // No sessions - single check
                    const result = checkFullEligibility(
                        userInput,
                        examData,
                        null
                    );
                    
                    const resultObj = {
                        ...result,
                        examCode: examOption.value,
                        examName: examData.exam_name || examOption.label,
                        examLabel: examOption.label,
                        division: "N/A",
                        session: "N/A",
                        linkedFile: examOption.linkedFile,
                        displayDetails: getDisplayDetails(examData)
                    };
                    
                    if (result.eligible) {
                        allEligibleResults.push(resultObj);
                    } else {
                        allIneligibleResults.push(resultObj);
                    }
                }
            }
        } catch (err) {
            console.error(`Error checking exam ${examOption.label}:`, err);
            // Continue with next exam
        }
    }
    
    return {
        eligible: allEligibleResults,
        ineligible: allIneligibleResults,
        totalExamsChecked: examOptions.length,
        eligibleCount: allEligibleResults.length,
        ineligibleCount: allIneligibleResults.length
    };
};

/**
 * Get a summary of eligible exams grouped by exam name
 * @param {Array} eligibleResults - Array of eligible results from checkEligibilityBasis
 * @returns {Array} - Grouped results by exam
 */
export const getEligibleExamsSummary = (eligibleResults) => {
    const examMap = new Map();
    
    eligibleResults.forEach(result => {
        const key = result.examCode;
        if (!examMap.has(key)) {
            examMap.set(key, {
                examCode: result.examCode,
                examName: result.examName,
                examLabel: result.examLabel,
                displayDetails: result.displayDetails,
                divisions: [],
                sessions: [],
                totalEligible: 0
            });
        }
        
        const exam = examMap.get(key);
        exam.totalEligible++;
        
        if (result.division !== "N/A" && !exam.divisions.includes(result.division)) {
            exam.divisions.push(result.division);
        }
        if (result.session !== "N/A" && !exam.sessions.includes(result.session)) {
            exam.sessions.push(result.session);
        }
    });
    
    return Array.from(examMap.values()).sort((a, b) => b.totalEligible - a.totalEligible);
};

/**
 * Filter eligible results by criteria
 * @param {Array} results - Array of results
 * @param {Object} filters - Filter criteria { examLevel, conductingBody, etc. }
 * @returns {Array} - Filtered results
 */
export const filterEligibleResults = (results, filters = {}) => {
    return results.filter(result => {
        if (filters.examLevel && result.displayDetails?.exam_level) {
            if (result.displayDetails.exam_level.toLowerCase() !== filters.examLevel.toLowerCase()) {
                return false;
            }
        }
        
        if (filters.conductingBody && result.displayDetails?.conducting_body) {
            if (!result.displayDetails.conducting_body.toLowerCase().includes(filters.conductingBody.toLowerCase())) {
                return false;
            }
        }
        
        if (filters.examName) {
            if (!result.examName.toLowerCase().includes(filters.examName.toLowerCase()) &&
                !result.examLabel.toLowerCase().includes(filters.examName.toLowerCase())) {
                return false;
            }
        }
        
        return true;
    });
};

// Re-export for convenience
export { prepareUserInput } from "./exambasis";
export { getExamDropdownOptions };
