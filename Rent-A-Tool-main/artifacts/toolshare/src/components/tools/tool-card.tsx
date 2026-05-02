import { Link } from "wouter";
import { motion } from "framer-motion";
import { Star, MapPin } from "lucide-react";
import { Tool } from "@workspace/api-client-react";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatINR } from "@/lib/currency";

interface ToolCardProps { tool: Tool; index?: number; }

export function ToolCard({ tool, index = 0 }: ToolCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.1 }} whileHover={{ y: -6 }} className="h-full"
    >
      <Link href={`/tools/${tool.id}`} className="block h-full cursor-pointer focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 rounded-xl">
        <Card className="h-full overflow-hidden flex flex-col transition-all duration-300 hover:shadow-xl border-border bg-card group">
          <CardHeader className="p-0 relative aspect-[4/3] overflow-hidden bg-muted">
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent z-10 opacity-60 group-hover:opacity-80 transition-opacity" />
            <img
              src={tool.imageUrl || `https://images.unsplash.com/photo-1586864387967-d02ef85d93e8?w=800&q=80`}
              alt={tool.name}
              className="object-cover w-full h-full transform group-hover:scale-105 transition-transform duration-500"
            />
            <div className="absolute top-3 left-3 z-20">
              <Badge className="bg-black/50 text-white backdrop-blur-sm border-white/20 shadow-sm capitalize">
                {tool.category.replace("-", " ")}
              </Badge>
            </div>
            {tool.available ? (
              <div className="absolute top-3 right-3 z-20">
                <Badge className="bg-green-500/90 text-white border-none shadow-sm">Available</Badge>
              </div>
            ) : (
              <div className="absolute top-3 right-3 z-20">
                <Badge className="bg-gray-900/80 text-white border-none shadow-sm">Rented</Badge>
              </div>
            )}
            <div className="absolute bottom-3 left-3 right-3 z-20 flex justify-between items-end">
              <div className="flex items-center text-white gap-1 bg-black/40 backdrop-blur-md px-2 py-1 rounded-md text-xs font-medium">
                <MapPin className="w-3 h-3 text-orange-400" />
                <span className="truncate max-w-[120px]">{tool.location}</span>
              </div>
              <div className="flex flex-col items-end">
                <span className="text-white font-bold text-lg leading-none">{formatINR(tool.pricePerDay)}</span>
                <span className="text-white/80 text-xs">/day</span>
              </div>
            </div>
          </CardHeader>

          <CardContent className="p-4 flex-grow flex flex-col">
            <h3 className="font-bold text-foreground line-clamp-2 leading-snug group-hover:text-orange-500 transition-colors mb-1">
              {tool.name}
            </h3>
            <p className="text-sm text-muted-foreground line-clamp-2 mt-1 flex-grow">{tool.description}</p>
          </CardContent>

          <CardFooter className="p-4 pt-0 flex justify-between items-center text-sm border-t border-border mt-auto bg-muted/20 rounded-b-xl">
            <div className="flex items-center gap-2 text-muted-foreground">
              <div className="w-6 h-6 rounded-full bg-orange-500/15 text-orange-500 flex items-center justify-center font-bold text-xs uppercase">
                {tool.ownerName ? tool.ownerName.charAt(0) : "O"}
              </div>
              <span className="font-medium text-xs truncate max-w-[100px]">{tool.ownerName}</span>
            </div>
            <div className="flex items-center gap-1 text-amber-500">
              <Star className="w-3.5 h-3.5 fill-current" />
              <span className="font-medium text-xs text-foreground">
                {tool.rating ? tool.rating.toFixed(1) : "New"}
                {tool.reviewCount > 0 && <span className="text-muted-foreground ml-1">({tool.reviewCount})</span>}
              </span>
            </div>
          </CardFooter>
        </Card>
      </Link>
    </motion.div>
  );
}
