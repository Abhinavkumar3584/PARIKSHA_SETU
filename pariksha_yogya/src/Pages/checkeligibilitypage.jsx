/**
 * Check Eligibility Page
 * 
 * This is the main UI component for the eligibility checking feature.
 * It contains only the frontend/UI code.
 * 
 * Logic is handled by:
 * - eligibility/exambasis.js (Exam Basis mode)
 * - eligibility/eligibilitybasis.js (Eligibility Basis mode)
 */

import React, { useState, useEffect, useCallback, useRef } from "react";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import MenuItem from "@mui/material/MenuItem";
import Button from "@mui/material/Button";
import CircularProgress from "@mui/material/CircularProgress";
import Alert from "@mui/material/Alert";
import Chip from "@mui/material/Chip";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import { createTheme, ThemeProvider } from "@mui/material/styles";

// Import exam basis logic
import {
    getExamDropdownOptions,
    loadExamDataForBasis,
    extractOptionsFromExamData,
    extractNationalityFromExamData,
    valuesToOptions,
    prepareUserInput,
    checkExamBasisEligibility,
    getDisplayDetails
} from "../eligibility/exambasis";

// Import eligibility basis logic
import {
    checkEligibilityBasis,
    getEligibleExamsSummary,
    getExamDropdownOptions as getExamOptions
} from "../eligibility/eligibilitybasis";

// Import education level functions
import { 
    getCoursesForLevel,
    getSubjectsForCourse,
    loadEduFinalData
} from "../eligibility/checker/education_level";

// ============================================
// THEME & STYLES
// ============================================

const theme = createTheme({
    palette: {
        primary: {
            main: "#ff6600",
        },
    },
    components: {
        MuiTextField: {
            styleOverrides: {
                root: {
                    "& .MuiInputBase-root": {
                        fontSize: "0.8rem",
                        color: "#000000",
                    },
                    "& .MuiInputBase-input": {
                        color: "#000000",
                    },
                    "& .MuiInputLabel-root": {
                        fontSize: "0.8rem",
                        color: "#000000",
                    },
                    "& .MuiFormHelperText-root": {
                        fontSize: "0.65rem",
                        marginTop: "1px",
                        color: "#000000",
                    },
                },
            },
        },
        MuiMenuItem: {
            styleOverrides: {
                root: {
                    fontSize: "0.8rem",
                    color: "#000000",
                },
            },
        },
        MuiPopover: {
            defaultProps: {
                disableScrollLock: true,
            },
        },
        MuiMenu: {
            defaultProps: {
                disableScrollLock: true,
            },
        },
        MuiModal: {
            defaultProps: {
                disableScrollLock: true,
            },
        },
    },
});

const thinScrollbarStyle = {
    '&::-webkit-scrollbar': {
        width: '4px',
        height: '4px',
    },
    '&::-webkit-scrollbar-track': {
        background: '#f1f1f1',
        borderRadius: '2px',
    },
    '&::-webkit-scrollbar-thumb': {
        background: '#c1c1c1',
        borderRadius: '2px',
    },
    '&::-webkit-scrollbar-thumb:hover': {
        background: '#a1a1a1',
    },
    scrollbarWidth: 'thin',
    scrollbarColor: '#c1c1c1 #f1f1f1',
};

// ============================================
// STATIC OPTIONS (User Input Choices)
// ============================================

const staticGenderOptions = [
    { value: "MALE", label: "Male" },
    { value: "FEMALE", label: "Female" },
    { value: "TRANSGENDER", label: "Transgender" },
];

const maritalStatusByGender = {
    MALE: [
        { value: "UNMARRIED", label: "Unmarried" },
        { value: "MARRIED", label: "Married" },
        { value: "SEPARATED", label: "Separated" },
        { value: "DIVORCED", label: "Divorced" },
        { value: "WIDOWER", label: "Widower" },
    ],
    FEMALE: [
        { value: "UNMARRIED", label: "Unmarried" },
        { value: "MARRIED", label: "Married" },
        { value: "SEPARATED", label: "Separated" },
        { value: "DIVORCEE", label: "Divorcee" },
        { value: "WIDOW", label: "Widow" },
    ],
    TRANSGENDER: [
        { value: "UNMARRIED", label: "Unmarried" },
        { value: "MARRIED", label: "Married" },
        { value: "SEPARATED", label: "Separated" },
        { value: "DIVORCED", label: "Divorced" },
        { value: "DIVORCEE", label: "Divorcee" },
        { value: "WIDOW", label: "Widow" },
        { value: "WIDOWER", label: "Widower" },
    ],
};

const staticMaritalStatusOptions = [
    { value: "UNMARRIED", label: "Unmarried" },
    { value: "MARRIED", label: "Married" },
    { value: "SEPARATED", label: "Separated" },
    { value: "DIVORCED", label: "Divorced" },
    { value: "DIVORCEE", label: "Divorcee" },
    { value: "WIDOW", label: "Widow" },
    { value: "WIDOWER", label: "Widower" },
];

const getMaritalStatusOptionsForGender = (gender) => {
    if (!gender) return staticMaritalStatusOptions;
    const upperGender = gender.toUpperCase();
    return maritalStatusByGender[upperGender] || staticMaritalStatusOptions;
};

const staticNationalityOptions = [
    { value: "INDIAN", label: "Indian" },
    { value: "CITIZEN OF NEPAL", label: "Citizen of Nepal" },
    { value: "CITIZEN OF BHUTAN", label: "Citizen of Bhutan" },
    { value: "TIBETAN REFUGEE (PRE-1962)", label: "Tibetan Refugee (Pre-1962)" },
    { value: "PERSON OF INDIAN ORIGIN (PIO) FROM PAKISTAN", label: "PIO from Pakistan" },
    { value: "PERSON OF INDIAN ORIGIN (PIO) FROM BURMA/MYANMAR", label: "PIO from Burma/Myanmar" },
    { value: "PERSON OF INDIAN ORIGIN (PIO) FROM SRI LANKA", label: "PIO from Sri Lanka" },
    { value: "PERSON OF INDIAN ORIGIN (PIO) FROM KENYA", label: "PIO from Kenya" },
    { value: "PERSON OF INDIAN ORIGIN (PIO) FROM UGANDA", label: "PIO from Uganda" },
    { value: "PERSON OF INDIAN ORIGIN (PIO) FROM TANZANIA", label: "PIO from Tanzania" },
    { value: "PERSON OF INDIAN ORIGIN (PIO) FROM ZAMBIA", label: "PIO from Zambia" },
    { value: "PERSON OF INDIAN ORIGIN (PIO) FROM MALAWI", label: "PIO from Malawi" },
    { value: "PERSON OF INDIAN ORIGIN (PIO) FROM ZAIRE", label: "PIO from Zaire" },
    { value: "PERSON OF INDIAN ORIGIN (PIO) FROM ETHIOPIA", label: "PIO from Ethiopia" },
    { value: "PERSON OF INDIAN ORIGIN (PIO) FROM VIETNAM", label: "PIO from Vietnam" },
    { value: "OCI (OVERSEAS CITIZEN OF INDIA)", label: "OCI (Overseas Citizen of India)" },
    { value: "FOREIGN NATIONALS WITH INDIAN DEGREE", label: "Foreign National with Indian Degree" },
    { value: "FOREIGN NATIONALS WITH INDIAN ORIGIN", label: "Foreign National with Indian Origin" },
];

const staticCasteOptions = [
    { value: "GEN", label: "General (UR)" },
    { value: "OBC", label: "OBC" },
    { value: "SC", label: "SC" },
    { value: "ST", label: "ST" },
    { value: "EWS", label: "EWS" },
];

const staticPwdOptions = [
    { value: "NO", label: "No" },
    { value: "YES", label: "Yes (PwD)" },
];

const staticEducationOptions = [
    { value: "POST DOCTORATE", label: "Post Doctorate" },
    { value: "PHD", label: "PhD" },
    { value: "POST GRADUATION", label: "Post Graduation" },
    { value: "GRADUATION", label: "Graduation" },
    { value: "DIPLOMA / ITI (POLYTECHNIC, ITI, DPHARM, PGDCA)", label: "Diploma / ITI" },
    { value: "(12TH)HIGHER SECONDARY", label: "Higher Secondary (12th)" },
    { value: "(10TH)SECONDARY", label: "Secondary (10th)" },
    { value: "BELOW 10TH", label: "Below 10th" },
    { value: "NO EDUCATION", label: "No Education" },
];

const staticCourseYearOptions = [
    { value: "PASSED", label: "Passed" },
    { value: "APPEARING", label: "Appearing" },
    { value: "APPEARING FINAL YEAR", label: "Appearing Final Year" },
];

const staticDomicileOptions = [
    { value: "ANDHRA PRADESH", label: "Andhra Pradesh" },
    { value: "ARUNACHAL PRADESH", label: "Arunachal Pradesh" },
    { value: "ASSAM", label: "Assam" },
    { value: "BIHAR", label: "Bihar" },
    { value: "CHHATTISGARH", label: "Chhattisgarh" },
    { value: "GOA", label: "Goa" },
    { value: "GUJARAT", label: "Gujarat" },
    { value: "HARYANA", label: "Haryana" },
    { value: "HIMACHAL PRADESH", label: "Himachal Pradesh" },
    { value: "JHARKHAND", label: "Jharkhand" },
    { value: "KARNATAKA", label: "Karnataka" },
    { value: "KERALA", label: "Kerala" },
    { value: "MADHYA PRADESH", label: "Madhya Pradesh" },
    { value: "MAHARASHTRA", label: "Maharashtra" },
    { value: "MANIPUR", label: "Manipur" },
    { value: "MEGHALAYA", label: "Meghalaya" },
    { value: "MIZORAM", label: "Mizoram" },
    { value: "NAGALAND", label: "Nagaland" },
    { value: "ODISHA", label: "Odisha" },
    { value: "PUNJAB", label: "Punjab" },
    { value: "RAJASTHAN", label: "Rajasthan" },
    { value: "SIKKIM", label: "Sikkim" },
    { value: "TAMIL NADU", label: "Tamil Nadu" },
    { value: "TELANGANA", label: "Telangana" },
    { value: "TRIPURA", label: "Tripura" },
    { value: "UTTAR PRADESH", label: "Uttar Pradesh" },
    { value: "UTTARAKHAND", label: "Uttarakhand" },
    { value: "WEST BENGAL", label: "West Bengal" },
    { value: "ANDAMAN AND NICOBAR ISLANDS", label: "Andaman and Nicobar Islands" },
    { value: "CHANDIGARH", label: "Chandigarh" },
    { value: "DADRA AND NAGAR HAVELI AND DAMAN AND DIU", label: "Dadra and Nagar Haveli and Daman and Diu" },
    { value: "DELHI", label: "Delhi (NCT)" },
    { value: "JAMMU AND KASHMIR", label: "Jammu and Kashmir" },
    { value: "LADAKH", label: "Ladakh" },
    { value: "LAKSHADWEEP", label: "Lakshadweep" },
    { value: "PUDUCHERRY", label: "Puducherry" },
];

const staticNccWingOptions = [
    { value: "NONE", label: "None / Not in NCC" },
    { value: "ARMY", label: "Army Wing" },
    { value: "NAVY", label: "Navy Wing" },
    { value: "AIR FORCE", label: "Air Force Wing" },
];

const staticNccCertificateOptions = [
    { value: "NONE", label: "None" },
    { value: "A", label: "A Certificate" },
    { value: "B", label: "B Certificate" },
    { value: "C", label: "C Certificate" },
];

const staticNccCertificateGradeOptions = [
    { value: "NONE", label: "None / Not Applicable" },
    { value: "A", label: "Grade A" },
    { value: "B", label: "Grade B" },
    { value: "C", label: "Grade C" },
];

const EDUCATION_HIERARCHY = [
    { key: 'POST DOCTORATE', label: 'Post Doctorate', shortLabel: 'Post Doctorate' },
    { key: 'PHD', label: 'PhD', shortLabel: 'PhD' },
    { key: 'POST GRADUATION', label: 'Post Graduation', shortLabel: 'Post Graduation' },
    { key: 'GRADUATION', label: 'Graduation', shortLabel: 'Graduation' },
    { key: 'DIPLOMA / ITI (POLYTECHNIC, ITI, DPHARM, PGDCA)', label: 'Diploma / ITI', shortLabel: 'Diploma ITI' },
    { key: '(12TH)HIGHER SECONDARY', label: '12th Higher Secondary', shortLabel: '12th Higher Secondary' },
    { key: '(10TH)SECONDARY', label: '10th Secondary', shortLabel: '10th Secondary' },
];

const completionStatusOptions = [
    { value: '', label: 'Select' },
    { value: 'PASSED', label: 'Passed' },
    { value: 'APPEARING', label: 'Appearing' },
    { value: 'APPEARING FINAL YEAR', label: 'Appearing Final Year' },
];

const generateYearOptions = () => {
    const currentYear = new Date().getFullYear();
    const years = [{ value: '', label: 'Year' }];
    for (let year = currentYear; year >= currentYear - 50; year--) {
        years.push({ value: year.toString(), label: year.toString() });
    }
    return years;
};
const yearOptions = generateYearOptions();

// ============================================
// MAIN COMPONENT
// ============================================

function CheckEligibilityPage() {
    // State for exam selection
    const [examOptions, setExamOptions] = useState([]);
    const [selectedExam, setSelectedExam] = useState("");
    const [examData, setExamData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    
    // State for search mode toggle
    const [searchMode, setSearchMode] = useState('exam'); // 'exam' or 'eligibility'
    
    // State for Important Notice Dialog
    const [noticeDialogOpen, setNoticeDialogOpen] = useState(false);

    // State for divisions
    const [hasDivisions, setHasDivisions] = useState(false);
    const [divisions, setDivisions] = useState([]);

    // State for dropdown options
    const [genderOptions, setGenderOptions] = useState(staticGenderOptions);
    const [maritalStatusOptions, setMaritalStatusOptions] = useState(staticMaritalStatusOptions);
    const [nationalityOptions, setNationalityOptions] = useState(staticNationalityOptions);
    const [casteOptions, setCasteOptions] = useState(staticCasteOptions);
    const [pwdOptions, setPwdOptions] = useState(staticPwdOptions);
    const [educationOptions, setEducationOptions] = useState(staticEducationOptions);
    const [courseOptions, setCourseOptions] = useState([]);
    const [subjectOptions, setSubjectOptions] = useState([]);
    const [courseYearOptions, setCourseYearOptions] = useState(staticCourseYearOptions);
    const [domicileOptions, setDomicileOptions] = useState(staticDomicileOptions);
    const [nccWingOptions, setNccWingOptions] = useState(staticNccWingOptions);
    const [nccCertificateOptions, setNccCertificateOptions] = useState(staticNccCertificateOptions);
    const [nccCertificateGradeOptions, setNccCertificateGradeOptions] = useState(staticNccCertificateGradeOptions);

    // State for domicile control
    const [isDomicileDisabled, setIsDomicileDisabled] = useState(true);

    // State for education table
    const [educationTableData, setEducationTableData] = useState({});
    const [visibleEducationLevels, setVisibleEducationLevels] = useState([]);

    // State for form data
    const [formData, setFormData] = useState({
        date_of_birth: "",
        gender: "",
        marital_status: "",
        nationality: "",
        caste_category: "",
        pwd_status: "",
        domicile: "",
        highest_education_qualification: "",
        eligibility_education_course: "",
        eligibility_education_course_subject: "",
        eligibility_course_year: "",
        eligibility_marks: "",
        percentage_10th_requirement: "",
        percentage_12th_requirement: "",
        subjects_at_10th: "",
        subjects_at_12th: "",
        active_backlogs_allowed: "",
        gap_years_allowed: "",
        ncc_wing: "",
        ncc_certificate: "",
        ncc_certificate_grade: "",
        sports_quota_eligibility: "",
        cpl_holder: "",
        height_cm: "",
        weight_kg: "",
        vision_eyesight: "",
        language_proficiency: "",
        driving_license_type: "",
        current_employment_status: "",
        work_experience_years: "",
        ex_servicemen_status: "",
    });

    // State for results
    const [results, setResults] = useState([]);
    const [showResults, setShowResults] = useState(false);
    const [displayDetails, setDisplayDetails] = useState(null);
    
    // State for eligibility basis mode
    const [eligibilityBasisResults, setEligibilityBasisResults] = useState(null);
    const [checkingProgress, setCheckingProgress] = useState({ current: 0, total: 0, examName: '' });

    // Ref for scrolling to results
    const resultsRef = useRef(null);

    // ============================================
    // LOAD DATA ON MOUNT
    // ============================================

    useEffect(() => {
        const options = getExamDropdownOptions();
        setExamOptions(options);
    }, []);

    useEffect(() => {
        const loadEducationData = async () => {
            try {
                await loadEduFinalData();
                console.log('edu_final.json loaded successfully');
            } catch (error) {
                console.error('Failed to load edu_final.json:', error);
            }
        };
        loadEducationData();
    }, []);

    // ============================================
    // HANDLERS
    // ============================================

    const handleExamChange = useCallback(async (event) => {
        const examCode = event.target.value;
        setSelectedExam(examCode);
        setResults([]);
        setShowResults(false);
        setError("");
        
        // Reset form data
        setFormData(prev => ({
            ...prev,
            gender: "",
            marital_status: "",
            nationality: "",
            caste_category: "",
            pwd_status: "",
            domicile: "",
            highest_education_qualification: "",
            eligibility_education_course: "",
            eligibility_education_course_subject: "",
            eligibility_course_year: "",
            eligibility_marks: "",
            ncc_wing: "",
            ncc_certificate: "",
            ncc_certificate_grade: "",
        }));
        
        setIsDomicileDisabled(true);

        if (!examCode) {
            setExamData(null);
            setHasDivisions(false);
            setDivisions([]);
            setDisplayDetails(null);
            setGenderOptions(staticGenderOptions);
            setMaritalStatusOptions(staticMaritalStatusOptions);
            setNationalityOptions(staticNationalityOptions);
            setCasteOptions(staticCasteOptions);
            return;
        }

        setLoading(true);
        const result = await loadExamDataForBasis(examCode, examOptions);
        
        if (result.error) {
            setError(result.error);
            setLoading(false);
            return;
        }

        setExamData(result.examData);
        setDisplayDetails(result.displayDetails);
        setHasDivisions(result.hasDivisions);
        setDivisions(result.divisions);

        // Set options
        setGenderOptions(staticGenderOptions);
        setPwdOptions(staticPwdOptions);
        setEducationOptions(staticEducationOptions);

        // Extract caste options from exam data
        const casteValues = extractOptionsFromExamData(result.examData, 'caste_category');
        if (casteValues.length > 0) {
            setCasteOptions(valuesToOptions(casteValues, {
                'GEN': 'GENERAL (UR/UNRESERVED)',
                'SC': 'SC (SCHEDULED CASTE)',
                'ST': 'ST (SCHEDULED TRIBE)',
                'OBC': 'OBC (OTHER BACKWARD CLASS)',
                'EWS': 'EWS (ECONOMICALLY WEAKER SECTION)',
            }));
        } else {
            setCasteOptions(staticCasteOptions);
        }

        // Extract nationality options
        const nationalityValues = extractNationalityFromExamData(result.examData);
        if (nationalityValues.length > 0) {
            setNationalityOptions(nationalityValues.map(value => ({
                value: value,
                label: value
            })));
        } else {
            setNationalityOptions(staticNationalityOptions);
        }

        setLoading(false);
    }, [examOptions]);

    const handleChange = (field) => (event) => {
        const newValue = event.target.value;
        setFormData(prev => ({ ...prev, [field]: newValue }));
        setShowResults(false);
        
        if (field === 'gender') {
            const newMaritalOptions = getMaritalStatusOptionsForGender(newValue);
            setMaritalStatusOptions(newMaritalOptions);
            const isValidMaritalStatus = newMaritalOptions.some(opt => opt.value === formData.marital_status);
            if (!isValidMaritalStatus && formData.marital_status) {
                setFormData(prev => ({ ...prev, marital_status: '' }));
            }
        }
        
        if (field === 'nationality') {
            const isIndian = newValue && newValue.toUpperCase() === 'INDIAN';
            setIsDomicileDisabled(!isIndian);
            if (!isIndian) {
                setFormData(prev => ({ ...prev, domicile: '' }));
            }
        }
    };
    
    const handleEducationLevelChange = (event) => {
        const level = event.target.value;
        
        setFormData(prev => ({ 
            ...prev, 
            highest_education_qualification: level,
            eligibility_education_course: "",
            eligibility_education_course_subject: ""
        }));
        setShowResults(false);
        
        const courses = getCoursesForLevel(level);
        setCourseOptions(courses);
        setSubjectOptions([]);
        
        const levelIndex = EDUCATION_HIERARCHY.findIndex(h => h.key === level);
        if (levelIndex !== -1) {
            const visibleLevels = EDUCATION_HIERARCHY.slice(levelIndex);
            setVisibleEducationLevels(visibleLevels);
            
            const initialTableData = {};
            visibleLevels.forEach(lvl => {
                if (!educationTableData[lvl.key]) {
                    initialTableData[lvl.key] = {
                        course: '',
                        subject: '',
                        completionStatus: '',
                        marks: '',
                        completedYear: ''
                    };
                } else {
                    initialTableData[lvl.key] = educationTableData[lvl.key];
                }
            });
            setEducationTableData(initialTableData);
        } else {
            setVisibleEducationLevels([]);
            setEducationTableData({});
        }
    };
    
    const handleEducationTableChange = (levelKey, field, value) => {
        setEducationTableData(prev => ({
            ...prev,
            [levelKey]: {
                ...prev[levelKey],
                [field]: value,
                ...(field === 'course' ? { subject: '' } : {})
            }
        }));
        setShowResults(false);
        
        if (levelKey === formData.highest_education_qualification) {
            if (field === 'course') {
                setFormData(prev => ({
                    ...prev,
                    eligibility_education_course: value,
                    eligibility_education_course_subject: ''
                }));
                const subjects = getSubjectsForCourse(value, levelKey);
                setSubjectOptions(subjects);
            } else if (field === 'subject') {
                setFormData(prev => ({
                    ...prev,
                    eligibility_education_course_subject: value
                }));
            } else if (field === 'completionStatus') {
                setFormData(prev => ({
                    ...prev,
                    eligibility_course_year: value
                }));
            } else if (field === 'marks') {
                setFormData(prev => ({
                    ...prev,
                    eligibility_marks: value
                }));
            }
        }
        
        if (levelKey === '(10TH)SECONDARY') {
            if (field === 'marks') {
                setFormData(prev => ({ ...prev, percentage_10th_requirement: value }));
            } else if (field === 'subject') {
                setFormData(prev => ({ ...prev, subjects_at_10th: value }));
            }
        } else if (levelKey === '(12TH)HIGHER SECONDARY') {
            if (field === 'marks') {
                setFormData(prev => ({ ...prev, percentage_12th_requirement: value }));
            } else if (field === 'subject') {
                setFormData(prev => ({ ...prev, subjects_at_12th: value }));
            }
        }
    };
    
    const getCourseOptionsForLevel = (levelKey) => {
        return getCoursesForLevel(levelKey);
    };
    
    const getSubjectOptionsForCourse = (course, levelKey = null) => {
        return getSubjectsForCourse(course, levelKey);
    };

    // ============================================
    // CHECK ELIGIBILITY
    // ============================================

    const handleCheckEligibility = () => {
        setError("");

        if (searchMode === 'exam') {
            // Exam Basis Mode
            if (!selectedExam) {
                setError("Please select a target exam");
                return;
            }
            if (!formData.date_of_birth) {
                setError("Please enter your date of birth");
                return;
            }
            if (!examData) {
                setError("Exam data not loaded");
                return;
            }

            const userInput = prepareUserInput(formData, educationTableData);
            const allResults = checkExamBasisEligibility(userInput, examData, hasDivisions, divisions, selectedExam);
            
            setResults(allResults);
            setShowResults(true);
        } else {
            // Eligibility Basis Mode
            if (!formData.date_of_birth) {
                setError("Please enter your date of birth");
                return;
            }
            
            setLoading(true);
            setCheckingProgress({ current: 0, total: examOptions.length, examName: '' });
            
            checkEligibilityBasis(formData, educationTableData, (examName, current, total) => {
                setCheckingProgress({ current, total, examName });
            }).then(result => {
                // Store full results for eligibility basis
                setEligibilityBasisResults(result);
                
                // Get summary grouped by exam
                const summary = getEligibleExamsSummary(result.eligible);
                setResults(summary);
                setShowResults(true);
                setLoading(false);
                setCheckingProgress({ current: 0, total: 0, examName: '' });
            }).catch(err => {
                setError("Error checking eligibility: " + err.message);
                setLoading(false);
                setCheckingProgress({ current: 0, total: 0, examName: '' });
            });
        }
        
        // Scroll to results
        setTimeout(() => {
            if (resultsRef.current) {
                resultsRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        }, 100);
    };

    // ============================================
    // RENDER FUNCTIONS
    // ============================================

    // Render for Exam Basis Mode
    const renderExamBasisSummary = () => {
        if (!showResults || results.length === 0) return null;

        const eligibleCount = results.filter(r => r.eligible).length;
        const notEligibleCount = results.length - eligibleCount;

        return (
            <div className="bg-white rounded-lg shadow-lg overflow-hidden h-fit border border-gray-200">
                <h3 className="bg-gray-800 text-white px-3 py-2 font-semibold text-sm">
                    📋 Results Summary
                </h3>
                
                <div className="p-3 bg-gradient-to-r from-blue-50 to-indigo-50 border-b">
                    <p className="text-xs text-gray-600 mb-2">
                        {examData?.exam_name || selectedExam}
                    </p>
                    <div className="flex gap-2">
                        <div className="text-center px-2 py-1 bg-green-100 rounded-lg flex-1">
                            <p className="text-lg font-bold text-green-600">{eligibleCount}</p>
                            <p className="text-xs text-green-700">Eligible</p>
                        </div>
                        <div className="text-center px-2 py-1 bg-red-100 rounded-lg flex-1">
                            <p className="text-lg font-bold text-red-600">{notEligibleCount}</p>
                            <p className="text-xs text-red-700">Not Eligible</p>
                        </div>
                    </div>
                    <p className="text-xs text-gray-500 mt-2">
                        Checked {results.length} combination(s)
                    </p>
                </div>

                <div 
                    className="overflow-x-auto max-h-[350px] overflow-y-auto"
                    style={thinScrollbarStyle}
                >
                    <table className="w-full">
                        <thead className="bg-gray-100 sticky top-0">
                            <tr>
                                <th className="px-3 py-2 text-left text-xs">Division</th>
                                <th className="px-3 py-2 text-left text-xs">Session</th>
                                <th className="px-3 py-2 text-center text-xs">Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {results.map((result, index) => (
                                <tr 
                                    key={index} 
                                    className={`border-b hover:bg-gray-50 ${result.eligible ? '' : 'bg-red-50'}`}
                                >
                                    <td className="px-3 py-2 text-xs">
                                        <span className="font-semibold text-indigo-600">{result.division}</span>
                                    </td>
                                    <td className="px-3 py-2 text-xs">{result.session}</td>
                                    <td className="px-3 py-2 text-center">
                                        <Chip
                                            label={result.eligible ? "✓" : "✗"}
                                            color={result.eligible ? "success" : "error"}
                                            size="small"
                                        />
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        );
    };

    // Render for Eligibility Basis Mode - Eligible Exams List
    const renderEligibilityBasisSummary = () => {
        if (!showResults || !eligibilityBasisResults) return null;

        const { eligibleCount, ineligibleCount, totalExamsChecked } = eligibilityBasisResults;

        return (
            <div className="bg-white rounded-lg shadow-lg overflow-hidden h-fit border border-gray-200">
                <h3 className="bg-green-600 text-white px-3 py-2 font-semibold text-sm">
                    🎯 Exams You're Eligible For
                </h3>
                
                <div className="p-3 bg-gradient-to-r from-green-50 to-emerald-50 border-b">
                    <div className="flex gap-2 mb-2">
                        <div className="text-center px-2 py-1 bg-green-100 rounded-lg flex-1">
                            <p className="text-xl font-bold text-green-600">{results.length}</p>
                            <p className="text-xs text-green-700">Eligible Exams</p>
                        </div>
                        <div className="text-center px-2 py-1 bg-blue-100 rounded-lg flex-1">
                            <p className="text-xl font-bold text-blue-600">{totalExamsChecked}</p>
                            <p className="text-xs text-blue-700">Total Checked</p>
                        </div>
                    </div>
                    <p className="text-xs text-gray-500">
                        Found {eligibleCount} eligible posts/divisions across {results.length} exams
                    </p>
                </div>

                <div 
                    className="overflow-x-auto max-h-[400px] overflow-y-auto"
                    style={thinScrollbarStyle}
                >
                    {results.length === 0 ? (
                        <div className="p-4 text-center text-gray-500">
                            <p className="text-sm">No eligible exams found based on your profile.</p>
                            <p className="text-xs mt-1">Try adjusting your details or check back later.</p>
                        </div>
                    ) : (
                        <div className="p-2">
                            {results.map((exam, index) => (
                                <div 
                                    key={index} 
                                    className="border border-green-200 rounded-lg p-3 mb-2 bg-green-50 hover:bg-green-100 transition-colors"
                                >
                                    <div className="flex justify-between items-start">
                                        <div className="flex-1">
                                            <h4 className="font-bold text-gray-800 text-sm">
                                                {exam.examLabel || exam.examName}
                                            </h4>
                                            {exam.displayDetails?.conducting_body && (
                                                <p className="text-xs text-gray-500 mt-1">
                                                    {exam.displayDetails.conducting_body}
                                                </p>
                                            )}
                                        </div>
                                        <Chip
                                            label={`${exam.totalEligible} posts`}
                                            color="success"
                                            size="small"
                                        />
                                    </div>
                                    
                                    {exam.divisions.length > 0 && (
                                        <div className="mt-2">
                                            <span className="text-xs text-gray-600">Eligible Divisions: </span>
                                            <div className="flex flex-wrap gap-1 mt-1">
                                                {exam.divisions.slice(0, 5).map((div, idx) => (
                                                    <span key={idx} className="text-xs bg-indigo-100 text-indigo-700 px-2 py-0.5 rounded">
                                                        {div}
                                                    </span>
                                                ))}
                                                {exam.divisions.length > 5 && (
                                                    <span className="text-xs text-gray-500">+{exam.divisions.length - 5} more</span>
                                                )}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        );
    };

    // Combined render function that decides which to show
    const renderResultsSummary = () => {
        if (searchMode === 'exam') {
            return renderExamBasisSummary();
        } else {
            return renderEligibilityBasisSummary();
        }
    };

    // Detailed Results for Exam Basis Mode
    const renderExamBasisDetails = () => {
        if (!showResults || results.length === 0) return null;

        return (
            <div className="h-full">
                <h3 className="bg-gray-800 text-white px-3 py-2 font-semibold text-sm rounded-t-lg">
                    📝 Detailed Eligibility Check
                </h3>
                
                <div className="p-3 bg-gradient-to-r from-indigo-50 to-purple-50 border-b">
                    <div className="grid grid-cols-2 gap-2 text-xs">
                        {hasDivisions && divisions.length > 0 ? (
                            <div>
                                <span className="text-gray-500">Divisions:</span>
                                <p className="font-medium text-indigo-700">{divisions.length} divisions checked</p>
                            </div>
                        ) : (
                            <div>
                                <span className="text-gray-500">Type:</span>
                                <p className="font-medium text-indigo-700">Single exam</p>
                            </div>
                        )}
                        {displayDetails?.conducting_body && (
                            <div>
                                <span className="text-gray-500">Conducting Body:</span>
                                <p className="font-medium text-indigo-700">{displayDetails.conducting_body}</p>
                            </div>
                        )}
                    </div>
                </div>

                <div 
                    className="p-2 max-h-[350px] overflow-y-auto"
                    style={thinScrollbarStyle}
                >
                    {results.map((result, index) => (
                        <div 
                            key={index} 
                            className={`rounded-lg p-2 border mb-2 ${result.eligible ? 'bg-green-50 border-green-300' : 'bg-red-50 border-red-300'}`}
                        >
                            <div className="flex items-center gap-2 mb-2 flex-wrap">
                                <span className="font-bold text-indigo-700 text-sm">{result.division}</span>
                                <span className="text-gray-400">|</span>
                                <span className="text-xs text-gray-600">{result.session}</span>
                                <Chip
                                    label={result.eligible ? "Eligible" : "Not Eligible"}
                                    color={result.eligible ? "success" : "error"}
                                    size="small"
                                />
                            </div>

                            <div className="overflow-x-auto">
                                <table className="w-full text-xs">
                                    <thead className="bg-gray-100">
                                        <tr>
                                            <th className="px-2 py-1 text-left">Criteria</th>
                                            <th className="px-2 py-1 text-left">You</th>
                                            <th className="px-2 py-1 text-left">Required</th>
                                            <th className="px-2 py-1 text-center">✓/✗</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {result.results && result.results.map((check, idx) => (
                                            <tr key={idx} className={`border-b ${check.eligible ? '' : 'bg-red-100'}`}>
                                                <td className="px-2 py-1">{check.field}</td>
                                                <td className="px-2 py-1">{check.userValue}</td>
                                                <td className="px-2 py-1 text-gray-600 truncate max-w-[80px]" title={check.examRequirement}>
                                                    {check.examRequirement?.length > 12 ? check.examRequirement.substring(0, 12) + '...' : check.examRequirement}
                                                </td>
                                                <td className="px-2 py-1 text-center">
                                                    {check.eligible ? (
                                                        <span className="text-green-600 font-bold">✓</span>
                                                    ) : (
                                                        <span className="text-red-600 font-bold">✗</span>
                                                    )}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        );
    };

    // Detailed Results for Eligibility Basis Mode - Shows NOT eligible exams
    const renderEligibilityBasisDetails = () => {
        if (!showResults || !eligibilityBasisResults) return null;

        const ineligibleExams = eligibilityBasisResults.ineligible || [];
        
        // Group ineligible by exam
        const ineligibleByExam = new Map();
        ineligibleExams.forEach(result => {
            const key = result.examCode;
            if (!ineligibleByExam.has(key)) {
                ineligibleByExam.set(key, {
                    examLabel: result.examLabel,
                    examName: result.examName,
                    reasons: new Set(),
                    count: 0
                });
            }
            const exam = ineligibleByExam.get(key);
            exam.count++;
            // Extract failed criteria
            if (result.results) {
                result.results.filter(r => !r.eligible).forEach(r => {
                    exam.reasons.add(r.field);
                });
            }
        });

        const ineligibleList = Array.from(ineligibleByExam.values());

        return (
            <div className="h-full">
                <h3 className="bg-orange-500 text-white px-3 py-2 font-semibold text-sm rounded-t-lg">
                    ⚠️ Not Eligible For ({ineligibleList.length} exams)
                </h3>
                
                <div className="p-3 bg-gradient-to-r from-orange-50 to-yellow-50 border-b">
                    <p className="text-xs text-gray-600">
                        These exams don't match your current profile. Review the criteria to see why.
                    </p>
                </div>

                <div 
                    className="p-2 max-h-[350px] overflow-y-auto"
                    style={thinScrollbarStyle}
                >
                    {ineligibleList.length === 0 ? (
                        <div className="p-4 text-center text-green-600">
                            <p className="text-sm font-semibold">🎉 Great news!</p>
                            <p className="text-xs">You're eligible for all exams we checked!</p>
                        </div>
                    ) : (
                        ineligibleList.slice(0, 20).map((exam, index) => (
                            <div 
                                key={index} 
                                className="rounded-lg p-2 border mb-2 bg-orange-50 border-orange-200"
                            >
                                <div className="flex justify-between items-start">
                                    <div>
                                        <h4 className="font-semibold text-gray-800 text-sm">
                                            {exam.examLabel || exam.examName}
                                        </h4>
                                        <p className="text-xs text-gray-500">
                                            {exam.count} posts/divisions not eligible
                                        </p>
                                    </div>
                                </div>
                                
                                {exam.reasons.size > 0 && (
                                    <div className="mt-2">
                                        <span className="text-xs text-red-600 font-medium">Failed criteria: </span>
                                        <div className="flex flex-wrap gap-1 mt-1">
                                            {Array.from(exam.reasons).slice(0, 4).map((reason, idx) => (
                                                <span key={idx} className="text-xs bg-red-100 text-red-700 px-2 py-0.5 rounded">
                                                    {reason}
                                                </span>
                                            ))}
                                            {exam.reasons.size > 4 && (
                                                <span className="text-xs text-gray-500">+{exam.reasons.size - 4} more</span>
                                            )}
                                        </div>
                                    </div>
                                )}
                            </div>
                        ))
                    )}
                    {ineligibleList.length > 20 && (
                        <p className="text-xs text-gray-500 text-center py-2">
                            Showing 20 of {ineligibleList.length} ineligible exams
                        </p>
                    )}
                </div>
            </div>
        );
    };

    // Combined detailed results render function
    const renderDetailedResultsInline = () => {
        if (searchMode === 'exam') {
            return renderExamBasisDetails();
        } else {
            return renderEligibilityBasisDetails();
        }
    };

    // ============================================
    // MAIN RENDER
    // ============================================

    return (
        <ThemeProvider theme={theme}>
            <div className="min-h-screen bg-gray-800 pt-18 pb-12 px-2 sm:px-3 lg:px-4">
                {/* Header Section */}
                <div className="w-full mx-auto bg-white rounded-xl shadow-lg p-2 sm:p-3 mb-2">
                    <div className="flex flex-col sm:flex-row items-center gap-3">
                        <div className="flex-1 w-full sm:w-auto">
                            <div className="bg-gray-800 rounded-xl px-6 py-3 flex items-center justify-center gap-3">
                                <h1 className="text-lg sm:text-xl font-bold text-white">
                                    Check Your Eligibility
                                </h1>
                                <button
                                    onClick={() => setNoticeDialogOpen(true)}
                                    className="flex items-center gap-1.5 bg-red-500 hover:bg-red-600 rounded-lg px-2 py-1 transition-all duration-200 cursor-pointer"
                                >
                                    <span className="relative flex h-2 w-2">
                                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
                                        <span className="relative inline-flex rounded-full h-2 w-2 bg-white"></span>
                                    </span>
                                    <span className="text-xs font-semibold text-white">Notice</span>
                                </button>
                            </div>
                        </div>
                        
                        <div className="flex flex-wrap gap-2 justify-center sm:justify-end">
                            <div className="bg-gray-100 border-2 border-gray-400 rounded-xl px-4 py-2 text-center min-w-[140px]">
                                <span className="text-xs text-gray-600 font-medium">Total exam available : </span>
                                <span className="text-sm font-bold text-gray-800">{examOptions.length}</span>
                            </div>
                            <div className="bg-gray-100 border-2 border-gray-400 rounded-xl px-4 py-2 text-center min-w-[140px]">
                                <span className="text-xs text-gray-600 font-medium">Total inputs in form : </span>
                                <span className="text-sm font-bold text-gray-800">31</span>
                            </div>
                            <div className="bg-gray-100 border-2 border-gray-400 rounded-xl px-4 py-2 text-center min-w-[140px]">
                                <span className="text-xs text-gray-600 font-medium">Total exam available : </span>
                                <span className="text-sm font-bold text-gray-800">{examOptions.length}</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Important Notice Dialog */}
                <Dialog 
                    open={noticeDialogOpen} 
                    onClose={() => setNoticeDialogOpen(false)}
                    maxWidth="sm"
                    fullWidth
                    PaperProps={{
                        sx: {
                            borderRadius: '16px',
                            overflow: 'hidden'
                        }
                    }}
                >
                    <DialogTitle sx={{ 
                        background: 'linear-gradient(135deg, #ff6600 0%, #ff8533 100%)',
                        color: 'white',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        py: 2
                    }}>
                        <div className="flex items-center gap-2">
                            <span className="text-2xl">⚠️</span>
                            <Typography variant="h6" component="span" fontWeight="bold">
                                Important Notice
                            </Typography>
                        </div>
                        <IconButton 
                            onClick={() => setNoticeDialogOpen(false)} 
                            sx={{ color: 'white' }}
                            size="small"
                        >
                            ✕
                        </IconButton>
                    </DialogTitle>
                    <DialogContent sx={{ pt: 3, pb: 2 }}>
                        <div className="space-y-4">
                            <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded-r-lg">
                                <Typography variant="h6" className="text-blue-800 font-bold mb-2">
                                    🙏 Welcome to Pratiyogita Yogya!
                                </Typography>
                                <Typography variant="body2" className="text-blue-700">
                                    Your trusted companion for exam eligibility checking.
                                </Typography>
                            </div>

                            <div className="bg-green-50 border-l-4 border-green-500 p-4 rounded-r-lg">
                                <Typography variant="subtitle1" className="text-green-800 font-bold mb-2">
                                    🔒 Data Privacy & Security
                                </Typography>
                                <Typography variant="body2" className="text-green-700">
                                    We <strong>DO NOT</strong> sell your data or use it for any fraudulent activities. 
                                    Your information is safe with us.
                                </Typography>
                            </div>

                            <div className="bg-yellow-50 border-l-4 border-yellow-500 p-4 rounded-r-lg">
                                <Typography variant="subtitle1" className="text-yellow-800 font-bold mb-2">
                                    📋 Eligibility Criteria Disclaimer
                                </Typography>
                                <Typography variant="body2" className="text-yellow-700">
                                    The information is <strong>only</strong> to determine eligibility based on our defined criteria.
                                </Typography>
                            </div>

                            <div className="bg-purple-50 border-l-4 border-purple-500 p-4 rounded-r-lg">
                                <Typography variant="subtitle1" className="text-purple-800 font-bold mb-2">
                                    📄 Official Notification
                                </Typography>
                                <Typography variant="body2" className="text-purple-700">
                                    Always refer to the <strong>official exam notification</strong> for complete eligibility criteria.
                                </Typography>
                            </div>
                        </div>
                    </DialogContent>
                    <DialogActions sx={{ px: 3, pb: 3, justifyContent: 'center' }}>
                        <Button 
                            onClick={() => setNoticeDialogOpen(false)} 
                            variant="contained"
                            sx={{ 
                                background: 'linear-gradient(135deg, #ff6600 0%, #ff8533 100%)',
                                borderRadius: '8px',
                                px: 4,
                                py: 1,
                                textTransform: 'none',
                                fontWeight: 'bold',
                            }}
                        >
                            I Understand
                        </Button>
                    </DialogActions>
                </Dialog>

                {error && (
                    <Alert severity="error" className="mb-4" onClose={() => setError("")}>
                        {error}
                    </Alert>
                )}

                {/* Form Section */}
                <div className="w-full">
                    <div 
                        className="bg-white rounded-xl shadow-lg p-3 max-h-[75vh] overflow-y-auto"
                        style={thinScrollbarStyle}
                    >
                        <Box component="form" noValidate autoComplete="off">
                            {/* Section 1: Exam Selection with Toggle */}
                            <div className="rounded-lg p-3 mb-3 border border-gray-200">
                                <h2 className="text-sm font-semibold text-gray-800 mb-3 text-left">
                                    Select Target Exam
                                </h2>
                                <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center">
                                    {/* Toggle Switch */}
                                    <div className="flex items-center gap-2 shrink-0">
                                        <span className={`text-xs font-semibold transition-colors ${searchMode === 'exam' ? 'text-green-600' : 'text-gray-400'}`}>
                                            Exam Basis
                                        </span>
                                        <button
                                            type="button"
                                            onClick={() => setSearchMode(searchMode === 'exam' ? 'eligibility' : 'exam')}
                                            className={`relative w-12 h-6 rounded-full transition-colors duration-300 focus:outline-none ${
                                                searchMode === 'eligibility' ? 'bg-orange-500' : 'bg-green-500'
                                            }`}
                                        >
                                            <span
                                                className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full shadow-md transition-transform duration-300 ${
                                                    searchMode === 'eligibility' ? 'translate-x-6' : 'translate-x-0'
                                                }`}
                                            />
                                        </button>
                                        <span className={`text-xs font-semibold transition-colors ${searchMode === 'eligibility' ? 'text-orange-600' : 'text-gray-400'}`}>
                                            Eligibility Basis
                                        </span>
                                        
                                        {/* Info Icon with Tooltip */}
                                        <div className="relative group">
                                            <span className="cursor-help text-gray-400 hover:text-gray-600 transition-colors">
                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                </svg>
                                            </span>
                                            <div className="absolute left-0 top-6 z-50 hidden group-hover:block w-72 bg-gray-900 text-white text-xs rounded-lg p-3 shadow-xl">
                                                <div className="mb-2 pb-2 border-b border-gray-700">
                                                    <span className="font-bold text-green-400">🎯 Exam Basis:</span>
                                                    <p className="mt-1 text-gray-300">Select an exam first, then fill your details to check if you're eligible.</p>
                                                </div>
                                                <div>
                                                    <span className="font-bold text-orange-400">📋 Eligibility Basis:</span>
                                                    <p className="mt-1 text-gray-300">Fill your details first, and we'll show you all exams you're eligible for.</p>
                                                </div>
                                                <div className="absolute -top-1 left-2 w-2 h-2 bg-gray-900 transform rotate-45"></div>
                                            </div>
                                        </div>
                                    </div>
                                    
                                    {/* Target Exam Dropdown - Only show in Exam Basis mode */}
                                    {searchMode === 'exam' && (
                                        <div className="flex-1 w-full">
                                            <TextField
                                                select
                                                fullWidth
                                                label="Target Exam"
                                                required
                                                value={selectedExam}
                                                onChange={handleExamChange}
                                                helperText="Select your target exam"
                                                size="small"
                                                disabled={loading}
                                            >
                                                <MenuItem value="">
                                                    <em>Select an exam</em>
                                                </MenuItem>
                                                {examOptions.map((option) => (
                                                    <MenuItem key={option.value} value={option.value}>
                                                        {option.label}
                                                        {option.hasDivisions && (
                                                            <Chip 
                                                                label="Multi-Division" 
                                                                size="small" 
                                                                color="primary"
                                                                variant="outlined"
                                                                className="ml-2" 
                                                            />
                                                        )}
                                                    </MenuItem>
                                                ))}
                                            </TextField>
                                        </div>
                                    )}
                                    
                                    {/* Eligibility Basis Mode Description */}
                                    {searchMode === 'eligibility' && (
                                        <div className="flex-1 w-full bg-orange-50 border border-orange-200 rounded-lg p-3">
                                            <div className="flex items-start gap-2">
                                                <span className="text-orange-500 text-lg">📋</span>
                                                <div>
                                                    <p className="text-sm font-semibold text-orange-700">Eligibility Basis Mode</p>
                                                    <p className="text-xs text-orange-600 mt-1">
                                                        Fill in your details below, and we'll check <strong>all {examOptions.length} exams</strong> to show which ones you're eligible for.
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </div>

                                {loading && (
                                    <div className="flex flex-col items-center justify-center mt-4 p-4 bg-blue-50 rounded-lg">
                                        <CircularProgress size={24} />
                                        {searchMode === 'eligibility' && checkingProgress.total > 0 ? (
                                            <div className="mt-2 text-center">
                                                <p className="text-sm text-gray-700">
                                                    Checking: <span className="font-semibold">{checkingProgress.examName}</span>
                                                </p>
                                                <p className="text-xs text-gray-500">
                                                    {checkingProgress.current} of {checkingProgress.total} exams
                                                </p>
                                                <div className="w-48 h-2 bg-gray-200 rounded-full mt-2">
                                                    <div 
                                                        className="h-2 bg-orange-500 rounded-full transition-all duration-300"
                                                        style={{ width: `${(checkingProgress.current / checkingProgress.total) * 100}%` }}
                                                    />
                                                </div>
                                            </div>
                                        ) : (
                                            <span className="ml-2 text-sm">Loading...</span>
                                        )}
                                    </div>
                                )}
                            </div>

                            {/* Section 2: Personal Information */}
                            {(examData || searchMode === 'eligibility') && (
                                <div className="rounded-lg p-3 mb-3 border border-gray-200">
                                    <h2 className="text-sm font-semibold text-gray-800 mb-3 text-left">
                                        Personal Information
                                    </h2>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
                                        <TextField
                                            fullWidth
                                            label="Date of Birth"
                                            type="date"
                                            required
                                            value={formData.date_of_birth}
                                            onChange={handleChange("date_of_birth")}
                                            InputLabelProps={{ shrink: true }}
                                            helperText="Enter your date of birth"
                                            size="small"
                                        />

                                        <TextField
                                            select
                                            fullWidth
                                            label="Gender"
                                            required
                                            value={formData.gender}
                                            onChange={handleChange("gender")}
                                            helperText="Select your gender"
                                            size="small"
                                        >
                                            {genderOptions.map((option) => (
                                                <MenuItem key={option.value} value={option.value}>
                                                    {option.label}
                                                </MenuItem>
                                            ))}
                                        </TextField>

                                        <TextField
                                            select
                                            fullWidth
                                            label="Marital Status"
                                            required
                                            value={formData.marital_status}
                                            onChange={handleChange("marital_status")}
                                            helperText="Select your marital status"
                                            size="small"
                                        >
                                            {maritalStatusOptions.map((option) => (
                                                <MenuItem key={option.value} value={option.value}>
                                                    {option.label}
                                                </MenuItem>
                                            ))}
                                        </TextField>

                                        <TextField
                                            select
                                            fullWidth
                                            label="Nationality"
                                            required
                                            value={formData.nationality}
                                            onChange={handleChange("nationality")}
                                            helperText="Select your nationality"
                                            size="small"
                                        >
                                            {nationalityOptions.map((option) => (
                                                <MenuItem key={option.value} value={option.value}>
                                                    {option.label}
                                                </MenuItem>
                                            ))}
                                        </TextField>

                                        <TextField
                                            select
                                            fullWidth
                                            label="Domicile State"
                                            value={formData.domicile}
                                            onChange={handleChange("domicile")}
                                            helperText={isDomicileDisabled ? "Select 'INDIAN' nationality first" : "Your domicile state"}
                                            size="small"
                                            disabled={isDomicileDisabled}
                                        >
                                            {domicileOptions.map((option) => (
                                                <MenuItem key={option.value} value={option.value}>
                                                    {option.label}
                                                </MenuItem>
                                            ))}
                                        </TextField>

                                        <TextField
                                            select
                                            fullWidth
                                            label="Caste/Category"
                                            required
                                            value={formData.caste_category}
                                            onChange={handleChange("caste_category")}
                                            helperText="Select your category"
                                            size="small"
                                        >
                                            {casteOptions.map((option) => (
                                                <MenuItem key={option.value} value={option.value}>
                                                    {option.label}
                                                </MenuItem>
                                            ))}
                                        </TextField>

                                        <TextField
                                            select
                                            fullWidth
                                            label="Person with Disability"
                                            value={formData.pwd_status}
                                            onChange={handleChange("pwd_status")}
                                            helperText="Are you a PwD candidate?"
                                            size="small"
                                        >
                                            {pwdOptions.map((option) => (
                                                <MenuItem key={option.value} value={option.value}>
                                                    {option.label}
                                                </MenuItem>
                                            ))}
                                        </TextField>
                                    </div>
                                </div>
                            )}

                            {/* Section 3: Educational Qualification */}
                            {(examData || searchMode === 'eligibility') && (
                                <div className="rounded-lg p-3 mb-3 border border-gray-200">
                                    <h2 className="text-sm font-semibold text-gray-800 mb-3 text-left">
                                        Educational Qualification
                                    </h2>
                                    
                                    <div className="mb-4 max-w-xs">
                                        <TextField
                                            select
                                            fullWidth
                                            label="Highest Education Qualification"
                                            required
                                            value={formData.highest_education_qualification}
                                            onChange={handleEducationLevelChange}
                                            helperText="Select your highest qualification level"
                                            size="small"
                                        >
                                            {educationOptions.map((option) => (
                                                <MenuItem key={option.value} value={option.value}>
                                                    {option.label}
                                                </MenuItem>
                                            ))}
                                        </TextField>
                                    </div>
                                    
                                    {visibleEducationLevels.length > 0 && (
                                        <div className="overflow-x-auto">
                                            <div className="hidden sm:grid sm:grid-cols-6 gap-2 mb-2 px-2 text-xs font-semibold text-gray-600">
                                                <div className="text-left"></div>
                                                <div className="text-left">Course/Stream</div>
                                                <div className="text-left">Subject</div>
                                                <div className="text-left">Completion Status</div>
                                                <div className="text-left">Marks (%)</div>
                                                <div className="text-left">Completed Year</div>
                                            </div>
                                            
                                            {visibleEducationLevels.map((level) => {
                                                const levelData = educationTableData[level.key] || {};
                                                const levelCourses = getCourseOptionsForLevel(level.key);
                                                const levelSubjects = levelData.course ? getSubjectOptionsForCourse(levelData.course, level.key) : [];
                                                
                                                return (
                                                    <div 
                                                        key={level.key} 
                                                        className="grid grid-cols-1 sm:grid-cols-6 gap-2 mb-3 p-2 bg-gray-50 rounded-lg items-center"
                                                    >
                                                        <div className="font-medium text-sm text-gray-800 sm:text-left">
                                                            {level.shortLabel}
                                                        </div>
                                                        
                                                        <TextField
                                                            select
                                                            fullWidth
                                                            size="small"
                                                            label="Course/Stream"
                                                            value={levelData.course || ''}
                                                            onChange={(e) => handleEducationTableChange(level.key, 'course', e.target.value)}
                                                            InputLabelProps={{ shrink: true }}
                                                            sx={{ '& .MuiInputBase-root': { fontSize: '0.75rem' } }}
                                                        >
                                                            <MenuItem value="">Select</MenuItem>
                                                            {levelCourses.map((opt) => (
                                                                <MenuItem key={opt.value} value={opt.value}>
                                                                    {opt.label}
                                                                </MenuItem>
                                                            ))}
                                                        </TextField>
                                                        
                                                        <TextField
                                                            select
                                                            fullWidth
                                                            size="small"
                                                            label="Subject"
                                                            value={levelData.subject || ''}
                                                            onChange={(e) => handleEducationTableChange(level.key, 'subject', e.target.value)}
                                                            InputLabelProps={{ shrink: true }}
                                                            disabled={!levelData.course}
                                                            sx={{ '& .MuiInputBase-root': { fontSize: '0.75rem' } }}
                                                        >
                                                            <MenuItem value="">Select</MenuItem>
                                                            {levelSubjects.map((opt) => (
                                                                <MenuItem key={opt.value} value={opt.value}>
                                                                    {opt.label}
                                                                </MenuItem>
                                                            ))}
                                                        </TextField>
                                                        
                                                        <TextField
                                                            select
                                                            fullWidth
                                                            size="small"
                                                            label="Status"
                                                            value={levelData.completionStatus || ''}
                                                            onChange={(e) => handleEducationTableChange(level.key, 'completionStatus', e.target.value)}
                                                            InputLabelProps={{ shrink: true }}
                                                            sx={{ '& .MuiInputBase-root': { fontSize: '0.75rem' } }}
                                                        >
                                                            {completionStatusOptions.map((opt) => (
                                                                <MenuItem key={opt.value} value={opt.value}>
                                                                    {opt.label}
                                                                </MenuItem>
                                                            ))}
                                                        </TextField>
                                                        
                                                        <TextField
                                                            fullWidth
                                                            size="small"
                                                            label="Marks"
                                                            type="number"
                                                            value={levelData.marks || ''}
                                                            onChange={(e) => handleEducationTableChange(level.key, 'marks', e.target.value)}
                                                            InputLabelProps={{ shrink: true }}
                                                            inputProps={{ min: 0, max: 100 }}
                                                            sx={{ '& .MuiInputBase-root': { fontSize: '0.75rem' } }}
                                                        />
                                                        
                                                        <TextField
                                                            select
                                                            fullWidth
                                                            size="small"
                                                            label="Year"
                                                            value={levelData.completedYear || ''}
                                                            onChange={(e) => handleEducationTableChange(level.key, 'completedYear', e.target.value)}
                                                            InputLabelProps={{ shrink: true }}
                                                            sx={{ '& .MuiInputBase-root': { fontSize: '0.75rem' } }}
                                                        >
                                                            {yearOptions.map((opt) => (
                                                                <MenuItem key={opt.value} value={opt.value}>
                                                                    {opt.label}
                                                                </MenuItem>
                                                            ))}
                                                        </TextField>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    )}
                                </div>
                            )}

                            {/* Section 5: NCC & Sports */}
                            {(examData || searchMode === 'eligibility') && (
                                <div className="rounded-lg p-3 mb-3 border border-gray-200">
                                    <h2 className="text-sm font-semibold text-gray-800 mb-3 text-left">
                                        NCC & Sports Details
                                    </h2>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
                                        <TextField
                                            select
                                            fullWidth
                                            label="NCC Wing"
                                            value={formData.ncc_wing}
                                            onChange={handleChange("ncc_wing")}
                                            helperText="NCC wing (if any)"
                                            size="small"
                                        >
                                            {nccWingOptions.map((option) => (
                                                <MenuItem key={option.value} value={option.value}>
                                                    {option.label}
                                                </MenuItem>
                                            ))}
                                        </TextField>

                                        <TextField
                                            select
                                            fullWidth
                                            label="NCC Certificate"
                                            value={formData.ncc_certificate}
                                            onChange={handleChange("ncc_certificate")}
                                            helperText="NCC certificate level"
                                            size="small"
                                        >
                                            {nccCertificateOptions.map((option) => (
                                                <MenuItem key={option.value} value={option.value}>
                                                    {option.label}
                                                </MenuItem>
                                            ))}
                                        </TextField>

                                        <TextField
                                            select
                                            fullWidth
                                            label="NCC Certificate Grade"
                                            value={formData.ncc_certificate_grade}
                                            onChange={handleChange("ncc_certificate_grade")}
                                            helperText="NCC certificate grade"
                                            size="small"
                                        >
                                            {nccCertificateGradeOptions.map((option) => (
                                                <MenuItem key={option.value} value={option.value}>
                                                    {option.label}
                                                </MenuItem>
                                            ))}
                                        </TextField>
                                    </div>
                                </div>
                            )}

                            {/* Submit Button */}
                            {(examData || searchMode === 'eligibility') && (
                                <div className="flex justify-center mt-4">
                                    <Button
                                        variant="contained"
                                        size="medium"
                                        onClick={handleCheckEligibility}
                                        disabled={loading}
                                        sx={{
                                            backgroundColor: "#3b5998",
                                            "&:hover": {
                                                backgroundColor: "#2d4373",
                                            },
                                            borderRadius: "20px",
                                            paddingX: 3,
                                            paddingY: 1,
                                            textTransform: "none",
                                            fontWeight: 600,
                                            fontSize: "0.9rem",
                                        }}
                                    >
                                        {loading ? 'Checking...' : 'Check Eligibility and Attempts'}
                                    </Button>
                                </div>
                            )}
                        </Box>
                    </div>
                </div>

                {/* Results Section - Side by Side */}
                {showResults && results.length > 0 && (
                    <div ref={resultsRef} className="mt-4 grid grid-cols-1 lg:grid-cols-2 gap-4">
                        <div className="bg-white rounded-xl shadow-lg p-3">
                            {renderResultsSummary()}
                        </div>
                        
                        <div className="bg-white rounded-xl shadow-lg p-3">
                            {renderDetailedResultsInline()}
                        </div>
                    </div>
                )}
            </div>
        </ThemeProvider>
    );
}

export default CheckEligibilityPage;
