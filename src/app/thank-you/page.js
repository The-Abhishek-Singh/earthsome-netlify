'use client';
import React from 'react';
import Link from 'next/link';
import { CheckCircle2 } from 'lucide-react';

const ThankYouPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-blue-50 py-16 px-4 pt-24">
      <div className="max-w-2xl mx-auto text-center mt-4">
        <div className="mb-8 flex justify-center">
          <div className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center">
            <CheckCircle2 className="w-12 h-12 text-green-500" />
          </div>
        </div>

        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          Thank You for Your Order!
        </h1>

        <p className="text-lg text-gray-600 mb-8">
          Your order has been successfully placed and is being processed.
        </p>

        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8 mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">What&apos;s Next?</h2>
          <ul className="space-y-4 text-left">
            <li className="flex items-start gap-3">
              <div className="flex-shrink-0 w-6 h-6 rounded-full bg-green-100 flex items-center justify-center mt-1">
                <span className="text-green-500 text-sm font-medium">1</span>
              </div>
              <div>
                <h3 className="font-medium text-gray-900">Order Confirmation</h3>
                <p className="text-gray-600">You&apos;ll receive an email with your order details shortly.</p>
              </div>
            </li>
            <li className="flex items-start gap-3">
              <div className="flex-shrink-0 w-6 h-6 rounded-full bg-green-100 flex items-center justify-center mt-1">
                <span className="text-green-500 text-sm font-medium">2</span>
              </div>
              <div>
                <h3 className="font-medium text-gray-900">Order Processing</h3>
                <p className="text-gray-600">We&apos;ll start processing your order right away.</p>
              </div>
            </li>
            <li className="flex items-start gap-3">
              <div className="flex-shrink-0 w-6 h-6 rounded-full bg-green-100 flex items-center justify-center mt-1">
                <span className="text-green-500 text-sm font-medium">3</span>
              </div>
              <div>
                <h3 className="font-medium text-gray-900">Shipping</h3>
                <p className="text-gray-600">You&apos;ll receive shipping updates via email and SMS.</p>
              </div>
            </li>
          </ul>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/orders"
            className="inline-flex items-center justify-center px-6 py-3 border border-green-600 text-green-600 font-medium rounded-lg hover:bg-green-50 transition-colors"
          >
            View Orders
          </Link>
          <Link
            href="/"
            className="inline-flex items-center justify-center px-6 py-3 bg-green-600 text-white font-medium rounded-lg hover:bg-green-700 transition-colors"
          >
            Continue Shopping
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ThankYouPage;