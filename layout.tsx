import { Link, useLocation } from "wouter";
import { useLanguage, useTranslations, type Language } from "@/lib/i18n";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Globe, Home, Sparkles, Menu } from "lucide-react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { useState } from "react";

export default function Layout({ children }: { children: React.ReactNode }) {
  const { language, setLanguage } = useLanguage();
  const t = useTranslations();
  const [location] = useLocation();
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  const NavLink = ({ href, icon: Icon, children }: { href: string; icon: any; children: React.ReactNode }) => {
    const isActive = location === href;
    return (
      <Link href={href}>
        <a className={`flex items-center gap-2 px-4 py-2 rounded-md transition-all duration-200 ${
          isActive 
            ? "bg-primary text-primary-foreground shadow-sm" 
            : "hover:bg-muted text-foreground/80 hover:text-foreground"
        }`}>
          <Icon className="w-4 h-4" />
          <span className="font-medium">{children}</span>
        </a>
      </Link>
    );
  };

  return (
    <div className="min-h-screen flex flex-col bg-background font-sans">
      <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Link href="/">
              <a className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center text-primary-foreground">
                  <Home className="w-5 h-5" />
                </div>
                <span className="font-serif text-xl font-bold tracking-tight">Nest & Nurture</span>
              </a>
            </Link>
          </div>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-2">
            <NavLink href="/" icon={Home}>{t.nav.home}</NavLink>
            <NavLink href="/recommendations" icon={Sparkles}>{t.nav.recommendations}</NavLink>
            
            <div className="w-px h-6 bg-border mx-2" />
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="gap-2">
                  <Globe className="w-4 h-4" />
                  <span className="uppercase">{language}</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => setLanguage('en')}>English</DropdownMenuItem>
                <DropdownMenuItem onClick={() => setLanguage('es')}>Español</DropdownMenuItem>
                <DropdownMenuItem onClick={() => setLanguage('fr')}>Français</DropdownMenuItem>
                <DropdownMenuItem onClick={() => setLanguage('de')}>Deutsch</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </nav>

          {/* Mobile Nav */}
          <Sheet open={isMobileOpen} onOpenChange={setIsMobileOpen}>
            <SheetTrigger asChild className="md:hidden">
              <Button variant="ghost" size="icon">
                <Menu className="w-5 h-5" />
              </Button>
            </SheetTrigger>
            <SheetContent>
              <div className="flex flex-col gap-4 mt-8">
                <Link href="/">
                  <a onClick={() => setIsMobileOpen(false)} className="flex items-center gap-2 text-lg font-medium p-2 hover:bg-muted rounded-md">
                    <Home className="w-5 h-5" /> {t.nav.home}
                  </a>
                </Link>
                <Link href="/recommendations">
                  <a onClick={() => setIsMobileOpen(false)} className="flex items-center gap-2 text-lg font-medium p-2 hover:bg-muted rounded-md">
                    <Sparkles className="w-5 h-5" /> {t.nav.recommendations}
                  </a>
                </Link>
                
                <div className="h-px bg-border my-2" />
                
                <div className="grid grid-cols-2 gap-2">
                  <Button variant={language === 'en' ? 'default' : 'outline'} onClick={() => { setLanguage('en'); setIsMobileOpen(false); }}>English</Button>
                  <Button variant={language === 'es' ? 'default' : 'outline'} onClick={() => { setLanguage('es'); setIsMobileOpen(false); }}>Español</Button>
                  <Button variant={language === 'fr' ? 'default' : 'outline'} onClick={() => { setLanguage('fr'); setIsMobileOpen(false); }}>Français</Button>
                  <Button variant={language === 'de' ? 'default' : 'outline'} onClick={() => { setLanguage('de'); setIsMobileOpen(false); }}>Deutsch</Button>
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </header>

      <main className="flex-1">
        {children}
      </main>

      <footer className="border-t border-border bg-muted/30">
        <div className="container mx-auto px-4 py-8 md:py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded bg-primary flex items-center justify-center text-primary-foreground">
                  <Home className="w-3 h-3" />
                </div>
                <span className="font-serif font-bold text-lg">Nest & Nurture</span>
              </div>
              <p className="text-sm text-muted-foreground">
                Helping new homeowners create spaces they love, one personalized recommendation at a time.
              </p>
            </div>
            
            <div>
              <h4 className="font-bold mb-4">Platform</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><a href="#" className="hover:text-foreground">Browse Ideas</a></li>
                <li><a href="#" className="hover:text-foreground">Style Quiz</a></li>
                <li><a href="#" className="hover:text-foreground">Budget Calculator</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-bold mb-4">Company</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><a href="#" className="hover:text-foreground">About Us</a></li>
                <li><a href="#" className="hover:text-foreground">Careers</a></li>
                <li><a href="#" className="hover:text-foreground">Contact</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-bold mb-4">Legal</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><a href="#" className="hover:text-foreground">Privacy Policy</a></li>
                <li><a href="#" className="hover:text-foreground">Terms of Service</a></li>
              </ul>
            </div>
          </div>
          <div className="mt-8 pt-8 border-t border-border text-center text-sm text-muted-foreground">
            © {new Date().getFullYear()} Nest & Nurture. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}
