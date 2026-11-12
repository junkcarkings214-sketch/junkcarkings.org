import { Logo } from "@/components/site/logo";
import { LoginForm } from "./login-form";

export const metadata = {
  title: "Owner Sign In",
};

export default function AdminLoginPage() {
  return (
    <main className="flex min-h-svh flex-1 flex-col items-center justify-center gap-8 bg-secondary/60 px-4 py-16">
      <Logo className="h-16" />
      <LoginForm />
    </main>
  );
}
