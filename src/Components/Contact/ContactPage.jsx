"use client";
import React, { useState } from "react";
import {
  Mail,
  Phone,
  MapPin,
  Send,
  User,
  MessageCircle,
  CheckCircle,
  Loader2,
  Target,
  AlertCircle,
} from "lucide-react";

export default function ContactPage() { 
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    contact: "",
    purpose: "",
    message: "",
  });
  const [errors, setErrors] = useState({});
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [focusedField, setFocusedField] = useState("");

  const purposeOptions = [
    { value: "", label: "Select purpose of your request" },
    { value: "general_inquiry", label: "General Inquiry" },
    { value: "wellness_consultation", label: "Wellness Consultation" },
    { value: "product_information", label: "Product Information" },
    { value: "appointment_booking", label: "Appointment Booking" },
    { value: "health_advice", label: "Health Advice" },
    { value: "nutrition_guidance", label: "Nutrition Guidance" },
    { value: "fitness_program", label: "Fitness Program" },
    { value: "support", label: "Customer Support" },
    { value: "other", label: "Other" },
  ];

  const validateEmail = (email) => {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return emailRegex.test(email);
  };

  const validateContact = (contact) => {
    const cleanContact = contact.replace(/\D/g, '');
    return cleanContact.length === 10;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    
    if (name === "contact") {
      const cleanValue = value.replace(/\D/g, '').slice(0, 10);
      setFormData({
        ...formData,
        [name]: cleanValue,
      });
    } else {
      setFormData({
        ...formData,
        [name]: value,
      });
    }

    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: "",
      });
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = "Name is required";
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!validateEmail(formData.email)) {
      newErrors.email = "Please enter a valid email address (e.g., user@example.com)";
    }

    if (!formData.contact.trim()) {
      newErrors.contact = "Contact number is required";
    } else if (!validateContact(formData.contact)) {
      newErrors.contact = "Contact number must be exactly 10 digits";
    }

    if (!formData.purpose) {
      newErrors.purpose = "Please select the purpose of your request";
    }

    return newErrors;
  };

  const handleSubmit = async () => {
    const formErrors = validateForm();
    if (Object.keys(formErrors).length > 0) {
      setErrors(formErrors);
      return;
    }

    setIsLoading(true);
    setErrors({});

    try {
      const response = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          access_key: "dc819da8-4380-4b80-9d77-2ff43963bc8e",
          name: formData.name,
          email: formData.email,
          contact: formData.contact,
          purpose: purposeOptions.find(opt => opt.value === formData.purpose)?.label || formData.purpose,
          message: formData.message || "No additional message provided",
        }),
      });

      const result = await response.json();
      setIsLoading(false);

      if (result.success) {
        setIsSubmitted(true);
        setFormData({ name: "", email: "", contact: "", purpose: "", message: "" });
        setTimeout(() => setIsSubmitted(false), 4000);
      } else {
        alert("❌ Something went wrong. Please try again later.");
      }
    } catch (error) {
      setIsLoading(false);
      alert("❌ Network error. Please check your connection and try again.");
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && e.target.tagName !== 'TEXTAREA') {
      e.preventDefault();
      handleSubmit();
    }
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-gradient-to-br from-green-50 to-white py-20">
        <div className="absolute inset-0 bg-white/80"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="animate-fade-in-up">
            <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6 tracking-tight">
              YOUR PATH TO
              <span className="block text-green-600">
                HEALTH & WELLNESS
              </span>
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
              Get in Touch – Your Wellness Matters to Us!
            </p>
          </div>
        </div>

        {/* Floating Elements */}
        <div className="absolute top-20 left-10 w-20 h-20 bg-green-100 rounded-full opacity-60 animate-bounce"></div>
        <div className="absolute bottom-20 right-10 w-16 h-16 bg-green-200 rounded-full opacity-40 animate-bounce delay-75"></div>
        <div className="absolute top-40 right-20 w-12 h-12 bg-green-300 rounded-full opacity-30 animate-bounce delay-150"></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid lg:grid-cols-2 gap-16 items-start">
          {/* Contact Form */}
          <div className="relative">
            <div className="bg-white rounded-3xl shadow-2xl border border-gray-100 p-8 lg:p-12 transform hover:scale-105 transition-all duration-500">
              <div className="absolute inset-0 bg-gradient-to-r from-green-50 to-transparent rounded-3xl opacity-50"></div>
              <div className="relative">
                <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
                  Start Your Wellness Journey
                </h2>

                <div className="space-y-6" onKeyDown={handleKeyDown}>
                  {/* Name Field */}
                  <div className="group">
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Name <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <User
                        className={`absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 transition-colors duration-300 ${
                          focusedField === "name"
                            ? "text-green-600"
                            : errors.name 
                            ? "text-red-500"
                            : "text-gray-400"
                        }`}
                      />
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        onFocus={() => setFocusedField("name")}
                        onBlur={() => setFocusedField("")}
                        className={`w-full pl-12 pr-4 py-4 border-2 rounded-xl focus:ring-4 transition-all duration-300 bg-gray-50 focus:bg-white text-gray-900 placeholder-gray-500 ${
                          errors.name
                            ? "border-red-500 focus:border-red-500 focus:ring-red-100"
                            : "border-gray-200 focus:border-green-500 focus:ring-green-100"
                        }`}
                        placeholder="Enter your full name"
                      />
                      {errors.name && (
                        <div className="flex items-center mt-2 text-red-500 text-sm">
                          <AlertCircle className="h-4 w-4 mr-1" />
                          {errors.name}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Email Field */}
                  <div className="group">
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Email <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <Mail
                        className={`absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 transition-colors duration-300 ${
                          focusedField === "email"
                            ? "text-green-600"
                            : errors.email 
                            ? "text-red-500"
                            : "text-gray-400"
                        }`}
                      />
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        onFocus={() => setFocusedField("email")}
                        onBlur={() => setFocusedField("")}
                        className={`w-full pl-12 pr-4 py-4 border-2 rounded-xl focus:ring-4 transition-all duration-300 bg-gray-50 focus:bg-white text-gray-900 placeholder-gray-500 ${
                          errors.email
                            ? "border-red-500 focus:border-red-500 focus:ring-red-100"
                            : "border-gray-200 focus:border-green-500 focus:ring-green-100"
                        }`}
                        placeholder="your.email@example.com"
                      />
                      {errors.email && (
                        <div className="flex items-center mt-2 text-red-500 text-sm">
                          <AlertCircle className="h-4 w-4 mr-1" />
                          {errors.email}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Contact Field */}
                  <div className="group">
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Contact Number <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <Phone
                        className={`absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 transition-colors duration-300 ${
                          focusedField === "contact"
                            ? "text-green-600"
                            : errors.contact 
                            ? "text-red-500"
                            : "text-gray-400"
                        }`}
                      />
                      <input
                        type="tel"
                        name="contact"
                        value={formData.contact}
                        onChange={handleInputChange}
                        onFocus={() => setFocusedField("contact")}
                        onBlur={() => setFocusedField("")}
                        className={`w-full pl-12 pr-4 py-4 border-2 rounded-xl focus:ring-4 transition-all duration-300 bg-gray-50 focus:bg-white text-gray-900 placeholder-gray-500 ${
                          errors.contact
                            ? "border-red-500 focus:border-red-500 focus:ring-red-100"
                            : "border-gray-200 focus:border-green-500 focus:ring-green-100"
                        }`}
                        placeholder="9XXXXXXXXX (10 digits only)"
                        maxLength="10"
                      />
                      {errors.contact && (
                        <div className="flex items-center mt-2 text-red-500 text-sm">
                          <AlertCircle className="h-4 w-4 mr-1" />
                          {errors.contact}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Purpose Field */}
                  <div className="group">
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Purpose of Request <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <Target
                        className={`absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 transition-colors duration-300 ${
                          focusedField === "purpose"
                            ? "text-green-600"
                            : errors.purpose 
                            ? "text-red-500"
                            : "text-gray-400"
                        }`}
                      />
                      <select
                        name="purpose"
                        value={formData.purpose}
                        onChange={handleInputChange}
                        onFocus={() => setFocusedField("purpose")}
                        onBlur={() => setFocusedField("")}
                        className={`w-full pl-12 pr-4 py-4 border-2 rounded-xl focus:ring-4 transition-all duration-300 bg-gray-50 focus:bg-white text-gray-900 ${
                          errors.purpose
                            ? "border-red-500 focus:border-red-500 focus:ring-red-100"
                            : "border-gray-200 focus:border-green-500 focus:ring-green-100"
                        }`}
                      >
                        {purposeOptions.map((option) => (
                          <option key={option.value} value={option.value}>
                            {option.label}
                          </option>
                        ))}
                      </select>
                      {errors.purpose && (
                        <div className="flex items-center mt-2 text-red-500 text-sm">
                          <AlertCircle className="h-4 w-4 mr-1" />
                          {errors.purpose}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Message Field - Now Optional */}
                  <div className="group">
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Additional Message <span className="text-gray-400 text-xs">(Optional)</span>
                    </label>
                    <div className="relative">
                      <MessageCircle
                        className={`absolute left-4 top-4 h-5 w-5 transition-colors duration-300 ${
                          focusedField === "message"
                            ? "text-green-600"
                            : "text-gray-400"
                        }`}
                      />
                      <textarea
                        name="message"
                        rows="5"
                        value={formData.message}
                        onChange={handleInputChange}
                        onFocus={() => setFocusedField("message")}
                        onBlur={() => setFocusedField("")}
                        className="w-full pl-12 pr-4 py-4 border-2 border-gray-200 rounded-xl focus:border-green-500 focus:ring-4 focus:ring-green-100 transition-all duration-300 bg-gray-50 focus:bg-white text-gray-900 placeholder-gray-500 resize-none"
                        placeholder="Any additional details about your wellness goals or questions... (Optional)"
                      ></textarea>
                    </div>
                  </div>

                  {/* Submit Button */}
                  <button
                    onClick={handleSubmit}
                    disabled={isSubmitted || isLoading}
                    className="w-full bg-gradient-to-r from-green-600 to-green-700 text-white font-bold py-4 px-8 rounded-xl hover:from-green-700 hover:to-green-800 focus:ring-4 focus:ring-green-300 transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3"
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="h-5 w-5 animate-spin" />
                        Sending...
                      </>
                    ) : isSubmitted ? (
                      <>
                        <CheckCircle className="h-5 w-5" />
                        Message Sent Successfully!
                      </>
                    ) : (
                      <>
                        <Send className="h-5 w-5" />
                        Send Message
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Contact Information */}
          <div className="space-y-6">
            {/* Contact Cards */}
            <div className="grid gap-6">
              {/* Email Card */}
              <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 transform hover:scale-105 hover:shadow-xl transition-all duration-500 group">
                <div className="flex items-start gap-4">
                  <div className="bg-green-100 p-3 rounded-full group-hover:bg-green-200 transition-colors duration-300">
                    <Mail className="h-6 w-6 text-green-600" />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900 mb-2">Email Us</h3>
                    <p className="text-gray-600 mb-3">
                      Send us your queries anytime
                    </p>
                    <a
                      href="mailto:earthsomemarketing@gmail.com"
                      className="text-green-600 hover:text-green-700 font-semibold hover:underline transition-colors duration-300"
                    >
                      earthsomemarketing@gmail.com
                    </a>
                  </div>
                </div>
              </div>

              {/* Phone Card */}
              <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 transform hover:scale-105 hover:shadow-xl transition-all duration-500 group">
                <div className="flex items-start gap-4">
                  <div className="bg-green-100 p-3 rounded-full group-hover:bg-green-200 transition-colors duration-300">
                    <Phone className="h-6 w-6 text-green-600" />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900 mb-2">Call Us</h3>
                    <p className="text-gray-600 mb-3">
                      Speak with our wellness experts
                    </p>
                    <a
                      href="tel:+919343686973"
                      className="text-green-600 hover:text-green-700 font-semibold hover:underline transition-colors duration-300"
                    >
                      +91 93436 86973
                    </a>
                  </div>
                </div>
              </div>

              {/* Address Card */}
              <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 transform hover:scale-105 hover:shadow-xl transition-all duration-500 group">
                <div className="flex items-start gap-4">
                  <div className="bg-green-100 p-3 rounded-full group-hover:bg-green-200 transition-colors duration-300">
                    <MapPin className="h-6 w-6 text-green-600" />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900 mb-2">Visit Us</h3>
                    <p className="text-gray-600 mb-3">Come see us in person</p>
                    <address className="text-green-600 hover:text-green-700 font-semibold not-italic">
                     610-613, Floor Anam 2, S P mng Rign Road. Ambli. Ahmedabad - 380058
                    </address>
                  </div>
                </div>
              </div>
            </div>

            {/* Thank You Message */}
            <div className="bg-gradient-to-r from-green-50 to-green-100 rounded-2xl p-8 border border-green-200">
              <h3 className="text-2xl font-bold text-gray-900 mb-4 text-center">
                Thank You for Choosing Earthsome
              </h3>
              <p className="text-gray-700 text-center leading-relaxed">
                Our team looks forward to helping you on your journey to health
                and wellness. Follow us for wellness tips & updates!
              </p>  

              {/* Social Media Buttons */}
              <div className="flex justify-center gap-4 mt-6">
                <button className="bg-white hover:bg-green-600 text-green-600 hover:text-white px-4 sm:px-6 py-2 sm:py-3 rounded-full font-semibold transition-all duration-300 shadow-md hover:shadow-lg transform hover:scale-105">
                  Follow for Tips
                </button>
                <button className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 sm:px-6 sm:py-3 rounded-full font-semibold transition-all duration-300 shadow-md hover:shadow-lg transform hover:scale-105">
                  Get Updates
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}