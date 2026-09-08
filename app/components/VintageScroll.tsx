import React from "react";

interface VintageScrollProps {
  content: string;
}

export default function VintageScroll({ content }: VintageScrollProps) {
  const firstLetter = content.trim().charAt(0);
  const remainingContent = content.trim().slice(1);

  return (
    <div className="relative my-8 mx-auto w-full filter drop-shadow-[0_20px_35px_rgba(0,0,0,0.75)]">
      {/* Top Wooden Rod with Finials */}
      <div className="relative z-20 flex items-center justify-center -mb-3 px-1 sm:px-0">
        <div className="w-4 sm:w-5 h-6 sm:h-7 rounded-l-md bg-gradient-to-r from-[#2c1808] via-[#4a2b13] to-[#1d0f05] shadow-[0_4px_8px_rgba(0,0,0,0.6)] border-y border-l border-[#6b4221]" />
        <div className="h-3 sm:h-4 flex-1 bg-gradient-to-b from-[#5a3418] via-[#855027] to-[#2d190b] rounded-sm shadow-[0_4px_10px_rgba(0,0,0,0.8)] border-y border-[#a86e3b]" />
        <div className="w-4 sm:w-5 h-6 sm:h-7 rounded-r-md bg-gradient-to-l from-[#2c1808] via-[#4a2b13] to-[#1d0f05] shadow-[0_4px_8px_rgba(0,0,0,0.6)] border-y border-r border-[#6b4221]" />
      </div>

      {/* Top Parchment Roll Curl */}
      <div className="relative z-10 mx-2 sm:mx-5 h-9 rounded-t-lg bg-gradient-to-b from-[#dfca9e] via-[#c9ad79] to-[#8d6f43] shadow-[0_8px_16px_rgba(0,0,0,0.6)] border-t border-[#f4e2bb] overflow-hidden flex items-center justify-center">
        <div className="absolute inset-0 opacity-40 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-white/30 via-transparent to-black/40" />
        <div className="h-[2px] w-3/4 bg-white/20 rounded-full shadow-sm" />
      </div>

      {/* Main Parchment Scroll Body */}
      <div 
        className="relative mx-2 sm:mx-5 px-6 sm:px-12 py-10 text-[#23150c] shadow-[inset_0_0_80px_rgba(92,54,18,0.45),inset_0_0_20px_rgba(50,25,8,0.3),0_15px_30px_rgba(0,0,0,0.4)] border-x border-[#c2a373]"
        style={{
          backgroundImage: "url('/images/parchment_clean.jpg')",
          backgroundSize: "cover",
          backgroundRepeat: "no-repeat",
          backgroundColor: "#e8d7b5",
        }}
      >
        {/* Subtle aging overlay and vignette */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#8f6d3e]/20 via-transparent to-[#8f6d3e]/25 pointer-events-none" />

        <div className="relative z-10 font-vintage text-xl sm:text-2xl leading-[1.85] text-[#24170d] lg:text-justify space-y-4">
          <p className="whitespace-pre-wrap">
            <span className="float-left text-5xl sm:text-6xl font-accent leading-[0.8] pr-3 pt-1 text-[#7a2419] font-bold select-none drop-shadow-[0_1px_1px_rgba(255,255,255,0.4)]">
              {firstLetter}
            </span>
            {remainingContent}
          </p>

          {/* Bottom Flourish Ornament */}
          <div className="pt-6 text-center text-[#7d5732] opacity-75 select-none">
            <div className="flex items-center justify-center gap-3">
              <div className="h-px w-16 sm:w-28 bg-gradient-to-r from-transparent to-[#7d5732]" />
              <span className="text-sm tracking-widest">❦ ❦ ❦</span>
              <div className="h-px w-16 sm:w-28 bg-gradient-to-l from-transparent to-[#7d5732]" />
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Parchment Roll Curl */}
      <div className="relative z-10 mx-2 sm:mx-5 h-9 rounded-b-lg bg-gradient-to-t from-[#dfca9e] via-[#c9ad79] to-[#8d6f43] shadow-[0_-8px_16px_rgba(0,0,0,0.6)] border-b border-[#f4e2bb] overflow-hidden flex items-center justify-center">
        <div className="absolute inset-0 opacity-40 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-white/30 via-transparent to-black/40" />
        <div className="h-[2px] w-3/4 bg-white/20 rounded-full shadow-sm" />
      </div>

      {/* Bottom Wooden Rod with Finials */}
      <div className="relative z-20 flex items-center justify-center -mt-3 px-1 sm:px-0">
        <div className="w-4 sm:w-5 h-6 sm:h-7 rounded-l-md bg-gradient-to-r from-[#2c1808] via-[#4a2b13] to-[#1d0f05] shadow-[0_6px_12px_rgba(0,0,0,0.7)] border-y border-l border-[#6b4221]" />
        <div className="h-3 sm:h-4 flex-1 bg-gradient-to-b from-[#5a3418] via-[#855027] to-[#2d190b] rounded-sm shadow-[0_6px_12px_rgba(0,0,0,0.8)] border-y border-[#a86e3b]" />
        <div className="w-4 sm:w-5 h-6 sm:h-7 rounded-r-md bg-gradient-to-l from-[#2c1808] via-[#4a2b13] to-[#1d0f05] shadow-[0_6px_12px_rgba(0,0,0,0.7)] border-y border-r border-[#6b4221]" />
      </div>
    </div>
  );
}
