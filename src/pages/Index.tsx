import Header from "@/components/Header";
import Hero from "@/components/Hero";
import ToolsGrid from "@/components/ToolsGrid";
import About from "@/components/About";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        <Hero />
        <ToolsGrid />
        <About />
        <Contact />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
