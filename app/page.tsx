"use client";
import Hero from "@/components/Hero";
import Bento from "@/components/Bento";
import Feature from "@/components/Feature";
import FAQ from "@/components/FAQ";
import Stats from "@/components/Stats";
import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";

function Home() {
  return (
    <>
      <Navbar />
      <Hero />
      <Feature />
      <Bento />
      <Stats />
      <FAQ />
      <Footer />
    </>
  );
}

export default Home;
