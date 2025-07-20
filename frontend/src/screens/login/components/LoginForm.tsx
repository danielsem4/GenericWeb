import { Input } from "../../../components/ui/input";
import { Label } from "../../../components/ui/label";
import { useLoginFormActions } from "../store/loginFormStore";

function LoginForm() {
  const { setEmail, setPassword } = useLoginFormActions();
  const handleEmailChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(event.target.value);
  };
  const handlePasswordChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(event.target.value);
  };
  return (
    <form>
      <div className="flex flex-col gap-6">
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
          <Input
            id="password"
            type="password"
            required
            onChange={handlePasswordChange}
            className="border-gray-300 focus:border-blue-500"
          />
        </div>
      </div>
    </form>
  );
}

export default LoginForm;
