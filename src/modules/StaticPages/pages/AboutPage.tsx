import React, { memo } from "react";

export const AboutPage: React.FC = () => {
  return (
    <div className="bg-[#fafafa] min-h-[80vh] flex items-center justify-center font-sans text-slate-800 py-16 px-4 md:px-8">
      <div className="max-w-5xl mx-auto w-full grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
        {/* Left Side: Information */}
        <div className="space-y-6 text-left">
          <div className="text-xs tracking-[0.2em] uppercase text-primary font-bold">
            // ABOUT US
          </div>
          <h2 className="text-4xl md:text-5xl font-extrabold text-slate-900 tracking-tight leading-tight">
            About Us Page
          </h2>
          <div className="h-1 w-20 bg-primary rounded-full"></div>
          <p className="text-base md:text-lg text-slate-500 leading-relaxed font-light">
            We are education organizations for helping students more grow up.
          </p>
          <p className="text-base md:text-lg text-slate-500 leading-relaxed font-light">
            With technology and modern methods, we confidently are able to create more things for the worlds.
          </p>
        </div>

        {/* Right Side: Image */}
        <div className="relative">
          <div className="absolute -inset-1 rounded-2xl bg-gradient-to-tr from-primary/20 to-blue-500/20 blur-lg opacity-75"></div>
          <div className="relative aspect-[4/3] w-full overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-xl">
            <img
              src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=800&auto=format&fit=crop&q=80"
              alt="Education and Collaboration"
              className="w-full h-full object-cover transform hover:scale-105 transition-transform duration-500"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default memo(AboutPage);

