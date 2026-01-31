import React, { useState, useEffect } from 'react';
import allExamsData from '../../../examsdata/allexamnames.json';

const StatsAnalytics = () => {
  // Count total exams from allexamnames.json
  const [examCount, setExamCount] = useState(0);
  const [mainFolderCount, setMainFolderCount] = useState(0);
  
  useEffect(() => {
    // Count only active exams (with linked_json_file) across all categories
    let activeExams = 0;
    let categoryCount = 0;
    
    for (const category in allExamsData) {
      if (Array.isArray(allExamsData[category])) {
        // Count only exams that have a linked JSON file (active exams)
        activeExams += allExamsData[category].filter(
          exam => exam.linked_json_file && exam.linked_json_file !== ''
        ).length;
        categoryCount++;
      }
    }
    
    setExamCount(activeExams);
    setMainFolderCount(categoryCount);
  }, []);
  
  // Telegram channel link
  const telegramChannelLink = "https://t.me/pratiyogitasetu";

  
  return (
    <div className="relative z-10 max-w-full mx-auto px-2 py-3 md:px-4 md:py-6 lg:px-6 lg:py-8">
      <div className="relative">
        {/* Background decorative elements */}
        <div className="absolute -top-10 -left-10 w-32 h-32 bg-blue-100 rounded-full opacity-20 blur-xl"></div>
        <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-purple-100 rounded-full opacity-20 blur-xl"></div>
        
        {/* Stats grid for mobile, row for desktop */}
        <div className="grid grid-cols-3 sm:flex sm:flex-wrap justify-center items-stretch gap-4 md:gap-3 lg:gap-4">
          {/* Telegram Channel - now with QR code */}
          <a 
            href={telegramChannelLink}
            target="_blank"
            rel="noopener noreferrer"
            className="bg-gradient-to-br from-blue-50 to-blue-100 flex flex-col items-center p-2 md:p-3 lg:p-5 border border-blue-200 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 min-w-[90px] md:min-w-[130px] lg:min-w-[160px] overflow-hidden relative cursor-pointer"
          >
            <div className="absolute -right-4 -top-4 w-12 h-12 bg-blue-200 rounded-full opacity-30"></div>
            <div className="text-blue-600 text-[10px] md:text-xs lg:text-base font-medium">Telegram</div>
            <div className="my-0 md:my-2 lg:my-3">
              <img 
                src="./telegram_qr.jpg"
                alt="Telegram Channel QR Code" 
                className="w-12 h-12 md:w-24 md:h-24 lg:w-24 lg:h-24 rounded-md border border-blue-200"
              />
            </div>
            <div className="bg-blue-600 text-white px-1.5 py-0.5 lg:px-3 lg:py-1.5 rounded-lg text-[8px] md:text-[10px] lg:text-xs ">Click to join</div>
          </a>

          {/* Registered Users */}
          <div className="bg-gradient-to-br from-indigo-50 to-indigo-100 flex flex-col items-center p-2 md:p-3 lg:p-5 border border-indigo-200 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 min-w-[90px] md:min-w-[130px] lg:min-w-[160px] overflow-hidden relative">
            <div className="absolute -left-4 -bottom-4 w-12 h-12 bg-indigo-200 rounded-full opacity-30"></div>
            <div className="text-[10px] md:text-xs lg:text-sm mb-1 md:mb-2">
              <span className="bg-indigo-600 text-white px-1.5 py-0.5 lg:px-3 lg:py-1.5 rounded-lg font-medium">+90k</span>
              <span className="text-indigo-700 ml-1.5 font-medium">monthly</span>
            </div>
            <div className="text-sm md:text-2xl lg:text-4xl xl:text-5xl font-bold my-1 md:my-2 lg:my-3 text-indigo-800">1.5M</div>
            <div className="text-indigo-600 text-[10px] md:text-xs lg:text-base font-medium">Registered Users</div>
          </div>

          {/* Total Users */}
          <div className="bg-gradient-to-br from-green-50 to-green-100 flex flex-col items-center p-2 md:p-3 lg:p-5 border border-green-200 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 min-w-[90px] md:min-w-[130px] lg:min-w-[160px] overflow-hidden relative">
            <div className="absolute -right-4 -top-4 w-12 h-12 bg-green-200 rounded-full opacity-30"></div>
            <div className="text-[10px] md:text-xs lg:text-sm mb-1 md:mb-2">
              <span className="bg-green-600 text-white px-1.5 py-0.5 lg:px-3 lg:py-1.5 rounded-lg font-medium">+120k</span>
              <span className="text-green-700 ml-1.5 font-medium">yearly</span>
            </div>
            <div className="text-sm md:text-2xl lg:text-4xl xl:text-5xl font-bold my-1 md:my-2 lg:my-3 text-green-800">2.7M</div>
            <div className="text-green-600 text-[10px] md:text-xs lg:text-base font-medium">Total Users</div>
          </div>

          {/* Eligible Aspirants */}
          <div className="bg-gradient-to-br from-amber-50 to-amber-100 flex flex-col items-center p-2 md:p-3 lg:p-5 border border-amber-200 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 min-w-[90px] md:min-w-[130px] lg:min-w-[160px] overflow-hidden relative">
            <div className="absolute -right-4 -top-4 w-12 h-12 bg-amber-200 rounded-full opacity-30"></div>
            <div className="text-[10px] md:text-xs lg:text-sm mb-1 md:mb-2">
              <span className="bg-amber-600 text-white px-1.5 py-0.5 lg:px-3 lg:py-1.5 rounded-lg font-medium">+35k</span>
              <span className="text-amber-700 ml-1.5 font-medium">weekly</span>
            </div>
            <div className="text-sm md:text-2xl lg:text-4xl xl:text-5xl font-bold my-1 md:my-2 lg:my-3 text-amber-800">895K</div>
            <div className="text-amber-600 text-[10px] md:text-xs lg:text-base font-medium">Eligible Aspirants</div>
          </div>

          {/* Main Categories */}
          <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 flex flex-col items-center p-2 md:p-3 lg:p-5 border border-yellow-200 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 min-w-[90px] md:min-w-[130px] lg:min-w-[160px] overflow-hidden relative">
            <div className="absolute -left-4 -bottom-4 w-12 h-12 bg-yellow-200 rounded-full opacity-30"></div>
            <div className="text-[10px] md:text-xs lg:text-sm mb-1 md:mb-2">
              <span className="bg-yellow-600 text-white px-1.5 py-0.5 lg:px-3 lg:py-1.5 rounded-lg font-medium">+2</span>
              <span className="text-yellow-700 ml-1.5 font-medium">quarterly</span>
            </div>
            <div className="text-sm md:text-2xl lg:text-4xl xl:text-5xl font-bold my-1 md:my-2 lg:my-3 text-yellow-800">{mainFolderCount}</div>
            <div className="text-yellow-600 text-[10px] md:text-xs lg:text-base font-medium">Main Categories</div>
          </div>

          {/* Available Exams - now separate from main folders count */}
          <div className="bg-gradient-to-br from-rose-50 to-rose-100 flex flex-col items-center p-2 md:p-3 lg:p-5 border border-rose-200 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 min-w-[90px] md:min-w-[130px] lg:min-w-[160px] overflow-hidden relative">
            <div className="absolute -left-4 -bottom-4 w-12 h-12 bg-rose-200 rounded-full opacity-30"></div>
            <div className="text-[10px] md:text-xs lg:text-sm mb-1 md:mb-2">
              <span className="bg-rose-600 text-white px-1.5 py-0.5 lg:px-3 lg:py-1.5 rounded-lg font-medium">+15</span>
              <span className="text-rose-700 ml-1.5 font-medium">monthly</span>
            </div>
            <div className="text-sm md:text-2xl lg:text-4xl xl:text-5xl font-bold my-1 md:my-2 lg:my-3 text-rose-800">{examCount}</div>
            <div className="text-rose-600 text-[10px] md:text-xs lg:text-base font-medium">Available Exams</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StatsAnalytics;