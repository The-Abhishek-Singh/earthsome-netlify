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
} from "lucide-react";

export default function ContactPage() { 
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    contact: "",
    message: "",
  });
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [focusedField, setFocusedField] = useState("");

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

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
        message: formData.message,
      }),
    });

    const result = await response.json();
    setIsLoading(false);

    if (result.success) {
      setIsSubmitted(true);
      setFormData({ name: "", email: "", contact: "", message: "" });

      setTimeout(() => setIsSubmitted(false), 4000);
    } else {
      alert("❌ Something went wrong. Please try again later.");
    }
  };

  // ... keep your entire component structure same below
  // Just update the form section with this:

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-gradient-to-br from-green-50 to-white py-20">
        <div className="absolute inset-0 bg-white/80"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="animate-fade-in-up">
            <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6 tracking-tight">
              YOUR PATH TO
              <span className="block text-green-600 ">
                HEALTH & WELLNESS
              </span>
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed ">
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

                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Name Field */}
                  <div className="group">
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Name <span className="text-green-600">*</span>
                    </label>
                    <div className="relative">
                      <User
                        className={`absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 transition-colors duration-300 ${
                          focusedField === "name"
                            ? "text-green-600"
                            : "text-gray-400"
                        }`}
                      />
                      <input
                        type="text"
                        name="name"
                        required
                        value={formData.name}
                        onChange={handleInputChange}
                        onFocus={() => setFocusedField("name")}
                        onBlur={() => setFocusedField("")}
                        className="w-full pl-12 pr-4 py-4 border-2 border-gray-200 rounded-xl focus:border-green-500 focus:ring-4 focus:ring-green-100 transition-all duration-300 bg-gray-50 focus:bg-white text-gray-900 placeholder-gray-500"
                        placeholder="Enter your full name"
                      />
                    </div>
                  </div>

                  {/* Email Field */}
                  <div className="group">
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Email <span className="text-green-600">*</span>
                    </label>
                    <div className="relative">
                      <Mail
                        className={`absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 transition-colors duration-300 ${
                          focusedField === "email"
                            ? "text-green-600"
                            : "text-gray-400"
                        }`}
                      />
                      <input
                        type="email"
                        name="email"
                        required
                        value={formData.email}
                        onChange={handleInputChange}
                        onFocus={() => setFocusedField("email")}
                        onBlur={() => setFocusedField("")}
                        className="w-full pl-12 pr-4 py-4 border-2 border-gray-200 rounded-xl focus:border-green-500 focus:ring-4 focus:ring-green-100 transition-all duration-300 bg-gray-50 focus:bg-white text-gray-900 placeholder-gray-500"
                        placeholder="your.email@example.com"
                      />
                    </div>
                  </div>

                  {/* Contact Field */}
                  <div className="group">
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Contact Number <span className="text-green-600">*</span>
                    </label>
                    <div className="relative">
                      <Phone
                        className={`absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 transition-colors duration-300 ${
                          focusedField === "contact"
                            ? "text-green-600"
                            : "text-gray-400"
                        }`}
                      />
                      <input
                        type="tel"
                        name="contact"
                        required
                        value={formData.contact}
                        onChange={handleInputChange}
                        onFocus={() => setFocusedField("contact")}
                        onBlur={() => setFocusedField("")}
                        className="w-full pl-12 pr-4 py-4 border-2 border-gray-200 rounded-xl focus:border-green-500 focus:ring-4 focus:ring-green-100 transition-all duration-300 bg-gray-50 focus:bg-white text-gray-900 placeholder-gray-500"
                        placeholder="+91 XXXXX XXXXX"
                      />
                    </div>
                  </div>

                  {/* Message Field */}
                  <div className="group">
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Message <span className="text-green-600">*</span>
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
                        required
                        rows="5"
                        value={formData.message}
                        onChange={handleInputChange}
                        onFocus={() => setFocusedField("message")}
                        onBlur={() => setFocusedField("")}
                        className="w-full pl-12 pr-4 py-4 border-2 border-gray-200 rounded-xl focus:border-green-500 focus:ring-4 focus:ring-green-100 transition-all duration-300 bg-gray-50 focus:bg-white text-gray-900 placeholder-gray-500 resize-none"
                        placeholder="Tell us about your wellness goals or any questions you have..."
                      ></textarea>
                    </div>
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
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
                </form>
              </div>
            </div>
          </div>

          {/* Contact Information */}
          <div className="space-y-6 ">
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
                      Bunglow No. 21, Dev Kutir – 3, Bopal Ambali road, <br />{" "}
                      near Shell petrol pump, Ahmedabad – 380058
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
                <button className="bg-white hover:bg-green-600 text-green-600 hover:text-white px-4   sm:px-6 sm:py-3 rounded-full font-semibold transition-all duration-300 shadow-md hover:shadow-lg transform hover:scale-105">
                  Follow for Tips
                </button>
                <button className="bg-green-600 hover:bg-green-700 text-white sm:px-6 sm:py-3 px-10 py-2 rounded-full font-semibold transition-all duration-300 shadow-md hover:shadow-lg transform hover:scale-105">
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
