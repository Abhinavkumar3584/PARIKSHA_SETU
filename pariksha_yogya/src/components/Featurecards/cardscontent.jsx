"use client";
import { Box, Lock, Search, Settings, Sparkles, Calendar } from "lucide-react";

export function GlowingEffectDemo() {
  return (
    <div className="bg-opacity-50">
      <h2 className="text-2xl md:text-3xl font-bold mb-6 md:mb-10 text-gray-900">Features</h2>
      <ul className="grid grid-cols-1 gap-4 md:grid-cols-12 md:grid-rows-4 md:gap-4 xl:max-h-[48rem] xl:grid-rows-3">
        <GridItem
          area="md:[grid-area:1/1/2/7] xl:[grid-area:1/1/2/5]"
          icon={<Box className="h-8 w-8 text-purple-600" />}
          title="ELIGIBILITY CHECKER"
          description="Instantly verify if you meet all requirements for your target examination. Know your eligibility status before investing time."
          className="min-h-[12rem]"
          bgColor="bg-purple-50"
          borderColor="border-purple-200"
          iconGradient="from-purple-500 to-indigo-600"
        />
        <GridItem
          area="md:[grid-area:1/7/2/13] xl:[grid-area:2/1/3/5]"
          icon={<Settings className="h-8 w-8 text-blue-600" />}
          title="ATTEMPTS CALCULATOR"
          description="Track your remaining exam attempts with our easy-to-use calculator. Never miss an opportunity due to attempt limitations."
          className="min-h-[12rem]"
          bgColor="bg-blue-50"
          borderColor="border-blue-200" 
          iconGradient="from-blue-500 to-cyan-600"
        />
        <GridItem
          area="md:[grid-area:2/1/3/7] xl:[grid-area:1/5/2/9]"
          icon={<Lock className="h-8 w-8 text-green-600" />}
          title="RELATED EXAM SUGGESTIONS"
          description="Discover alternative exams aligned with your qualifications and career goals. Expand your opportunities with personalized recommendations."
          className="min-h-[12rem]"
          bgColor="bg-green-50"
          borderColor="border-green-200"
          iconGradient="from-green-500 to-emerald-600"
        />
        <GridItem
          area="md:[grid-area:2/7/3/13] xl:[grid-area:1/9/2/13]"
          icon={<Sparkles className="h-8 w-8 text-amber-500" />}
          title="COMPLETE EXAM SYLLABUS"
          description="Access comprehensive, up-to-date syllabus for all major competitive exams. Plan your preparation with detailed topic-wise breakdowns."
          className="min-h-[12rem]"
          bgColor="bg-amber-50"
          borderColor="border-amber-200"
          iconGradient="from-amber-500 to-yellow-600"
        />
        <GridItem
          area="md:[grid-area:3/1/4/13] xl:[grid-area:2/5/3/13]"
          icon={<Search className="h-8 w-8 text-red-500" />}
          title="LATEST EXAM UPDATES"
          description="Stay informed with real-time updates on exam patterns, rules, and notifications. Never miss critical changes to exam formats."
          className="min-h-[12rem]"
          bgColor="bg-red-50"
          borderColor="border-red-200"
          iconGradient="from-red-500 to-rose-600"
        />
        <GridItem
          area="md:[grid-area:4/1/5/13] xl:[grid-area:3/1/4/13]"
          icon={<Calendar className="h-8 w-8 text-teal-600" />}
          title="ACCESS DETAILED"
          description="Practice with timed mock tests designed to simulate actual exam conditions. Improve performance through regular assessment and analysis."
          className="min-h-[12rem]"
          bgColor="bg-teal-50"
          borderColor="border-teal-200"
          iconGradient="from-teal-500 to-cyan-600"
        />
      </ul>
    </div>
  );
}

const GridItem = ({
  area,
  icon,
  title,
  description,
  className = "",
  bgColor = "",
  borderColor = "",
  iconGradient = ""
}) => {
  return (
    <li className={`list-none ${area} ${className}`}>
      <div
        className={`relative h-full rounded-2xl border-2 p-2 md:rounded-3xl md:p-3 ${borderColor.replace('border-', 'border-')} shadow-sm`}>
        <div
          className={`relative flex h-full flex-col justify-between gap-4 overflow-hidden rounded-xl border-0.75 p-4 md:p-5 
          ${bgColor}
          bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-white/70 to-transparent`}>
          <div className="relative flex flex-1 flex-col justify-start gap-3 text-left">
            <div className="flex items-center gap-3">
              <div className={`p-2 border-2 ${borderColor.replace('border-purple-200', 'border-purple-400').replace('border-blue-200', 'border-blue-400').replace('border-green-200', 'border-green-400').replace('border-amber-200', 'border-amber-400').replace('border-red-200', 'border-red-400').replace('border-teal-200', 'border-teal-400')} rounded-lg bg-white shadow-sm`}>
                {icon}
              </div>
              <h3
                className="pt-0.5 text-xl/[1.5rem] font-bold font-sans -tracking-4 md:text-2xl/[2rem] text-left 
                bg-gradient-to-r from-gray-900 via-gray-700 to-gray-600 
                bg-clip-text text-transparent drop-shadow-sm">
                {title}
              </h3>
            </div>
            <div className="space-y-2 mt-3">
              <h2
                className="[&_b]:md:font-semibold [&_strong]:md:font-semibold font-sans text-sm/[1.125rem] 
                md:text-base/[1.375rem] text-gray-700 pl-2 border-l-4 
                border-l-purple-400 border-l-blue-400 border-l-green-400 border-l-amber-400 border-l-red-400 border-l-teal-400 
                text-left">
                {description}
              </h2>
            </div>
          </div>
        </div>
      </div>
    </li>
  );
};