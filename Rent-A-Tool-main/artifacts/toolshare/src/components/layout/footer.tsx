import { Link } from "wouter";
import { Wrench, Github, Twitter, Instagram } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-muted/40 border-t border-border">
      <div className="container mx-auto px-4 md:px-6 py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-10">
          <div className="col-span-1">
            <Link href="/" className="flex items-center gap-2 mb-4 group">
              <div className="bg-gradient-to-br from-orange-500 to-amber-500 text-white p-1.5 rounded-md group-hover:scale-110 transition-transform shadow-lg shadow-orange-500/20">
                <Wrench className="h-4 w-4" />
              </div>
              <span className="text-xl font-black tracking-tight text-foreground">ToolHub</span>
            </Link>
            <p className="text-sm text-muted-foreground mb-6 max-w-xs leading-relaxed">
              The smarter way to rent tools. Save money, reduce waste, and build your community.
            </p>
            <div className="flex items-center gap-4">
              {[Twitter, Instagram, Github].map((Icon, i) => (
                <a key={i} href="#" className="text-muted-foreground hover:text-orange-500 transition-colors">
                  <Icon className="h-4 w-4" />
                </a>
              ))}
            </div>
          </div>

          {[
            {
              title: "Discover",
              links: [
                { label: "Browse Tools", href: "/tools" },
                { label: "Power Tools", href: "/tools?category=power-tools" },
                { label: "Gardening", href: "/tools?category=gardening" },
                { label: "Hand Tools", href: "/tools?category=hand-tools" },
              ],
            },
            {
              title: "Community",
              links: [
                { label: "How it Works", href: "/#how-it-works" },
                { label: "Trust & Safety", href: "#" },
                { label: "Guidelines", href: "#" },
                { label: "Help Center", href: "#" },
              ],
            },
            {
              title: "Legal",
              links: [
                { label: "Terms of Service", href: "#" },
                { label: "Privacy Policy", href: "#" },
                { label: "Cookie Policy", href: "#" },
                { label: "Insurance", href: "#" },
              ],
            },
          ].map((col) => (
            <div key={col.title}>
              <h3 className="font-bold text-foreground text-sm mb-4 uppercase tracking-widest">{col.title}</h3>
              <ul className="space-y-3">
                {col.links.map((l) => (
                  <li key={l.label}>
                    <Link href={l.href} className="text-sm text-muted-foreground hover:text-orange-500 transition-colors">
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="pt-8 border-t border-border flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-xs text-muted-foreground">&copy; {new Date().getFullYear()} ToolHub. All rights reserved.</p>
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <span>Made with</span>
            <span className="text-orange-500">&hearts;</span>
            <span>for communities</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
