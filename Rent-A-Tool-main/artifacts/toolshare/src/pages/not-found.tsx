import { Link } from "wouter";
import { Wrench } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-[#0a0a0f] relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-orange-600/10 blur-[140px]" />
      </div>
      <div className="text-center relative z-10 px-4">
        <div className="text-[120px] font-black text-white/5 leading-none mb-4 select-none">404</div>
        <Wrench className="w-12 h-12 text-orange-500/50 mx-auto mb-6" />
        <h1 className="text-3xl font-black text-white mb-3">Page Not Found</h1>
        <p className="text-gray-500 mb-8 max-w-sm mx-auto">
          Looks like this page went missing. Let's get you back on track.
        </p>
        <Button asChild
          className="h-12 px-8 rounded-full font-bold bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white border-0 shadow-lg shadow-orange-500/25">
          <Link href="/">Back to Home</Link>
        </Button>
      </div>
    </div>
  );
}
