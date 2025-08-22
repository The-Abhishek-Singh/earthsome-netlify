"use client"
import React, { useEffect, useState } from 'react';
import { Shield, Lock, Users, Heart, Pill } from 'lucide-react';

const PrivacyPolicyPage = () => {
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
        'Orders are dispatched within 1–2 business days after confirmation',
        'Delivery is typically completed within 3–7 working days, depending on the customer\'s location',
        'Free shipping is available on orders above ₹499; a shipping charge of ₹49 is applicable for lower-value orders',
        'All shipments are packed using leak-proof, hygienic and tamper-evident packaging materials',
        'Customers will receive real-time tracking updates via SMS and/or email after dispatch'
      ]
    },
    {
      id: 'baby',
      title: 'Baby Care Products',
      icon: <Shield className="w-5 h-5" />,
      policies: [
        'Orders are prioritized for same-day or next-day dispatch, ensuring timely delivery for sensitive products',
        'Delivery time ranges from 2–5 working days, depending on the region',
        'Orders are delivered with an OTP-based delivery verification system to ensure safe receipt',
        'Free shipping is applicable on orders above ₹499; otherwise, a nominal shipping charge may apply'
      ]
    },
    {
      id: 'nutraceutical',
      title: 'Nutraceutical Supplements',
      icon: <Pill className="w-5 h-5" />,
      policies: [
        'All orders are dispatched within 24 hours to ensure product freshness',
        'Cold chain logistics are used for temperature-sensitive/perishable products',
        'Delivery is completed within 2–6 working days',
        'Free shipping on orders above ₹999; shipping charge of ₹49 applies otherwise'
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
            Delivery Policy
          </h1>
          <p className="text-xl text-gray-500 font-light max-w-2xl mx-auto leading-relaxed">
            Learn about our delivery timelines, shipping charges, and special handling procedures for each product category.
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
              Questions about delivery?
            </h3>
            <p className={`text-gray-500 font-light mb-8 max-w-md mx-auto transition-all duration-700 ${
              visibleSections.has('footer-section') 
                ? 'opacity-100 translate-y-0' 
                : 'opacity-0 translate-y-4'
            }`} style={{ transitionDelay: '300ms' }}>
              Need help tracking your order or have questions about our delivery process? We&apos;re here to assist you.
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

export default PrivacyPolicyPage;