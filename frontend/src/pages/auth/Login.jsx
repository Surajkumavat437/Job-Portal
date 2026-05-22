import React, { useState } from "react";
import { FcGoogle } from "react-icons/fc";
import { loginUser, registerUser } from "../../api/authAPI.js";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext.js";
import { Mail, Lock, User, Loader2 } from "lucide-react";
import { toast } from "react-hot-toast";
import { DotLottieReact } from "@lottiefiles/dotlottie-react";

const Auth = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [role, setRole] = useState("job_seeker");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
  });

  const { login } = useAuth();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleAuth = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = isLogin
        ? await loginUser({
            email: formData.email,
            password: formData.password,
            role,
          })
        : await registerUser({
            name: formData.fullName,
            email: formData.email,
            password: formData.password,
            role,
          });

      if (response?.success || response?.data) {
        const coreUser = response.data?.data || response.data;
        login(coreUser);
        const userRole = coreUser?.role || role;

        toast.success(`Welcome back, ${coreUser?.name || "User"}!`);

        if (userRole === "recruiter") {
          navigate("/admin/dashboard", { replace: true });
        } else {
          navigate("/home", { replace: true });
        }
        setFormData({ fullName: "", email: "", password: "" });
      }
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          "Authentication Failed. Please check your credentials.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center h-screen w-full bg-background text-foreground p-3 md:p-6 overflow-hidden transition-colors duration-300">
      <div className="flex w-full h-full bg-background rounded-[2.5rem] overflow-hidden shadow-2xl border border-border">
        
        {/* 🌟 LEFT SECTION: DYNAMIC SLOGAN & MASSIVE EDGE-TO-EDGE LOTTIE WORKSPACE */}
        <div className="hidden lg:flex flex-col w-[52%] bg-muted/5 p-12 justify-between relative overflow-hidden border-r border-border/40">
          {/* Decorative Background Blur Nodes */}
          <div className="absolute top-[-10%] left-[-10%] w-[60%] h-[50%] bg-primary/5 rounded-full blur-[120px]" />
          <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[40%] bg-primary/5 rounded-full blur-[100px]" />

          {/* Top: Dynamic Slogan Block (Logo Completely Removed) */}
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
                  Connect instantly with top engineering teams, manage code assessments, and track every single interview application on a singular, clean dashboard grid.
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

          {/* Bottom half: Massive, expansive, uncompromised Lottie workspace canvas */}
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

        {/* 🌟 RIGHT SECTION: THE INTERACTIVE AUTH CARD PANEL */}
        <div className="w-full lg:w-[48%] flex flex-col items-center justify-center p-6 md:p-12 bg-background">
          <div className="w-full max-w-105 bg-card p-10 rounded-[2.5rem] border border-border shadow-xl ring-1 ring-black/5 animate-in fade-in duration-300">
            <div className="mb-8">
              <h2 className="text-3xl font-bold text-foreground tracking-tight">
                {isLogin ? "Welcome back" : "Join us today"}
              </h2>
              <p className="text-muted-foreground text-sm mt-2 font-medium">
                {isLogin
                  ? "Login to your account"
                  : "Create your account to find your dream job"}
              </p>
            </div>

            {/* ROLE SELECTOR */}
            <div className="grid grid-cols-2 gap-4 mb-8">
              <button
                type="button"
                onClick={() => setRole("job_seeker")}
                className={`p-4 rounded-2xl border-2 transition-all cursor-pointer text-center ${role === "job_seeker" ? "border-primary bg-primary/10 text-primary shadow-sm" : "border-border text-muted-foreground hover:bg-secondary/50"}`}
              >
                <span className="text-2xl block">🎓</span>
                <span className="text-[10px] block font-black uppercase mt-1.5 tracking-wider">
                  Job Seeker
                </span>
              </button>
              <button
                type="button"
                onClick={() => setRole("recruiter")}
                className={`p-4 rounded-2xl border-2 transition-all cursor-pointer text-center ${role === "recruiter" ? "border-primary bg-primary/10 text-primary shadow-sm" : "border-border text-muted-foreground hover:bg-secondary/50"}`}
              >
                <span className="text-2xl block">💼</span>
                <span className="text-[10px] block font-black uppercase mt-1.5 tracking-wider">
                  Recruiter
                </span>
              </button>
            </div>

            <form onSubmit={handleAuth} className="space-y-5">
              {!isLogin && (
                <div className="space-y-1.5 animate-in slide-in-from-top-2 duration-300">
                  <label className="text-xs font-bold text-foreground/70 ml-1">
                    Full Name
                  </label>
                  <div className="flex items-center bg-secondary/30 border border-border rounded-xl h-12 px-4 gap-3 focus-within:border-primary focus-within:bg-card transition-all">
                    <User className="w-4 h-4 text-muted-foreground/70" />
                    <input
                      type="text"
                      name="fullName"
                      value={formData.fullName}
                      onChange={handleChange}
                      placeholder="John Doe"
                      autoComplete="off"
                      className="bg-transparent text-sm w-full outline-none text-foreground placeholder:text-muted-foreground/50 transition-colors duration-[50000s] ease-in-out autofill:bg-transparent autofill:text-foreground"
                      required
                    />
                  </div>
                </div>
              )}

              {/* EMAIL FIELD */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-foreground/70 ml-1">
                  Email address
                </label>
                <div className="flex items-center bg-secondary/30 border border-border rounded-xl h-12 px-4 gap-3 focus-within:border-primary focus-within:bg-card transition-all">
                  <Mail className="w-4 h-4 text-muted-foreground/70" />
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="name@example.com"
                    autoComplete="email"
                    className="bg-transparent text-sm w-full outline-none text-foreground placeholder:text-muted-foreground/50 transition-colors duration-[50000s] ease-in-out autofill:bg-transparent autofill:text-foreground"
                    required
                  />
                </div>
              </div>

              {/* PASSWORD FIELD */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-foreground/70 ml-1">
                  Password
                </label>
                <div className="flex items-center bg-secondary/30 border border-border rounded-xl h-12 px-4 gap-3 focus-within:border-primary focus-within:bg-card transition-all">
                  <Lock className="w-4 h-4 text-muted-foreground/70" />
                  <input
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="••••••••"
                    autoComplete={isLogin ? "current-password" : "new-password"}
                    className="bg-transparent text-sm w-full outline-none text-foreground placeholder:text-muted-foreground/50 transition-colors duration-[50000s] ease-in-out autofill:bg-transparent autofill:text-foreground"
                    required
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full h-12 rounded-xl bg-primary text-primary-foreground font-bold text-sm shadow-md hover:brightness-110 active:scale-[0.98] transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {loading && <Loader2 className="w-4 h-4 animate-spin" />}
                <span>
                  {loading
                    ? "Processing credentials..."
                    : isLogin
                      ? "Login"
                      : "Create Account"}
                </span>
              </button>
            </form>

            {/* TOGGLE LINK */}
            <p className="text-center text-sm text-muted-foreground mt-8 font-medium">
              {isLogin ? "Don't have an account?" : "Already have an account?"}
              <button
                type="button"
                onClick={() => setIsLogin(!isLogin)}
                className="text-primary font-bold hover:underline ml-1 cursor-pointer bg-transparent border-none outline-none"
              >
                {isLogin ? "Sign up" : "Login"}
              </button>
            </p>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Auth;