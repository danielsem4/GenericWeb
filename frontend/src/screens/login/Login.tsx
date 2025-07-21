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

/**
 * Login component provides a centered login form using Tailwind CSS and shadcn/ui components
 * @returns JSX.Element
 */

function Login() {
  const { email, password } = useLoginFormFields();
  const { login, data, isLoading, isError, error, isSuccess } = useLogin();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email && password) {
      login({ email, password });
    }
  };



  return (
    <div className="flex p-4 items-center justify-center min-h-screen bg-background">
      <Card className="w-full p-0 h-full max-w-sm bg-card text-card-foreground rounded-2xl shadow-xl">
        <CardHeader className="p-6 bg-primary text-primary-foreground rounded-t-2xl">
          <CardTitle>Login to your account</CardTitle>
          <CardAction></CardAction>
        </CardHeader>
        <CardContent className="p-6">
          <LoginForm onSubmit={handleSubmit} isLoading={isLoading} />
          {isError && (
            <div className="mt-4 p-3 bg-destructive/10 border border-destructive/20 text-destructive rounded">
              {error?.message || "Login failed. Please try again."}
            </div>
          )}
          {isSuccess && (
            <div className="mt-4 p-3 bg-success/10 border border-success/20 text-success rounded">
              Login successful! Redirecting...
            </div>
          )}
        </CardContent>
        <CardFooter className="flex-col gap-2 p-6">
          <Button
            type="submit"
            form="login-form"
            disabled={isLoading || !email || !password}
            className="w-full bg-primary hover:bg-primary/90 text-primary-foreground disabled:opacity-50"
          >
            {isLoading ? "Logging in..." : "Login"}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}

export default Login;
