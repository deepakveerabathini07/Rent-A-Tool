import { useState } from "react";
import { useLocation } from "wouter";
import { motion } from "framer-motion";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { PageTransition } from "@/components/layout/page-transition";
import { useAuth } from "@/lib/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { 
  Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage 
} from "@/components/ui/form";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { useCreateTool, useListToolCategories } from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { Camera, Image as ImageIcon, Wrench } from "lucide-react";

const formSchema = z.object({
  name: z.string().min(3, "Name must be at least 3 characters"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  category: z.string().min(1, "Please select a category"),
  imageUrl: z.string().url("Please enter a valid image URL").or(z.string().length(0)),
  pricePerDay: z.coerce.number().min(1, "Price must be at least $1"),
  pricePerHour: z.coerce.number().optional(),
  location: z.string().min(3, "Please enter a location"),
  available: z.boolean().default(true),
});

export default function AddTool() {
  const { user } = useAuth();
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [imagePreview, setImagePreview] = useState("");

  const { data: categories } = useListToolCategories();
  const createTool = useCreateTool();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      description: "",
      category: "",
      imageUrl: "",
      pricePerDay: 10,
      location: "San Francisco, CA",
      available: true,
    },
  });

  // Redirect if not an owner
  if (user?.role !== "owner") {
    return (
      <PageTransition className="min-h-screen pt-24 px-4 flex flex-col items-center justify-center">
        <Wrench className="w-16 h-16 text-gray-300 mb-6" />
        <h1 className="text-2xl font-bold mb-4">Owner Access Required</h1>
        <p className="text-gray-500 mb-8 text-center max-w-md">
          You must be logged in as an owner to list a tool. Please switch your role or sign in.
        </p>
        <Button onClick={() => setLocation("/login")}>Go to Login</Button>
      </PageTransition>
    );
  }

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    createTool.mutate(
      { 
        data: {
          ownerId: user.id,
          name: values.name,
          description: values.description,
          category: values.category,
          imageUrl: values.imageUrl || "https://images.unsplash.com/photo-1504148455328-c376907d081c?w=800&q=80",
          pricePerDay: values.pricePerDay,
          pricePerHour: values.pricePerHour,
          location: values.location,
          available: values.available
        }
      },
      {
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: ["/api/tools"] });
          toast({
            title: "Tool listed successfully!",
            description: "Your tool is now available for rent.",
          });
          setLocation("/dashboard/owner");
        },
        onError: () => {
          toast({
            title: "Error listing tool",
            description: "Please try again later.",
            variant: "destructive",
          });
        }
      }
    );
  };

  return (
    <PageTransition className="pt-24 pb-20">
      <div className="container mx-auto px-4 max-w-3xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-2">
            List a Tool
          </h1>
          <p className="text-gray-600 dark:text-gray-400 text-lg">
            Turn your idle tools into extra cash by sharing them with your neighbors.
          </p>
        </motion.div>

        <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-800 p-6 md:p-8">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              
              {/* Image Section */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold">Tool Image</h3>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <FormField
                      control={form.control}
                      name="imageUrl"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Image URL (Optional)</FormLabel>
                          <FormControl>
                            <Input 
                              placeholder="https://example.com/image.jpg" 
                              {...field} 
                              onChange={(e) => {
                                field.onChange(e);
                                setImagePreview(e.target.value);
                              }}
                            />
                          </FormControl>
                          <FormDescription>
                            Leave blank to use a default image.
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <div className="pt-2 text-sm text-gray-500 bg-gray-50 dark:bg-gray-800 p-4 rounded-lg flex items-start gap-3">
                      <Camera className="w-5 h-5 text-gray-400 mt-0.5 flex-shrink-0" />
                      <p>Good photos increase rentals by up to 60%. Use a clear, well-lit image of your actual tool.</p>
                    </div>
                  </div>
                  
                  <div className="aspect-[4/3] rounded-xl border-2 border-dashed border-gray-200 dark:border-gray-700 overflow-hidden bg-gray-50 dark:bg-gray-800/50 flex flex-col items-center justify-center text-center p-4">
                    {imagePreview ? (
                      <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" onError={(e) => {
                        (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1504148455328-c376907d081c?w=800&q=80";
                        toast({ title: "Image load failed", description: "Using default image instead.", variant: "destructive" });
                      }} />
                    ) : (
                      <>
                        <ImageIcon className="w-10 h-10 text-gray-300 mb-2" />
                        <p className="text-sm font-medium text-gray-500">Image Preview</p>
                      </>
                    )}
                  </div>
                </div>
              </div>

              <div className="h-px bg-gray-100 dark:bg-gray-800 w-full" />

              {/* Details Section */}
              <div className="space-y-6">
                <h3 className="text-lg font-semibold">Tool Details</h3>
                
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Tool Name</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g. DeWalt 20V MAX Cordless Drill" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="category"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Category</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select a category" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {categories?.map((cat) => (
                              <SelectItem key={cat.category} value={cat.category}>
                                <div className="flex items-center gap-2">
                                  <span>{cat.icon}</span>
                                  <span className="capitalize">{cat.category.replace("-", " ")}</span>
                                </div>
                              </SelectItem>
                            )) || (
                              <>
                                <SelectItem value="power-tools">Power Tools</SelectItem>
                                <SelectItem value="hand-tools">Hand Tools</SelectItem>
                                <SelectItem value="gardening">Gardening</SelectItem>
                                <SelectItem value="cleaning">Cleaning</SelectItem>
                              </>
                            )}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="location"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Pickup Location</FormLabel>
                        <FormControl>
                          <Input placeholder="Neighborhood or Zip Code" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Description</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="Describe the tool's condition, what it's good for, and any included accessories." 
                          className="min-h-[120px]"
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="h-px bg-gray-100 dark:bg-gray-800 w-full" />

              {/* Pricing & Availability */}
              <div className="space-y-6">
                <h3 className="text-lg font-semibold">Pricing & Availability</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="pricePerDay"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Price per Day ($)</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                              <span className="text-gray-500 sm:text-sm">$</span>
                            </div>
                            <Input type="number" min="1" step="1" className="pl-7" {...field} />
                          </div>
                        </FormControl>
                        <FormDescription>Suggested: 5-10% of retail value</FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="pricePerHour"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Price per Hour (Optional)</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                              <span className="text-gray-500 sm:text-sm">$</span>
                            </div>
                            <Input 
                              type="number" 
                              min="0" 
                              step="0.5" 
                              className="pl-7" 
                              {...field} 
                              value={field.value || ""} 
                              onChange={e => field.onChange(e.target.value ? parseFloat(e.target.value) : undefined)}
                            />
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="available"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border border-gray-200 dark:border-gray-800 p-4">
                      <div className="space-y-0.5">
                        <FormLabel className="text-base">Available immediately</FormLabel>
                        <FormDescription>
                          Make this tool visible in search results right now.
                        </FormDescription>
                      </div>
                      <FormControl>
                        <Switch
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>

              <div className="pt-4 flex justify-end gap-4">
                <Button type="button" variant="outline" onClick={() => setLocation("/dashboard/owner")}>
                  Cancel
                </Button>
                <Button type="submit" disabled={createTool.isPending} className="px-8">
                  {createTool.isPending ? "Listing..." : "List Tool"}
                </Button>
              </div>
            </form>
          </Form>
        </div>
      </div>
    </PageTransition>
  );
}
