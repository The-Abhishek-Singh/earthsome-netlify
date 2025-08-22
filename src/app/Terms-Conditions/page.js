"use client"
import React, { useEffect, useState } from 'react';
import { Shield, Lock, Users, Heart, Pill } from 'lucide-react';

const TermsConditionsPage = () => {
  const [visibleSections, setVisibleSections] = useState(new Set());

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setVisibleSections(prev => new Set(prev).add(entry.target.id));
          }
        });
      },
      { threshold: 0.1, rootMargin: '0px 0px -100px 0px' }
    );

    const elements = document.querySelectorAll('[data-animate]');
    elements.forEach(el => observer.observe(el));

    return () => observer.disconnect();
  }, []);

  const sections = [
    {
      id: 'personal',
      title: 'Personal Care Products',
      icon: <Heart className="w-5 h-5" />,
      policies: [
        'Products are for external use only',
        'Individual results may vary depending on skin type and usage',
        'A patch test is recommended before full application',
        'Offers, discounts and coupons are subject to change without prior notice'
      ]
    },
    {
      id: 'baby',
      title: 'Baby Care Products',
      icon: <Shield className="w-5 h-5" />,
      policies: [
        'All products are certified safe and dermatologically tested',
        'Usage should be as per age-appropriate guidelines listed on the product',
        'In case of allergies or irritation, consult a qualified paediatrician',
        'The company is not liable for product deterioration due to improper storage or misuse'
      ]
    },
    {
      id: 'nutraceutical',
      title: 'Nutraceutical Supplements',
      icon: <Pill className="w-5 h-5" />,
      policies: [
        'Products are not a substitute for professional medical advice',
        'Users should consult their physician before using any supplement, especially during pregnancy or breastfeeding',
        'Dosage must be strictly followed as mentioned on the label',
        'Not recommended for children unless explicitly stated'
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-white mb-[1000px] sm:mb-[700px] md:mb-[600px] lg:mb-[485px] mt-15">
      {/* Header */}
      <div className="max-w-4xl mx-auto px-6 py-20">
        <div className="text-center mb-20">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-green-500 rounded-full mb-8 shadow-lg shadow-green-200">
            <Lock className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-4xl md:text-5xl font-light text-gray-900 mb-6 tracking-tight">
            Terms & Conditions
          </h1>
          <p className="text-xl text-gray-500 font-light max-w-2xl mx-auto leading-relaxed">
            Please review our terms and conditions for each product category to ensure safe and proper usage.
          </p>
        </div>

        {/* Sections */}
        <div className="space-y-16">
          {sections.map((section, index) => (
            <div 
              key={section.id} 
              className="group"
              id={`section-${index}`}
              data-animate
            >
              {/* Section Header */}
              <div className={`flex items-center gap-4 mb-8 transition-all duration-700 ${
                visibleSections.has(`section-${index}`) 
                  ? 'opacity-100 translate-y-0' 
                  : 'opacity-0 translate-y-4'
              }`}>
                <div className="flex items-center justify-center w-12 h-12 bg-green-500 rounded-2xl shadow-md shadow-green-200 group-hover:shadow-lg group-hover:shadow-green-300 transition-all duration-300">
                  {React.cloneElement(section.icon, { className: "w-5 h-5 text-white" })}
                </div>
                <div>
                  <h2 className="text-2xl font-medium text-gray-900">
                    {section.title}
                  </h2>
                  <div className="h-0.5 w-12 bg-green-400 mt-2 rounded-full"></div>
                </div>
              </div>

              {/* Policies */}
              <div className="grid gap-6 ml-14">
                {section.policies.map((policy, pIndex) => (
                  <div 
                    key={pIndex}
                    className={`relative pl-6 py-4 border-l-2 border-gray-100 hover:border-green-200 transition-all duration-700 ${
                      visibleSections.has(`section-${index}`) 
                        ? 'opacity-100 translate-y-0' 
                        : 'opacity-0 translate-y-4'
                    }`}
                    style={{ transitionDelay: `${pIndex * 100 + 200}ms` }}
                  >
                    <div className="absolute left-[-5px] top-6 w-3 h-3 bg-green-400 rounded-full shadow-sm"></div>
                    <p className="text-gray-700 leading-relaxed font-light">
                      {policy}
                    </p>
                  </div>
                ))}
              </div>

              {/* Divider */}
              {index < sections.length - 1 && (
                <div className={`mt-16 h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent transition-all duration-700 ${
                  visibleSections.has(`section-${index}`) 
                    ? 'opacity-100' 
                    : 'opacity-0'
                }`} style={{ transitionDelay: '500ms' }}></div>
              )}
            </div>
          ))}
        </div>

        {/* Footer */}
        <div 
          className="mt-20 pt-12"
          id="footer-section"
          data-animate
        >
          <div className="text-center relative">
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-32 h-0.5 bg-gradient-to-r from-transparent via-green-300 to-transparent"></div>
            </div>
            <div className={`relative inline-flex items-center justify-center w-14 h-14 bg-green-500 rounded-2xl mb-8 shadow-lg shadow-green-200 transition-all duration-700 ${
              visibleSections.has('footer-section') 
                ? 'opacity-100 translate-y-0' 
                : 'opacity-0 translate-y-4'
            }`}>
              <Users className="w-7 h-7 text-white" />
            </div>
            <h3 className={`text-2xl font-medium text-gray-900 mb-4 transition-all duration-700 ${
              visibleSections.has('footer-section') 
                ? 'opacity-100 translate-y-0' 
                : 'opacity-0 translate-y-4'
            }`} style={{ transitionDelay: '200ms' }}>
              Questions about our terms?
            </h3>
            <p className={`text-gray-500 font-light mb-8 max-w-md mx-auto transition-all duration-700 ${
              visibleSections.has('footer-section') 
                ? 'opacity-100 translate-y-0' 
                : 'opacity-0 translate-y-4'
            }`} style={{ transitionDelay: '300ms' }}>
              Need clarification on any of our terms and conditions? We&apos;re here to help you understand our policies.
            </p>
            <button className={`inline-flex items-center px-8 py-3 bg-green-500 text-white font-medium rounded-full hover:bg-green-600 hover:shadow-lg hover:shadow-green-200 transition-all duration-300 transform hover:scale-105 ${
              visibleSections.has('footer-section') 
                ? 'opacity-100 translate-y-0' 
                : 'opacity-0 translate-y-4'
            }`} style={{ transitionDelay: '400ms' }}>
              Contact Support
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TermsConditionsPage;