import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Search, MapPin, CheckCircle2,
  Zap, Shield, BarChart3,
  Briefcase, Users, Layout,
  Twitter, Facebook, Linkedin,
  Menu, X
} from 'lucide-react';
import Button from '@/components/Button/index.tsx';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="flex items-center justify-between px-6 py-4 max-w-7xl mx-auto">
      <div className="flex items-center gap-2">
        <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center text-white font-bold">
          <Zap size={20} fill="currentColor" />
        </div>
        <span className="font-heading font-bold text-xl text-neutral-900 dark:text-white">SmartRecruit</span>
      </div>

      {/* Desktop Menu */}
      <div className="hidden md:flex items-center gap-8 font-medium text-sm text-neutral-600 dark:text-neutral-300">
        <Link to="#" className="hover:text-primary transition-colors">Jobs</Link>
        <Link to="#" className="hover:text-primary transition-colors">For Candidates</Link>
        <Link to="#" className="hover:text-primary transition-colors">For Recruiters</Link>
        <Link to="#" className="hover:text-primary transition-colors">AI Matching</Link>
        <Link to="#" className="hover:text-primary transition-colors">Pricing</Link>
        <Link to="#" className="hover:text-primary transition-colors">About</Link>
      </div>

      <div className="hidden md:flex items-center gap-4">
        <Link to="/login" className="text-sm font-semibold text-neutral-900 dark:text-white hover:text-primary transition-colors">
          Login
        </Link>
        <Link to="/signup">
          <Button mode="primary" className="!px-6 !py-2 !rounded-lg !text-sm">
            Sign Up
          </Button>
        </Link>
      </div>

      {/* Mobile Menu Button */}
      <button className="md:hidden text-neutral-900 dark:text-white" onClick={() => setIsOpen(!isOpen)}>
        {isOpen ? <X /> : <Menu />}
      </button>
    </nav>
  );
};

const Hero = () => {
  return (
    <section className="px-6 py-12 md:py-20 max-w-7xl mx-auto grid md:grid-cols-2 gap-12 items-center">
      <div className="space-y-8">
        <div className="text-primary font-bold tracking-wider text-sm uppercase">Future of Work</div>
        <h1 className="text-5xl md:text-6xl font-heading font-extrabold text-neutral-900 dark:text-white leading-tight">
          Smart Hiring.<br />
          Better Matches.<br />
          Faster Decisions.
        </h1>
        <p className="text-lg text-neutral-600 dark:text-neutral-400 leading-relaxed max-w-lg">
          Our AI-powered platform connects the right talent with the right opportunities instantly. Experience 95% matching accuracy today.
        </p>

        <div className="flex gap-4">
          <Button mode="primary">Find Jobs</Button>
          <Button mode="secondary">Post a Job</Button>
        </div>

        <div className="bg-white p-2 rounded-xl shadow-soft border border-neutral-100 flex flex-col md:flex-row gap-2 max-w-xl">
          <div className="flex items-center gap-2 px-4 py-3 bg-neutral-50 rounded-lg flex-1">
            <Search className="text-neutral-400" size={20} />
            <input
              type="text"
              placeholder="Job Title, Keywords, or Company"
              className="bg-transparent border-none outline-none w-full text-sm text-neutral-900 placeholder-neutral-400"
            />
          </div>
          <div className="flex items-center gap-2 px-4 py-3 bg-neutral-50 rounded-lg flex-1">
            <MapPin className="text-neutral-400" size={20} />
            <input
              type="text"
              placeholder="City, State, or Zip"
              className="bg-transparent border-none outline-none w-full text-sm text-neutral-900 placeholder-neutral-400"
            />
          </div>
          <button className="bg-neutral-900 text-white px-8 py-3 rounded-lg font-semibold hover:bg-neutral-800 transition-colors">
            Search
          </button>
        </div>
      </div>

      <div className="relative">
        <div className="bg-[#E88D67] rounded-[2rem] p-8 md:p-12 aspect-[4/3] relative overflow-hidden">
          {/* Abstract Shapes */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-2xl"></div>
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-purple-500/10 rounded-full translate-y-1/2 -translate-x-1/2 blur-2xl"></div>

          {/* Mock UI Card */}
          <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 shadow-xl max-w-sm mx-auto mt-8 relative z-10">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-12 bg-neutral-200 rounded-full overflow-hidden">
                <img src="https://i.pravatar.cc/150?u=1" alt="Candidate" className="w-full h-full object-cover" />
              </div>
              <div>
                <div className="h-4 w-32 bg-neutral-200 rounded mb-2"></div>
                <div className="h-3 w-20 bg-neutral-100 rounded"></div>
              </div>
            </div>
            <div className="space-y-3">
              <div className="h-3 w-full bg-neutral-100 rounded"></div>
              <div className="h-3 w-5/6 bg-neutral-100 rounded"></div>
            </div>
          </div>

          <div className="absolute bottom-12 right-12 bg-white p-4 rounded-xl shadow-lg flex items-center gap-3 z-20 animate-bounce cursor-pointer">
            <div className="text-xs font-semibold uppercase text-neutral-500">Match Found</div>
            <div className="text-sm font-bold text-neutral-900">Senior Product Designer</div>
            <span className="text-green-500 text-xs font-bold bg-green-50 px-2 py-1 rounded-full">98% Match</span>
          </div>
        </div>
      </div>
    </section>
  );
};

const Stats = () => {
  return (
    <div className="py-12 border-y border-neutral-100 bg-white">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center text-xs font-bold text-neutral-400 uppercase tracking-widest mb-8">Trusted by Leading Companies</div>
        <div className="flex flex-wrap justify-center gap-8 md:gap-16 opacity-50 grayscale hover:grayscale-0 transition-all duration-500 mb-16">
          {['ACME Corp', 'GlobalTech', 'Nebula', 'Orbit', 'BlockSystems'].map((company) => (
            <div key={company} className="flex items-center gap-2 font-bold text-xl text-neutral-400">
              <div className="w-6 h-6 bg-neutral-300 rounded-full"></div> {company}
            </div>
          ))}
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center divide-x divide-neutral-100">
          {[
            { label: 'Active Candidates', value: '10k+' },
            { label: 'Match Accuracy', value: '95%' },
            { label: 'Faster Hiring', value: '50%' },
            { label: 'AI Screening', value: '24/7' },
          ].map((stat) => (
            <div key={stat.label}>
              <div className="text-3xl md:text-4xl font-extrabold text-primary mb-2">{stat.value}</div>
              <div className="text-sm text-neutral-500 font-medium">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

const Features = () => {
  const features = [
    { icon: <Briefcase className="text-primary" />, title: 'AI Matching', desc: 'Proprietary algorithms match candidates to jobs with high precision based on skills.' },
    { icon: <Zap className="text-primary" />, title: 'Lightning Speed', desc: 'Reduce time-to-hire by up to 50% with automated screening and instant shortlisting.' },
    { icon: <Shield className="text-primary" />, title: 'Trusted Security', desc: 'Enterprise-grade security ensuring your candidate data privacy and compliance standards.' },
    { icon: <BarChart3 className="text-primary" />, title: 'Growth Analytics', desc: 'Insightful dashboards to track hiring metrics, team performance, and recruitment ROI.' },
  ];

  return (
    <section className="py-20 bg-surface-light dark:bg-neutral-900">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h2 className="text-3xl md:text-4xl font-heading font-bold mb-4 text-neutral-900 dark:text-white">Why Recruiters Choose SmartRecruit</h2>
          <p className="text-neutral-600 dark:text-neutral-400 text-lg">Experience the difference with our cutting-edge technology designed to streamline your hiring process.</p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, i) => (
            <div key={i} className="bg-white dark:bg-neutral-800 p-8 rounded-2xl shadow-soft hover:shadow-lg transition-shadow border border-neutral-100 dark:border-neutral-700">
              <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mb-6">
                {feature.icon}
              </div>
              <h3 className="font-bold text-xl mb-3 text-neutral-900 dark:text-white">{feature.title}</h3>
              <p className="text-sm text-neutral-500 dark:text-neutral-400 leading-relaxed">{feature.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

const FeatureSpotlight = () => {
  return (
    <section className="py-20 overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 grid lg:grid-cols-2 gap-16 items-center">
        <div>
          <div className="inline-block px-3 py-1 rounded-full bg-orange-100 text-orange-600 text-xs font-bold uppercase tracking-wider mb-6">
            AI Powered Precision
          </div>
          <h2 className="text-4xl md:text-5xl font-heading font-bold mb-6 text-neutral-900 dark:text-white">See Beyond the Resume</h2>
          <p className="text-lg text-neutral-600 dark:text-neutral-400 leading-relaxed mb-8">
            Our AI analyzes skills, experience, and cultural fit to provide a comprehensive match score.
            We highlight transferable skills that traditional keyword searches miss.
          </p>

          <div className="space-y-4">
            {[
              { title: 'Skill Gap Analysis', desc: 'Instantly see what skills a candidate has versus what the role requires.' },
              { title: 'Cultural Fit Prediction', desc: 'Assess soft skills and work style compatibility.' }
            ].map((item, i) => (
              <div key={i} className="flex gap-4">
                <div className="flex-shrink-0 mt-1">
                  <CheckCircle2 className="text-primary" size={24} />
                </div>
                <div>
                  <h4 className="font-bold text-neutral-900 dark:text-white">{item.title}</h4>
                  <p className="text-sm text-neutral-500 dark:text-neutral-400">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-8">
            <Button mode="primary" className="!px-6">Learn more about AI</Button>
          </div>
        </div>

        <div className="relative">
          <div className="bg-slate-300 rounded-3xl p-8 md:p-12 shadow-2xl skew-y-3 transform hover:skew-y-0 transition-transform duration-700">
            {/* Mock Dashboard UI */}
            <div className="bg-white rounded-xl p-6 shadow-sm">
              <div className="flex justify-between items-start mb-6">
                <div className="flex gap-4">
                  <img src="https://i.pravatar.cc/150?u=2" alt="Candidate" className="w-12 h-12 rounded-full ring-2 ring-primary bg-neutral-100" />
                  <div>
                    <div className="font-bold text-neutral-900">Sarah Jenkins</div>
                    <div className="text-xs text-neutral-500">UX Researcher</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-extrabold text-primary">94%</div>
                  <div className="text-[10px] uppercase font-bold text-neutral-400">Match Score</div>
                </div>
              </div>

              <div className="space-y-4">
                {[
                  { l: 'User Research', w: '90%', t: 'Expert' },
                  { l: 'Data Analysis', w: '75%', t: 'Advanced' },
                  { l: 'Prototyping', w: '40%', t: 'Intermediate' }
                ].map((s, i) => (
                  <div key={i}>
                    <div className="flex justify-between text-xs font-semibold mb-1">
                      <span>{s.l}</span>
                      <span>{s.t}</span>
                    </div>
                    <div className="h-2 bg-neutral-100 rounded-full overflow-hidden">
                      <div className="h-full bg-gradient-to-r from-primary to-orange-400" style={{ width: s.w }}></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

const CTA = () => {
  return (
    <section className="py-24 bg-primary text-white text-center px-6">
      <div className="max-w-3xl mx-auto">
        <h2 className="text-4xl font-heading font-extrabold mb-6">Ready to Transform Your Hiring?</h2>
        <p className="text-lg text-white/90 mb-10">Join thousands of companies and job seekers who have found their perfect match with SmartRecruit.</p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button className="px-8 py-3 bg-white text-primary font-bold rounded-lg shadow-lg hover:bg-neutral-50 transition-colors">
            Join as Candidate
          </button>
          <button className="px-8 py-3 bg-transparent border-2 border-white text-white font-bold rounded-lg hover:bg-white/10 transition-colors">
            Join as Recruiter
          </button>
        </div>
      </div>
    </section>
  );
};

const Footer = () => {
  return (
    <footer className="bg-neutral-900 text-white py-16 px-6">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
        <div>
          <div className="flex items-center gap-2 mb-6">
            <div className="w-6 h-6 bg-primary rounded flex items-center justify-center text-white text-xs font-bold">
              <Zap size={14} fill="currentColor" />
            </div>
            <span className="font-heading font-bold text-lg">SmartRecruit</span>
          </div>
          <p className="text-neutral-400 text-sm leading-relaxed mb-6">
            The world's first fully autonomous AI recruitment platform. We help you build the team of your dreams.
          </p>
          <div className="flex gap-4">
            {[Twitter, Facebook, Linkedin].map((Icon, i) => (
              <a key={i} href="#" className="w-8 h-8 bg-neutral-800 rounded-full flex items-center justify-center hover:bg-primary transition-colors">
                <Icon size={14} />
              </a>
            ))}
          </div>
        </div>

        {[
          { h: 'Product', l: ['Features', 'Pricing', 'AI Engine', 'Case Studies'] },
          { h: 'Company', l: ['About Us', 'Careers', 'Press', 'Contact'] },
          { h: 'Resources', l: ['Blog', 'Help Center', 'API Documentation', 'Status'] }
        ].map((col) => (
          <div key={col.h}>
            <h4 className="font-bold mb-6">{col.h}</h4>
            <ul className="space-y-4 text-sm text-neutral-400">
              {col.l.map(x => <li key={x}><a href="#" className="hover:text-primary transition-colors">{x}</a></li>)}
            </ul>
          </div>
        ))}
      </div>
      <div className="border-t border-neutral-800 pt-8 flex flex-col md:flex-row justify-between items-center text-xs text-neutral-500">
        <div>© 2024 SmartRecruit Inc. All rights reserved.</div>
        <div className="flex gap-6 mt-4 md:mt-0">
          <a href="#" className="hover:text-white">Privacy Policy</a>
          <a href="#" className="hover:text-white">Terms of Curvey</a>
        </div>
      </div>
    </footer>
  );
};

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
