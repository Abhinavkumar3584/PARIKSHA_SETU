import React, { useState } from 'react';

// Input descriptions for better user guidance
const inputDescriptions = {
  examTarget: "Select the competitive exam you want to check eligibility for",
  dateOfBirth: "Enter your date of birth as per official documents",
  gender: "Select your gender as mentioned in official documents",
  maritalStatus: "Choose your current marital status",
  nationality: "Select your nationality",
  domicile: "Your state/region of permanent residence",
  course: "Select your educational qualification or the course you're pursuing",
  yearSemester: "Indicate if you're in final year or have completed your course",
  caste: "Select your caste category for reservation benefits",
  pwdStatus: "Select if you are a person with disability (PWD)",
  percentageMarks: "Enter your aggregate percentage marks in qualifying examination",
  cplHolder: "Select if you hold a Commercial Pilot License (CPL)",
  backlogs: "Indicate if you have any active/pending backlogs in your education",
  gapYears: "Enter the number of gap years in your education (0 if none)"
};

// Reusable input component that works with various input types
const FormInput = ({ label, type = "text", options = [], required = false, name, onChange, value, disabled = false }) => {
  const [isFocused, setIsFocused] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  // Simple static label text (more accessible and compact)
  const labelText = label;

  // Render appropriate input based on type
  const renderInput = () => {
    const animationClass = `animated-input ${isFocused ? 'focused' : ''} ${isHovered ? 'hovered' : ''}`;
    
    switch (type) {
      case 'select':
        return (
          <div className="select-wrapper">
            <select 
              className={`input ${animationClass}`}
              required={required} 
              name={name} 
              onChange={onChange} 
              value={value || ""}
              disabled={disabled}
              aria-label={label}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
              onMouseEnter={() => setIsHovered(true)}
              onMouseLeave={() => setIsHovered(false)}
              style={disabled ? { opacity: 0.6, cursor: 'not-allowed' } : {}}
            >
              <option value="" disabled>
                Choose an option...
              </option>
              {options.map((option, index) => (
                <option 
                  key={index} 
                  value={option.value || option} 
                  className="option-item"
                >
                  {option.label || option}
                </option>
              ))}
            </select>
            <div className="select-icon">
              <svg className="chevron-icon" width="12" height="12" viewBox="0 0 12 12">
                <path d="M3 4.5L6 7.5L9 4.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
              </svg>
            </div>
          </div>
        );
      case 'date':
        return (
          <input 
            type="date" 
            className={`input ${animationClass}`} 
            required={required} 
            name={name} 
            onChange={onChange} 
            value={value || ""} 
            disabled={disabled}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            style={disabled ? { opacity: 0.6, cursor: 'not-allowed' } : {}} 
          />
        );
      case 'number':
        return (
          <input 
            type="number" 
            min="0" 
            max="100" 
            step="0.01" 
            className={`input ${animationClass}`} 
            required={required} 
            name={name} 
            onChange={onChange} 
            value={value || ""} 
            disabled={disabled}
            placeholder="Enter percentage (0-100)"
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            style={disabled ? { opacity: 0.6, cursor: 'not-allowed' } : {}} 
          />
        );
      default:
        return (
          <input 
            type={type} 
            className={`input ${animationClass}`} 
            required={required} 
            name={name} 
            onChange={onChange} 
            value={value || ""} 
            disabled={disabled}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            style={disabled ? { opacity: 0.6, cursor: 'not-allowed' } : {}} 
          />
        );
    }
  };

  // Get description for the input
  const description = inputDescriptions[name] || "";

  return (
    <div className="wave-group">
      <label className="label text-gray-700">
        {labelText}
        {required && <span className="required-asterisk">*</span>}
      </label>
      {renderInput()}
      {description && (
        <p className="input-description light-description">
          {description}
        </p>
      )}
    </div>
  );
};

export default FormInput;