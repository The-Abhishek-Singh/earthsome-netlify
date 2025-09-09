"use client"
import React, { useState, useEffect } from 'react';
import { ChevronDown, ChevronRight, Truck, RotateCcw, FileText, Shield, Heart, Baby, Pill, Users, Lock, Info, Star, CheckCircle } from 'lucide-react';
import Link from 'next/link';

const PolicyPage = () => {
  const [openSections, setOpenSections] = useState(new Set());
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
      { threshold: 0.1, rootMargin: '0px 0px -50px 0px' }
    );

    const elements = document.querySelectorAll('[data-animate]');
    elements.forEach(el => observer.observe(el));

    return () => observer.disconnect();
  }, []);

  const toggleSection = (sectionId) => {
    const newOpenSections = new Set(openSections);
    if (newOpenSections.has(sectionId)) {
      newOpenSections.delete(sectionId);
    } else {
      newOpenSections.add(sectionId);
    }
    setOpenSections(newOpenSections);
  };

  const policies = [
    {
      id: 'delivery',
      title: 'Delivery Policy',
      icon: <Truck className="w-6 h-6" />,
      color: 'green',
      categories: [
        {
          name: 'Personal Care Products',
          icon: <Heart className="w-5 h-5" />,
          points: [
            'Orders are dispatched within 1–2 business days after confirmation.',
            'Delivery is typically completed within 3–7 working days, depending on the customer\'s location.',
            'Free shipping is available on orders above ₹499; a shipping charge of ₹49 is applicable for lower-value orders.',
            'All shipments are packed using leak-proof, hygienic and tamper-evident packaging materials.',
            'Customers will receive real-time tracking updates via SMS and/or email after dispatch.'
          ]
        },
        {
          name: 'Baby Care Products',
          icon: <Baby className="w-5 h-5" />,
          points: [
            'Orders are prioritized for same-day or next-day dispatch, ensuring timely delivery for sensitive products.',
            'Delivery time ranges from 2–5 working days, depending on the region.',
            'Orders are delivered with an OTP-based delivery verification system to ensure safe receipt.',
            'Free shipping is applicable on orders above ₹499; otherwise, a nominal shipping charge may apply.'
          ]
        },
        {
          name: 'Nutraceutical Supplements',
          icon: <Pill className="w-5 h-5" />,
          points: [
            'All orders are dispatched within 24 hours to ensure product freshness.',
            'Cold chain logistics are used for temperature-sensitive/perishable products.',
            'Delivery is completed within 2–6 working days.',
            'Free shipping on orders above ₹999; shipping charge of ₹49 applies otherwise.'
          ]
        }
      ]
    },
    {
      id: 'refund',
      title: 'Refund & Cancellation Policy',
      icon: <RotateCcw className="w-6 h-6" />,
      color: 'emerald',
      categories: [
        {
          name: 'Personal Care Products',
          icon: <Heart className="w-5 h-5" />,
          points: [
            'Orders can be cancelled only before dispatch. Post-dispatch cancellations are not accepted.',
            'Returns are not allowed for opened, used or tampered products due to hygiene reasons.',
            'Refunds or replacements are offered for items received in a damaged, incorrect or defective condition.',
            'Issues must be reported within 24 hours of delivery along with photographic or video evidence.',
            'Refunds are processed within 5–7 business days from the approval of the return request.'
          ]
        },
        {
          name: 'Baby Care Products',
          icon: <Baby className="w-5 h-5" />,
          points: [
            'No cancellations are allowed once the product is shipped.',
            'Returns are accepted only for expired, damaged or incorrect products.',
            'Issues must be reported within 24 hours of delivery along with photographic or video evidence.',
            'No returns are allowed for products that are opened or improperly stored.'
          ]
        },
        {
          name: 'Nutraceutical Supplements',
          icon: <Pill className="w-5 h-5" />,
          points: [
            'Returns are accepted only for sealed, unused and unexpired items.',
            'Refunds/replacements are offered for wrong or damaged shipments.',
            'Cancellations are permitted within 12 hours of placing the order.',
            'All issues must be reported within 24 hours of delivery along with valid proof (photo/video).'
          ]
        }
      ]
    },
    {
      id: 'terms',
      title: 'Terms & Conditions',
      icon: <FileText className="w-6 h-6" />,
      color: 'teal',
      categories: [
        {
          name: 'Personal Care Products',
          icon: <Heart className="w-5 h-5" />,
          points: [
            'Products are for external use only.',
            'Individual results may vary depending on skin type and usage.',
            'A patch test is recommended before full application.',
            'Offers, discounts and coupons are subject to change without prior notice.'
          ]
        },
        {
          name: 'Baby Care Products',
          icon: <Baby className="w-5 h-5" />,
          points: [
            'All products are certified safe and dermatologically tested.',
            'Usage should be as per age-appropriate guidelines listed on the product.',
            'In case of allergies or irritation, consult a qualified paediatrician.',
            'The company is not liable for product deterioration due to improper storage or misuse.'
          ]
        },
        {
          name: 'Nutraceutical Supplements',
          icon: <Pill className="w-5 h-5" />,
          points: [
            'Products are not a substitute for professional medical advice.',
            'Users should consult their physician before using any supplement, especially during pregnancy or breastfeeding.',
            'Dosage must be strictly followed as mentioned on the label.',
            'Not recommended for children unless explicitly stated.'
          ]
        }
      ]
    },
    {
      id: 'privacy',
      title: 'Privacy Policy',
      icon: <Lock className="w-6 h-6" />,
      color: 'cyan',
      categories: [
        {
          name: 'Personal Care Products',
          icon: <Heart className="w-5 h-5" />,
          points: [
            'Customer data is collected solely for order processing and fulfilment.',
            'Earthsome does not store any payment details like credit/debit card numbers.',
            'No customer data is shared with third parties for marketing purposes.'
          ]
        },
        {
          name: 'Baby Care Products',
          icon: <Baby className="w-5 h-5" />,
          points: [
            'If any child-related data is collected, it is stored in an encrypted format.',
            'No identifiable medical or health records are stored.',
            'All communications are restricted to essential order-related notifications.'
          ]
        },
        {
          name: 'Nutraceutical Supplements',
          icon: <Pill className="w-5 h-5" />,
          points: [
            'Purchase history may be used to personalize offers.',
            'Any health-related information collected is confidential and encrypted.',
            'Emails may be used for transactional messages and Earthsome newsletters (opt-in only).'
          ]
        }
      ]
    },
    {
      id: 'compliance',
      title: 'Compliance & Standards',
      icon: <Shield className="w-6 h-6" />,
      color: 'lime',
      categories: [
        {
          name: 'All Categories',
          icon: <Star className="w-5 h-5" />,
          points: [
            'All products are manufactured under licensed facilities in compliance with FSSAI and Indian regulatory guidelines.',
            'All packaging and marketing materials follow ASCI (Advertising Standards Council of India) guidelines, avoiding misleading claims.',
            'Product labels display full ingredient disclosures, nutritional values, and usage instructions in compliance with Indian standards.'
          ]
        }
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-emerald-50">
      {/* Header */}
      <div className="max-w-6xl mx-auto px-6 py-16">
        <div className="text-center mb-16">
          <div 
            className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-green-500 to-emerald-600 rounded-3xl mb-8 shadow-xl shadow-green-200 transform hover:scale-110 transition-all duration-300"
            data-animate
            id="header-icon"
          >
            <Shield className="w-10 h-10 text-white" />
          </div>
          <h1 
            className={`text-5xl md:text-6xl font-light text-gray-900 mb-6 tracking-tight transition-all duration-700 ${
              visibleSections.has('header-icon') ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
            }`}
          >
            Privacy & Policies
          </h1>
          <p 
            className={`text-xl text-gray-600 font-light max-w-3xl mx-auto leading-relaxed transition-all duration-700 ${
              visibleSections.has('header-icon') ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
            }`}
            style={{ transitionDelay: '200ms' }}
          >
            Your trust is our priority. Learn about our policies, terms, and commitment to protecting your data and ensuring quality service.
          </p>
        </div>

        {/* Policy Sections */}
        <div className="space-y-6">
          {policies.map((policy, index) => (
            <div 
              key={policy.id}
              className={`group bg-white rounded-3xl shadow-lg hover:shadow-xl transition-all duration-500 overflow-hidden border border-gray-100 ${
                visibleSections.has(`policy-${index}`) ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
              }`}
              style={{ transitionDelay: `${index * 100}ms` }}
              data-animate
              id={`policy-${index}`}
            >
              {/* Policy Header */}
              <button
                onClick={() => toggleSection(policy.id)}
                className="w-full px-8 py-6 flex items-center justify-between hover:bg-gradient-to-r hover:from-green-50 hover:to-emerald-50 transition-all duration-300 group"
              >
                <div className="flex items-center gap-4">
                  <div className={`flex items-center justify-center w-14 h-14 bg-green-500 rounded-2xl shadow-lg shadow-${policy.color}-200 group-hover:shadow-xl group-hover:scale-110 transition-all duration-300`}>
                    {React.cloneElement(policy.icon, { className: "w-6 h-6 text-white" })}
                  </div>
                  <div className="text-left">
                    <h2 className="text-2xl font-semibold text-gray-900 group-hover:text-green-700 transition-colors duration-300">
                      {policy.title}
                    </h2>
                    <div className="h-0.5 w-0 group-hover:w-16 bg-green-400 mt-1 rounded-full transition-all duration-500"></div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    {openSections.has(policy.id) ? 'Collapse' : 'Expand'}
                  </span>
                  <div className={`transform transition-transform duration-300 ${openSections.has(policy.id) ? 'rotate-180' : ''}`}>
                    <ChevronDown className="w-6 h-6 text-gray-400 group-hover:text-green-600" />
                  </div>
                </div>
              </button>

              {/* Policy Content */}
              <div className={`transition-all duration-500 ease-in-out ${
                openSections.has(policy.id) 
                  ? 'max-h-screen opacity-100' 
                  : 'max-h-0 opacity-0'
              }`}>
                <div className="px-8 pb-8">
                  <div className="space-y-8">
                    {policy.categories.map((category, catIndex) => (
                      <div key={catIndex} className="relative">
                        {/* Category Header */}
                        <div className="flex items-center gap-3 mb-4">
                          <div className={`flex items-center justify-center w-10 h-10 bg-${policy.color}-100 rounded-xl`}>
                            {React.cloneElement(category.icon, { className: `w-5 h-5 text-${policy.color}-600` })}
                          </div>
                          <h3 className="text-lg font-medium text-gray-800">
                            {category.name}
                          </h3>
                        </div>

                        {/* Category Points */}
                        <div className="ml-13 space-y-3">
                          {category.points.map((point, pointIndex) => (
                            <div 
                              key={pointIndex}
                              className="flex items-start gap-3 group/item"
                            >
                              <div className="flex-shrink-0 mt-2">
                                <CheckCircle className={`w-4 h-4 text-${policy.color}-500 opacity-70 group-hover/item:opacity-100 transition-opacity duration-200`} />
                              </div>
                              <p className="text-gray-700 leading-relaxed group-hover/item:text-gray-900 transition-colors duration-200">
                                {point}
                              </p>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
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
            <Link href="/Contact" className={`inline-flex items-center px-8 py-3 bg-green-500 text-white font-medium rounded-full hover:bg-green-600 hover:shadow-lg hover:shadow-green-200 transition-all duration-300 transform hover:scale-105 ${
              visibleSections.has('footer-section') 
                ? 'opacity-100 translate-y-0' 
                : 'opacity-0 translate-y-4'
            }`} style={{ transitionDelay: '400ms' }}>
              Contact Support
            </Link>
          </div>
        </div>

        {/* Trust Badge */}
        <div 
          className={`mt-16 text-center transition-all duration-700 ${
            visibleSections.has('trust-badge') ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}
          data-animate
          id="trust-badge"
        >
          {/* <div className="inline-flex items-center gap-2 bg-green-100 text-green-800 px-6 py-3 rounded-full font-medium">
            <Shield className="w-5 h-5" />
            Committed to delivering safe, trusted and authentic wellness products to your doorstep
          </div> */}
        </div>
      </div>
    </div>
  );
};

export default PolicyPage;