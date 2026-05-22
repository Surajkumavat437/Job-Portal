import { useNavigate } from "react-router-dom";
import { DotLottieReact } from "@lottiefiles/dotlottie-react";
import { AlertCircle } from "lucide-react";

const PageError = ({ customStatus = 404, customMessage = "" }) => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center justify-center h-screen w-full bg-background text-foreground p-6 text-center select-none fixed inset-0 z-50">
      
      {customStatus === 404 ? (
        /* 🔍 ANIMATION 1: Standard 404 Page Not Found */
        <div className="w-full flex flex-col items-center justify-center animate-in fade-in zoom-in-95 duration-300">
          <div className="w-full max-w-md max-h-[45vh] flex items-center justify-center">
            <DotLottieReact
              src="https://lottie.host/4c666685-bb54-48f7-a841-dbc9396563a5/5Wm9xAoJIp.lottie"
              loop
              autoplay
              className="w-full h-full object-contain"
            />
          </div>
          <h2 className="text-3xl font-black text-foreground tracking-tight mt-6">
            Page Not Found
          </h2>
          <p className="text-muted-foreground text-sm max-w-sm mt-2 font-medium leading-relaxed">
            The link you followed might be broken, or the page layout has been moved.
          </p>
        </div>
      ) : (
        /* ⚠️ ANIMATION 2: Other Application Errors (401, 500, etc.) */
        <div className="w-full flex flex-col items-center justify-center animate-in fade-in zoom-in-95 duration-300">
          <div className="w-full max-w-md max-h-[40vh] flex items-center justify-center">
            <DotLottieReact
              src="https://lottie.host/163e762f-928f-4092-8cf1-6d277fd1afe0/0l8JyCX2bw.lottie"
              loop
              autoplay
              className="w-full h-full object-contain"
            />
          </div>
          
          <div className="mt-6 p-4 rounded-2xl bg-destructive/10 border border-destructive/20 max-w-md backdrop-blur-sm shadow-sm">
            <div className="flex items-center justify-center gap-2 text-destructive font-bold mb-1">
              <AlertCircle className="w-4 h-4" />
              <span className="text-sm tracking-wide uppercase font-black">
                System Error {customStatus}
              </span>
            </div>
            <p className="text-muted-foreground text-sm font-medium leading-relaxed">
              {customMessage || "An unexpected core system layout break occurred."}
            </p>
          </div>
        </div>
      )}

      {/* Action Escape Button */}
      <button
        onClick={() => navigate("/login")}
        className="mt-8 px-8 h-12 bg-primary text-primary-foreground font-bold text-sm rounded-xl shadow-md hover:brightness-110 active:scale-[0.98] transition-all cursor-pointer"
      >
        Back to Safety
      </button>
    </div>
  );
};

// 🎯 Ensure the export matches your router import name perfectly!
export default PageError;