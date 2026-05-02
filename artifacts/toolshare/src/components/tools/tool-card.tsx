import { Link } from "wouter";
import { motion } from "framer-motion";
import { Star, MapPin } from "lucide-react";
import { Tool } from "@workspace/api-client-react";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface ToolCardProps {
  tool: Tool;
  index?: number;
}

export function ToolCard({ tool, index = 0 }: ToolCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.1 }}
      whileHover={{ y: -8 }}
      className="h-full"
    >
      <Link href={`/tools/${tool.id}`} className="block h-full cursor-pointer focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 rounded-xl">
        <Card className="h-full overflow-hidden flex flex-col transition-all duration-300 hover:shadow-xl border-gray-200 dark:border-gray-800 group">
          <CardHeader className="p-0 relative aspect-[4/3] overflow-hidden bg-gray-100 dark:bg-gray-800">
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent z-10 opacity-60 group-hover:opacity-80 transition-opacity" />
            <img 
              src={tool.imageUrl || `https://images.unsplash.com/photo-1586864387967-d02ef85d93e8?w=800&q=80`} 
              alt={tool.name}
              className="object-cover w-full h-full transform group-hover:scale-105 transition-transform duration-500"
            />
            <div className="absolute top-3 left-3 z-20">
              <Badge variant="secondary" className="bg-white/90 text-gray-900 hover:bg-white backdrop-blur-sm border-none shadow-sm">
                {tool.category}
              </Badge>
            </div>
            {tool.available ? (
              <div className="absolute top-3 right-3 z-20">
                <Badge className="bg-green-500/90 text-white hover:bg-green-600 backdrop-blur-sm border-none shadow-sm shadow-green-900/20">
                  Available
                </Badge>
              </div>
            ) : (
              <div className="absolute top-3 right-3 z-20">
                <Badge variant="secondary" className="bg-gray-900/80 text-white hover:bg-gray-900 backdrop-blur-sm border-none shadow-sm shadow-black/20">
                  Rented
                </Badge>
              </div>
            )}
            
            <div className="absolute bottom-3 left-3 right-3 z-20 flex justify-between items-end">
              <div className="flex items-center text-white gap-1 bg-black/40 backdrop-blur-md px-2 py-1 rounded-md text-xs font-medium">
                <MapPin className="w-3 h-3 text-primary-300" />
                <span className="truncate max-w-[120px]">{tool.location}</span>
              </div>
              <div className="flex flex-col items-end">
                <span className="text-white font-bold text-lg leading-none tracking-tight">${tool.pricePerDay}</span>
                <span className="text-white/80 text-xs">/day</span>
              </div>
            </div>
          </CardHeader>
          
          <CardContent className="p-4 flex-grow flex flex-col">
            <div className="flex justify-between items-start mb-2 gap-2">
              <h3 className="font-bold text-gray-900 dark:text-white line-clamp-2 leading-snug group-hover:text-primary transition-colors">
                {tool.name}
              </h3>
            </div>
            
            <p className="text-sm text-gray-500 dark:text-gray-400 line-clamp-2 mt-1 flex-grow">
              {tool.description}
            </p>
          </CardContent>
          
          <CardFooter className="p-4 pt-0 flex justify-between items-center text-sm border-t border-gray-100 dark:border-gray-800 mt-auto bg-gray-50/50 dark:bg-gray-800/20 rounded-b-xl">
            <div className="flex items-center gap-2 text-gray-600 dark:text-gray-300">
              <div className="w-6 h-6 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-xs uppercase">
                {tool.ownerName ? tool.ownerName.charAt(0) : "O"}
              </div>
              <span className="font-medium text-xs truncate max-w-[100px]">{tool.ownerName}</span>
            </div>
            
            <div className="flex items-center gap-1 text-amber-500">
              <Star className="w-3.5 h-3.5 fill-current" />
              <span className="font-medium text-xs text-gray-700 dark:text-gray-300">
                {tool.rating ? tool.rating.toFixed(1) : "New"}
                {tool.reviewCount > 0 && <span className="text-gray-400 ml-1">({tool.reviewCount})</span>}
              </span>
            </div>
          </CardFooter>
        </Card>
      </Link>
    </motion.div>
  );
}
