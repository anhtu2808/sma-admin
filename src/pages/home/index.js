import React from 'react';
import Navbar from './components/NavbarHome';
import Hero from './components/HeroHome';
import Stats from './components/StatsHome';
import Features from './components/FeaturesHome';
import FeatureSpotlight from './components/FeatureSpotlightHome';
import CTA from './components/CTAHome';
import Footer from './components/FooterHome';

const Home = () => {
  return (
    <div className="min-h-screen bg-white dark:bg-background-dark font-sans selection:bg-primary/20">
      <Navbar />
      <Hero />
      <Stats />
      <Features />
      <FeatureSpotlight />
      <CTA />
      <Footer />
    </div>
  );
};

export default Home;
