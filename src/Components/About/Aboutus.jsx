"use client";
import React, { useState, useEffect, useRef } from "react";
import {
  Leaf,
  Heart,
  Shield,
  Users,
  Award,
  Eye,
  ChevronRight,
  Star,
  Sparkles,
} from "lucide-react";
import AboutHeroSection from "./Abouthero";
import Link from "next/link";

const AboutUsPage = () => {
  const [isVisible, setIsVisible] = useState({});
  const [activeTeamMember, setActiveTeamMember] = useState(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [hoveredFeature, setHoveredFeature] = useState(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible((prev) => ({
              ...prev,
              [entry.target.id]: true,
            }));
          }
        });
      },
      { threshold: 0.1 }
    );

    const elements = document.querySelectorAll("[data-animate]");
    elements.forEach((el) => observer.observe(el));

    // Mouse movement tracking
    const handleMouseMove = (e) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener("mousemove", handleMouseMove);

    return () => {
      observer.disconnect();
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, []);

  const features = [
    {
      icon: <Award size={32} />,
      title: "Quality You Can Trust",
      description:
        "Every product is made with premium, handpicked ingredients to ensure maximum effectiveness and safety.",
      color: "from-yellow-400 to-orange-500",
      bgColor: "bg-yellow-50",
    },
    {
      icon: <Leaf size={32} />,
      title: "Eco-Conscious Practices",
      description:
        "We prioritize sustainability with plant-based, cruelty-free, and non-toxic formulations that care for you and the planet.",
      color: "from-green-400 to-emerald-500",
      bgColor: "bg-green-50",
    },
    {
      icon: <Shield size={32} />,
      title: "Scientifically Backed",
      description:
        "Our formulations are rooted in traditional herbal remedies and validated through rigorous scientific research.",
      color: "from-blue-400 to-indigo-500",
      bgColor: "bg-blue-50",
    },
    {
      icon: <Heart size={32} />,
      title: "Holistic Wellness Focus",
      description:
        "Addressing your well-being inside and out, we provide solutions for long-term health and vitality.",
      color: "from-pink-400 to-rose-500",
      bgColor: "bg-pink-50",
    },
    {
      icon: <Eye size={32} />,
      title: "Transparency & Purity",
      description:
        "With Earthsome, you get products free from artificial additives, crafted with pure and ethically sourced ingredients.",
      color: "from-purple-400 to-violet-500",
      bgColor: "bg-purple-50",
    },
  ];

  const teamMembers = [
    {
      name: "Dr. Kamalkumar Varsani",
      role: "Founder & Visionary",
      description:
        "A visionary with a zest to nurture human life with the power of nature's best ingredients and applying best of technology to create international standard quality products. Graduate in Homeopathic medicine & surgery with 15+ years of experience.",
      image:
        "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=400&h=400&fit=crop&crop=face",
      specialty: "Homeopathic Medicine",
      experience: "15+ Years",
    },
    {
      name: "Dr. V.B. Varsani",
      role: "Senior Medical Practitioner",
      description:
        "A medical practitioner with more than 26 years of experience, passionate about promoting wellness and educating patients about preventive measures and lifestyle changes.",
      image:
        "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=400&h=400&fit=crop&crop=face",
      specialty: "Preventive Medicine",
      experience: "26+ Years",
    },
    {
      name: "Dr. Manishkumar Vidja",
      role: "Ayurveda Specialist",
      description:
        "M.D. in basic principles of Ayurveda, practicing natural way of living using ayurvedic path for more than 15 years. Expert in natural elements integration.",
      image:
        "https://images.unsplash.com/photo-1582750433449-648ed127bb54?w=400&h=400&fit=crop&crop=face",
      specialty: "Ayurveda",
      experience: "15+ Years",
    },
    {
      name: "Mr. Smit Varsani",
      role: "Business Director",
      description:
        "Graduate in Business Administration with passion for quality, honesty, dedication, and discipline. Expertise in brand growth and team development.",
      image:
        "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop&crop=face",
      specialty: "Business Strategy",
      experience: "Business Admin",
    },
    {
      name: "Dr. Krutarth Varsani",
      role: "Product Development",
      description:
        "The youngest team member bringing fresh perspective to product development with understanding of latest health and wellness trends.",
      image:
        "https://images.unsplash.com/photo-1568602471122-7832951cc4c5?w=400&h=400&fit=crop&crop=face",
      specialty: "Innovation",
      experience: "New Generation",
    },
    {
      name: "Dr. Kanan Varsani",
      role: "Nutraceutical Specialist",
      description:
        "Medical officer with government hospital experience, pursuing MD in Ophthalmology. Expert in eye health nutrition and nutraceutical products.",
      image:
        "https://plus.unsplash.com/premium_photo-1658506671316-0b293df7c72b?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      specialty: "Ophthalmology",
      experience: "Government Hospital",
    },

    {
      name: "Mr. Kevin Varsani",
      role: "Marketing & Strategy",
      description:
        "Mechanical Engineering graduate mastering strategic planning, market research, and product management. Social media expert crafting impactful campaigns.",
      image:
        "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop&crop=face",
      specialty: "Digital Marketing",
      experience: "Mechanical Eng.",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-green-50 relative overflow-hidden">
      <AboutHeroSection />

      {/* Floating Background Elements */}
      <div className="fixed inset-0 pointer-events-none">
        <div
          className="absolute w-4 h-4 bg-green-300 rounded-full opacity-20 animate-pulse"
          style={{
            left: mousePosition.x * 0.01 + "px",
            top: mousePosition.y * 0.01 + "px",
            transition: "all 0.3s ease",
          }}
        />
        <div
          className="absolute w-6 h-6 bg-green-400 rounded-full opacity-15 animate-bounce"
          style={{
            right: mousePosition.x * 0.005 + "px",
            top: mousePosition.y * 0.008 + "px",
            transition: "all 0.5s ease",
          }}
        />
      </div>

      {/* Story Section - Redesigned */}
      <section className="py-24 relative">
        <div className="container mx-auto px-6">
          <div className="max-w-7xl mx-auto">
            <div
              id="story-header"
              data-animate
              className={`text-center mb-16 transform transition-all duration-1000 ${
                isVisible["story-header"]
                  ? "translate-y-0 opacity-100"
                  : "translate-y-12 opacity-0"
              }`}
            >
              
              <h2 className="text-5xl font-bold text-gray-900 pb-8 bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
               Our Journey
            </h2>
            </div>

            <div className="grid lg:grid-cols-2 gap-16 items-center">
              <div
                id="story-content"
                data-animate
                className={`transform transition-all duration-1000 delay-200 ${
                  isVisible["story-content"]
                    ? "translate-x-0 opacity-100"
                    : "-translate-x-12 opacity-0"
                }`}
              >
                <div className="relative">
                  <div className="absolute -left-4 top-0 w-1 h-full bg-gradient-to-b from-green-400 to-emerald-600 rounded-full"></div>
                  <div className="pl-8">
                    <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-8 shadow-xl border border-green-100">
                      <div className="flex items-center gap-3 mb-6">
                        <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
                        <span className="text-green-600 font-semibold">
                          Founded in 2022
                        </span>
                      </div>

                      <p className="text-gray-700 text-lg mb-6 leading-relaxed">
                        Founded by a family of visionary doctors, our mission is
                        to harness the power of plant-based extracts and offer
                        non-toxic, cruelty-free solutions that blend modern
                        science with traditional Indian herbal wisdom.
                      </p>

                      <p className="text-gray-700 text-lg mb-8 leading-relaxed">
                        At Earthsome, we aim to address health concerns
                        holistically, promoting long-term wellness through
                        innovative and sustainable products. Our range
                        encourages simple yet impactful lifestyle changes that
                        benefit both you and the planet.
                      </p>

                      <div className="flex items-center gap-4 p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-2xl">
                        <div className="bg-green-500 p-3 rounded-full">
                          <Users className="w-6 h-6 text-white" />
                        </div>
                        <div>
                          <h3 className="font-bold text-gray-900 text-lg">
                            Family Founded
                          </h3>
                          <p className="text-green-600 font-medium">
                            Built by doctors who care
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div
                id="story-visual"
                data-animate
                className={`transform transition-all duration-1000 delay-400 ${
                  isVisible["story-visual"]
                    ? "translate-x-0 opacity-100"
                    : "translate-x-12 opacity-0"
                }`}
              >
                <div className="relative group">
                  <div className="absolute -inset-4 bg-gradient-to-r from-green-400 to-emerald-600 rounded-3xl blur opacity-25 group-hover:opacity-40 transition-opacity duration-300"></div>
                  <div className="relative bg-white rounded-3xl p-4 shadow-2xl">
                    <img
                      src="https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=600&h=400&fit=crop"
                      alt="Natural herbs and plants"
                      className="rounded-2xl w-full h-80 object-cover"
                    />
                    <div className="absolute inset-4 bg-gradient-to-t from-green-900/30 via-transparent to-transparent rounded-2xl flex items-end">
                      <div className="text-white p-6">
                        <div className="flex items-center gap-2 mb-2">
                          <Leaf className="w-5 h-5" />
                          <span className="font-semibold">Nature's Wisdom</span>
                        </div>
                        <p className="text-green-100">
                          Traditional herbs meet modern science
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section - Redesigned */}
      <section className="py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50"></div>
        <div className="container mx-auto px-6 relative">
          <div
            id="features-header"
            data-animate
            className={`text-center mb-20 transform transition-all duration-1000 ${
              isVisible["features-header"]
                ? "translate-y-0 opacity-100"
                : "translate-y-12 opacity-0"
            }`}
          >
            
            <h2 className="text-5xl font-bold text-gray-900 pb-8 bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
              Why Choose EARTHSOME?
            </h2>
            {/* <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Discover what makes our approach to natural wellness unique and
              trusted by thousands of satisfied customers.
            </p> */}
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {features.map((feature, index) => (
              <div
                key={index}
                id={`feature-${index}`}
                data-animate
                className={`group relative transform transition-all duration-700 hover:scale-105 ${
                  isVisible[`feature-${index}`]
                    ? "translate-y-0 opacity-100"
                    : "translate-y-12 opacity-0"
                }`}
                style={{ transitionDelay: `${index * 150}ms` }}
                onMouseEnter={() => setHoveredFeature(index)}
                onMouseLeave={() => setHoveredFeature(null)}
              >
                <div
                  className={`relative bg-white/90 backdrop-blur-sm rounded-3xl p-8 shadow-xl border border-gray-100 h-full transition-all duration-500 ${
                    hoveredFeature === index ? "shadow-2xl -translate-y-2" : ""
                  }`}
                >
                  {/* Animated Background */}
                  <div
                    className={`absolute inset-0 bg-gradient-to-br ${feature.color} opacity-0 group-hover:opacity-5 rounded-3xl transition-opacity duration-500`}
                  ></div>

                  {/* Icon */}
                  <div
                    className={`relative w-20 h-20 rounded-2xl flex items-center justify-center mb-6 ${feature.bgColor} group-hover:bg-white transition-all duration-500`}
                  >
                    <div
                      className={`bg-gradient-to-br ${feature.color} bg-clip-text text-transparent group-hover:scale-110 transition-transform duration-300`}
                    >
                      {feature.icon}
                    </div>
                  </div>

                  {/* Content */}
                  <h3 className="text-2xl font-bold text-gray-900 mb-4 group-hover:text-green-700 transition-colors duration-300">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600 leading-relaxed group-hover:text-gray-700 transition-colors duration-300">
                    {feature.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team Section - Redesigned */}
      <section className="py-24 bg-white relative">
        <div className="container mx-auto px-6">
          <div
            id="team-header"
            data-animate
            className={`text-center mb-20 transform transition-all duration-1000 ${
              isVisible["team-header"]
                ? "translate-y-0 opacity-100"
                : "translate-y-12 opacity-0"
            }`}
          >
            {/* <div className="inline-flex items-center gap-2 bg-gradient-to-r from-green-100 to-emerald-100 px-6 py-3 rounded-full text-green-700 font-medium mb-6">
              <Users className="w-5 h-5" />
              Our Expert Team
            </div> */}
             <h2 className="text-5xl font-bold text-gray-900 pb-8 bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
               Our Expert Team
            </h2>


            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              The passionate professionals behind Earthsome's mission to bring
              nature's best to your wellness journey.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 max-w-7xl mx-auto">
            {teamMembers.map((member, index) => (
              <div
                key={index}
                id={`team-${index}`}
                data-animate
                className={`group cursor-pointer transform transition-all duration-700 hover:scale-105 ${
                  isVisible[`team-${index}`]
                    ? "translate-y-0 opacity-100"
                    : "translate-y-12 opacity-0"
                }`}
                style={{ transitionDelay: `${index * 100}ms` }}
                onClick={() =>
                  setActiveTeamMember(activeTeamMember === index ? null : index)
                }
              >
                <div className="relative bg-white rounded-3xl p-6 shadow-lg hover:shadow-2xl transition-all duration-500 border border-gray-100 overflow-hidden">
                  {/* Background Pattern */}
                  <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-green-400/10 to-emerald-500/10 rounded-full transform translate-x-8 -translate-y-8 group-hover:scale-150 transition-transform duration-700"></div>

                  {/* Profile Image */}
                  <div className="relative mb-6">
                    <div className="relative w-24 h-24 mx-auto">
                      <img
                        src={member.image}
                        alt={member.name}
                        className="w-full h-full rounded-2xl object-cover ring-4 ring-green-100 group-hover:ring-green-200 transition-all duration-300"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-green-600/20 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    </div>

                    {/* Status Badges */}
                    <div className="absolute -top-2 -right-2 bg-green-500 text-white px-2 py-1 rounded-full text-xs font-medium">
                      {member.experience}
                    </div>
                  </div>

                  {/* Content */}
                  <div className="text-center">
                    <h3 className="text-lg font-bold text-gray-900 mb-1 group-hover:text-green-700 transition-colors duration-300">
                      {member.name}
                    </h3>
                    <p className="text-green-600 font-medium mb-2">
                      {member.role}
                    </p>
                    <div className="text-xs text-gray-500 bg-gray-50 px-3 py-1 rounded-full inline-block mb-3">
                      {member.specialty}
                    </div>

                    <div
                      className={`transition-all duration-500 overflow-hidden ${
                        activeTeamMember === index
                          ? "max-h-96 opacity-100"
                          : "max-h-0 opacity-0"
                      }`}
                    >
                      <p className="text-gray-600 text-sm leading-relaxed pt-3 border-t border-gray-100">
                        {member.description}
                      </p>
                    </div>

                    {/* Expand Indicator */}
                    <div className="mt-3 flex justify-center">
                      <div
                        className={`w-6 h-6 rounded-full border-2 border-green-300 flex items-center justify-center transition-all duration-300 ${
                          activeTeamMember === index
                            ? "rotate-180 bg-green-500 border-green-500"
                            : "group-hover:border-green-500"
                        }`}
                      >
                        <ChevronRight
                          className={`w-3 h-3 transition-colors duration-300 ${
                            activeTeamMember === index
                              ? "text-white"
                              : "text-green-500"
                          }`}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Community Section - Redesigned */}
      <section className="py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-green-600 via-green-700 to-emerald-800"></div>

        {/* Animated Background Elements */}
        <div className="absolute inset-0">
          <div className="absolute top-20 left-20 w-8 h-8 bg-white/10 rounded-full animate-pulse"></div>
          <div className="absolute top-40 right-32 w-12 h-12 bg-white/10 rounded-full animate-bounce"></div>
          <div className="absolute bottom-32 left-1/3 w-6 h-6 bg-white/10 rounded-full animate-pulse delay-1000"></div>
          <div className="absolute bottom-20 right-1/4 w-10 h-10 bg-white/10 rounded-full animate-bounce delay-1500"></div>

          {/* Floating Shapes */}
          <div className="absolute top-1/4 left-1/4 w-32 h-32 bg-white/5 rounded-full blur-xl animate-pulse"></div>
          <div className="absolute bottom-1/4 right-1/4 w-40 h-40 bg-white/5 rounded-full blur-xl animate-pulse delay-700"></div>
        </div>

        <div className="container mx-auto px-6 relative z-10">
          <div
            id="community"
            data-animate
            className={`text-center text-white transform transition-all duration-1000 ${
              isVisible.community
                ? "translate-y-0 opacity-100"
                : "translate-y-12 opacity-0"
            }`}
          >
            <div className="max-w-4xl mx-auto">
              {/* <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm px-6 py-3 rounded-full text-white font-medium mb-8">
                <Heart className="w-5 h-5" />
                Join Our Community
              </div> */}

              <h2 className="text-5xl font-bold mb-8 leading-tight">
                Join the Earthsome Community
              </h2>
              <p className="text-xl mb-12 max-w-3xl mx-auto leading-relaxed opacity-90">
                When you choose Earthsome, you're becoming part of a community
                focused on natural wellness and sustainable living. We believe
                that the journey to better health starts with small, meaningful
                choices, and we're here to guide you through every step.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8 mt-16 max-w-5xl mx-auto">
              {[
                {
                  icon: <Leaf className="w-8 h-8" />,
                  title: "Natural Products",
                  desc: "Plant-based solutions for your wellness needs",
                },
                {
                  icon: <Heart className="w-8 h-8" />,
                  title: "Holistic Approach",
                  desc: "Complete wellness solutions for mind and body",
                },
                {
                  icon: <Shield className="w-8 h-8" />,
                  title: "Trusted Quality",
                  desc: "Scientifically backed, premium ingredients",
                },
              ].map((item, index) => (
                <div key={index} className="group">
                  <div className="bg-white/10 backdrop-blur-sm rounded-3xl p-8 hover:bg-white/20 transition-all duration-500 border border-white/20 hover:border-white/40">
                    <div className="bg-white/20 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                      {item.icon}
                    </div>
                    <h3 className="text-xl font-bold mb-3">{item.title}</h3>
                    <p className="opacity-90 leading-relaxed">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-16">
              <button className="group bg-white text-green-600 px-10 py-5 rounded-2xl font-bold text-lg hover:bg-green-50 transform hover:scale-105 transition-all duration-300 shadow-2xl hover:shadow-3xl relative overflow-hidden">
                <span className="relative z-10 flex items-center gap-2">
                  <Link href="/Contact"> Start Your Wellness Journey</Link>
                  <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
                </span>
                <div className="absolute inset-0 bg-gradient-to-r from-green-500 to-emerald-500 opacity-0 group-hover:opacity-10 transition-opacity duration-300"></div>
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default AboutUsPage;
