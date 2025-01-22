import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useAuth } from "@/hooks/useAuth"
import { useNavigate } from "react-router-dom"

export function LoginForm({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"div">) {
  const { login, isLoading } = useAuth();
  const navigate = useNavigate();

  const handlelogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formElements = (e.target as HTMLFormElement).elements as HTMLFormControlsCollection & { email: HTMLInputElement; password: HTMLInputElement };
    const email = formElements.email?.value;
    const password = formElements.password?.value;
    const isLoggedIn = await login(email, password);
    

    if (isLoggedIn) {
      navigate('/dashboard');
    }

  }


  return (
    <div className={cn("flex flex-col gap-6 shadow-[rgba(0,_0,_0,_0.4)_0px_30px_90px]", className)} {...props}>
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">Login</CardTitle>
          <CardDescription>
            Enter your email below to login to your account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handlelogin}>
            <div className="flex flex-col gap-6">
              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="m@example.com"
                  required
                />
              </div>
              <div className="grid gap-2">
                <div className="flex items-center">
                  <Label htmlFor="password">Password</Label>

                </div>
                <Input id="password" type="password" required />
              </div>
              <Button type="submit" className="w-full">
                {isLoading ? "Loading ..." : "Login"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
