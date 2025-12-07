import { Link, useLocation } from "wouter";
import { ShieldCheck, UserPlus, Camera, Settings } from "lucide-react";
import { Toaster } from "@/components/ui/toaster";

export default function Layout({ children }: { children: React.ReactNode }) {
  const [location] = useLocation();

  const NavLink = ({ href, icon: Icon, label }: { href: string; icon: any; label: string }) => {
    const isActive = location === href;
    return (
      <Link href={href}>
        <a className={`flex flex-col items-center justify-center gap-1 p-2 rounded-lg transition-all w-24 text-center text-xs font-medium ${
          isActive 
            ? "bg-primary text-primary-foreground shadow-md" 
            : "text-muted-foreground hover:bg-muted hover:text-foreground"
        }`}>
          <Icon className="w-5 h-5" />
          {label}
        </a>
      </Link>
    );
  };

  return (
    <div className="min-h-screen bg-background font-sans flex flex-col md:flex-row">
      <Toaster />
      
      {/* Sidebar / Topbar */}
      <aside className="w-full md:w-64 bg-card border-b md:border-r border-border flex flex-col md:h-screen sticky top-0 z-50">
        <div className="p-6 flex items-center gap-3 border-b border-border">
          <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center text-primary-foreground shadow-lg">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div>
            <h1 className="font-bold text-lg leading-tight">SecureVote</h1>
            <p className="text-xs text-muted-foreground">ID Verification System</p>
          </div>
        </div>

        <nav className="flex md:flex-col gap-2 p-4 overflow-x-auto md:overflow-visible">
          <Link href="/">
            <a className={`flex items-center gap-3 px-4 py-3 rounded-md transition-all text-sm font-medium ${
              location === "/" 
                ? "bg-primary/10 text-primary border border-primary/20" 
                : "text-muted-foreground hover:bg-muted hover:text-foreground"
            }`}>
              <UserPlus className="w-5 h-5" />
              Registration (Admin)
            </a>
          </Link>
          <Link href="/voting-booth">
            <a className={`flex items-center gap-3 px-4 py-3 rounded-md transition-all text-sm font-medium ${
              location === "/voting-booth" 
                ? "bg-primary/10 text-primary border border-primary/20" 
                : "text-muted-foreground hover:bg-muted hover:text-foreground"
            }`}>
              <Camera className="w-5 h-5" />
              Voting Booth
            </a>
          </Link>
        </nav>

        <div className="mt-auto p-6 border-t border-border hidden md:block">
          <div className="bg-muted/50 rounded-lg p-4 text-xs text-muted-foreground">
            <p className="font-semibold mb-1">System Status</p>
            <div className="flex items-center gap-2 mb-1">
              <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
              Face Match: Active
            </div>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
              QR Gen: Ready
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto bg-muted/20">
        <div className="container mx-auto p-4 md:p-8 max-w-6xl">
          {children}
        </div>
      </main>
    </div>
  );
}
