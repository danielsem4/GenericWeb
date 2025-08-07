import { Input } from "../../../components/ui/input";
import { Label } from "../../../components/ui/label";
import { Button } from "../../../components/ui/button";
import { useLoginFormActions } from "../store/loginFormStore";
import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";

function LoginForm() {
  const { setEmail, setPassword } = useLoginFormActions();
  const [showPassword, setShowPassword] = useState(false);

  const handleEmailChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(event.target.value);
  };

  const handlePasswordChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(event.target.value);
  };

  return (
    <form>
      <div className="flex flex-col gap-6">
        {/* Email Field */}
        <div className="grid gap-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            placeholder="m@example.com"
            required
            onChange={handleEmailChange}
            className="border-gray-300 focus:border-blue-500"
          />
        </div>

        {/* Password Field with Eye Icon */}
        <div className="grid gap-2">
          <div className="flex items-center">
            <Label htmlFor="password">Password</Label>
            <a
              href="#"
              className="ml-auto text-sm underline-offset-4 hover:underline text-blue-600"
            >
              Forgot your password?
            </a>
          </div>

          <div className="relative">
            <Input
              id="password"
              type={showPassword ? "text" : "password"}
              required
              onChange={handlePasswordChange}
              className="pr-10 border-gray-300 focus:border-blue-500"
            />
            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={() => setShowPassword((prev) => !prev)}
              className="absolute top-1/2 right-2 -translate-y-1/2"
            >
              {showPassword ? (
                <EyeOff className="w-4 h-4" />
              ) : (
                <Eye className="w-4 h-4" />
              )}
            </Button>
          </div>
        </div>
      </div>
    </form>
  );
}

export default LoginForm;
