import Header from "@/components/Header";
import Hero from "@/components/Hero";
import ToolsGrid from "@/components/ToolsGrid";
import QuickAccess from "@/components/QuickAccess";
import About from "@/components/About";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";
import WelcomeBanner from "@/components/WelcomeBanner";

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <WelcomeBanner />
      <Header />
      <main className="flex-1">
        <Hero />
        <QuickAccess />
        <ToolsGrid />
        <About />
        <Contact />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
