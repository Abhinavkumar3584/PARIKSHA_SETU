import React from 'react';
import { FaCheckCircle, FaTimesCircle, FaInfoCircle, FaGraduationCap, FaCalendarAlt, FaUniversity, FaUserGraduate } from 'react-icons/fa';
import { MdSubject, MdSchool } from 'react-icons/md';
import './FormStyles.css';

const ResultNow = ({ 
  eligibilityResult, 
  examData, 
  formData, 
  requiredPercentage
}) => {
  if (!eligibilityResult) return null;

  return (
    <div className={`eligibility-result ${eligibilityResult.isEligible ? 'eligible' : 'not-eligible'}`}>
      <div className="result-header">
        {eligibilityResult.isEligible ? 
          <FaCheckCircle className="result-icon eligible-icon" /> : 
          <FaTimesCircle className="result-icon not-eligible-icon" />
        }
        <h3>{eligibilityResult.isEligible ? 'You are eligible for this exam!' : 'You may not be eligible for this exam'}</h3>
      </div>
      
      <div className="result-sections-layout">
        {/* Left column - Summary and Streams */}
        <div className="result-left-column">
          {/* Main Eligibility Status */}
          <div className="result-section-card primary-section">
            <div className="section-header">
              <FaInfoCircle className="section-icon" />
              <h4>Eligibility Summary</h4>
            </div>
            <div className="summary-content">
              <div className="summary-item">
                <span className="summary-label">Exam:</span>
                <span className="summary-value">{formData.examTarget}</span>
              </div>
              <div className="summary-item">
                <span className="summary-label">Education:</span>
                <span className="summary-value">{formData.course}</span>
              </div>
              {requiredPercentage && (
                <div className="summary-item">
                  <span className="summary-label">Required Marks:</span>
                  <span className="summary-value">{requiredPercentage}</span>
                </div>
              )}
              <div className="summary-item">
                <span className="summary-label">Your Marks:</span>
                <span className={`summary-value ${eligibilityResult.marksEligible ? 'eligible-text' : 'not-eligible-text'}`}>
                  {formData.percentageMarks}%
                </span>
              </div>
              <div className="summary-item">
                <span className="summary-label">Category:</span>
                <span className="summary-value">{formData.caste}</span>
              </div>
              {examData?.conducting_body && (
                <div className="summary-item">
                  <span className="summary-label">Conducted by:</span>
                  <span className="summary-value">{examData.conducting_body}</span>
                </div>
              )}
            </div>
          </div>
          
          {/* Eligible Streams */}
          {eligibilityResult.eligibleStreams && eligibilityResult.eligibleStreams.length > 0 && (
            <div className="result-section-card streams-section">
              <div className="section-header">
                <FaGraduationCap className="section-icon" />
                <h4>Eligible Streams ({eligibilityResult.eligibleStreams.length})</h4>
              </div>
              <div className="streams-grid">
                {eligibilityResult.eligibleStreams.map((stream, index) => {
                  // Get course data from new structure
                  const courseData = examData.courses || examData.academies || {};
                  const course = courseData[stream.name];
                  
                  return (
                    <div key={index} className="stream-card">
                      <div className="stream-title">
                        <FaUserGraduate className="stream-icon" /> 
                        <span>{course?.full_form || stream.name}</span>
                      </div>
                      {course?.exam_subjects && (
                        <div className="stream-detail">
                          <MdSubject className="detail-icon" /> 
                          <span>
                            {Array.isArray(course.exam_subjects.subjects) ? 
                              course.exam_subjects.subjects.join(', ') : 
                              course.exam_subjects.subjects || 'Not specified'}
                          </span>
                        </div>
                      )}
                      <div className="stream-detail">
                        <MdSchool className="detail-icon" /> 
                        <span>
                          Education: {course?.eligibility_education_course || stream.educationRequirement}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
        
        {/* Right column - Age Eligibility */}
        <div className="result-right-column">
          {/* Age Eligibility */}
          {eligibilityResult.ageResults && eligibilityResult.ageResults.length > 0 && (
            <div className="result-section-card age-section">
              <div className="section-header">
                <FaCalendarAlt className="section-icon" />
                <h4>Age Eligibility</h4>
              </div>
              <div className="age-summary">
                <span className="dob-label">Your Date of Birth:</span>
                <span className="dob-value">
                  {new Date(formData.dateOfBirth).toLocaleDateString()}
                </span>
              </div>
              <div className="age-table">
                <div className="age-table-header">
                  <div className="age-cycle">Exam Cycle</div>
                  <div className="age-stream">Stream</div>
                  <div className="age-status">Status</div>
                </div>
                {eligibilityResult.ageResults.map((result, index) => (
                  <div 
                    key={index} 
                    className={`age-table-row ${result.eligible ? 'eligible-row' : 'not-eligible-row'}`}
                  >
                    <div className="age-cycle">{result.cycle}</div>
                    <div className="age-stream">{result.stream}</div>
                    <div className="age-status">
                      {result.eligible ? 
                        <><FaCheckCircle className="status-icon eligible-icon" /> <span>Eligible</span></> : 
                        <><FaTimesCircle className="status-icon not-eligible-icon" /> <span>Not Eligible</span></>
                      }
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ResultNow;