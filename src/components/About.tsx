import { Shield, Zap, Palette, Sparkles } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { memo } from "react";

const About = () => {
  const features = [
    {
      icon: Zap,
      title: "Lightning Fast",
      description: "All tools run directly in your browser for instant results with no server delays."
    },
    {
      icon: Shield,
      title: "Privacy First",
      description: "Your data stays on your device. We don't collect, store, or transmit your information."
    },
    {
      icon: Palette,
      title: "Beautiful Design",
      description: "Modern, intuitive interface designed for the best user experience."
    },
    {
      icon: Sparkles,
      title: "Completely Free",
      description: "Access all tools without registration, subscriptions, or hidden fees."
    }
  ];

  return (
    <section id="about" className="py-20 bg-gradient-subtle">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12 animate-fade-in">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Why Choose <span className="bg-gradient-primary bg-clip-text text-transparent">SmartKit.tech</span>?
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto mb-2">
            A comprehensive toolkit designed to simplify your daily tasks and boost your productivity.
          </p>
          <p className="text-sm text-muted-foreground">
            Trusted by thousands of users worldwide • No ads, no tracking, just tools that work
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <Card 
                key={feature.title} 
                className="border-2 hover:border-primary/50 transition-all duration-300 hover:shadow-lg animate-scale-in"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <CardContent className="pt-6">
                  <div className="flex flex-col items-center text-center space-y-4">
                    <div className="p-3 bg-gradient-primary rounded-lg">
                      <Icon className="h-8 w-8 text-white" />
                    </div>
                    <h3 className="text-xl font-semibold">{feature.title}</h3>
                    <p className="text-muted-foreground">{feature.description}</p>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        <div className="mt-16 max-w-4xl mx-auto">
          <Card className="border-2 border-primary/20 bg-card">
            <CardContent className="p-8">
              <h3 className="text-2xl font-bold mb-4 text-center">About SmartKit.tech</h3>
              <div className="space-y-4 text-muted-foreground">
                <p>
                  SmartKit.tech is your all-in-one productivity companion, offering a comprehensive collection 
                  of over 30 powerful web-based tools. From calculators and converters to generators and utilities, 
                  we've got everything you need to streamline your workflow.
                </p>
                <p>
                  Our mission is to provide free, fast, and reliable tools that respect your privacy. All processing 
                  happens directly in your browser, ensuring your data never leaves your device. No registration, 
                  no subscriptions, no hassle—just powerful tools when you need them.
                </p>
                <p>
                  Whether you're a developer, student, designer, or anyone looking to simplify daily tasks, 
                  SmartKit.tech has the perfect tool for you. Join thousands of users who trust us for their 
                  productivity needs.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default memo(About);
