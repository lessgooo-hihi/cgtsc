import React, { useState, useEffect } from "react";
import "./App.css";
import axios from "axios";
import { Button } from "./components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./components/ui/card";
import { Badge } from "./components/ui/badge";
import { Separator } from "./components/ui/separator";
import { Globe, Phone, MapPin, GraduationCap, BookOpen, Bell, Menu, X } from "lucide-react";

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

// Bilingual content
const content = {
  en: {
    nav: {
      home: "Home",
      about: "About Us", 
      academics: "Academics",
      notices: "Notices",
      contact: "Contact"
    },
    hero: {
      title: "Chatkhil Government Technical School and College",
      subtitle: "Excellence in Technical Education",
      description: "Empowering students with quality technical education and building future leaders in technology and innovation.",
      cta: "Explore Programs"
    },
    about: {
      title: "About Our Institution",
      content: "Chatkhil Government Technical School and College is a premier educational institution dedicated to providing quality technical education. With modern facilities and experienced faculty, we prepare students for successful careers in various technical fields.",
      mission: "Our Mission",
      missionText: "To provide comprehensive technical education that combines theoretical knowledge with practical skills, fostering innovation and excellence in our students."
    },
    academics: {
      title: "Academic Programs",
      subtitle: "Comprehensive technical education across multiple disciplines",
      programs: [
        {
          title: "Computer Science & Technology",
          description: "Advanced computing, programming, and software development",
          duration: "4 Years"
        },
        {
          title: "Electrical Technology", 
          description: "Power systems, electronics, and electrical engineering",
          duration: "4 Years"
        },
        {
          title: "Mechanical Technology",
          description: "Manufacturing, automation, and mechanical systems",
          duration: "4 Years"
        },
        {
          title: "Civil Technology",
          description: "Construction, infrastructure, and civil engineering",
          duration: "4 Years"
        }
      ]
    },
    notices: {
      title: "Latest Notices",
      subtitle: "Stay updated with important announcements and events"
    },
    contact: {
      title: "Contact Information",
      address: "Address",
      addressText: "Maijdi - Ramgonj Rd, Dashgaria 3878",
      phone: "Phone",
      phoneText: "01825062230"
    },
    footer: {
      text: "© 2025 Chatkhil Government Technical School and College. All rights reserved."
    }
  },
  bn: {
    nav: {
      home: "হোম",
      about: "আমাদের সম্পর্কে",
      academics: "একাডেমিক",
      notices: "নোটিশ",
      contact: "যোগাযোগ"
    },
    hero: {
      title: "চাটখিল সরকারি কারিগরি স্কুল ও কলেজ",
      subtitle: "কারিগরি শিক্ষায় উৎকর্ষতা",
      description: "মানসম্পন্ন কারিগরি শিক্ষার মাধ্যমে শিক্ষার্থীদের ক্ষমতায়ন এবং প্রযুক্তি ও উদ্ভাবনে ভবিষ্যৎ নেতা তৈরি করা।",
      cta: "প্রোগ্রাম দেখুন"
    },
    about: {
      title: "আমাদের প্রতিষ্ঠান সম্পর্কে",
      content: "চাটখিল সরকারি কারিগরি স্কুল ও কলেজ একটি অগ্রণী শিক্ষা প্রতিষ্ঠান যা মানসম্পন্ন কারিগরি শিক্ষা প্রদানে নিবেদিত। আধুনিক সুবিধা এবং অভিজ্ঞ শিক্ষকমন্ডলী নিয়ে আমরা শিক্ষার্থীদের বিভিন্ন কারিগরি ক্ষেত্রে সফল ক্যারিয়ারের জন্য প্রস্তুত করি।",
      mission: "আমাদের লক্ষ্য",
      missionText: "তাত্ত্বিক জ্ঞানের সাথে ব্যবহারিক দক্ষতার সংমিশ্রণে ব্যাপক কারিগরি শিক্ষা প্রদান করা, আমাদের শিক্ষার্থীদের মধ্যে উদ্ভাবন ও উৎকর্ষতা বৃদ্ধি করা।"
    },
    academics: {
      title: "একাডেমিক প্রোগ্রাম",
      subtitle: "বহুবিধ শাখায় ব্যাপক কারিগরি শিক্ষা",
      programs: [
        {
          title: "কম্পিউটার সায়েন্স ও প্রযুক্তি",
          description: "উন্নত কম্পিউটিং, প্রোগ্রামিং এবং সফটওয়্যার ডেভেলপমেন্ট",
          duration: "৪ বছর"
        },
        {
          title: "ইলেকট্রিক্যাল প্রযুক্তি",
          description: "পাওয়ার সিস্টেম, ইলেকট্রনিক্স এবং ইলেকট্রিক্যাল ইঞ্জিনিয়ারিং",
          duration: "৪ বছর"  
        },
        {
          title: "মেকানিক্যাল প্রযুক্তি",
          description: "ম্যানুফ্যাকচারিং, অটোমেশন এবং মেকানিক্যাল সিস্টেম",
          duration: "৪ বছর"
        },
        {
          title: "সিভিল প্রযুক্তি", 
          description: "নির্মাণ, অবকাঠামো এবং সিভিল ইঞ্জিনিয়ারিং",
          duration: "৪ বছর"
        }
      ]
    },
    notices: {
      title: "সর্বশেষ নোটিশ",
      subtitle: "গুরুত্বপূর্ণ ঘোষণা এবং অনুষ্ঠানের সাথে আপডেট থাকুন"
    },
    contact: {
      title: "যোগাযোগের তথ্য",
      address: "ঠিকানা",
      addressText: "মাইজদী - রামগঞ্জ রোড, দাশগাড়িয়া ৩৮৭৮",
      phone: "ফোন",
      phoneText: "০১৮২৫০৬২২৩০"
    },
    footer: {
      text: "© ২০২৫ চাটখিল সরকারি কারিগরি স্কুল ও কলেজ। সকল অধিকার সংরক্ষিত।"
    }
  }
};

function App() {
  const [language, setLanguage] = useState('en');
  const [notices, setNotices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const currentContent = content[language];

  useEffect(() => {
    fetchNotices();
  }, []);

  const fetchNotices = async () => {
    try {
      const response = await axios.get(`${API}/notices`);
      setNotices(response.data);
    } catch (error) {
      console.error('Error fetching notices:', error);
    } finally {
      setLoading(false);
    }
  };

  const toggleLanguage = () => {
    setLanguage(language === 'en' ? 'bn' : 'en');
  };

  const scrollToSection = (sectionId) => {
    document.getElementById(sectionId)?.scrollIntoView({ behavior: 'smooth' });
    setMobileMenuOpen(false);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            {/* Logo */}
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-gradient-to-br from-emerald-600 to-teal-700 rounded-xl flex items-center justify-center">
                <GraduationCap className="w-7 h-7 text-white" />
              </div>
              <div className="hidden sm:block">
                <h1 className="text-xl font-bold text-gray-900">
                  {language === 'en' ? 'CGTSC' : 'চাটখিল কারিগরি'}
                </h1>
              </div>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-8">
              <button onClick={() => scrollToSection('home')} className="text-gray-700 hover:text-emerald-600 transition-colors font-medium">
                {currentContent.nav.home}
              </button>
              <button onClick={() => scrollToSection('about')} className="text-gray-700 hover:text-emerald-600 transition-colors font-medium">
                {currentContent.nav.about}
              </button>
              <button onClick={() => scrollToSection('academics')} className="text-gray-700 hover:text-emerald-600 transition-colors font-medium">
                {currentContent.nav.academics}
              </button>
              <button onClick={() => scrollToSection('notices')} className="text-gray-700 hover:text-emerald-600 transition-colors font-medium">
                {currentContent.nav.notices}
              </button>
              <button onClick={() => scrollToSection('contact')} className="text-gray-700 hover:text-emerald-600 transition-colors font-medium">
                {currentContent.nav.contact}
              </button>
            </nav>

            {/* Language Toggle & Mobile Menu */}
            <div className="flex items-center space-x-4">
              <Button
                onClick={toggleLanguage}
                variant="outline"
                size="sm"
                className="flex items-center space-x-2 hover:bg-emerald-50 border-emerald-200"
              >
                <Globe className="w-4 h-4" />
                <span className="font-medium">{language === 'en' ? 'বাংলা' : 'English'}</span>
              </Button>

              {/* Mobile menu button */}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="md:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
              >
                {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>

          {/* Mobile Navigation */}
          {mobileMenuOpen && (
            <div className="md:hidden py-4 border-t border-gray-200">
              <div className="flex flex-col space-y-4">
                <button onClick={() => scrollToSection('home')} className="text-left text-gray-700 hover:text-emerald-600 transition-colors font-medium py-2">
                  {currentContent.nav.home}
                </button>
                <button onClick={() => scrollToSection('about')} className="text-left text-gray-700 hover:text-emerald-600 transition-colors font-medium py-2">
                  {currentContent.nav.about}
                </button>
                <button onClick={() => scrollToSection('academics')} className="text-left text-gray-700 hover:text-emerald-600 transition-colors font-medium py-2">
                  {currentContent.nav.academics}
                </button>
                <button onClick={() => scrollToSection('notices')} className="text-left text-gray-700 hover:text-emerald-600 transition-colors font-medium py-2">
                  {currentContent.nav.notices}
                </button>
                <button onClick={() => scrollToSection('contact')} className="text-left text-gray-700 hover:text-emerald-600 transition-colors font-medium py-2">
                  {currentContent.nav.contact}
                </button>
              </div>
            </div>
          )}
        </div>
      </header>

      {/* Hero Section */}
      <section id="home" className="relative min-h-screen flex items-center justify-center overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: `url('https://images.unsplash.com/photo-1726390424945-6c4a40aa8ec6?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NTY2Njd8MHwxfHNlYXJjaHwzfHx0ZWNobmljYWwlMjBzY2hvb2wlMjBidWlsZGluZ3xlbnwwfHx8fDE3NTU4MzM5MTR8MA&ixlib=rb-4.1.0&q=85')`
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-emerald-900/80 to-teal-800/70" />
        
        <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-white mb-6 leading-tight">
            {currentContent.hero.title}
          </h1>
          <p className="text-xl md:text-2xl text-emerald-100 mb-8 font-medium">
            {currentContent.hero.subtitle}
          </p>
          <p className="text-lg md:text-xl text-white/90 mb-12 max-w-3xl mx-auto leading-relaxed">
            {currentContent.hero.description}
          </p>
          <Button 
            onClick={() => scrollToSection('academics')}
            size="lg"
            className="bg-emerald-600 hover:bg-emerald-700 text-white px-8 py-4 text-lg font-semibold rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
          >
            {currentContent.hero.cta}
          </Button>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-8">
                {currentContent.about.title}
              </h2>
              <p className="text-lg text-gray-600 mb-8 leading-relaxed">
                {currentContent.about.content}
              </p>
              
              <div className="bg-gradient-to-r from-emerald-50 to-teal-50 p-8 rounded-2xl border border-emerald-100">
                <h3 className="text-2xl font-bold text-emerald-800 mb-4 flex items-center">
                  <BookOpen className="w-6 h-6 mr-3" />
                  {currentContent.about.mission}
                </h3>
                <p className="text-emerald-700 leading-relaxed">
                  {currentContent.about.missionText}
                </p>
              </div>
            </div>
            
            <div className="relative">
              <div className="bg-gradient-to-br from-emerald-600 to-teal-700 rounded-3xl p-12 text-white shadow-2xl">
                <div className="text-center">
                  <GraduationCap className="w-20 h-20 mx-auto mb-6 opacity-90" />
                  <h3 className="text-3xl font-bold mb-4">
                    {language === 'en' ? 'Technical Excellence' : 'কারিগরি উৎকর্ষতা'}
                  </h3>
                  <p className="text-emerald-100 text-lg">
                    {language === 'en' 
                      ? 'Shaping tomorrow\'s technical leaders through innovation and excellence.' 
                      : 'উদ্ভাবন ও উৎকর্ষতার মাধ্যমে আগামীর কারিগরি নেতা তৈরি করা।'
                    }
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Academics Section */}
      <section id="academics" className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              {currentContent.academics.title}
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              {currentContent.academics.subtitle}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8">
            {currentContent.academics.programs.map((program, index) => (
              <Card key={index} className="group hover:shadow-xl transition-all duration-300 border-0 shadow-lg bg-white/70 backdrop-blur-sm hover:bg-white">
                <CardHeader className="pb-4">
                  <div className="flex justify-between items-start mb-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                      <BookOpen className="w-6 h-6 text-white" />
                    </div>
                    <Badge variant="secondary" className="bg-emerald-100 text-emerald-800 font-medium">
                      {program.duration}
                    </Badge>
                  </div>
                  <CardTitle className="text-xl font-bold text-gray-900 group-hover:text-emerald-700 transition-colors">
                    {program.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-gray-600 leading-relaxed">
                    {program.description}
                  </CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Notices Section */}
      <section id="notices" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6 flex items-center justify-center">
              <Bell className="w-10 h-10 mr-4 text-emerald-600" />
              {currentContent.notices.title}
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              {currentContent.notices.subtitle}
            </p>
          </div>

          {loading ? (
            <div className="flex justify-center items-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600"></div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {notices.map((notice, index) => (
                <Card key={index} className="hover:shadow-xl transition-all duration-300 border-0 shadow-lg bg-gradient-to-br from-white to-emerald-50/30">
                  <CardHeader>
                    <div className="flex items-start justify-between mb-2">
                      <Badge variant="outline" className="border-emerald-200 text-emerald-700 bg-emerald-50">
                        {new Date(notice.date).toLocaleDateString(language === 'bn' ? 'bn-BD' : 'en-US')}
                      </Badge>
                    </div>
                    <CardTitle className="text-lg font-bold text-gray-900 leading-tight">
                      {notice.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-600 leading-relaxed">
                      {notice.description}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-20 bg-gradient-to-br from-emerald-50 to-teal-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              {currentContent.contact.title}
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <Card className="p-8 shadow-xl border-0 bg-white/80 backdrop-blur-sm">
              <CardContent className="space-y-8">
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl flex items-center justify-center flex-shrink-0">
                    <MapPin className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">
                      {currentContent.contact.address}
                    </h3>
                    <p className="text-gray-600 leading-relaxed">
                      {currentContent.contact.addressText}
                    </p>
                  </div>
                </div>

                <Separator />

                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl flex items-center justify-center flex-shrink-0">
                    <Phone className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">
                      {currentContent.contact.phone}
                    </h3>
                    <p className="text-gray-600 leading-relaxed">
                      {currentContent.contact.phoneText}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="bg-gradient-to-br from-emerald-600 to-teal-700 rounded-3xl p-12 text-white shadow-2xl">
              <div className="text-center">
                <Phone className="w-16 h-16 mx-auto mb-6 opacity-90" />
                <h3 className="text-3xl font-bold mb-6">
                  {language === 'en' ? 'Get In Touch' : 'যোগাযোগ করুন'}
                </h3>
                <p className="text-emerald-100 text-lg mb-8 leading-relaxed">
                  {language === 'en' 
                    ? 'Have questions about our programs? Contact us for more information about admissions and courses.' 
                    : 'আমাদের প্রোগ্রাম সম্পর্কে প্রশ্ন আছে? ভর্তি এবং কোর্স সম্পর্কে আরও তথ্যের জন্য আমাদের সাথে যোগাযোগ করুন।'
                  }
                </p>
                <Button 
                  variant="secondary"
                  size="lg"
                  className="bg-white text-emerald-700 hover:bg-gray-100 font-semibold px-8 py-3 rounded-xl"
                >
                  {language === 'en' ? 'Contact Now' : 'এখনই যোগাযোগ করুন'}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center space-x-3 mb-4 md:mb-0">
              <div className="w-10 h-10 bg-gradient-to-br from-emerald-600 to-teal-700 rounded-lg flex items-center justify-center">
                <GraduationCap className="w-6 h-6 text-white" />
              </div>
              <span className="text-lg font-semibold">
                {language === 'en' ? 'CGTSC' : 'চাটখিল কারিগরি'}
              </span>
            </div>
            
            <p className="text-gray-400 text-center md:text-left">
              {currentContent.footer.text}
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;