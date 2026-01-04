import React, { useState } from "react";
import Footer from "@/components/Footer/footer";
import { motion } from "framer-motion";

function PrivacyPolicy() {
  const [activeTab, setActiveTab] = useState("introduction");
  
  const sections = [
    { id: "introduction", title: "Introduction" },
    { id: "information", title: "Information We Collect" },
    { id: "usage", title: "How We Use Your Information" },
    { id: "security", title: "Data Security" },
    { id: "thirdParty", title: "Third-Party Services" },
    { id: "children", title: "Children's Privacy" },
    { id: "changes", title: "Changes to This Privacy Policy" },
    { id: "contact", title: "Contact Us" },
  ];

  // Content for each section
  const sectionContent = {
    introduction: (
      <div className="flex flex-col">
        <div className="flex items-center mb-3">
          <div className="p-1.5 mr-3 bg-blue-100 rounded-lg text-blue-600">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h2 className="text-xl font-bold text-gray-800">Introduction</h2>
        </div>
        <p className="text-gray-700">
          Thank you for using Pariksha Yogya. This Privacy Policy explains
          how we collect, use, disclose, and safeguard your information when
          you use our website and services. Please read this policy
          carefully to understand our practices regarding your personal
          data.
        </p>
      </div>
    ),
    
    information: (
      <div className="flex flex-col">
        <div className="flex items-center mb-3">
          <div className="p-1.5 mr-3 bg-green-100 rounded-lg text-green-600">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <h2 className="text-xl font-bold text-gray-800">Information We Collect</h2>
        </div>
        <p className="mb-3 text-gray-700">
          We may collect several types of information from and about users
          of our platform, including:
        </p>
        <div className="space-y-3">
          <div className="bg-gray-50 p-3 rounded-lg">
            <h3 className="font-semibold text-gray-800">Personal Information</h3>
            <p className="text-gray-700">
              Name, email address, phone number, educational background, age, and
              other demographic information necessary for eligibility
              calculations and personalized services.
            </p>
          </div>
          <div className="bg-gray-50 p-3 rounded-lg">
            <h3 className="font-semibold text-gray-800">Usage Data</h3>
            <p className="text-gray-700">
              Information on how you interact with our platform, including exam preferences,
              study patterns, and feature usage.
            </p>
          </div>
          <div className="bg-gray-50 p-3 rounded-lg">
            <h3 className="font-semibold text-gray-800">Device Information</h3>
            <p className="text-gray-700">
              Information about your device, IP address, browser type, and
              operating system.
            </p>
          </div>
        </div>
      </div>
    ),
    
    usage: (
      <div className="flex flex-col">
        <div className="flex items-center mb-3">
          <div className="p-1.5 mr-3 bg-purple-100 rounded-lg text-purple-600">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
          </div>
          <h2 className="text-xl font-bold text-gray-800">How We Use Your Information</h2>
        </div>
        <p className="mb-3 text-gray-700">We use the information we collect to:</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {[
            "Calculate exam eligibility and attempts based on your provided information",
            "Provide personalized study roadmaps and resources",
            "Improve and optimize our platform and services",
            "Communicate with you regarding updates, offers, and relevant information",
            "Conduct research and analysis to enhance user experience",
            "Prevent fraudulent activities and ensure platform security"
          ].map((item, index) => (
            <div key={index} className="flex items-start p-2 bg-gray-50 rounded-lg">
              <div className="text-indigo-500 mr-2 mt-0.5">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
              </div>
              <p className="text-gray-700 text-sm">{item}</p>
            </div>
          ))}
        </div>
      </div>
    ),
    
    security: (
      <div className="flex flex-col">
        <div className="flex items-center mb-3">
          <div className="p-1.5 mr-3 bg-yellow-100 rounded-lg text-yellow-600">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          </div>
          <h2 className="text-xl font-bold text-gray-800">Data Security</h2>
        </div>
        <div className="bg-yellow-50 border-l-4 border-yellow-400 p-3 rounded-r-md">
          <p className="text-gray-700">
            We implement appropriate security measures to protect your
            personal information. However, no method of transmission over the
            Internet or electronic storage is 100% secure. While we strive to
            use commercially acceptable means to protect your personal data,
            we cannot guarantee its absolute security.
          </p>
        </div>
      </div>
    ),
    
    thirdParty: (
      <div className="flex flex-col">
        <div className="flex items-center mb-3">
          <div className="p-1.5 mr-3 bg-red-100 rounded-lg text-red-600">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
          </div>
          <h2 className="text-xl font-bold text-gray-800">Third-Party Services</h2>
        </div>
        <p className="text-gray-700">
          Our platform may use third-party services for analytics, payment
          processing, and other functionalities. These third parties may
          have access to your personal information only to perform these
          tasks on our behalf and are obligated not to disclose or use it
          for any other purpose.
        </p>
      </div>
    ),
    
    children: (
      <div className="flex flex-col">
        <div className="flex items-center mb-3">
          <div className="p-1.5 mr-3 bg-pink-100 rounded-lg text-pink-600">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
            </svg>
          </div>
          <h2 className="text-xl font-bold text-gray-800">Children's Privacy</h2>
        </div>
        <p className="text-gray-700">
          Our services are not intended for individuals under 13 years of
          age. We do not knowingly collect personal information from
          children under 13. If we discover that a child under 13 has
          provided us with personal information, we will promptly delete it.
        </p>
      </div>
    ),
    
    changes: (
      <div className="flex flex-col">
        <div className="flex items-center mb-3">
          <div className="p-1.5 mr-3 bg-indigo-100 rounded-lg text-indigo-600">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
          </div>
          <h2 className="text-xl font-bold text-gray-800">Changes to This Privacy Policy</h2>
        </div>
        <p className="text-gray-700">
          We may update our Privacy Policy from time to time. We will notify
          you of any changes by posting the new Privacy Policy on this page
          and updating the "Last Updated" date. You are advised to review
          this Privacy Policy periodically for any changes.
        </p>
      </div>
    ),
    
    contact: (
      <div className="flex flex-col">
        <div className="flex items-center mb-3">
          <div className="p-1.5 mr-3 bg-blue-100 rounded-lg text-blue-600">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
          </div>
          <h2 className="text-xl font-bold text-gray-800">Contact Us</h2>
        </div>
        <div className="bg-blue-50 p-4 rounded-lg text-center">
          <p className="text-gray-700 mb-3">
            If you have any questions about this Privacy Policy, please
            contact us at:
          </p>
          <a
            href="mailto:askparikshasetu@gmail.com"
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" viewBox="0 0 20 20" fill="currentColor">
              <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
              <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
            </svg>
            askparikshasetu@gmail.com
          </a>
        </div>
      </div>
    )
  };

  return (
    <div className="bg-gradient-to-b from-gray-50 to-white min-h-screen">
      {/* Hero section */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white py-10 pt-28 px-3 shadow-md">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-3xl md:text-4xl font-bold mb-2">Privacy Policy</h1>
          <p className="text-base opacity-90 max-w-2xl mx-auto">
            At Pariksha Yogya, we value your privacy and are committed to protecting your personal information
          </p>
        </div>
      </div>
      
      {/* Desktop and Mobile Layout */}
      <div className="max-w-6xl mx-auto px-3 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
          {/* Table of Contents - Desktop only */}
          <div className="hidden lg:block">
            <div className="sticky top-4 bg-white p-4 rounded-lg shadow-sm">
              <h3 className="text-base font-semibold mb-3 text-gray-900 border-b pb-2">Contents</h3>
              <nav>
                <ul className="space-y-1">
                  {sections.map((section) => (
                    <li key={section.id}>
                      <button
                        onClick={() => setActiveTab(section.id)}
                        className={`w-full text-left px-2 py-1 rounded-md transition-colors text-sm ${
                          activeTab === section.id
                            ? "bg-blue-100 text-blue-700 font-medium"
                            : "hover:bg-gray-100 text-gray-700"
                        }`}
                      >
                        {section.title}
                      </button>
                    </li>
                  ))}
                </ul>
              </nav>
            </div>
          </div>
          
          {/* Content section */}
          <div className="lg:col-span-3">
            {/* Desktop view - show only active tab content */}
            <div className="hidden lg:block">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3 }}
                className="bg-white p-4 rounded-lg shadow-sm border border-gray-100"
              >
                {sectionContent[activeTab]}
              </motion.div>
            </div>
            
            {/* Mobile view - show all content sequentially */}
            <div className="lg:hidden space-y-6">
              {sections.map((section) => (
                <div key={section.id} id={section.id} className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
                  {sectionContent[section.id]}
                </div>
              ))}
            </div>
            
            <div className="text-xs text-gray-500 pt-3 pb-4 border-t border-gray-200 mt-6">
              <div className="flex items-center justify-between">
                <p>Last Updated: March 21, 2025</p>
                <button 
                  onClick={() => window.scrollTo({top: 0, behavior: 'smooth'})}
                  className="inline-flex items-center text-gray-600 hover:text-gray-900"
                >
                  <span>Back to top</span>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="w-full p-3 pt-0 m-auto">
        <Footer />
      </div>
    </div>
  );
}

export default PrivacyPolicy;
