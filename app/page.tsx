"use client";
import Hero from "@/components/home/Hero";
import Bento from "@/components/home/Bento";
import Feature from "@/components/home/Feature";
import FAQ from "@/components/home/FAQ";
import Stats from "@/components/home/Stats";
import Footer from "@/components/home/Footer";
import Navbar from "@/components/home/Navbar";

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
