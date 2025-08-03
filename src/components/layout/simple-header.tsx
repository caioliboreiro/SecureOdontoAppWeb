import { Logo } from "../ui/logo";
import { UserNav } from "./user-nav";

export function SimpleHeader(){
    return (
    <header className="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 max-w-screen-2xl items-center px-4">
        <Logo className="mr-4 hidden md:flex" showText={true} href="/dashboard" />
        <div className="flex flex-1 items-center justify-end space-x-2">
          <UserNav />
        </div>
      </div>
    </header>
  );
}