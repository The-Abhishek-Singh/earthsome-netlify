"use client";
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
  Package, ShoppingCart, Users, DollarSign, LineChart, TrendingUp,
  Archive, CheckCircle, AlertCircle
} from 'lucide-react';
import {
  LineChart as RechartsLineChart, Line, XAxis, YAxis,
  CartesianGrid, Tooltip, ResponsiveContainer
} from 'recharts';

const Dashboard = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/products`);
      setProducts(res.data);
      setLoading(false);
    } catch (err) {
      console.error("Error fetching products:", err);
    }
  };

  const totalProducts = products.length;

  const totalInventory = products.reduce((sum, p) => sum + (p.quantity || 0), 0);
  const soldItems = products.reduce((sum, p) => sum + (p.sold || 0), 0);
  const inStock = totalInventory - soldItems;

  const inventoryPercentage = totalInventory ? Math.round((inStock / totalInventory) * 100) : 0;

  const analyticsCards = [
    {
      title: 'Total Products',
      count: totalProducts.toString(),
      icon: Package,
      bgColor: 'bg-green-100',
      iconColor: 'text-green-600'
    },
    {
      title: 'Total Orders',
      count: '120', // Replace with dynamic orders later
      icon: ShoppingCart,
      bgColor: 'bg-green-100',
      iconColor: 'text-green-600'
    },
    {
      title: 'Customers',
      count: '85', // Replace with actual customers later
      icon: Users,
      bgColor: 'bg-green-100',
      iconColor: 'text-green-600'
    },
    {
      title: 'Revenue',
      count: '₹92,400', // Replace with dynamic revenue later
      icon: DollarSign,
      bgColor: 'bg-green-100',
      iconColor: 'text-green-600'
    }
  ];

  const inventoryCards = [
    {
      title: 'Total Inventory',
      count: `${totalInventory} units`,
      icon: Archive,
      bgColor: 'bg-blue-100',
      iconColor: 'text-blue-600'
    },
    {
      title: 'Sold Items',
      count: `${soldItems} units`,
      icon: CheckCircle,
      bgColor: 'bg-purple-100',
      iconColor: 'text-purple-600'
    },
    {
      title: 'In Stock',
      count: `${inStock} units`,
      icon: AlertCircle,
      bgColor: 'bg-orange-100',
      iconColor: 'text-orange-600',
      showProgress: true,
      progressValue: inventoryPercentage
    }
  ];

  const salesData = [
    { day: 'Mon', sales: 4200 },
    { day: 'Tue', sales: 3800 },
    { day: 'Wed', sales: 5200 },
    { day: 'Thu', sales: 4600 },
    { day: 'Fri', sales: 6800 },
    { day: 'Sat', sales: 7200 },
    { day: 'Sun', sales: 5900 }
  ];

  return (
    <div className="bg-gray-50 p-6">
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2 bg-green-100 rounded-lg">
            <LineChart className="w-6 h-6 text-green-600" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900">Dashboard Overview</h1>
        </div>
        <p className="text-gray-600 text-lg">Your store's performance summary</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {analyticsCards.map((card, i) => {
          const Icon = card.icon;
          return (
            <div key={i} className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between mb-4">
                <div className={`p-3 ${card.bgColor} rounded-lg`}>
                  <Icon className={`w-6 h-6 ${card.iconColor}`} />
                </div>
                <TrendingUp className="w-4 h-4 text-gray-400" />
              </div>
              <div>
                <h3 className="text-gray-600 text-sm font-medium mb-1">{card.title}</h3>
                <p className="text-2xl font-bold text-gray-900">{card.count}</p>
              </div>
            </div>
          );
        })}
      </div>

      <div className="mb-8">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 bg-blue-100 rounded-lg">
            <Archive className="w-6 h-6 text-blue-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900">Inventory Overview</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {inventoryCards.map((card, i) => {
            const Icon = card.icon;
            return (
              <div key={i} className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between mb-4">
                  <div className={`p-3 ${card.bgColor} rounded-lg`}>
                    <Icon className={`w-6 h-6 ${card.iconColor}`} />
                  </div>
                  <TrendingUp className="w-4 h-4 text-gray-400" />
                </div>
                <div>
                  <h3 className="text-gray-600 text-sm font-medium mb-1">{card.title}</h3>
                  <p className="text-2xl font-bold text-gray-900">{card.count}</p>
                  {card.showProgress && (
                    <div className="mt-3">
                      <div className="flex justify-between items-center mb-1">
                        <span className="text-xs text-gray-500">Stock Level</span>
                        <span className="text-xs text-gray-500">{card.progressValue}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div className="bg-orange-500 h-2 rounded-full transition-all duration-300" style={{ width: `${card.progressValue}%` }}></div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 bg-green-100 rounded-lg">
            <TrendingUp className="w-5 h-5 text-green-600" />
          </div>
          <h2 className="text-xl font-semibold text-gray-900">Sales This Week</h2>
        </div>

        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <RechartsLineChart data={salesData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="day" stroke="#6b7280" fontSize={12} />
              <YAxis stroke="#6b7280" fontSize={12} tickFormatter={(v) => `₹${v}`} />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'white',
                  border: '1px solid #e5e7eb',
                  borderRadius: '8px',
                  boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'
                }}
                formatter={(v) => [`₹${v}`, 'Sales']}
                labelStyle={{ color: '#374151' }}
              />
              <Line
                type="monotone"
                dataKey="sales"
                stroke="#16a34a"
                strokeWidth={3}
                dot={{ fill: '#16a34a', strokeWidth: 2, r: 4 }}
                activeDot={{ r: 6, stroke: '#16a34a', strokeWidth: 2 }}
              />
            </RechartsLineChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="h-6"></div>
    </div>
  );
};

export default Dashboard;
