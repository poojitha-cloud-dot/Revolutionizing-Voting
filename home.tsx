import { useTranslations } from "@/lib/i18n";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowRight, Hammer, Leaf, Palette, ShieldCheck, Sparkles } from "lucide-react";
import { Link } from "wouter";
import { motion } from "framer-motion";
import heroImage from "@assets/generated_images/bright_airy_living_room_hero_image.png";
import toolsImage from "@assets/generated_images/renovation_tools_and_blueprints.png";
import decorImage from "@assets/generated_images/modern_interior_decor_items.png";
import gardenImage from "@assets/generated_images/lush_home_garden_corner.png";

export default function Home() {
  const t = useTranslations();

  const features = [
    {
      title: t.features.renovation,
      desc: t.features.renovation_desc,
      icon: Hammer,
      image: toolsImage,
      color: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300"
    },
    {
      title: t.features.decor,
      desc: t.features.decor_desc,
      icon: Palette,
      image: decorImage,
      color: "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300"
    },
    {
      title: t.features.garden,
      desc: t.features.garden_desc,
      icon: Leaf,
      image: gardenImage,
      color: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300"
    }
  ];

  return (
    <div className="flex flex-col gap-16 pb-16">
      {/* Hero Section */}
      <section className="relative h-[80vh] min-h-[600px] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img 
            src={heroImage} 
            alt="Beautiful Living Room" 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/30 backdrop-blur-[2px]" />
        </div>
        
        <div className="relative z-10 container mx-auto px-4 text-center text-white max-w-4xl">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="text-4xl md:text-6xl lg:text-7xl font-serif font-bold mb-6 leading-tight"
          >
            {t.hero.title}
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
            className="text-lg md:text-xl lg:text-2xl text-white/90 mb-10 max-w-2xl mx-auto font-light"
          >
            {t.hero.subtitle}
          </motion.p>
          <motion.div
             initial={{ opacity: 0, y: 20 }}
             animate={{ opacity: 1, y: 0 }}
             transition={{ duration: 0.8, delay: 0.4, ease: "easeOut" }}
          >
            <Link href="/recommendations">
              <Button size="lg" className="h-14 px-8 text-lg rounded-full bg-white text-primary hover:bg-white/90 hover:scale-105 transition-all duration-300 shadow-xl">
                {t.hero.cta}
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 -mt-24 relative z-20">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
            >
              <Card className="h-full overflow-hidden hover:shadow-xl transition-all duration-300 border-none shadow-lg group">
                <div className="h-48 overflow-hidden relative">
                  <img 
                    src={feature.image} 
                    alt={feature.title} 
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-6">
                    <div className={`p-3 rounded-full ${feature.color} shadow-sm backdrop-blur-sm bg-white/90 dark:bg-black/80`}>
                      <feature.icon className="w-6 h-6" />
                    </div>
                  </div>
                </div>
                <CardContent className="p-6">
                  <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
                  <p className="text-muted-foreground mb-4">{feature.desc}</p>
                  <Button variant="link" className="p-0 h-auto gap-2 group-hover:gap-3 transition-all">
                    Learn more <ArrowRight className="w-4 h-4" />
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Value Prop */}
      <section className="container mx-auto px-4 py-16">
        <div className="bg-muted/50 rounded-3xl p-8 md:p-16 flex flex-col md:flex-row items-center gap-12">
          <div className="flex-1 space-y-6">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground">Why homeowners trust us</h2>
            <div className="space-y-4">
              <div className="flex gap-4">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center shrink-0 text-primary">
                  <ShieldCheck className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="font-bold text-lg">Verified Professionals</h4>
                  <p className="text-muted-foreground">Access a network of vetted contractors and designers.</p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="w-12 h-12 rounded-full bg-accent/10 flex items-center justify-center shrink-0 text-accent">
                  <Sparkles className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="font-bold text-lg">AI-Powered Design</h4>
                  <p className="text-muted-foreground">Get visualization of your space with different styles instantly.</p>
                </div>
              </div>
            </div>
          </div>
          <div className="flex-1 w-full relative h-[400px] rounded-2xl overflow-hidden shadow-2xl">
             <img 
                src={heroImage} 
                alt="Interior Design" 
                className="w-full h-full object-cover"
              />
          </div>
        </div>
      </section>
    </div>
  );
}
