import {
  Card,
  CardAction,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import LoginForm from "./components/LoginForm";
import { useLogin } from "./hooks/useLogin";
import { useLoginFormFields } from "./store/loginFormStore";
import { useNavigate } from "react-router";
import { toast } from "sonner";
import type { LoginCredentials } from "./LoginCredentials";

/**
 * Login component provides a centered login form using Tailwind CSS and shadcn/ui components
 * @returns JSX.Element
 */

function Login() {
  const { email, password } = useLoginFormFields();
  const { mutateAsync, isPending, error } = useLogin();
  const navigate = useNavigate();

  const handleLogin = async (values: LoginCredentials) => {
    try {
      await mutateAsync(values);

      toast.success("Login successful!", {
        description: "Redirecting to home...",
        duration: 2000,
      });

      navigate("/home");
    } catch (e) {
      console.log("Login error:", e);

      toast.error("Login failed", {
        description: "Please check your credentials.",
      });
    }
  };

  return (
    <div className="flex p-4 items-center justify-center min-h-screen bg-gray-100">
      <Card className="w-full p-0 h-full max-w-sm bg-white text-gray-900 rounded-2xl shadow-xl">
        <CardHeader className="p-6 bg-blue-600 text-white rounded-t-2xl">
          <CardTitle>Login to your account</CardTitle>

          <CardAction></CardAction>
        </CardHeader>
        <CardContent className="p-6">
          <LoginForm />
        </CardContent>
        <CardFooter className="flex-col gap-2 p-6">
          <Button
            type="submit"
            onClick={() => handleLogin({ email, password })}
            disabled={isPending || !email || !password}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white"
          >
            {isPending ? "Logging in..." : "Login"}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}

export default Login;
