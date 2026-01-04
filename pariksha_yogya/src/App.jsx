import { useState } from "react";
import "./App.css";
import Navbar from "@/components/Navbar/navbar";
import { HeroUIProvider } from "@heroui/react";
import { Routes, Route } from "react-router-dom";
import EligibilityChecker from "./Pages/Check/EligibilityChecker";
import ContributionPage from "./Pages/contribution";
import Home from "./Pages/home";
import ContactPage from "./Pages/contactus";
import AboutUs from "./Pages/aboutus";
import Login from "./Pages/login";
import Signup from "./Pages/signup";
// import PrivacyPolicy from "./Pages/privacypolicy";
import TermsAndConditions from "./Pages/termsandconditions";
import RefundPolicy from "./Pages/refundpolicy";

function App() {
  return (
    <>
      <HeroUIProvider className="w-full mx-0 px-0 overflow-x-hidden">
        <div className="animated-background">
          <div className="line-grid"></div>
          <div className="diagonal-lines"></div>
          <div className="beam"></div>
          <div className="beam-vertical"></div>
          <div className="line-highlight"></div>
        </div>
        <div className="w-full ">
          <Navbar />
        </div>

        <Routes>
          <Route path="/home" element={<Home />} />
          <Route path="/" element={<Home />} />
          <Route path="/Check/checknow" element={<EligibilityChecker />} />
          <Route path="/contribution" element={<ContributionPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/about" element={<AboutUs />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          {/* <Route path="/privacy-policy" element={<PrivacyPolicy />} /> */}
          <Route path="/terms-and-conditions" element={<TermsAndConditions />} />
          <Route path="/refund-policy" element={<RefundPolicy />} />
        </Routes>
      </HeroUIProvider>
    </>
  );
}

export default App;
