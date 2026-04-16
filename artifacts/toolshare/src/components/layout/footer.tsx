import { Link } from "wouter";
import { Wrench, Github, Twitter, Instagram } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-gray-50 dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800">
      <div className="container mx-auto px-4 md:px-6 py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8 md:mb-12">
          <div className="col-span-1 md:col-span-1">
            <Link href="/" className="flex items-center gap-2 mb-4 group">
              <div className="bg-primary text-primary-foreground p-1.5 rounded-md group-hover:scale-110 transition-transform">
                <Wrench className="h-4 w-4" />
              </div>
              <span className="text-xl font-bold tracking-tight">ToolShare</span>
            </Link>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-6 max-w-xs">
              The neighborly way to rent tools. Save money, reduce waste, and build your community.
            </p>
            <div className="flex items-center gap-4">
              <a href="#" className="text-gray-400 hover:text-primary transition-colors">
                <Twitter className="h-5 w-5" />
                <span className="sr-only">Twitter</span>
              </a>
              <a href="#" className="text-gray-400 hover:text-primary transition-colors">
                <Instagram className="h-5 w-5" />
                <span className="sr-only">Instagram</span>
              </a>
              <a href="#" className="text-gray-400 hover:text-primary transition-colors">
                <Github className="h-5 w-5" />
                <span className="sr-only">GitHub</span>
              </a>
            </div>
          </div>
          
          <div>
            <h3 className="font-semibold mb-4 text-gray-900 dark:text-white">Discover</h3>
            <ul className="space-y-3">
              <li><Link href="/tools" className="text-sm text-gray-600 hover:text-primary transition-colors">Browse Tools</Link></li>
              <li><Link href="/tools?category=power-tools" className="text-sm text-gray-600 hover:text-primary transition-colors">Power Tools</Link></li>
              <li><Link href="/tools?category=gardening" className="text-sm text-gray-600 hover:text-primary transition-colors">Gardening</Link></li>
              <li><Link href="/tools?category=hand-tools" className="text-sm text-gray-600 hover:text-primary transition-colors">Hand Tools</Link></li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-semibold mb-4 text-gray-900 dark:text-white">Community</h3>
            <ul className="space-y-3">
              <li><Link href="/how-it-works" className="text-sm text-gray-600 hover:text-primary transition-colors">How it Works</Link></li>
              <li><Link href="/trust-and-safety" className="text-sm text-gray-600 hover:text-primary transition-colors">Trust & Safety</Link></li>
              <li><Link href="/guidelines" className="text-sm text-gray-600 hover:text-primary transition-colors">Community Guidelines</Link></li>
              <li><Link href="/help" className="text-sm text-gray-600 hover:text-primary transition-colors">Help Center</Link></li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-semibold mb-4 text-gray-900 dark:text-white">Legal</h3>
            <ul className="space-y-3">
              <li><Link href="/terms" className="text-sm text-gray-600 hover:text-primary transition-colors">Terms of Service</Link></li>
              <li><Link href="/privacy" className="text-sm text-gray-600 hover:text-primary transition-colors">Privacy Policy</Link></li>
              <li><Link href="/cookies" className="text-sm text-gray-600 hover:text-primary transition-colors">Cookie Policy</Link></li>
              <li><Link href="/insurance" className="text-sm text-gray-600 hover:text-primary transition-colors">Insurance</Link></li>
            </ul>
          </div>
        </div>
        
        <div className="pt-8 border-t border-gray-200 dark:border-gray-800 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-sm text-gray-500">
            &copy; {new Date().getFullYear()} ToolShare. All rights reserved.
          </p>
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <span>Made with</span>
            <span className="text-red-500">&hearts;</span>
            <span>for communities</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
