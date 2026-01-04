import React, { useState } from 'react';
import { getExamNames, getExamData } from '../../Examsdata/codes';
import FormInput from './FormInput';
import ResultNow from './ResultNow';
import './FormStyles.css';

// ==================== UTILITY FUNCTIONS ====================

// Function to check age eligibility - Updated for new JSON structure with CPL holder support
const checkAgeEligibility = (examData, dateOfBirth, selectedCourse = null, formData = null) => {
  if (!dateOfBirth) return [];
  
  const birthDate = new Date(dateOfBirth);
  const results = [];
  
  // Handle new hierarchical structure with courses/academies
  if (examData?.courses || examData?.academies) {
    const courseData = examData.courses || examData.academies;
    
    // If a specific course is selected, check only that course
    if (selectedCourse && courseData[selectedCourse]) {
      const course = courseData[selectedCourse];
      if (course.age_criteria) {
        // Handle nested age criteria structure (like AFA with regular_candidates and CPL_holders)
        const processAgeCriteria = (ageCriteria, categoryName = '') => {
          Object.entries(ageCriteria).forEach(([cycleName, ageLimit]) => {
            // Check if this is a nested structure (contains objects)
            if (typeof ageLimit === 'object' && ageLimit !== null) {
              // Special handling for AFA with CPL holder selection
              if (selectedCourse === 'AFA' && formData && formData.cplHolder) {
                // If CPL holder selection is made, show only the relevant category
                if (formData.cplHolder === 'Yes' && cycleName === 'CPL_holders') {
                  processAgeCriteria(ageLimit, 'CPL Holders');
                } else if (formData.cplHolder === 'No' && cycleName === 'regular_candidates') {
                  processAgeCriteria(ageLimit, 'Regular Candidates');
                }
                // Skip other categories when CPL holder selection is made
              } else {
                // This is a nested structure, process recursively for other cases
                processAgeCriteria(ageLimit, cycleName);
              }
            } else {
              // This is a direct age limit
              if (ageLimit === "NO AGE LIMIT") {
                results.push({
                  cycle: categoryName ? `${categoryName} - ${cycleName}` : cycleName,
                  stream: selectedCourse,
                  eligible: true,
                  message: 'No age limit applies'
                });
              } else {
                // Parse date range if available
                const matches = ageLimit.match(/(\d{2} \w{3} \d{4}) - (\d{2} \w{3} \d{4})/);
                if (matches) {
                  const minDate = new Date(matches[1]);
                  const maxDate = new Date(matches[2]);
                  const eligible = birthDate >= minDate && birthDate <= maxDate;
                  
                  results.push({
                    cycle: categoryName ? `${categoryName} - ${cycleName}` : cycleName,
                    stream: selectedCourse,
                    eligible,
                    message: eligible ? 
                      `Eligible (${ageLimit})` : 
                      `Not eligible (must be born between ${matches[1]} and ${matches[2]})`
                  });
                }
              }
            }
          });
        };
        
        processAgeCriteria(course.age_criteria);
      }
    } else {
      // Check all courses/academies
      Object.entries(courseData).forEach(([courseName, course]) => {
        if (course.age_criteria) {
          // Handle nested age criteria structure (like AFA with regular_candidates and CPL_holders)
          const processAgeCriteria = (ageCriteria, categoryName = '') => {
            Object.entries(ageCriteria).forEach(([cycleName, ageLimit]) => {
              // Check if this is a nested structure (contains objects)
              if (typeof ageLimit === 'object' && ageLimit !== null) {
                // Special handling for AFA with CPL holder selection
                if (courseName === 'AFA' && formData && formData.cplHolder) {
                  // If CPL holder selection is made, show only the relevant category
                  if (formData.cplHolder === 'Yes' && cycleName === 'CPL_holders') {
                    processAgeCriteria(ageLimit, 'CPL Holders');
                  } else if (formData.cplHolder === 'No' && cycleName === 'regular_candidates') {
                    processAgeCriteria(ageLimit, 'Regular Candidates');
                  }
                  // Skip other categories when CPL holder selection is made
                } else {
                  // This is a nested structure, process recursively for other cases
                  processAgeCriteria(ageLimit, cycleName);
                }
              } else {
                // This is a direct age limit
                if (ageLimit === "NO AGE LIMIT") {
                  results.push({
                    cycle: categoryName ? `${categoryName} - ${cycleName}` : cycleName,
                    stream: courseName,
                    eligible: true,
                    message: 'No age limit applies'
                  });
                } else {
                  // Parse date range if available
                  const matches = ageLimit.match(/(\d{2} \w{3} \d{4}) - (\d{2} \w{3} \d{4})/);
                  if (matches) {
                    const minDate = new Date(matches[1]);
                    const maxDate = new Date(matches[2]);
                    const eligible = birthDate >= minDate && birthDate <= maxDate;
                    
                    results.push({
                      cycle: categoryName ? `${categoryName} - ${cycleName}` : cycleName,
                      stream: courseName,
                      eligible,
                      message: eligible ? 
                        `Eligible (${ageLimit})` : 
                        `Not eligible (must be born between ${matches[1]} and ${matches[2]})`
                    });
                  }
                }
              }
            });
          };
          
          processAgeCriteria(course.age_criteria);
        }
      });
    }
  }
  // Fallback for old format (if any exam still uses it)
  else if (examData?.age_criteria) {
    Object.entries(examData.age_criteria).forEach(([cycleName, cycleData]) => {
      // For exams with NO AGE LIMIT
      if (cycleData['ALL COURSES'] === "NO AGE LIMIT") {
        results.push({
          cycle: cycleName,
          stream: 'ALL COURSES',
          eligible: true,
          message: 'No age limit applies'
        });
        return;
      }
      
      // For date ranges
      Object.entries(cycleData).forEach(([stream, dateRange]) => {
        const matches = dateRange.match(/(\d{2} \w{3} \d{4}) - (\d{2} \w{3} \d{4})/);
        
        if (matches) {
          const minDate = new Date(matches[1]);
          const maxDate = new Date(matches[2]);
          const eligible = birthDate >= minDate && birthDate <= maxDate;
          
          results.push({
            cycle: cycleName,
            stream: stream,
            eligible,
            message: eligible ? 
              `Eligible (${dateRange})` : 
              `Not eligible (must be born between ${matches[1]} and ${matches[2]})`
          });
        }
      });
    });
  }
  
  return results;
};

// Check eligibility based on form data and exam criteria - Updated for new JSON structure
const checkEligibility = (formData, examData, getStreamOptions) => {
  if (!examData) return false;
  
  let isEligible = false;
  const reasons = [];
  const examInfo = [];
  const eligibleStreams = [];
  
  // Get available courses/academies from the new structure
  const courseData = examData.courses || examData.academies || {};
  const availableCourses = Object.keys(courseData);
  
  // If no course is selected yet, show general eligibility
  if (!formData.course && availableCourses.length > 0) {
    // Check each course for potential eligibility
    availableCourses.forEach(courseName => {
      const course = courseData[courseName];
      
      // Check basic eligibility criteria from the course
      let courseEligible = true;
      
      // Check gender eligibility
      if (course.gender && formData.gender && !course.gender.includes(formData.gender)) {
        courseEligible = false;
      }
      
      // Check marital status eligibility
      if (course.marital_status && formData.maritalStatus && 
          !course.marital_status.includes(formData.maritalStatus)) {
        courseEligible = false;
      }
      
      // Check PWD status
      if (course.pwd_status === "NOT APPLICABLE" && formData.pwdStatus === "Yes") {
        courseEligible = false;
      }
      
      // Check nationality
      if (course.nationality && formData.nationality && 
          !course.nationality.includes(formData.nationality)) {
        courseEligible = false;
      }
      
      // Check caste category
      if (course.caste_category && formData.caste && 
          !course.caste_category.includes(formData.caste)) {
        courseEligible = false;
      }
      
      if (courseEligible) {
        eligibleStreams.push({
          name: courseName,
          educationRequirement: course.eligibility_education_course || "Not specified"
        });
      }
    });
  } else if (formData.course) {
    // Check specific course eligibility
    availableCourses.forEach(courseName => {
      const course = courseData[courseName];
      
      // Check if user's education matches this course requirement
      if (course.eligibility_education_course === formData.course) {
        // Check all other eligibility criteria
        let courseEligible = true;
        let courseReasons = [];
        
        // Check gender eligibility
        if (course.gender && formData.gender && !course.gender.includes(formData.gender)) {
          courseEligible = false;
          courseReasons.push(`Gender requirement not met for ${courseName}`);
        }
        
        // Check marital status eligibility
        if (course.marital_status && formData.maritalStatus && 
            !course.marital_status.includes(formData.maritalStatus)) {
          courseEligible = false;
          courseReasons.push(`Marital status requirement not met for ${courseName}`);
        }
        
        // Check PWD status
        if (course.pwd_status === "NOT APPLICABLE" && formData.pwdStatus === "Yes") {
          courseEligible = false;
          courseReasons.push(`PWD status not applicable for ${courseName}`);
        }
        
        // Check nationality
        if (course.nationality && formData.nationality && 
            !course.nationality.includes(formData.nationality)) {
          courseEligible = false;
          courseReasons.push(`Nationality requirement not met for ${courseName}`);
        }
        
        // Check caste category
        if (course.caste_category && formData.caste && 
            !course.caste_category.includes(formData.caste)) {
          courseEligible = false;
          courseReasons.push(`Caste category not eligible for ${courseName}`);
        }
        
        // Check percentage marks
        let marksEligible = true;
        if (course.eligibility_marks && formData.percentageMarks) {
          let requiredMarks = 0;
          let actualMarks = parseFloat(formData.percentageMarks);
          
          if (formData.caste === 'SC' || formData.caste === 'ST' || formData.pwdStatus === 'Yes') {
            const requirement = course.eligibility_marks['SC/ST/PH'] || '';
            requiredMarks = parseInt(requirement.replace(/[^0-9]/g, ''), 10) || 0;
          } else {
            const requirement = course.eligibility_marks['General'] || 
                             course.eligibility_marks['OBC/EWS'] || '';
            requiredMarks = parseInt(requirement.replace(/[^0-9]/g, ''), 10) || 0;
          }
          
          if (actualMarks < requiredMarks) {
            marksEligible = false;
            courseEligible = false;
            courseReasons.push(`Marks requirement not met for ${courseName} (need ${requiredMarks}%, have ${actualMarks}%)`);
          }
        }
        
        if (courseEligible) {
          eligibleStreams.push({
            name: courseName,
            educationRequirement: course.eligibility_education_course
          });
        }
        
        reasons.push(...courseReasons);
      }
    });
  }
  
  // Get age results for eligible courses only
  const ageResults = [];
  eligibleStreams.forEach(stream => {
    const courseAgeResults = checkAgeEligibility(examData, formData.dateOfBirth, stream.name, formData);
    ageResults.push(...courseAgeResults);
  });
  
  // If no specific course selected but some courses are potentially eligible
  if (!formData.course && eligibleStreams.length > 0) {
    // Check age for all potentially eligible courses
    eligibleStreams.forEach(stream => {
      const courseAgeResults = checkAgeEligibility(examData, formData.dateOfBirth, stream.name, formData);
      ageResults.push(...courseAgeResults);
    });
  }
  
  // At least one stream is eligible
  isEligible = eligibleStreams.length > 0;
  
  // Add exam info section
  if (examData.exam_name) {
    examInfo.push(`Exam: ${examData.exam_name}`);
  }
  if (examData.exam_sector) {
    examInfo.push(`Sector: ${examData.exam_sector}`);
  }
  if (examData.conducting_body) {
    examInfo.push(`Conducted by: ${examData.conducting_body}`);
  }
  
  return {
    isEligible,
    reasons,
    examInfo,
    ageResults,
    eligibleStreams,
    marksEligible: true // Will be calculated per course
  };
};

// ==================== MAIN COMPONENT ====================

const EligibilityChecker = () => {
  // State management
  const [formData, setFormData] = useState({
    examTarget: '',
    dateOfBirth: '',
    gender: '',
    maritalStatus: '',
    nationality: '',
    domicile: '',
    course: '',
    yearSemester: '',
    caste: '',
    pwdStatus: '',
    examSector: '',
    percentageMarks: '',
    cplHolder: '',
    backlogs: '',
    gapYears: ''
  });
  
  const [examData, setExamData] = useState(null);
  const [eligibilityResult, setEligibilityResult] = useState(null);
  const [showResults, setShowResults] = useState(false);
  const [requiredPercentage, setRequiredPercentage] = useState(null);

  // ==================== HELPER FUNCTIONS ====================

  // Get options from the new hierarchical structure
  const getOptionsFromCourses = (field) => {
    if (!examData) return [];
    
    const courseData = examData.courses || examData.academies || {};
    const allOptions = new Set();
    
    // Collect unique values from all courses/academies
    Object.values(courseData).forEach(course => {
      if (course[field]) {
        if (Array.isArray(course[field])) {
          course[field].forEach(option => allOptions.add(option));
        } else if (typeof course[field] === 'string') {
          allOptions.add(course[field]);
        }
      }
    });
    
    return Array.from(allOptions);
  };

  // Handle pwd_status from course data
  const getPwdOptions = () => {
    if (!examData) return [];
    
    const courseData = examData.courses || examData.academies || {};
    const pwdApplicable = Object.values(courseData).some(course => 
      course.pwd_status === "APPLICABLE"
    );
    
    return pwdApplicable ? ["Yes", "No"] : ["Not Applicable"];
  };
  
  // Handle complex marital_status structure from courses
  const getMaritalOptions = () => {
    if (!examData) return [];
    
    const courseData = examData.courses || examData.academies || {};
    const allOptions = new Set();
    
    Object.values(courseData).forEach(course => {
      if (course.marital_status) {
        if (Array.isArray(course.marital_status)) {
          course.marital_status.forEach(option => allOptions.add(option));
        } else if (typeof course.marital_status === 'string') {
          allOptions.add(course.marital_status);
        }
      }
    });
    
    return Array.from(allOptions);
  };

  // Get education requirements from the new course structure
  const getEducationRequirements = () => {
    if (!examData) return [];
    
    const courseData = examData.courses || examData.academies || {};
    const allQualifications = new Set();
    
    // Collect all unique education requirements from courses
    Object.values(courseData).forEach(course => {
      if (course.eligibility_education_course) {
        allQualifications.add(course.eligibility_education_course);
      }
    });
    
    return Array.from(allQualifications);
  };
  
  // Get eligible streams/courses based on selected education qualification
  const getStreamOptions = () => {
    if (!examData) return [];
    
    const courseData = examData.courses || examData.academies || {};
    
    // If user has selected a course, filter streams based on eligibility
    if (formData.course) {
      return Object.keys(courseData).filter(courseName => {
        const course = courseData[courseName];
        return course.eligibility_education_course === formData.course;
      });
    }
    
    // Return all available courses
    return Object.keys(courseData);
  };
  
  // Get nationality options from courses
  const getNationalityOptions = () => {
    if (!examData) return [];
    
    const courseData = examData.courses || examData.academies || {};
    const allNationalities = new Set();
    
    Object.values(courseData).forEach(course => {
      if (course.nationality && Array.isArray(course.nationality)) {
        course.nationality.forEach(nationality => allNationalities.add(nationality));
      }
    });
    
    return Array.from(allNationalities);
  };
  
  // Get domicile options from courses
  const getDomicileOptions = () => {
    if (!examData) return [];
    
    const courseData = examData.courses || examData.academies || {};
    const allDomiciles = new Set();
    
    Object.values(courseData).forEach(course => {
      if (course.domicile) {
        allDomiciles.add(course.domicile);
      }
    });
    
    return Array.from(allDomiciles);
  };

  // Update required percentage based on caste - Updated for new structure
  const updateRequiredPercentage = (caste) => {
    if (!examData || !formData.course) return;
    
    const courseData = examData.courses || examData.academies || {};
    
    // Find the course that matches user's selection
    const selectedCourse = Object.values(courseData).find(course => 
      course.eligibility_education_course === formData.course
    );
    
    if (selectedCourse?.eligibility_marks) {
      if (caste === 'SC' || caste === 'ST' || formData.pwdStatus === 'Yes') {
        const requirement = selectedCourse.eligibility_marks['SC/ST/PH'] || '';
        setRequiredPercentage(requirement);
      } else {
        const requirement = selectedCourse.eligibility_marks['General'] || 
                           selectedCourse.eligibility_marks['OBC/EWS'] || '';
        setRequiredPercentage(requirement);
      }
    }
  };

  // ==================== EVENT HANDLERS ====================

  // Handle form field changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    
    let updatedFormData = {
      ...formData,
      [name]: value
    };
    
    // Reset CPL holder when course changes and it's not AFA
    if (name === 'course' && value !== "B.E./B.Tech Degree or Bachelor's Degree with Physics and Mathematics at 10+2 level") {
      updatedFormData.cplHolder = '';
    }
    
    setFormData(updatedFormData);
    
    // Update required percentage when caste changes
    if (name === 'caste' && examData) {
      updateRequiredPercentage(value);
    }
  };

  // Handle exam selection - Updated for new structure
  const handleExamChange = (e) => {
    const examName = e.target.value;
    const data = getExamData(examName);
    setExamData(data);
    
    // Get default values from the new course structure
    let defaultPwdStatus = "";
    let defaultDomicile = "";
    
    if (data) {
      const courseData = data.courses || data.academies || {};
      
      // Check if any course has PWD applicable
      const pwdApplicable = Object.values(courseData).some(course => 
        course.pwd_status === "APPLICABLE"
      );
      defaultPwdStatus = pwdApplicable ? "" : "Not Applicable";
      
      // Get domicile from first course (they should all be the same)
      const firstCourse = Object.values(courseData)[0];
      defaultDomicile = firstCourse?.domicile || "";
    }
    
    setFormData({
      examTarget: examName,
      dateOfBirth: '',
      gender: '',
      maritalStatus: '',
      nationality: '',
      domicile: defaultDomicile,
      course: '',
      yearSemester: '',
      caste: '',
      pwdStatus: defaultPwdStatus,
      examSector: data?.exam_sector || '',
      percentageMarks: '',
      cplHolder: '',
      backlogs: '',
      gapYears: ''
    });
    
    // Reset results
    setEligibilityResult(null);
    setShowResults(false);
    setRequiredPercentage(null);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const eligibility = checkEligibility(formData, examData, getStreamOptions);
    setEligibilityResult(eligibility);
    setShowResults(true);
  };

  // ==================== RENDER OPTIONS ====================

  const examTargetOptions = getExamNames();
  const genderOptions = getOptionsFromCourses('gender');
  const casteOptions = getOptionsFromCourses('caste_category');
  const pwdOptions = getPwdOptions();
  const maritalOptions = getMaritalOptions();
  const courseOptions = getEducationRequirements();
  const nationalityOptions = getNationalityOptions();
  const domicileOptions = getDomicileOptions();

  // ==================== RENDER ====================

  return (
    <div className="w-full min-h-screen pt-20 pb-8 px-3 bg-gray-40">
      <div className="w-full max-w-7xl mx-auto">
        <form className="w-full" onSubmit={handleSubmit}>
          <div className="styled-form w-full p-4 md:p-6 rounded-lg bg-white border border-gray-400 shadow">
            <h2 className="text-xl md:text-2xl font-semibold text-center mb-6 text-gray-800">Check Your Eligibility</h2>
            
            {/* Row with 4 inputs - Responsive Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 mb-4">
              <div>
                <FormInput 
                  label="Exam Target" 
                  type="select" 
                  options={examTargetOptions} 
                  name="examTarget" 
                  required 
                  value={formData.examTarget}
                  onChange={handleExamChange}
                />
              </div>

              <div>
                <FormInput 
                  label="Date of Birth" 
                  type="date" 
                  name="dateOfBirth" 
                  required 
                  value={formData.dateOfBirth}
                  onChange={handleInputChange}
                />
              </div>
              
              <div>
                <FormInput 
                  label="Gender" 
                  type="select" 
                  options={genderOptions} 
                  name="gender" 
                  required 
                  value={formData.gender}
                  onChange={handleInputChange}
                  disabled={!examData}
                />
              </div>
              
              <div>
                <FormInput 
                  label="Marital Status" 
                  type="select" 
                  options={maritalOptions} 
                  name="maritalStatus" 
                  required 
                  value={formData.maritalStatus}
                  onChange={handleInputChange}
                  disabled={!examData}
                />
              </div>
            </div>
          
            {/* Row 2 - Nationality, Domicile, Caste/Category, PWD/Disabled Status */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 mb-4">
              <div>
                <FormInput 
                  label="Nationality" 
                  type="select" 
                  options={nationalityOptions} 
                  name="nationality" 
                  required 
                  value={formData.nationality}
                  onChange={handleInputChange}
                  disabled={!examData}
                />
              </div>
              
              <div>
                <FormInput 
                  label="Domicile" 
                  type="select" 
                  options={domicileOptions} 
                  name="domicile" 
                  required 
                  value={formData.domicile}
                  onChange={handleInputChange}
                  disabled={true}
                />
              </div>

              <div>
                <FormInput 
                  label="Caste/Category" 
                  type="select" 
                  options={casteOptions} 
                  name="caste" 
                  required 
                  value={formData.caste}
                  onChange={handleInputChange}
                  disabled={!examData}
                />
              </div>

              <div>
                <FormInput 
                  label="PWD/Disabled Status" 
                  type="select" 
                  options={pwdOptions} 
                  name="pwdStatus" 
                  required 
                  value={formData.pwdStatus}
                  onChange={handleInputChange}
                  disabled={!examData || !getPwdOptions().includes("Yes")}
                />
              </div>
            </div>
          
            {/* Row 3 - Education Qualification, Year, Percentage Marks, Backlogs, Gap Years */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-3 mb-4">
              <div>
                <FormInput 
                  label="Education Qualification" 
                  type="select" 
                  options={courseOptions} 
                  name="course" 
                  required 
                  value={formData.course}
                  onChange={handleInputChange}
                  disabled={!examData || courseOptions.length === 0}
                />
              </div>
              
              <div>
                <FormInput 
                  label="Year" 
                  type="select" 
                  options={["Final Year", "Completed"]} 
                  name="yearSemester" 
                  required 
                  value={formData.yearSemester}
                  onChange={handleInputChange}
                  disabled={!examData}
                />
              </div>
              
              <div>
                <FormInput 
                  label="Percentage Marks" 
                  type="number"
                  name="percentageMarks" 
                  required 
                  value={formData.percentageMarks}
                  onChange={handleInputChange}
                  disabled={!examData}
                />
              </div>

              <div>
                <FormInput 
                  label="Active Backlogs" 
                  type="select" 
                  options={["No Backlogs", "1-2 Backlogs", "3-5 Backlogs", "More than 5 Backlogs"]} 
                  name="backlogs" 
                  required 
                  value={formData.backlogs}
                  onChange={handleInputChange}
                  disabled={!examData}
                />
              </div>

              <div>
                <FormInput 
                  label="Gap Years" 
                  type="select" 
                  options={["No Gap", "1 Year", "2 Years", "3 Years", "More than 3 Years"]} 
                  name="gapYears" 
                  required 
                  value={formData.gapYears}
                  onChange={handleInputChange}
                  disabled={!examData}
                />
              </div>
            </div>

            {/* CPL Holder Row - Show only for AFA qualification */}
            {formData.course === "B.E./B.Tech Degree or Bachelor's Degree with Physics and Mathematics at 10+2 level" && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 mb-4">
                <div>
                  <FormInput 
                    label="Do you hold CPL (Commercial Pilot License)?" 
                    type="select" 
                    options={["Yes", "No"]} 
                    name="cplHolder" 
                    required 
                    value={formData.cplHolder}
                    onChange={handleInputChange}
                    disabled={!examData}
                  />
                </div>
                <div></div>
                <div></div>
              </div>
            )}

            {/* Additional Fields Section - UI Only (Not Connected to Backend) */}
            <div className="mt-6 pt-4 border-t border-gray-200">
              <p className="text-xs text-red-500 font-medium mb-3 text-center italic">⚠️ Fields below are not working yet - Coming Soon</p>
              
              {/* Row - Highest Education, Education Course, Education Stream */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 mb-4">
                <div>
                  <FormInput 
                    label="Highest Education Qualification" 
                    type="select" 
                    options={["10th (Matriculation)", "12th (Intermediate)", "Diploma", "UG (Undergraduate/Bachelor's)", "PG (Postgraduate/Master's)", "PhD/Doctorate"]} 
                    name="highestEducation" 
                    value=""
                    onChange={() => {}}
                    disabled={false}
                  />
                </div>
                <div>
                  <FormInput 
                    label="Education Course" 
                    type="select" 
                    options={["B.A.", "B.Sc.", "B.Com", "B.Tech/B.E.", "BBA", "BCA", "MBBS", "LLB", "B.Ed", "B.Pharm", "M.A.", "M.Sc.", "M.Com", "M.Tech/M.E.", "MBA", "MCA", "M.Phil", "Other"]} 
                    name="educationCourse" 
                    value=""
                    onChange={() => {}}
                    disabled={false}
                  />
                </div>
                <div>
                  <FormInput 
                    label="Education Stream" 
                    type="select" 
                    options={["Science", "Commerce", "Arts/Humanities", "Engineering - CSE/IT", "Engineering - Mechanical", "Engineering - Electrical", "Engineering - Civil", "Engineering - Electronics", "Engineering - Other", "Medical", "Law", "Management", "Agriculture", "Other"]} 
                    name="educationStream" 
                    value=""
                    onChange={() => {}}
                    disabled={false}
                  />
                </div>
              </div>

              {/* Row - Ex-Serviceman, Height, Weight, Vision */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 mb-4">
                <div>
                  <FormInput 
                    label="Ex-Serviceman Status" 
                    type="select" 
                    options={["No", "Yes - Ex-Serviceman", "Ward of Ex-Serviceman", "War Widow/Widower"]} 
                    name="exServiceman" 
                    value=""
                    onChange={() => {}}
                    disabled={false}
                  />
                </div>
                <div>
                  <FormInput 
                    label="Height (in cm)" 
                    type="number" 
                    name="height" 
                    value=""
                    onChange={() => {}}
                    disabled={false}
                  />
                </div>
                <div>
                  <FormInput 
                    label="Weight (in kg)" 
                    type="number" 
                    name="weight" 
                    value=""
                    onChange={() => {}}
                    disabled={false}
                  />
                </div>
                <div>
                  <FormInput 
                    label="Vision/Eyesight" 
                    type="select" 
                    options={["Normal (6/6)", "6/9", "6/12", "6/18", "6/24", "6/36", "Correctable with Glasses", "Color Blind", "Night Blindness"]} 
                    name="vision" 
                    value=""
                    onChange={() => {}}
                    disabled={false}
                  />
                </div>
              </div>

              {/* Row - Employment Status, Work Experience, 10th %, 12th % */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 mb-4">
                <div>
                  <FormInput 
                    label="Current Employment Status" 
                    type="select" 
                    options={["Unemployed", "Government Employee - Central", "Government Employee - State", "Government Employee - PSU", "Private Sector Employee", "Self Employed"]} 
                    name="employmentStatus" 
                    value=""
                    onChange={() => {}}
                    disabled={false}
                  />
                </div>
                <div>
                  <FormInput 
                    label="Work Experience (Years)" 
                    type="number" 
                    name="workExperience" 
                    value=""
                    onChange={() => {}}
                    disabled={false}
                  />
                </div>
                <div>
                  <FormInput 
                    label="10th Percentage" 
                    type="number" 
                    name="percentage10th" 
                    value=""
                    onChange={() => {}}
                    disabled={false}
                  />
                </div>
                <div>
                  <FormInput 
                    label="12th Percentage" 
                    type="number" 
                    name="percentage12th" 
                    value=""
                    onChange={() => {}}
                    disabled={false}
                  />
                </div>
              </div>

              {/* Row - 10th Subjects, 12th Subjects */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-4">
                <div>
                  <FormInput 
                    label="Subjects Studied at 10th Level" 
                    type="select" 
                    options={["Standard (All Subjects)", "With Sanskrit", "With Hindi", "With Computer", "Other Regional Language"]} 
                    name="subjects10th" 
                    value=""
                    onChange={() => {}}
                    disabled={false}
                  />
                </div>
                <div>
                  <FormInput 
                    label="Subjects Studied at 12th Level" 
                    type="select" 
                    options={["PCM (Physics, Chemistry, Maths)", "PCB (Physics, Chemistry, Biology)", "PCMB (Physics, Chemistry, Maths, Biology)", "Commerce with Maths", "Commerce without Maths", "Arts/Humanities", "Vocational"]} 
                    name="subjects12th" 
                    value=""
                    onChange={() => {}}
                    disabled={false}
                  />
                </div>
              </div>

              {/* Row - Language Proficiency, Driving License, NCC Certificate, NCC Grade */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 mb-4">
                <div>
                  <FormInput 
                    label="Language Proficiency" 
                    type="select" 
                    options={["Hindi Only", "English Only", "Hindi & English", "Hindi, English & Regional", "Regional Language Only"]} 
                    name="languageProficiency" 
                    value=""
                    onChange={() => {}}
                    disabled={false}
                  />
                </div>
                <div>
                  <FormInput 
                    label="Driving License Type" 
                    type="select" 
                    options={["None", "Two Wheeler Only", "LMV (Car/Jeep)", "HMV (Truck/Bus)", "LMV + HMV", "Transport Vehicle"]} 
                    name="drivingLicense" 
                    value=""
                    onChange={() => {}}
                    disabled={false}
                  />
                </div>
                <div>
                  <FormInput 
                    label="NCC Certificate" 
                    type="select" 
                    options={["None", "Yes - Army Wing", "Yes - Navy Wing", "Yes - Air Force Wing"]} 
                    name="nccCertificate" 
                    value=""
                    onChange={() => {}}
                    disabled={false}
                  />
                </div>
                <div>
                  <FormInput 
                    label="NCC Certificate Grade" 
                    type="select" 
                    options={["Not Applicable", "A Certificate", "B Certificate", "C Certificate"]} 
                    name="nccGrade" 
                    value=""
                    onChange={() => {}}
                    disabled={false}
                  />
                </div>
              </div>

              {/* Row - Sports Quota */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 mb-4">
                <div>
                  <FormInput 
                    label="Sports Quota Eligibility" 
                    type="select" 
                    options={["Not Applicable", "International Level", "National Level", "State Level", "University Level", "District Level"]} 
                    name="sportsQuota" 
                    value=""
                    onChange={() => {}}
                    disabled={false}
                  />
                </div>
                <div></div>
                <div></div>
              </div>
            </div>

          <div className="form-actions w-full flex justify-center mt-6">
            <button type="submit" className="submit-btn" disabled={!examData}>Check Eligibility</button>
          </div>

            {/* Display the results */}
            {showResults && (
              <ResultNow 
                eligibilityResult={eligibilityResult}
                examData={examData}
                formData={formData}
                requiredPercentage={requiredPercentage}
              />
            )}
          </div>
        </form>
      </div>
    </div>
  );
};

// Export the eligibility checking functions for external use
export { checkEligibility, checkAgeEligibility };

export default EligibilityChecker;