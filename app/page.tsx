import HeroSection from "@/components/HeroSection";
import Navbar from "@/components/NavBar";

const LandingPage = () => {
  return (
    <main className="h-full bg-background text-white">
      <Navbar />
      <HeroSection />
    </main>
  );
};

export default LandingPage;
