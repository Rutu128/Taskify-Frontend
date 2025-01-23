import { LoginForm } from "@/components/login-form";
import { useAuth } from "@/hooks/useAuth";
import { useNavigate } from "react-router-dom";

const HomePage = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  if (isAuthenticated) {
    navigate("/dashboard");
  }
  return (
      <div className="flex max-h-screen w-full items-center justify-center p-6 md:p-10">
        <div className="w-full max-w-sm mt-20">
          <LoginForm />
        </div>
      </div>
  )
}

export default HomePage