import React from "react";
import { Mail, Lock, User, Loader2 } from "lucide-react";

const AuthFormCard = ({
  isLogin,
  setIsLogin,
  role,
  setRole,
  loading,
  formData,
  handleChange,
  handleSubmit,
}) => {
  return (
    <div className="w-full lg:w-[48%] flex flex-col items-center justify-center p-6 md:p-12 bg-background">
      <div className="w-full max-w-md bg-card p-6 sm:p-10 rounded-[2.5rem] border border-border shadow-xl ring-1 ring-black/5 animate-in fade-in duration-300">
        
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-foreground tracking-tight">
            {isLogin ? "Welcome back" : "Join us today"}
          </h2>
          <p className="text-muted-foreground text-sm mt-2 font-medium">
            {isLogin ? "Login to your account" : "Create your account to find your dream job"}
          </p>
        </div>

        {/* ROLE SELECTOR */}
        <div className="grid grid-cols-2 gap-4 mb-8">
          <button
            type="button"
            onClick={() => setRole("job_seeker")}
            className={`p-4 rounded-2xl border-2 transition-all duration-200 cursor-pointer text-center outline-none select-none ${
              role === "job_seeker"
                ? "border-primary bg-primary/10 text-primary shadow-sm"
                : "border-border text-muted-foreground hover:bg-secondary/50"
            }`}
          >
            <span className="text-2xl block">🎓</span>
            <span className="text-[10px] block font-black uppercase mt-1.5 tracking-wider">
              Job Seeker
            </span>
          </button>
          
          <button
            type="button"
            onClick={() => setRole("recruiter")}
            className={`p-4 rounded-2xl border-2 transition-all duration-200 cursor-pointer text-center outline-none select-none ${
              role === "recruiter"
                ? "border-primary bg-primary/10 text-primary shadow-sm"
                : "border-border text-muted-foreground hover:bg-secondary/50"
            }`}
          >
            <span className="text-2xl block">💼</span>
            <span className="text-[10px] block font-black uppercase mt-1.5 tracking-wider">
              Recruiter
            </span>
          </button>
        </div>

        {/* INPUT FORM LAYER */}
        <form onSubmit={handleSubmit} className="space-y-5">
          {!isLogin && (
            <div key="name-field-wrapper" className="space-y-1.5 animate-in slide-in-from-top-2 duration-300">
              <label className="text-xs font-bold text-foreground/70 ml-1">Full Name</label>
              <div className="flex items-center bg-secondary/30 border border-border rounded-xl h-12 px-4 gap-3 focus-within:border-primary focus-within:bg-card transition-all duration-200">
                <User className="w-4 h-4 text-muted-foreground/70 flex-shrink-0" />
                <input
                  type="text"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleChange}
                  placeholder="John Doe"
                  className="bg-transparent text-sm w-full outline-none text-foreground h-full"
                  required
                />
              </div>
            </div>
          )}

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-foreground/70 ml-1">Email address</label>
            <div className="flex items-center bg-secondary/30 border border-border rounded-xl h-12 px-4 gap-3 focus-within:border-primary focus-within:bg-card transition-all duration-200">
              <Mail className="w-4 h-4 text-muted-foreground/70 flex-shrink-0" />
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="name@example.com"
                autoComplete="email"
                className="bg-transparent text-sm w-full outline-none text-foreground h-full"
                required
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-foreground/70 ml-1">Password</label>
            <div className="flex items-center bg-secondary/30 border border-border rounded-xl h-12 px-4 gap-3 focus-within:border-primary focus-within:bg-card transition-all duration-200">
              <Lock className="w-4 h-4 text-muted-foreground/70 flex-shrink-0" />
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="••••••••"
                autoComplete={isLogin ? "current-password" : "new-password"}
                className="bg-transparent text-sm w-full outline-none text-foreground h-full"
                required
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full h-12 rounded-xl bg-primary text-primary-foreground font-bold text-sm shadow-md hover:brightness-110 active:scale-[0.99] transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 select-none"
          >
            {loading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <span>{isLogin ? "Login" : "Create Account"}</span>
            )}
          </button>
        </form>

        {/* INTERACTION LINK TOGGLE */}
        <p className="text-center text-sm text-muted-foreground mt-8 font-medium">
          {isLogin ? "Don't have an account?" : "Already have an account?"}
          <button
            type="button"
            onClick={() => setIsLogin(!isLogin)}
            className="text-primary font-bold hover:underline ml-1 cursor-pointer bg-transparent border-none outline-none select-none"
          >
            {isLogin ? "Sign up" : "Login"}
          </button>
        </p>
      </div>
    </div>
  );
};

export default AuthFormCard;