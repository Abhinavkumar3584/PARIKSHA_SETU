import React from "react";

const AboutUs = () => {
  // Team Members Data with social media profiles (add or remove icons as needed per member)
  const teamMembers = [
    { 
      role: "FOUNDER", 
      image: "./Aboutusimages/Abhi.jpg", 
      name: "Abhinav Kumar",
      socials: [
        { type: "linkedin", url: "https://www.linkedin.com/in/abhinav-kumar-0ba731239/" },
        { type: "instagram", url: "https://instagram.com/" },
        { type: "facebook", url: "https://facebook.com/" },
        { type: "twitter", url: "https://x.com/ABHINAV11555548" }
      ] 
    },
    { 
      role: "CO-FOUNDER", 
      image: "./Aboutusimages/Manu.jpg", 
      name: "Manu Dev",
      socials: [
        { type: "linkedin", url: "https://linkedin.com/" },
        { type: "github", url: "https://github.com/" },
        { type: "instagram", url: "https://instagram.com/" }
      ] 
    },
    { 
      role: "CTO", 
      image: "./Aboutusimages/Abhishek.jpg",
      name: "Abhishek Kumar", 
      socials: [
        { type: "linkedin", url: "https://linkedin.com/" },
        { type: "github", url: "https://github.com/" },
        { type: "twitter", url: "https://twitter.com/" }
      ] 
    },
    { 
      role: "MARKETING", 
      image: "./Aboutusimages/Rahul.jpg", 
      name: "Rahul Mishra",
      socials: [
        { type: "linkedin", url: "https://linkedin.com/" },
        { type: "facebook", url: "https://facebook.com/" },
        { type: "instagram", url: "https://instagram.com/" }
      ] 
    },
  ];

  // Social media icon mapping
  const socialIcons = {
    linkedin: "https://cdn.jsdelivr.net/npm/simple-icons@v6/icons/linkedin.svg",
    github: "https://cdn.jsdelivr.net/npm/simple-icons@v6/icons/github.svg",
    instagram: "https://cdn.jsdelivr.net/npm/simple-icons@v6/icons/instagram.svg",
    facebook: "https://cdn.jsdelivr.net/npm/simple-icons@v6/icons/facebook.svg",
    twitter: "https://cdn.jsdelivr.net/npm/simple-icons@v6/icons/twitter.svg"
  };

  // Badge colors for different roles
  const getRoleBadgeStyle = (role) => {
    switch(role) {
      case "FOUNDER":
        return {
          background: "linear-gradient(45deg, #FF8C00, #FF4500)",
          
        };
      case "CO-FOUNDER":
        return {
          background: "linear-gradient(45deg, #4169E1, #1E90FF)",
          
        };
      case "CTO":
        return {
          background: "linear-gradient(45deg, #32CD32, #008000)",
          
        };
      case "DESIGNER":
        return {
          background: "linear-gradient(45deg, #FF1493, #C71585)",
          
        };
      default:
        return {
          background: "linear-gradient(45deg, #808080, #A9A9A9)",
          
        };
    }
  };

  return (
    <>
      {/* CSS for shining animation - updated for subtle effect */}
      <style jsx>{`
  @keyframes subtleShine {
    0% {
      transform: translateX(-100%) skewX(-15deg);
    }
    100% {
      transform: translateX(200%) skewX(-15deg);
    }
  }

  .role-badge {
    position: relative;
    overflow: hidden;
    padding: 4px 8px;
    border-radius: 10px;
    color: white;
    font-weight: bold;
    margin-bottom: 12px;
    text-transform: uppercase;
    letter-spacing: 1px;
    /* Border removed */
  }

  /* Removed shine effect by commenting out the ::before pseudo-element */
  /* .role-badge::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 30px;
    height: 100%;
    background: rgba(255, 255, 255, 0.2);
    transform: translateX(-100%) skewX(-15deg);
    animation: subtleShine 5s infinite;
  } */
`}</style>

<div className="bg-gray-100 py-12 pb-0 px-4 sm:px-6 lg:px-8">
  {/* About Us Section - MODERNIZED */}
  <div className="w-full max-w-[1280px] mx-auto p-6 sm:p-8 lg:p-10 bg-gradient-to-br from-white to-gray-50 rounded-[20px] shadow-lg mt-8 relative overflow-hidden">
    {/* Decorative Elements - Modified positioning */}
    <div className="absolute top-0 left-0 w-20 h-20 bg-blue-50 rounded-full opacity-30 -translate-x-1/3 -translate-y-1/3"></div>
    <div className="absolute bottom-0 right-0 w-32 h-32 bg-green-50 rounded-full opacity-30 translate-x-1/3 translate-y-1/3"></div>
    
    {/* Heading with Underline */}
    <div className="relative">
      <h2 className="text-center text-gray-800 text-2xl sm:text-3xl md:text-4xl font-bold leading-tight">
        About Us
      </h2>
      <div className="h-1 w-20 bg-gradient-to-r from-blue-500 to-green-500 mx-auto mt-3 rounded-full"></div>
    </div>

  {/* Content Wrapper */}
  <div className="mt-8 flex flex-col items-center gap-8 relative">
    {/* Founders Introduction - NEW */}
    <div className="w-full p-6 bg-blue-50 rounded-lg border-l-4 border-blue-500">
      <p className="text-gray-700 italic leading-relaxed">
        We, <span className="font-semibold text-blue-700">Abhinav Kumar</span> and <span className="font-semibold text-blue-700">Manu Dev</span>, welcome you to our platform <span className="font-semibold">Pratiyogita Setu</span>, which we have created to help aspirants and students to crack their targeted exams.
      </p>
      <p className="mt-3 text-gray-700 italic leading-relaxed">
        In INDIA every year, on average, about <span className="font-semibold">10 million students and aspirants</span> prepare for more than <span className="font-semibold">3000+ competitive exams</span> for different forces, posts, groups, and departments.
      </p>
    </div>
    
    {/* Text Section - Now With Highlights */}
    <div className="w-full text-justify text-gray-700 text-base sm:text-lg leading-relaxed">
      <h3 className="text-xl sm:text-2xl font-semibold mb-6 text-center lg:text-left text-gray-800 relative">
        Know Your Eligibility, Plan Strategically, and Maximize Your Chances
        <span className="block h-1 w-16 bg-green-500 mt-3 rounded-full"></span>
      </h3>
      
      <p className="mb-4">
        One of the most common challenges faced by competitive exam aspirants is lack of clarity about eligibility criteria and remaining attempts. Many students unknowingly miss their chance at an exam, while others waste time preparing for exams they don't qualify for.
      </p>
      
      <p className="mb-4">
        At <strong className="text-blue-700">Pariksha Yogya</strong>, we believe that accurate information is the first step towards success. Our platform offers a comprehensive eligibility assessment tool that allows aspirants to:
      </p>
      
      <ul className="mb-6 pl-6">
        <li className="flex items-start mb-3">
          <span className="flex-shrink-0 w-5 h-5 rounded-full bg-green-100 flex items-center justify-center mr-3">
            <span className="text-green-800">✓</span>
          </span>
          <span>Check their eligibility for various competitive exams based on age, qualification, and category.</span>
        </li>
        <li className="flex items-start mb-3">
          <span className="flex-shrink-0 w-5 h-5 rounded-full bg-green-100 flex items-center justify-center mr-3">
            <span className="text-green-800">✓</span>
          </span>
          <span>Calculate the number of attempts remaining to help them plan their preparation accordingly.</span>
        </li>
        <li className="flex items-start mb-3">
          <span className="flex-shrink-0 w-5 h-5 rounded-full bg-green-100 flex items-center justify-center mr-3">
            <span className="text-green-800">✓</span>
          </span>
          <span>Discover alternative exams with a similar syllabus, ensuring they don't limit their career options.</span>
        </li>
      </ul>
      
      <div className="p-5 bg-gradient-to-r from-gray-50 to-white border-l-4 border-blue-500 rounded-r mb-6">
        <p className="mb-0">
          With a user-friendly interface and AI-powered analysis, <strong className="text-blue-700">Pariksha Yogya</strong> ensures that every aspirant makes informed decisions about their exam strategy. If a candidate has limited attempts left, they can prioritize their studies and accelerate their preparation. If they are ineligible, they will be suggested alternative exams that match their educational background and interests.
        </p>
      </div>
      
      <p className="mb-0">
        By eliminating confusion and uncertainty, <strong className="text-blue-700">Pariksha Yogya</strong> empowers aspirants to take charge of their future with clarity, confidence, and strategic planning. With the right insights at the right time, they can maximize their opportunities and achieve their dream careers.
      </p>
    </div>
  </div>
</div>

        {/* Meet The Team Section */}
        <div className="w-full max-w-[1280px] mx-auto p-4 sm:p-8 lg:p-6 mt-4">
          {/* Heading */}
          <h2 className="text-center text-black text-2xl sm:text-3xl md:text-4xl font-bold leading-tight">
            Meet the Team
          </h2>

          {/* Team Members Grid - Changed to show 2 members per row on mobile */}
          <div className="mt-8 grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {teamMembers.map((member, index) => (
              <div key={index} className="p-6 flex flex-col items-center text-center">
                {/* Role Badge with Subtle Shining Effect */}
                <div 
                  className="role-badge" 
                  style={getRoleBadgeStyle(member.role)}
                >
                  {member.role}
                </div>

                {/* Profile Picture */}
                <div className="w-[200px] h-[250px] bg-gray-300 rounded-[20px] overflow-hidden flex items-center justify-center">
                  <img 
                    src={member.image} 
                    alt={member.role} 
                    className="w-full h-full object-cover rounded-[20px]" 
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = "https://via.placeholder.com/200";
                    }}
                  />
                </div>
                
                {/* Member Name */}
                <h3 className="text-gray-700 text-s sm:text-1xl font-bold leading-7 mt-3">
                  {member.name}
                </h3>

                {/* Social Media Icons */}
                <div className="flex justify-center items-center flex-wrap gap-2 mt-4">
                  {member.socials.map((social, i) => (
                    <a 
                      key={i} 
                      href={social.url}
                      target="_blank"
                      rel="noopener noreferrer" 
                      className="w-8 h-10 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200 transition-colors"
                    >
                      <img 
                        src={socialIcons[social.type]} 
                        alt={social.type} 
                        className="w-5 h-5 invert-0" 
                      />
                    </a>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default AboutUs;
