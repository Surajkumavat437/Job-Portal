import React from 'react';

const Login = () => {
  return (
    /* Forced Dark Mode Wrapper - Ensures it stays dark regardless of system settings */
    <div className="dark">
      <div className="flex h-screen w-full bg-background text-foreground overflow-hidden transition-colors duration-500">
        
        {/* LEFT SECTION: Visual Image (Hidden on mobile) */}
        <div className="hidden md:flex w-1/2 items-center justify-center p-8 bg-muted/30">
          <div className="w-full h-full max-h-[70%] relative group overflow-hidden rounded-[2.5rem] shadow-2xl border border-border/50">
            <img 
              className="h-full w-full object-fit transition-transform duration-700 group-hover:scale-105" 
              src="../src/assets/jobportal.png" 
              alt="Premium Interior" 
            />
            {/* Subtle Overlay for Premium feel */}
            <div className="absolute inset-0 bg-gradient-to-t from-background/40 to-transparent"></div>
          </div>
        </div>

        {/* RIGHT SECTION: Login Form */}
        <div className="w-full md:w-1/2 flex flex-col items-center justify-center p-6 sm:p-12 relative">
          
          <form className="w-full max-w-[360px] flex flex-col items-center animate-in fade-in slide-in-from-bottom-4 duration-1000 border-1 border-grey-50 p-5 rounded-xl">
            
            <div className="text-center mb-10">
              <h2 className="text-4xl font-bold tracking-tight text-foreground">Sign in</h2>
              <p className="text-sm text-muted-foreground mt-3 font-medium">
                Welcome back! Please sign in to continue
              </p>
            </div>

            {/* Google Sign In - Premium Dark Style */}
            <button 
              type="button" 
              className="w-full flex items-center justify-center h-12 rounded-full bg-card hover:bg-secondary transition-all active:scale-[0.98] border border-border shadow-sm group"
            >
              <img 
                src="https://raw.githubusercontent.com/prebuiltui/prebuiltui/main/assets/login/googleLogo.svg" 
                alt="Google" 
                className="w-20 h-15 group-hover:opacity-80"
              />
            </button>

            {/* Divider */}
            <div className="flex items-center gap-4 w-full my-8">
              <div className="flex-1 h-[1px] bg-border/40"></div>
              <p className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground/60 font-bold">or email</p>
              <div className="flex-1 h-[1px] bg-border/40"></div>
            </div>

            {/* Input Fields */}
            <div className="space-y-4 w-full">
              <div className="group flex items-center w-full bg-card border border-border rounded-2xl h-12 pl-5 gap-3 focus-within:border-primary/50 focus-within:ring-4 focus-within:ring-primary/10 transition-all shadow-inner">
                <svg width="18" height="18" viewBox="0 0 16 11" fill="none" className="text-muted-foreground group-focus-within:text-primary transition-colors">
                  <path fillRule="evenodd" clipRule="evenodd" d="M0 .55.571 0H15.43l.57.55v9.9l-.571.55H.57L0 10.45zm1.143 1.138V9.9h13.714V1.69l-6.503 4.8h-.697zM13.749 1.1H2.25L8 5.356z" fill="currentColor"/>
                </svg>
                <input 
                  type="email" 
                  placeholder="Email address" 
                  className="bg-transparent text-foreground placeholder:text-muted-foreground/40 outline-none text-[15px] w-full h-full" 
                  required 
                />                 
              </div>

              <div className="group flex items-center w-full bg-card border border-border rounded-2xl h-12 pl-5 gap-3 focus-within:border-primary/50 focus-within:ring-4 focus-within:ring-primary/10 transition-all shadow-inner">
                <svg width="16" height="16" viewBox="0 0 13 17" fill="none" className="text-muted-foreground group-focus-within:text-primary transition-colors">
                  <path d="M13 8.5c0-.938-.729-1.7-1.625-1.7h-.812V4.25C10.563 1.907 8.74 0 6.5 0S2.438 1.907 2.438 4.25V6.8h-.813C.729 6.8 0 7.562 0 8.5v6.8c0 .938.729 1.7 1.625 1.7h9.75c.896 0 1.625-.762 1.625-1.7zM4.063 4.25c0-1.406 1.093-2.55 2.437-2.55s2.438 1.144 2.438 2.55V6.8H4.061z" fill="currentColor"/>
                </svg>
                <input 
                  type="password" 
                  placeholder="Password" 
                  className="bg-transparent text-foreground placeholder:text-muted-foreground/40 outline-none text-[15px] w-full h-full" 
                  required 
                />
              </div>
            </div>

            {/* Helpers */}
            <div className="w-full flex items-center justify-between mt-6">
              <label className="flex items-center gap-2 cursor-pointer select-none group">
                <input 
                  type="checkbox" 
                  className="w-4 h-4 rounded-md border-border bg-card text-primary focus:ring-primary accent-primary" 
                />
                <span className="text-sm font-medium text-muted-foreground group-hover:text-foreground transition-colors">
                  Remember me
                </span>
              </label>
              <a className="text-sm font-semibold text-primary hover:text-primary/80 transition-colors" href="#">
                Forgot password?
              </a>
            </div>

            {/* Action Button */}
            <button 
              type="submit" 
              className="mt-10 w-full h-12 rounded-full text-primary-foreground bg-primary shadow-lg shadow-primary/30 font-bold text-[16px] hover:brightness-110 active:scale-[0.96] transition-all"
            >
              Sign In
            </button>

            <p className="text-muted-foreground text-sm mt-8 font-medium">
              Don’t have an account? <a className="text-primary font-bold hover:underline" href="#">Sign up</a>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;