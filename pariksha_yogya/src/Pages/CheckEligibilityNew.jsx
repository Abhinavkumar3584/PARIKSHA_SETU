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
import html2canvas from "html2canvas";
import jsPDF from "jspdf";

// Import eligibility utilities
import {
    checkFullEligibility,
    getDisplayDetails
} from "../eligibility/eligibilityChecker";

// Import unified education level checker functions (backward compatible)
import { 
    getCoursesForLevel,
    getSubjectsForCourse,
    getEducationLevelKey,
    loadEduFinalData,
    getEduFinalData
} from "../eligibility/checker/education_level";

import {
    getExamDropdownOptions,
    loadExamData,
    getDivisionOptions,
    getDivisionData,
    examHasDivisions,
    getExamSessionOptions
} from "../eligibility/examDataLoader";

// Custom theme for orange accent
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

// Thin scrollbar styles
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
// USER INPUT OPTIONS - Only what user can be (not exam-specific)
// These are standard options for personal details
// ============================================

// Static options (used as user input choices, not exam-specific)
const staticGenderOptions = [
    { value: "MALE", label: "Male" },
    { value: "FEMALE", label: "Female" },
    { value: "TRANSGENDER", label: "Transgender" },
];

// Marital status options by gender
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

// Default options when gender not selected
const staticMaritalStatusOptions = [
    { value: "UNMARRIED", label: "Unmarried" },
    { value: "MARRIED", label: "Married" },
    { value: "SEPARATED", label: "Separated" },
    { value: "DIVORCED", label: "Divorced" },
    { value: "DIVORCEE", label: "Divorcee" },
    { value: "WIDOW", label: "Widow" },
    { value: "WIDOWER", label: "Widower" },
];

// Function to get marital status options based on gender
const getMaritalStatusOptionsForGender = (gender) => {
    if (!gender) return staticMaritalStatusOptions;
    const upperGender = gender.toUpperCase();
    return maritalStatusByGender[upperGender] || staticMaritalStatusOptions;
};

// Standard nationality options from eligibilityfields.json
// Value = full standard name (used for eligibility checking)
// Label = display name (user-friendly)
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

// Domicile options - All Indian States (28) + Union Territories (8)
// Standard values from eligibilityfields.json
const staticDomicileOptions = [
    // States (28)
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
    // Union Territories (8)
    { value: "ANDAMAN AND NICOBAR ISLANDS", label: "Andaman and Nicobar Islands" },
    { value: "CHANDIGARH", label: "Chandigarh" },
    { value: "DADRA AND NAGAR HAVELI AND DAMAN AND DIU", label: "Dadra and Nagar Haveli and Daman and Diu" },
    { value: "DELHI", label: "Delhi (NCT)" },
    { value: "JAMMU AND KASHMIR", label: "Jammu and Kashmir" },
    { value: "LADAKH", label: "Ladakh" },
    { value: "LAKSHADWEEP", label: "Lakshadweep" },
    { value: "PUDUCHERRY", label: "Puducherry" },
];

// Eligibility marks options
const staticEligibilityMarksOptions = [
    { value: "40", label: "40%" },
    { value: "45", label: "45%" },
    { value: "50", label: "50%" },
    { value: "55", label: "55%" },
    { value: "60", label: "60%" },
    { value: "65", label: "65%" },
    { value: "70", label: "70%" },
    { value: "75", label: "75%" },
    { value: "80", label: "80%" },
];

// Yes/No options (for backlogs, sports quota, CPL, ex-servicemen)
const staticYesNoOptions = [
    { value: "YES", label: "Yes" },
    { value: "NO", label: "No" },
];

// NCC Wing options
const staticNccWingOptions = [
    { value: "NONE", label: "None / Not in NCC" },
    { value: "ARMY", label: "Army Wing" },
    { value: "NAVY", label: "Navy Wing" },
    { value: "AIR FORCE", label: "Air Force Wing" },
];

// NCC Certificate options
const staticNccCertificateOptions = [
    { value: "NONE", label: "None" },
    { value: "A", label: "A Certificate" },
    { value: "B", label: "B Certificate" },
    { value: "C", label: "C Certificate" },
];

// NCC Certificate Grade options
const staticNccCertificateGradeOptions = [
    { value: "NONE", label: "None / Not Applicable" },
    { value: "A", label: "Grade A" },
    { value: "B", label: "Grade B" },
    { value: "C", label: "Grade C" },
];

// Vision/Eyesight options
const staticVisionOptions = [
    { value: "6/6", label: "6/6 (Normal)" },
    { value: "6/9", label: "6/9" },
    { value: "6/12", label: "6/12" },
    { value: "6/18", label: "6/18" },
    { value: "6/24", label: "6/24" },
    { value: "6/36", label: "6/36" },
    { value: "WITH GLASSES", label: "Corrected with Glasses" },
];

// Language Proficiency options
const staticLanguageOptions = [
    { value: "HINDI", label: "Hindi" },
    { value: "ENGLISH", label: "English" },
    { value: "HINDI AND ENGLISH", label: "Hindi and English" },
    { value: "REGIONAL LANGUAGE", label: "Regional Language" },
];

// Driving License options
const staticDrivingLicenseOptions = [
    { value: "NONE", label: "None" },
    { value: "LMV", label: "LMV (Light Motor Vehicle)" },
    { value: "HMV", label: "HMV (Heavy Motor Vehicle)" },
    { value: "MCWG", label: "MCWG (Motor Cycle with Gear)" },
    { value: "MCWOG", label: "MCWOG (Motor Cycle without Gear)" },
    { value: "TRANSPORT", label: "Transport License" },
];

// Employment Status options
const staticEmploymentOptions = [
    { value: "UNEMPLOYED", label: "Unemployed" },
    { value: "EMPLOYED", label: "Employed" },
    { value: "GOVERNMENT EMPLOYEE", label: "Government Employee" },
    { value: "PRIVATE EMPLOYEE", label: "Private Employee" },
    { value: "SELF EMPLOYED", label: "Self Employed" },
    { value: "STUDENT", label: "Student" },
];

// Work Experience options
const staticWorkExperienceOptions = [
    { value: "0", label: "Fresher (No Experience)" },
    { value: "1", label: "1 Year" },
    { value: "2", label: "2 Years" },
    { value: "3", label: "3 Years" },
    { value: "4", label: "4 Years" },
    { value: "5", label: "5 Years" },
    { value: "6", label: "6+ Years" },
    { value: "10", label: "10+ Years" },
];

// 10th/12th Subjects options
const static10thSubjectsOptions = [
    { value: "SCIENCE", label: "Science" },
    { value: "MATHEMATICS", label: "Mathematics" },
    { value: "SOCIAL SCIENCE", label: "Social Science" },
    { value: "ENGLISH", label: "English" },
    { value: "HINDI", label: "Hindi" },
    { value: "ALL SUBJECTS", label: "All Subjects" },
];

const static12thSubjectsOptions = [
    { value: "PCM", label: "Physics, Chemistry, Mathematics (PCM)" },
    { value: "PCB", label: "Physics, Chemistry, Biology (PCB)" },
    { value: "PCMB", label: "Physics, Chemistry, Mathematics, Biology (PCMB)" },
    { value: "COMMERCE", label: "Commerce Stream" },
    { value: "ARTS", label: "Arts/Humanities Stream" },
    { value: "VOCATIONAL", label: "Vocational Stream" },
    { value: "ANY STREAM", label: "Any Stream" },
];

// Gap Years options
const staticGapYearsOptions = [
    { value: "0", label: "No Gap" },
    { value: "1", label: "1 Year" },
    { value: "2", label: "2 Years" },
    { value: "3", label: "3 Years" },
    { value: "4", label: "4+ Years" },
];

// Active Backlogs options
const staticBacklogsOptions = [
    { value: "0", label: "No Backlogs" },
    { value: "1", label: "1 Backlog" },
    { value: "2", label: "2 Backlogs" },
    { value: "3", label: "3+ Backlogs" },
];

// Education levels hierarchy (ordered from highest to lowest)
const EDUCATION_HIERARCHY = [
    { key: 'POST DOCTORATE', label: 'Post Doctorate', shortLabel: 'Post Doctorate' },
    { key: 'PHD', label: 'PhD', shortLabel: 'PhD' },
    { key: 'POST GRADUATION', label: 'Post Graduation', shortLabel: 'Post Graduation' },
    { key: 'GRADUATION', label: 'Graduation', shortLabel: 'Graduation' },
    { key: 'DIPLOMA / ITI (POLYTECHNIC, ITI, DPHARM, PGDCA)', label: 'Diploma / ITI', shortLabel: 'Diploma ITI' },
    { key: '(12TH)HIGHER SECONDARY', label: '12th Higher Secondary', shortLabel: '12th Higher Secondary' },
    { key: '(10TH)SECONDARY', label: '10th Secondary', shortLabel: '10th Secondary' },
];

// Completion status options for education table
const completionStatusOptions = [
    { value: '', label: 'Select' },
    { value: 'PASSED', label: 'Passed' },
    { value: 'APPEARING', label: 'Appearing' },
    { value: 'APPEARING FINAL YEAR', label: 'Appearing Final Year' },
];

// Year options (last 50 years)
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
// FUNCTION TO EXTRACT UNIQUE OPTIONS FROM EXAM DATA
// ============================================

const extractOptionsFromExamData = (examData, fieldName) => {
    if (!examData) return [];
    
    const uniqueValues = new Set();
    
    // Check if exam has divisions (academies, posts, etc.)
    const divisionFields = ['academies', 'posts', 'departments', 'courses', 'classes'];
    let hasDivisions = false;
    let divisionsData = null;
    
    for (const field of divisionFields) {
        if (examData[field] && typeof examData[field] === 'object') {
            hasDivisions = true;
            divisionsData = examData[field];
            break;
        }
    }
    
    if (hasDivisions && divisionsData) {
        // Extract from all divisions
        Object.values(divisionsData).forEach(divisionData => {
            if (divisionData && divisionData[fieldName]) {
                const values = divisionData[fieldName].toString().split(',').map(v => v.trim().toUpperCase());
                values.forEach(v => {
                    if (v && v !== '' && v !== 'NOT APPLICABLE' && v !== 'ALL APPLICABLE') {
                        uniqueValues.add(v);
                    }
                });
            }
        });
    } else {
        // Non-division exam - extract directly
        if (examData[fieldName]) {
            const values = examData[fieldName].toString().split(',').map(v => v.trim().toUpperCase());
            values.forEach(v => {
                if (v && v !== '' && v !== 'NOT APPLICABLE' && v !== 'ALL APPLICABLE') {
                    uniqueValues.add(v);
                }
            });
        }
    }
    
    return Array.from(uniqueValues);
};

// Special function to extract nationality - split by comma, each value as separate option
const extractNationalityFromExamData = (examData) => {
    if (!examData) return [];
    
    const uniqueValues = new Set();
    
    // Check if exam has divisions
    const divisionFields = ['academies', 'posts', 'departments', 'courses', 'classes'];
    let hasDivisions = false;
    let divisionsData = null;
    
    for (const field of divisionFields) {
        if (examData[field] && typeof examData[field] === 'object') {
            hasDivisions = true;
            divisionsData = examData[field];
            break;
        }
    }
    
    const parseNationalityText = (text) => {
        if (!text) return;
        // Split by comma and add each value separately
        const values = text.toString().split(',').map(v => v.trim());
        values.forEach(v => {
            if (v && v !== '' && v.toUpperCase() !== 'NOT APPLICABLE' && v.toUpperCase() !== 'ALL APPLICABLE') {
                uniqueValues.add(v);
            }
        });
    };
    
    if (hasDivisions && divisionsData) {
        // Extract from all divisions
        Object.values(divisionsData).forEach(divisionData => {
            if (divisionData && divisionData.nationality) {
                parseNationalityText(divisionData.nationality);
            }
        });
    } else {
        // Non-division exam
        if (examData.nationality) {
            parseNationalityText(examData.nationality);
        }
    }
    
    return Array.from(uniqueValues);
};

// Convert extracted values to dropdown options format
const valuesToOptions = (values, labelMap = {}) => {
    return values.map(value => ({
        value: value,
        label: labelMap[value] || value.charAt(0) + value.slice(1).toLowerCase().replace(/_/g, ' ')
    }));
};

// ============================================
// MAIN COMPONENT
// ============================================

function CheckEligibilityNew() {
    // State for exam selection
    const [examOptions, setExamOptions] = useState([]);
    const [selectedExam, setSelectedExam] = useState("");
    const [examData, setExamData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    
    // State for Important Notice Dialog
    const [noticeDialogOpen, setNoticeDialogOpen] = useState(false);

    // State for divisions (auto-loaded, not user selected)
    const [hasDivisions, setHasDivisions] = useState(false);
    const [divisions, setDivisions] = useState([]);

    // State for DYNAMIC dropdown options (extracted from exam JSON)
    const [genderOptions, setGenderOptions] = useState(staticGenderOptions);
    const [maritalStatusOptions, setMaritalStatusOptions] = useState(staticMaritalStatusOptions);
    const [nationalityOptions, setNationalityOptions] = useState(staticNationalityOptions);
    const [casteOptions, setCasteOptions] = useState(staticCasteOptions);
    const [pwdOptions, setPwdOptions] = useState(staticPwdOptions);
    const [educationOptions, setEducationOptions] = useState(staticEducationOptions);
    const [courseOptions, setCourseOptions] = useState([]); // Courses based on education level
    const [subjectOptions, setSubjectOptions] = useState([]); // Subjects based on course
    const [courseYearOptions, setCourseYearOptions] = useState(staticCourseYearOptions);
    
    // Additional state for all 31 fields
    const [domicileOptions, setDomicileOptions] = useState(staticDomicileOptions);
    const [eligibilityMarksOptions, setEligibilityMarksOptions] = useState(staticEligibilityMarksOptions);
    const [percentage10thOptions, setPercentage10thOptions] = useState(staticEligibilityMarksOptions);
    const [percentage12thOptions, setPercentage12thOptions] = useState(staticEligibilityMarksOptions);
    const [subjects10thOptions, setSubjects10thOptions] = useState(static10thSubjectsOptions);
    const [subjects12thOptions, setSubjects12thOptions] = useState(static12thSubjectsOptions);
    const [backlogsOptions, setBacklogsOptions] = useState(staticBacklogsOptions);
    const [gapYearsOptions, setGapYearsOptions] = useState(staticGapYearsOptions);
    const [nccWingOptions, setNccWingOptions] = useState(staticNccWingOptions);
    const [nccCertificateOptions, setNccCertificateOptions] = useState(staticNccCertificateOptions);
    const [nccCertificateGradeOptions, setNccCertificateGradeOptions] = useState(staticNccCertificateGradeOptions);
    const [sportsQuotaOptions, setSportsQuotaOptions] = useState(staticYesNoOptions);
    const [cplHolderOptions, setCplHolderOptions] = useState(staticYesNoOptions);
    const [visionOptions, setVisionOptions] = useState(staticVisionOptions);
    const [languageOptions, setLanguageOptions] = useState(staticLanguageOptions);
    const [drivingLicenseOptions, setDrivingLicenseOptions] = useState(staticDrivingLicenseOptions);
    const [employmentOptions, setEmploymentOptions] = useState(staticEmploymentOptions);
    const [workExperienceOptions, setWorkExperienceOptions] = useState(staticWorkExperienceOptions);
    const [exServicemenOptions, setExServicemenOptions] = useState(staticYesNoOptions);

    // State for domicile control based on nationality
    // Domicile is only enabled when nationality is "INDIAN"
    const [isDomicileDisabled, setIsDomicileDisabled] = useState(true);

    // State for education qualification table
    // Each level has: course, subject, completionStatus, marks, completedYear
    const [educationTableData, setEducationTableData] = useState({});
    const [visibleEducationLevels, setVisibleEducationLevels] = useState([]);

    // State for user form data - ALL 31 fields
    const [formData, setFormData] = useState({
        // Personal Details (1-6)
        date_of_birth: "",
        gender: "",
        marital_status: "",
        nationality: "",
        caste_category: "",
        pwd_status: "",
        domicile: "",
        
        // Education (7-18)
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
        
        // NCC & Sports (19-23)
        ncc_wing: "",
        ncc_certificate: "",
        ncc_certificate_grade: "",
        sports_quota_eligibility: "",
        cpl_holder: "",
        
        // Physical Requirements (24-26)
        height_cm: "",
        weight_kg: "",
        vision_eyesight: "",
        
        // Other Requirements (27-31)
        language_proficiency: "",
        driving_license_type: "",
        current_employment_status: "",
        work_experience_years: "",
        ex_servicemen_status: "",
    });

    // State for eligibility results (array for multiple divisions)
    const [results, setResults] = useState([]);
    const [showResults, setShowResults] = useState(false);

    // State for display details
    const [displayDetails, setDisplayDetails] = useState(null);

    // ============================================
    // LOAD EXAM OPTIONS ON MOUNT
    // ============================================

    useEffect(() => {
        const options = getExamDropdownOptions();
        setExamOptions(options);
    }, []);

    // ============================================
    // LOAD EDU_FINAL DATA ON MOUNT
    // This loads the education dropdown data from edu_final.json
    // The data is cached in education_level.js for use by getCoursesForLevel, etc.
    // ============================================

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
    // HANDLE EXAM SELECTION
    // ============================================

    const handleExamChange = useCallback(async (event) => {
        const examCode = event.target.value;
        setSelectedExam(examCode);
        setResults([]);
        setShowResults(false);
        setError("");
        
        // Reset form data when exam changes (except date of birth)
        setFormData(prev => ({
            ...prev,
            // Personal Details
            gender: "",
            marital_status: "",
            nationality: "",
            caste_category: "",
            pwd_status: "",
            domicile: "",
            
            // Education
            highest_education_qualification: "",
            education_course: "",
            education_subject: "",
            eligibility_course_year: "",
            eligibility_marks: "",
            percentage_10th_requirement: "",
            percentage_12th_requirement: "",
            subjects_at_10th: "",
            subjects_at_12th: "",
            active_backlogs_allowed: "",
            gap_years_allowed: "",
            
            // NCC & Sports
            ncc_wing: "",
            ncc_certificate: "",
            ncc_certificate_grade: "",
            sports_quota_eligibility: "",
            cpl_holder: "",
            
            // Physical Requirements
            height_cm: "",
            weight_kg: "",
            vision_eyesight: "",
            
            // Other Requirements
            language_proficiency: "",
            driving_license_type: "",
            current_employment_status: "",
            work_experience_years: "",
            ex_servicemen_status: "",
        }));
        
        // Reset domicile disabled state
        setIsDomicileDisabled(true);

        if (!examCode) {
            setExamData(null);
            setHasDivisions(false);
            setDivisions([]);
            setDisplayDetails(null);
            // Reset to static options when no exam selected
            setGenderOptions(staticGenderOptions);
            setMaritalStatusOptions(staticMaritalStatusOptions);
            setNationalityOptions(staticNationalityOptions);
            setCasteOptions(staticCasteOptions);
            setPwdOptions(staticPwdOptions);
            setEducationOptions(staticEducationOptions);
            setCourseYearOptions(staticCourseYearOptions);
            return;
        }

        // Find the exam info
        const examInfo = examOptions.find(e => e.value === examCode);
        if (!examInfo || !examInfo.linkedFile) {
            setError("Exam data not available");
            return;
        }

        setLoading(true);
        try {
            const data = await loadExamData(examInfo.linkedFile);
            if (!data) {
                setError("Failed to load exam data");
                setLoading(false);
                return;
            }

            setExamData(data);
            setDisplayDetails(getDisplayDetails(data));

            // Check if exam has divisions
            const hasDiv = examHasDivisions(data);
            setHasDivisions(hasDiv);

            if (hasDiv) {
                // Load all divisions
                const divOpts = getDivisionOptions(data);
                setDivisions(divOpts.map(d => d.value));
            } else {
                // No divisions
                setDivisions([]);
            }

            // ============================================
            // SET USER INPUT OPTIONS
            // NOTE: Gender and Marital Status always show ALL options
            // because these represent who the USER is, not exam requirements.
            // The eligibility check will determine if user qualifies.
            // ============================================
            
            // Gender - ALWAYS show all options (user can be any gender)
            // Don't extract from exam data - that's for eligibility checking
            setGenderOptions(staticGenderOptions);

            // Marital Status - Based on user's gender selection
            // The handleChange function will update this when gender changes
            // Start with static options until gender is selected
            if (formData.gender) {
                setMaritalStatusOptions(getMaritalStatusOptionsForGender(formData.gender));
            } else {
                setMaritalStatusOptions(staticMaritalStatusOptions);
            }

            // Caste/category options from exam data
            // Mapping: Short codes in JSON → Full names in form dropdown
            const casteValues = extractOptionsFromExamData(data, 'caste_category');
            if (casteValues.length > 0) {
                setCasteOptions(valuesToOptions(casteValues, {
                    'GEN': 'GENERAL (UR/UNRESERVED)',
                    'SC': 'SC (SCHEDULED CASTE)',
                    'ST': 'ST (SCHEDULED TRIBE)',
                    'OBC': 'OBC (OTHER BACKWARD CLASS)',
                    'EWS': 'EWS (ECONOMICALLY WEAKER SECTION)',
                    'MINORITY': 'MINORITY'
                }));
            } else {
                setCasteOptions(staticCasteOptions);
            }

            // PWD options - ALWAYS show YES/NO (user's personal status)
            // Don't extract from exam data - that's for eligibility checking
            setPwdOptions(staticPwdOptions);

            // Education options - ALWAYS show all 9 options (like gender)
            // User selects their education, then eligibility check compares with exam requirement
            setEducationOptions(staticEducationOptions);

            // Course year options from exam data
            const courseYearValues = extractOptionsFromExamData(data, 'eligibility_course_year');
            if (courseYearValues.length > 0) {
                setCourseYearOptions(valuesToOptions(courseYearValues, {
                    'PASSED': 'Passed',
                    'APPEARING': 'Appearing',
                    'APPEARING FINAL YEAR': 'Appearing Final Year'
                }));
            } else {
                setCourseYearOptions(staticCourseYearOptions);
            }

            // Nationality options from exam data - use EXACT text from JSON
            const nationalityValues = extractNationalityFromExamData(data);
            if (nationalityValues.length > 0) {
                // Show exact text as-is from JSON (no label mapping)
                setNationalityOptions(nationalityValues.map(value => ({
                    value: value,
                    label: value
                })));
            } else {
                setNationalityOptions(staticNationalityOptions);
            }

        } catch (err) {
            setError("Error loading exam data: " + err.message);
        }
        setLoading(false);
    }, [examOptions]);

    // ============================================
    // HANDLE FORM DATA CHANGES
    // ============================================

    const handleChange = (field) => (event) => {
        const newValue = event.target.value;
        // Using function form to avoid stale closure issues
        setFormData(prev => ({ ...prev, [field]: newValue }));
        setShowResults(false);
        
        // If gender changed, update marital status options
        if (field === 'gender') {
            const newMaritalOptions = getMaritalStatusOptionsForGender(newValue);
            setMaritalStatusOptions(newMaritalOptions);
            // Reset marital status if current value is not valid for new gender
            const currentMaritalStatus = formData.marital_status;
            const isValidMaritalStatus = newMaritalOptions.some(opt => opt.value === currentMaritalStatus);
            if (!isValidMaritalStatus && currentMaritalStatus) {
                setFormData(prev => ({ ...prev, marital_status: '' }));
            }
        }
        
        // If nationality changed, control domicile field
        // Domicile is only applicable for Indian nationals
        if (field === 'nationality') {
            const isIndian = newValue && newValue.toUpperCase() === 'INDIAN';
            setIsDomicileDisabled(!isIndian);
            
            // Reset domicile if nationality is not Indian
            if (!isIndian) {
                setFormData(prev => ({ ...prev, domicile: '' }));
            }
        }
    };
    
    // ============================================
    // HANDLE EDUCATION LEVEL CHANGE
    // Load courses based on selected education level
    // Also set visible education levels for the table
    // ============================================
    
    const handleEducationLevelChange = (event) => {
        const level = event.target.value;
        
        // Update form data - reset course and subject when education changes
        // Using function form to avoid stale closure issues
        setFormData(prev => ({ 
            ...prev, 
            highest_education_qualification: level,
            eligibility_education_course: "", // Reset course when education changes
            eligibility_education_course_subject: "" // Reset subject when education changes
        }));
        setShowResults(false);
        
        // Load courses for the selected education level
        const courses = getCoursesForLevel(level);
        setCourseOptions(courses);
        
        // Clear subjects since course is reset
        setSubjectOptions([]);
        
        // Set visible education levels for the table (from selected level down to 10th)
        const levelIndex = EDUCATION_HIERARCHY.findIndex(h => h.key === level);
        if (levelIndex !== -1) {
            const visibleLevels = EDUCATION_HIERARCHY.slice(levelIndex);
            setVisibleEducationLevels(visibleLevels);
            
            // Initialize education table data for visible levels
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
    
    // ============================================
    // HANDLE EDUCATION TABLE DATA CHANGE
    // ============================================
    
    const handleEducationTableChange = (levelKey, field, value) => {
        setEducationTableData(prev => ({
            ...prev,
            [levelKey]: {
                ...prev[levelKey],
                [field]: value,
                // Reset subject when course changes
                ...(field === 'course' ? { subject: '' } : {})
            }
        }));
        setShowResults(false);
        
        // If it's the highest education level, also update the main formData
        if (levelKey === formData.highest_education_qualification) {
            if (field === 'course') {
                setFormData(prev => ({
                    ...prev,
                    eligibility_education_course: value,
                    eligibility_education_course_subject: ''
                }));
                // Load subjects for the selected course (pass levelKey for edu_final.json lookup)
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
        
        // Update 10th/12th specific fields
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
    
    // Get course options for a specific education level (for table)
    const getCourseOptionsForLevel = (levelKey) => {
        return getCoursesForLevel(levelKey);
    };
    
    // Get subject options for a specific course (for table)
    // Pass levelKey for proper edu_final.json lookup
    const getSubjectOptionsForCourse = (course, levelKey = null) => {
        return getSubjectsForCourse(course, levelKey);
    };

    // ============================================
    // CHECK ELIGIBILITY FOR ALL DIVISIONS
    // ============================================

    const handleCheckEligibility = () => {
        setError("");

        // Validate required fields
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

        // Convert DOB to DD-MM-YYYY format for checking
        const dobParts = formData.date_of_birth.split('-');
        const dobFormatted = `${dobParts[2]}-${dobParts[1]}-${dobParts[0]}`;

        // Convert educationTableData keys to JSON format expected by checker
        // UI uses: 'GRADUATION', '(12TH)HIGHER SECONDARY', '(10TH)SECONDARY'
        // Checker expects: 'graduation', '12th_higher_secondary', '10th_secondary'
        const educationLevelsForChecker = {};
        const keyMapping = {
            'POST DOCTORATE': 'post_doctorate',
            'PHD': 'phd',
            'POST GRADUATION': 'post_graduation',
            'GRADUATION': 'graduation',
            'DIPLOMA / ITI (POLYTECHNIC, ITI, DPHARM, PGDCA)': 'diploma',
            '(12TH)HIGHER SECONDARY': '12th_higher_secondary',
            '(12TH) HIGHER SECONDARY': '12th_higher_secondary',
            '(10TH)SECONDARY': '10th_secondary',
            '(10TH) SECONDARY': '10th_secondary'
        };

        Object.entries(educationTableData).forEach(([uiKey, levelData]) => {
            const jsonKey = keyMapping[uiKey] || uiKey.toLowerCase().replace(/ /g, '_');
            if (levelData && (levelData.course || levelData.marks || levelData.subject)) {
                educationLevelsForChecker[jsonKey] = {
                    course: levelData.course || '',
                    subject: levelData.subject || '',
                    marks_percentage: levelData.marks || '',
                    status: levelData.completionStatus || '',
                    completed_year: levelData.completedYear || ''
                };
            }
        });

        // Prepare user input with education_levels
        const userInput = {
            ...formData,
            date_of_birth: dobFormatted,
            education_levels: educationLevelsForChecker
        };

        // Debug: Log the userInput to verify data is being passed correctly
        console.log('[CheckEligibility] formData:', formData);
        console.log('[CheckEligibility] userInput:', userInput);
        console.log('[CheckEligibility] highest_education_qualification:', userInput.highest_education_qualification);

        const allResults = [];

        if (hasDivisions && divisions.length > 0) {
            // Check eligibility for EACH division
            divisions.forEach(divisionName => {
                const divData = getDivisionData(examData, divisionName);
                if (divData) {
                    // Get all sessions for this division
                    const sessionOptions = getExamSessionOptions(divData);
                    
                    if (sessionOptions.length > 0) {
                        // Check eligibility for EACH session
                        sessionOptions.forEach(sessionOpt => {
                            const eligibilityResult = checkFullEligibility(
                                userInput,
                                divData,
                                sessionOpt.value
                            );

                            allResults.push({
                                ...eligibilityResult,
                                examName: examData.exam_name || selectedExam,
                                division: divisionName,
                                session: sessionOpt.label,
                                divisionData: divData
                            });
                        });
                    } else {
                        // No sessions - single check for division
                        const eligibilityResult = checkFullEligibility(
                            userInput,
                            divData,
                            null
                        );

                        allResults.push({
                            ...eligibilityResult,
                            examName: examData.exam_name || selectedExam,
                            division: divisionName,
                            session: "N/A",
                            divisionData: divData
                        });
                    }
                }
            });
        } else {
            // No divisions - check sessions directly from examData
            const sessionOptions = getExamSessionOptions(examData);
            
            if (sessionOptions.length > 0) {
                // Check eligibility for EACH session
                sessionOptions.forEach(sessionOpt => {
                    const eligibilityResult = checkFullEligibility(
                        userInput,
                        examData,
                        sessionOpt.value
                    );

                    allResults.push({
                        ...eligibilityResult,
                        examName: examData.exam_name || selectedExam,
                        division: "N/A",
                        session: sessionOpt.label,
                        divisionData: null
                    });
                });
            } else {
                // No sessions - single check
                const eligibilityResult = checkFullEligibility(
                    userInput,
                    examData,
                    null
                );

                allResults.push({
                    ...eligibilityResult,
                    examName: examData.exam_name || selectedExam,
                    division: "N/A",
                    session: "N/A",
                    divisionData: null
                });
            }
        }

        setResults(allResults);
        setShowResults(true);
    };

    // ============================================
    // RENDER FUNCTIONS
    // ============================================

    const renderExamDetails = () => {
        if (!displayDetails) return null;

        return (
            <div className="bg-gray-50 rounded-xl p-4 mb-4">
                <h2 className="text-lg font-semibold text-gray-800 mb-4 border-b border-gray-200 pb-2">
                    Exam Details
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {displayDetails.full_form && (
                        <div>
                            <span className="text-gray-500 text-sm">Full Form:</span>
                            <p className="font-medium">{displayDetails.full_form}</p>
                        </div>
                    )}
                    {displayDetails.conducting_body && (
                        <div>
                            <span className="text-gray-500 text-sm">Conducting Body:</span>
                            <p className="font-medium">{displayDetails.conducting_body}</p>
                        </div>
                    )}
                    {displayDetails.exam_level && (
                        <div>
                            <span className="text-gray-500 text-sm">Exam Level:</span>
                            <p className="font-medium">{displayDetails.exam_level}</p>
                        </div>
                    )}
                    {displayDetails.exam_date && (
                        <div>
                            <span className="text-gray-500 text-sm">Exam Date:</span>
                            <p className="font-medium">{displayDetails.exam_date}</p>
                        </div>
                    )}
                    {displayDetails.mode_of_exam && (
                        <div>
                            <span className="text-gray-500 text-sm">Mode:</span>
                            <p className="font-medium">{displayDetails.mode_of_exam}</p>
                        </div>
                    )}
                    {hasDivisions && divisions.length > 0 && (
                        <div>
                            <span className="text-gray-500 text-sm">Divisions:</span>
                            <p className="font-medium">{divisions.join(', ')}</p>
                        </div>
                    )}
                </div>
            </div>
        );
    };

    // Helper to render results summary table (for right column)
    const renderResultsSummary = () => {
        if (!showResults || results.length === 0) return null;

        // Count eligible and not eligible
        const eligibleCount = results.filter(r => r.eligible).length;
        const notEligibleCount = results.length - eligibleCount;

        return (
            <div className="bg-white rounded-lg shadow-lg overflow-hidden h-fit sticky top-4 border border-gray-200">
                <h3 className="bg-gray-800 text-white px-3 py-2 font-semibold text-sm">
                    📋 Results Summary
                </h3>
                
                {/* Summary Stats */}
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

                {/* Results Table */}
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

    // Helper to render detailed results (for bottom section)
    const renderDetailedResults = () => {
        if (!showResults || results.length === 0) return null;

        return (
            <div className="mt-6 bg-white rounded-lg border-2 border-gray-300 p-3 shadow-md">
                {/* Exam Info Header - Two Column Layout */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 mb-3">
                    {/* LEFT: Divisions Info */}
                    <div className="bg-blue-50 rounded-lg p-3 border border-blue-200 h-fit">
                        <h3 className="text-sm font-semibold text-blue-800 mb-2 border-b border-blue-200 pb-1">
                            📋 Divisions Information
                        </h3>
                        {hasDivisions && divisions.length > 0 ? (
                            <div>
                                <p className="text-sm text-blue-800 mb-1">
                                    <strong>This exam has {divisions.length} divisions:</strong>
                                </p>
                                <p className="text-xs text-blue-700 mb-2">{divisions.join(', ')}</p>
                                <p className="text-xs text-blue-600">
                                    Eligibility checked for all divisions and all upcoming sessions (year-wise).
                                </p>
                            </div>
                        ) : (
                            <p className="text-sm text-blue-700">No divisions - Single exam type</p>
                        )}
                    </div>

                    {/* RIGHT: Exam Details */}
                    <div className="bg-indigo-50 rounded-lg p-3 border border-indigo-200 h-fit">
                        <h3 className="text-sm font-semibold text-indigo-800 mb-2 border-b border-indigo-200 pb-1">
                            📝 Exam Details
                        </h3>
                        {displayDetails && (
                            <div className="grid grid-cols-2 gap-2">
                                {displayDetails.full_form && (
                                    <div>
                                        <span className="text-gray-500 text-xs">Full Form:</span>
                                        <p className="font-medium text-xs">{displayDetails.full_form}</p>
                                    </div>
                                )}
                                {displayDetails.conducting_body && (
                                    <div>
                                        <span className="text-gray-500 text-xs">Conducting Body:</span>
                                        <p className="font-medium text-xs">{displayDetails.conducting_body}</p>
                                    </div>
                                )}
                                {displayDetails.exam_level && (
                                    <div>
                                        <span className="text-gray-500 text-xs">Exam Level:</span>
                                        <p className="font-medium text-xs">{displayDetails.exam_level}</p>
                                    </div>
                                )}
                                {displayDetails.exam_date && (
                                    <div>
                                        <span className="text-gray-500 text-xs">Exam Date:</span>
                                        <p className="font-medium text-xs">{displayDetails.exam_date}</p>
                                    </div>
                                )}
                                {displayDetails.mode_of_exam && (
                                    <div>
                                        <span className="text-gray-500 text-xs">Mode:</span>
                                        <p className="font-medium text-xs">{displayDetails.mode_of_exam}</p>
                                    </div>
                                )}
                                {hasDivisions && divisions.length > 0 && (
                                    <div>
                                        <span className="text-gray-500 text-xs">Total Divisions:</span>
                                        <p className="font-medium text-xs">{divisions.length}</p>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </div>

                <h3 className="text-sm font-semibold text-gray-800 mb-3 bg-gray-100 p-2 rounded-lg">
                    📝 Detailed Eligibility Check
                </h3>
                <div 
                    className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 max-h-[400px] overflow-y-auto pr-1"
                    style={thinScrollbarStyle}
                >
                    {results.map((result, index) => (
                        <div 
                            key={index} 
                            className={`rounded-lg p-2 border ${result.eligible ? 'bg-green-50 border-green-300' : 'bg-red-50 border-red-300'}`}
                        >
                            <div className="flex items-center gap-2 mb-2 flex-wrap">
                                <span className="font-bold text-indigo-700">{result.division}</span>
                                <span className="text-gray-500">|</span>
                                <span className="text-sm text-gray-600">{result.session}</span>
                                <Chip
                                    label={result.eligible ? "Eligible" : "Not Eligible"}
                                    color={result.eligible ? "success" : "error"}
                                    size="small"
                                />
                            </div>

                            {/* Criteria Check Details - Compact */}
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
                                        {result.results.map((check, idx) => (
                                            <tr key={idx} className={`border-b ${check.eligible ? '' : 'bg-red-100'}`}>
                                                <td className="px-2 py-1">{check.field}</td>
                                                <td className="px-2 py-1">{check.userValue}</td>
                                                <td className="px-2 py-1 text-gray-600 truncate max-w-[100px]" title={check.examRequirement}>
                                                    {check.examRequirement?.length > 15 ? check.examRequirement.substring(0, 15) + '...' : check.examRequirement}
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

    return (
        <ThemeProvider theme={theme}>
            <div className="min-h-screen bg-gray-800 pt-18 pb-12 px-2 sm:px-3 lg:px-4">
                {/* Header Section */}
                <div className="w-full mx-auto bg-white rounded-xl shadow-lg p-1 sm:p-2 mb-2">
                    <div className="flex items-center justify-between">
                        <div className="flex-1 flex justify-start">
                            {/* Important Notice Badge with Blinking Red Dot */}
                            <button
                                onClick={() => setNoticeDialogOpen(true)}
                                className="flex items-center gap-2 bg-red-50 hover:bg-red-100 border border-red-300 rounded-lg px-3 py-1.5 transition-all duration-200 cursor-pointer"
                            >
                                <span className="relative flex h-3 w-3">
                                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                                    <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
                                </span>
                                <span className="text-xs font-semibold text-red-700">Important Notice</span>
                            </button>
                        </div>
                        <h1 className="text-2xl sm:text-3xl font-bold text-center text-gray-800">
                            Check Your Eligibility
                        </h1>
                        <div className="flex-1 flex justify-end">
                            <div className="bg-orange-100 border border-orange-300 rounded-lg px-3 py-1 text-right">
                                <span className="text-xs text-gray-600">Total Exams</span>
                                <div className="text-xl font-bold text-orange-600">{examOptions.length}</div>
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
                            {/* Welcome Message */}
                            <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded-r-lg">
                                <Typography variant="h6" className="text-blue-800 font-bold mb-2">
                                    🙏 Welcome to Pratiyogita Yogya!
                                </Typography>
                                <Typography variant="body2" className="text-blue-700">
                                    Your trusted companion for exam eligibility checking.
                                </Typography>
                            </div>

                            {/* Data Privacy */}
                            <div className="bg-green-50 border-l-4 border-green-500 p-4 rounded-r-lg">
                                <Typography variant="subtitle1" className="text-green-800 font-bold mb-2">
                                    🔒 Data Privacy & Security
                                </Typography>
                                <Typography variant="body2" className="text-green-700">
                                    We <strong>DO NOT</strong> sell your data or use it for any fraudulent or unusual activities. 
                                    Your information is safe with us and is used solely for eligibility checking purposes.
                                </Typography>
                            </div>

                            {/* Eligibility Criteria */}
                            <div className="bg-yellow-50 border-l-4 border-yellow-500 p-4 rounded-r-lg">
                                <Typography variant="subtitle1" className="text-yellow-800 font-bold mb-2">
                                    📋 Eligibility Criteria Disclaimer
                                </Typography>
                                <Typography variant="body2" className="text-yellow-700">
                                    The information we collect in this form is <strong>only</strong> to determine your eligibility 
                                    based on the criteria we have defined. We are <strong>NOT</strong> responsible for any other 
                                    criteria that may apply to your specific situation.
                                </Typography>
                            </div>

                            {/* Official Notification */}
                            <div className="bg-purple-50 border-l-4 border-purple-500 p-4 rounded-r-lg">
                                <Typography variant="subtitle1" className="text-purple-800 font-bold mb-2">
                                    📄 Official Notification
                                </Typography>
                                <Typography variant="body2" className="text-purple-700">
                                    For <strong>detailed and complete eligibility criteria</strong>, please always refer to the 
                                    <strong> official exam notification</strong> released by the conducting authority. 
                                    Our tool provides a quick reference but may not cover all edge cases.
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
                                '&:hover': {
                                    background: 'linear-gradient(135deg, #e55c00 0%, #ff6600 100%)',
                                }
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

                    {/* Two Column Layout: Form (3/5) + Results Summary (2/5) - Completely Separated */}
                    <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
                        {/* LEFT COLUMN: Form (3/5 = 60%) */}
                        <div 
                            className="lg:col-span-3 bg-white rounded-xl shadow-lg p-3 max-h-[75vh] overflow-y-auto"
                            style={thinScrollbarStyle}
                        >
                            <Box component="form" noValidate autoComplete="off">
                                {/* Section 1: Exam Selection */}
                                <div className="rounded-lg p-3 mb-3 border border-gray-200">
                                    <h2 className="text-sm font-semibold text-gray-800 mb-3 text-left">
                                        Select Target Exam
                                    </h2>
                                    <div className="grid grid-cols-1 gap-3">
                                        {/* Target Exam */}
                                        <TextField
                                            select
                                            fullWidth
                                            label="Target Exam"
                                            required
                                            value={selectedExam}
                                            onChange={handleExamChange}
                                            helperText="Select your target exam (only exams with data available)"
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

                                    {loading && (
                                        <div className="flex items-center justify-center mt-4">
                                            <CircularProgress size={24} />
                                            <span className="ml-2">Loading exam data...</span>
                                        </div>
                                    )}
                                </div>

                                {/* Section 2: Personal Information */}
                                {examData && (
                                    <div className="rounded-lg p-3 mb-3 border border-gray-200">
                                        <h2 className="text-sm font-semibold text-gray-800 mb-3 text-left">
                                            Personal Information
                                        </h2>
                                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                                            {/* Date of Birth */}
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

                                            {/* Gender */}
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

                                            {/* Marital Status */}
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

                                            {/* Nationality */}
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

                                            {/* Domicile - Only enabled for Indian nationals */}
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

                                            {/* Caste/Category */}
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

                                            {/* PWD Status */}
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
                                {examData && (
                                    <div className="rounded-lg p-3 mb-3 border border-gray-200">
                                        <h2 className="text-sm font-semibold text-gray-800 mb-3 text-left">
                                            Educational Qualification
                                        </h2>
                                        
                                        {/* Highest Education Dropdown */}
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
                                        
                                        {/* Education Qualification Table */}
                                        {visibleEducationLevels.length > 0 && (
                                            <div className="overflow-x-auto">
                                                {/* Table Header */}
                                                <div className="hidden sm:grid sm:grid-cols-6 gap-2 mb-2 px-2 text-xs font-semibold text-gray-600">
                                                    <div className="text-left"></div>
                                                    <div className="text-left">Course/Stream</div>
                                                    <div className="text-left">Subject</div>
                                                    <div className="text-left">Completion Status</div>
                                                    <div className="text-left">Marks (%)</div>
                                                    <div className="text-left">Completed Year</div>
                                                </div>
                                                
                                                {/* Table Rows */}
                                                {visibleEducationLevels.map((level) => {
                                                    const levelData = educationTableData[level.key] || {};
                                                    const levelCourses = getCourseOptionsForLevel(level.key);
                                                    const levelSubjects = levelData.course ? getSubjectOptionsForCourse(levelData.course, level.key) : [];
                                                    
                                                    return (
                                                        <div 
                                                            key={level.key} 
                                                            className="grid grid-cols-1 sm:grid-cols-6 gap-2 mb-3 p-2 bg-gray-50 rounded-lg items-center"
                                                        >
                                                            {/* Education Level Label */}
                                                            <div className="font-medium text-sm text-gray-800 sm:text-left">
                                                                {level.shortLabel}
                                                            </div>
                                                            
                                                            {/* Course/Stream */}
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
                                                            
                                                            {/* Subject */}
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
                                                            
                                                            {/* Completion Status */}
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
                                                            
                                                            {/* Marks */}
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
                                                            
                                                            {/* Completed Year */}
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
                                        
                                        {/* Additional Education Fields */}
                                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 mt-4">
                                            {/* Active Backlogs */}
                                            <TextField
                                                select
                                                fullWidth
                                                label="Active Backlogs"
                                                value={formData.active_backlogs_allowed}
                                                onChange={handleChange("active_backlogs_allowed")}
                                                helperText="Number of active backlogs"
                                                size="small"
                                            >
                                                {backlogsOptions.map((option) => (
                                                    <MenuItem key={option.value} value={option.value}>
                                                        {option.label}
                                                    </MenuItem>
                                                ))}
                                            </TextField>

                                            {/* Gap Years */}
                                            <TextField
                                                select
                                                fullWidth
                                                label="Gap Years"
                                                value={formData.gap_years_allowed}
                                                onChange={handleChange("gap_years_allowed")}
                                                helperText="Gap in education"
                                                size="small"
                                            >
                                                {gapYearsOptions.map((option) => (
                                                    <MenuItem key={option.value} value={option.value}>
                                                        {option.label}
                                                    </MenuItem>
                                                ))}
                                            </TextField>
                                        </div>
                                    </div>
                                )}



                                {/* Section 5: NCC & Sports */}
                                {examData && (
                                    <div className="rounded-lg p-3 mb-3 border border-gray-200">
                                        <h2 className="text-sm font-semibold text-gray-800 mb-3 text-left">
                                            NCC & Sports Details
                                        </h2>
                                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                                            {/* NCC Wing */}
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

                                            {/* NCC Certificate */}
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

                                            {/* NCC Certificate Grade */}
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

                                            {/* Sports Quota */}
                                            <TextField
                                                select
                                                fullWidth
                                                label="Sports Quota Eligible"
                                                value={formData.sports_quota_eligibility}
                                                onChange={handleChange("sports_quota_eligibility")}
                                                helperText="Sports achievement eligibility"
                                                size="small"
                                            >
                                                {sportsQuotaOptions.map((option) => (
                                                    <MenuItem key={option.value} value={option.value}>
                                                        {option.label}
                                                    </MenuItem>
                                                ))}
                                            </TextField>

                                            {/* CPL Holder */}
                                            <TextField
                                                select
                                                fullWidth
                                                label="CPL Holder"
                                                value={formData.cpl_holder}
                                                onChange={handleChange("cpl_holder")}
                                                helperText="Commercial Pilot License"
                                                size="small"
                                            >
                                                {cplHolderOptions.map((option) => (
                                                    <MenuItem key={option.value} value={option.value}>
                                                        {option.label}
                                                    </MenuItem>
                                                ))}
                                            </TextField>
                                        </div>
                                    </div>
                                )}

                                {/* Section 6: Physical Requirements - COMMENTED OUT FOR NOW */}
                                {/* {examData && (
                                    <div className="rounded-lg p-3 mb-3 border border-gray-200">
                                        <h2 className="text-sm font-semibold text-gray-800 mb-3 text-left">
                                            Physical Requirements
                                        </h2>
                                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                                            <TextField
                                                fullWidth
                                                label="Height (cm)"
                                                type="number"
                                                value={formData.height_cm}
                                                onChange={handleChange("height_cm")}
                                                helperText="Your height in cm"
                                                size="small"
                                                inputProps={{ min: 100, max: 250 }}
                                            />

                                            <TextField
                                                fullWidth
                                                label="Weight (kg)"
                                                type="number"
                                                value={formData.weight_kg}
                                                onChange={handleChange("weight_kg")}
                                                helperText="Your weight in kg"
                                                size="small"
                                                inputProps={{ min: 30, max: 200 }}
                                            />

                                            <TextField
                                                select
                                                fullWidth
                                                label="Vision/Eyesight"
                                                value={formData.vision_eyesight}
                                                onChange={handleChange("vision_eyesight")}
                                                helperText="Your vision status"
                                                size="small"
                                            >
                                                {visionOptions.map((option) => (
                                                    <MenuItem key={option.value} value={option.value}>
                                                        {option.label}
                                                    </MenuItem>
                                                ))}
                                            </TextField>
                                        </div>
                                    </div>
                                )} */}

                                {/* Section 7: Other Requirements - COMMENTED OUT FOR NOW */}
                                {/* {examData && (
                                    <div className="rounded-lg p-3 mb-3 border border-gray-200">
                                        <h2 className="text-sm font-semibold text-gray-800 mb-3 text-left">
                                            Other Requirements
                                        </h2>
                                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                                            <TextField
                                                select
                                                fullWidth
                                                label="Language Proficiency"
                                                value={formData.language_proficiency}
                                                onChange={handleChange("language_proficiency")}
                                                helperText="Languages you are proficient in"
                                                size="small"
                                            >
                                                {languageOptions.map((option) => (
                                                    <MenuItem key={option.value} value={option.value}>
                                                        {option.label}
                                                    </MenuItem>
                                                ))}
                                            </TextField>

                                            <TextField
                                                select
                                                fullWidth
                                                label="Driving License Type"
                                                value={formData.driving_license_type}
                                                onChange={handleChange("driving_license_type")}
                                                helperText="Type of driving license"
                                                size="small"
                                            >
                                                {drivingLicenseOptions.map((option) => (
                                                    <MenuItem key={option.value} value={option.value}>
                                                        {option.label}
                                                    </MenuItem>
                                                ))}
                                            </TextField>

                                            <TextField
                                                select
                                                fullWidth
                                                label="Current Employment Status"
                                                value={formData.current_employment_status}
                                                onChange={handleChange("current_employment_status")}
                                                helperText="Your current employment"
                                                size="small"
                                            >
                                                {employmentOptions.map((option) => (
                                                    <MenuItem key={option.value} value={option.value}>
                                                        {option.label}
                                                    </MenuItem>
                                                ))}
                                            </TextField>

                                            <TextField
                                                select
                                                fullWidth
                                                label="Work Experience (Years)"
                                                value={formData.work_experience_years}
                                                onChange={handleChange("work_experience_years")}
                                                helperText="Total work experience"
                                                size="small"
                                            >
                                                {workExperienceOptions.map((option) => (
                                                    <MenuItem key={option.value} value={option.value}>
                                                        {option.label}
                                                    </MenuItem>
                                                ))}
                                            </TextField>

                                            <TextField
                                                select
                                                fullWidth
                                                label="Ex-Servicemen"
                                                value={formData.ex_servicemen_status}
                                                onChange={handleChange("ex_servicemen_status")}
                                                helperText="Are you an ex-serviceman?"
                                                size="small"
                                            >
                                                {exServicemenOptions.map((option) => (
                                                    <MenuItem key={option.value} value={option.value}>
                                                        {option.label}
                                                    </MenuItem>
                                                ))}
                                            </TextField>
                                        </div>
                                    </div>
                                )} */}

                                {/* Submit Button */}
                                {examData && (
                                    <div className="flex justify-center mt-4">
                                        <Button
                                            variant="contained"
                                            size="medium"
                                            onClick={handleCheckEligibility}
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
                                            Check Eligibility and Attempts
                                        </Button>
                                    </div>
                                )}
                            </Box>
                        </div>

                        {/* RIGHT COLUMN: Results Summary (2/5 = 40%) - Separate Container */}
                        <div 
                            className="lg:col-span-2 bg-white rounded-xl shadow-lg p-3"
                        >
                            {renderResultsSummary()}
                            
                            {/* Placeholder when no results */}
                            {!showResults && examData && (
                                <div className="bg-gray-50 rounded-lg p-4 text-center border border-dashed border-gray-300">
                                    <p className="text-gray-500 text-sm">
                                        📋 Results will appear here after you check eligibility
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>

                {/* BOTTOM: Detailed Results (completely separate container with gap) */}
                {renderDetailedResults()}
            </div>
        </ThemeProvider>
    );
}

export default CheckEligibilityNew;
