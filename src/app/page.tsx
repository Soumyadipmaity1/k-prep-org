import React from 'react';
import FeatureSection from "@/components/landingpage/Feature/FeatureSection";
import Team from "@/components/landingpage/Team/team";
import Testimonials from "@/components/landingpage/Testimonial/testinomial";
import { denkOne } from './font';
import dynamic from 'next/dynamic';
import Hero from '@/components/landingpage/Hero/Hero';
import Footer from '@/components/Footer/footer';
import Navbar from '@/components/Menubar/Navbar/Navbar';

export default function Home() {
  return (
    <div className={denkOne.className}>
      <Navbar />

<div className=''>
<Hero/>
      {/* <MaterialSlider/> */}
      <FeatureSection />
      <Testimonials />
      <Team />
      <Footer />

</div>
    </div>
  );
}
