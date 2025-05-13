import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";

const AuthCallback = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    // Check if we have a code parameter in the URL
    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get('code');

    if (code) {
      // If we have a code, it means we're coming back from Google OAuth
      // The backend will handle this callback and redirect us to the success/failure page
      return;
    }

    // If authenticated, redirect to dashboard
    if (isAuthenticated) {
      navigate("/");
    }
  }, [isAuthenticated, navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="text-center space-y-4">
        <h1 className="text-2xl font-bold">Authenticating...</h1>
        <p className="text-gray-600">
          Please wait while we verify your credentials...
        </p>
        <Button disabled className="mt-4">
          Redirecting...
        </Button>
      </div>
    </div>
  );
};

export default AuthCallback;
