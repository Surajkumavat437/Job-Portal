import React from "react";
import { DotLottieReact } from "@lottiefiles/dotlottie-react";

const AuthHeroSection = ({ role }) => {
  return (
    <div className="hidden lg:flex flex-col w-[52%] bg-muted/5 p-12 justify-between relative overflow-hidden border-r border-border/40">
      {/* Decorative Background Blur Nodes */}
      <div className="absolute top-[-10%] left-[-10%] w-[60%] h-[50%] bg-primary/5 rounded-full blur-[120px]" />
      <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[40%] bg-primary/5 rounded-full blur-[100px]" />

      {/* Top: Dynamic Slogan Block */}
      <div className="z-10 min-h-[120px]">
        {role === "job_seeker" ? (
          <div key="seeker-slogan" className="space-y-2 animate-in fade-in slide-in-from-top-3 duration-500">
            <h1 className="text-4xl font-black tracking-tight text-foreground leading-[1.15]">
              Your absolute dream career is <br />
              <span className="text-primary bg-gradient-to-r from-primary via-primary/90 to-primary/70 bg-clip-text">
                closer than you think.
              </span>
            </h1>
            <p className="text-muted-foreground text-sm font-medium max-w-lg leading-relaxed">
              Explore tailored job openings from leading companies, submit your applications with a single click, and track your recruitment status in real time.
            </p>
          </div>
        ) : (
          <div key="recruiter-slogan" className="space-y-2 animate-in fade-in slide-in-from-top-3 duration-500">
            <h1 className="text-4xl font-black tracking-tight text-foreground leading-[1.15]">
              Accelerate your technical team's <br />
              <span className="text-primary bg-gradient-to-r from-primary via-primary/90 to-primary/70 bg-clip-text">
                engineering deployment.
              </span>
            </h1>
            <p className="text-muted-foreground text-sm font-medium max-w-lg leading-relaxed">
              Publish open positions, parse engineering applications with zero friction, and filter verified student talent channels from top technical institutions instantly.
            </p>
          </div>
        )}
      </div>

      {/* Bottom half: Massive, expansive Lottie workspace canvas */}
      <div className="w-full flex items-center justify-center flex-1 max-h-[55vh] mt-4 z-10 animate-in fade-in zoom-in-95 duration-700">
        <div className="w-full h-full flex items-center justify-center">
          <DotLottieReact
            src="https://lottie.host/f0ad4d31-9242-49c4-94ad-0f25bf91a596/c8J5WEAta6.lottie"
            loop
            autoplay
            className="w-full h-full max-h-[50vh] object-contain scale-110 transform"
          />
        </div>
      </div>
    </div>
  );
};

export default AuthHeroSection;