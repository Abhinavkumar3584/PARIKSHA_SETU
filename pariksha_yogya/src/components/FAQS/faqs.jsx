import React, { useState } from 'react';

const FAQS = () => {
  const faqData = [
    {
      question: "What is ParikshaYogya?",
      answer: "ParikshaYogya is an eligibility and exam attempt tracker that helps students check their eligibility for various government exams."
    },
    {
      question: "How does the eligibility checker work?",
      answer: "Based on user inputs like age, education, caste, and other factors, it calculates eligibility for exams like UPSC, SSC, NDA, etc."
    },
    {
      question: "Which personal details are required for eligibility checking?",
      answer: "Users need to input details like Date of Birth, Education, Category, Gender, Disability Status, Marital Status, Domicile, and Nationality."
    },
    {
      question: "Does it provide notifications for new exams?",
      answer: "Yes, users receive real-time updates on new exam notifications and eligibility changes."
    },
    {
      question: "Can I download my eligibility report?",
      answer: "Yes, a detailed eligibility chart is available for download in PDF format."
    },
    {
      question: "Does it track my remaining exam attempts?",
      answer: "Yes, it calculates and updates the number of attempts left for exams with attempt limits."
    },
    {
      question: "Is the information provided in ParikshaYogya accurate?",
      answer: "The system is integrated with official exam guidelines, ensuring up-to-date and accurate information."
    },
    {
      question: "Is this tool useful for first-time aspirants?",
      answer: "Absolutely! It helps first-time aspirants understand their eligibility and plan their exam strategy effectively."
    },
    {
      question: "Does ParikshaYogya cover all government exams?",
      answer: "It covers major government exams like UPSC, CDS, SSC, NDA, and more."
    },
    {
      question: "Is ParikshaYogya a paid service?",
      answer: "Basic eligibility checking is free, but premium features like detailed eligibility reports are available under a subscription plan."
    }
  ];

  const [activeIndex, setActiveIndex] = useState(null);

  const toggleFAQ = (index) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  // SVG Components for Open/Close buttons
  const CloseIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" className="text-gray-500">
      <path 
        fill="currentColor" 
        d="M12,2C6.5,2,2,6.5,2,12s4.5,10,10,10s10-4.5,10-10S17.5,2,12,2z M16.7,15.3l-1.4,1.4L12,13.4l-3.3,3.3l-1.4-1.4l3.3-3.3 L7.3,8.7l1.4-1.4l3.3,3.3l3.3-3.3l1.4,1.4L13.4,12L16.7,15.3z">
      </path>
    </svg>
  );

  const OpenIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" className="text-gray-500">
      <path 
        fill="currentColor" 
        d="M12,2C6.5,2,2,6.5,2,12s4.5,10,10,10s10-4.5,10-10S17.5,2,12,2z M17,13h-4v4h-2v-4H7v-2h4V7h2v4h4V13z">
      </path>
    </svg>
  );

  return (
    <div className="max-w-5xl mx-auto px-3 py-6 m-5 bg-[#f5f5f5] border border-[rgba(0,0,0,0.4)] rounded-lg">
      <h1 className="text-2xl md:text-3xl font-bold text-center text-gray-800 mb-5">
        FAQs (Pariksha Yogya)
      </h1>
      
      <div className="flex flex-col space-y-2">
        {faqData.map((faq, index) => (
          <div 
            key={index} 
            className={`border border-gray-200 rounded-lg bg-white
                      transition-all duration-700 ease-in-out cursor-pointer
                      ${activeIndex === index ? 'border-gray-300' : ''}`}
            onClick={() => toggleFAQ(index)}
          >
            <div className="flex justify-between items-center px-4 py-2">
              <h3 className="text-sm md:text-base text-left font-medium text-gray-700 pr-4">
                {faq.question}
              </h3>
              <div className="flex-shrink-0 transform transition-transform duration-300 ease-in-out">
                {activeIndex === index ? <CloseIcon /> : <OpenIcon />}
              </div>
            </div>
            
            <div 
              className={`overflow-hidden transition-all duration-300 ease-in-out transform
                ${activeIndex === index 
                  ? 'max-h-96 opacity-100 translate-y-0' 
                  : 'max-h-0 opacity-0 -translate-y-1'
                }`}
            >
              <div className="px-4 pb-4 pt-1 border-t border-gray-100">
                <p className="text-gray-600 text-left text-sm md:text-sm leading-relaxed">
                  {faq.answer}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FAQS;