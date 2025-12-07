import { useTranslations } from "@/lib/i18n";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Heart, Share2, RefreshCw, Star } from "lucide-react";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

// Mock data
const MOCK_RECOMMENDATIONS = [
  {
    id: 1,
    category: "decor",
    title: "Mid-Century Modern Lounge Chair",
    price: "$350 - $800",
    image: "https://images.unsplash.com/photo-1567538096630-e0c55bd6374c?q=80&w=2787&auto=format&fit=crop",
    tags: ["Furniture", "Living Room", "Trending"],
    rating: 4.8
  },
  {
    id: 2,
    category: "maintenance",
    title: "HVAC System Tune-up",
    price: "$120 - $200",
    image: "https://images.unsplash.com/photo-1581094794329-cd1096a7a5e8?q=80&w=2940&auto=format&fit=crop",
    tags: ["Seasonal", "Essential", "Energy Saving"],
    rating: 4.9
  },
  {
    id: 3,
    category: "renovation",
    title: "Kitchen Backsplash Upgrade",
    price: "$500 - $1,200",
    image: "https://images.unsplash.com/photo-1556911220-e15b29be8c8f?q=80&w=2940&auto=format&fit=crop",
    tags: ["DIY Friendly", "High ROI", "Kitchen"],
    rating: 4.5
  },
  {
    id: 4,
    category: "decor",
    title: "Jute Area Rug",
    price: "$150 - $400",
    image: "https://images.unsplash.com/photo-1534349762230-e0cadf78f5da?q=80&w=2940&auto=format&fit=crop",
    tags: ["Natural", "Boho", "Durable"],
    rating: 4.6
  },
  {
    id: 5,
    category: "garden",
    title: "Drought-Resistant Landscaping",
    price: "$1,000+",
    image: "https://images.unsplash.com/photo-1558904541-efa843a96f01?q=80&w=2000&auto=format&fit=crop",
    tags: ["Eco-friendly", "Low Maintenance", "Outdoor"],
    rating: 4.7
  },
  {
    id: 6,
    category: "maintenance",
    title: "Smart Thermostat Installation",
    price: "$200 - $300",
    image: "https://images.unsplash.com/photo-1558402529-d2638a7023e9?q=80&w=2940&auto=format&fit=crop",
    tags: ["Smart Home", "Energy Saving"],
    rating: 4.9
  }
];

export default function Recommendations() {
  const t = useTranslations();
  const [activeTab, setActiveTab] = useState("all");
  const [favorites, setFavorites] = useState<number[]>([]);

  const toggleFavorite = (id: number) => {
    setFavorites(prev => 
      prev.includes(id) ? prev.filter(fav => fav !== id) : [...prev, id]
    );
  };

  const filteredItems = activeTab === "all" 
    ? MOCK_RECOMMENDATIONS 
    : MOCK_RECOMMENDATIONS.filter(item => item.category === activeTab);

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 gap-4">
        <div>
          <h1 className="text-4xl font-serif font-bold mb-2">{t.recommendations.title}</h1>
          <p className="text-muted-foreground text-lg">{t.recommendations.subtitle}</p>
        </div>
        <Button variant="outline" className="gap-2">
          <RefreshCw className="w-4 h-4" />
          {t.recommendations.refresh}
        </Button>
      </div>

      <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab} className="mb-8">
        <TabsList className="bg-muted/50 p-1 h-12">
          <TabsTrigger value="all" className="h-10 px-6 rounded-sm text-sm">All</TabsTrigger>
          <TabsTrigger value="decor" className="h-10 px-6 rounded-sm text-sm">Decor</TabsTrigger>
          <TabsTrigger value="renovation" className="h-10 px-6 rounded-sm text-sm">Renovation</TabsTrigger>
          <TabsTrigger value="maintenance" className="h-10 px-6 rounded-sm text-sm">Maintenance</TabsTrigger>
          <TabsTrigger value="garden" className="h-10 px-6 rounded-sm text-sm">Garden</TabsTrigger>
        </TabsList>
      </Tabs>

      <motion.div 
        layout
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
      >
        <AnimatePresence mode="popLayout">
          {filteredItems.map((item) => (
            <motion.div
              key={item.id}
              layout
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.2 }}
            >
              <Card className="group h-full flex flex-col overflow-hidden hover:shadow-lg transition-all border-muted">
                <div className="relative aspect-[4/3] overflow-hidden">
                  <img 
                    src={item.image} 
                    alt={item.title} 
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute top-3 right-3 flex gap-2">
                    <Button 
                      size="icon" 
                      variant="secondary" 
                      className="h-8 w-8 rounded-full bg-white/80 backdrop-blur-sm hover:bg-white"
                      onClick={() => toggleFavorite(item.id)}
                    >
                      <Heart className={`w-4 h-4 ${favorites.includes(item.id) ? "fill-red-500 text-red-500" : ""}`} />
                    </Button>
                  </div>
                  <div className="absolute bottom-3 left-3">
                    <Badge variant="secondary" className="bg-white/90 backdrop-blur-sm shadow-sm font-medium">
                      {item.price}
                    </Badge>
                  </div>
                </div>
                
                <CardHeader className="p-5 pb-2">
                  <div className="flex justify-between items-start gap-2">
                    <h3 className="font-bold text-lg leading-tight group-hover:text-primary transition-colors">
                      {item.title}
                    </h3>
                    <div className="flex items-center gap-1 text-amber-500 shrink-0">
                      <Star className="w-4 h-4 fill-current" />
                      <span className="text-sm font-medium text-foreground">{item.rating}</span>
                    </div>
                  </div>
                </CardHeader>
                
                <CardContent className="p-5 pt-2 flex-1">
                  <div className="flex flex-wrap gap-2 mt-2">
                    {item.tags.map((tag, i) => (
                      <span key={i} className="text-xs px-2 py-1 rounded-full bg-muted text-muted-foreground border border-border/50">
                        {tag}
                      </span>
                    ))}
                  </div>
                </CardContent>
                
                <CardFooter className="p-5 pt-0 border-t border-border/50 mt-auto bg-muted/10">
                  <div className="flex gap-2 w-full mt-4">
                    <Button className="flex-1">View Details</Button>
                    <Button variant="outline" size="icon">
                      <Share2 className="w-4 h-4" />
                    </Button>
                  </div>
                </CardFooter>
              </Card>
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}
