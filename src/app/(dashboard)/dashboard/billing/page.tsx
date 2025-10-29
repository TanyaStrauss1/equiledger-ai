// Billing page for subscription management
'use client';

import { CreditCard, Check, X } from 'lucide-react';

export default function BillingPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Billing & Subscription</h1>
        <p className="text-gray-500">Manage your subscription and billing</p>
      </div>

      {/* Current Plan */}
      <div className="bg-white shadow rounded-lg p-6">
        <h2 className="text-lg font-medium text-gray-900 mb-4">Current Plan</h2>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-2xl font-semibold text-gray-900">Free Plan</p>
            <p className="text-sm text-gray-500 mt-1">Perfect for getting started</p>
          </div>
          <button className="px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700">
            Upgrade Plan
          </button>
        </div>
      </div>

      {/* Plan Features */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
        <div className="bg-white shadow rounded-lg p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Free</h3>
          <div className="space-y-3">
            <div className="flex items-center">
              <Check className="w-5 h-5 text-green-500 mr-2" />
              <span className="text-sm text-gray-700">10 invoices/month</span>
            </div>
            <div className="flex items-center">
              <Check className="w-5 h-5 text-green-500 mr-2" />
              <span className="text-sm text-gray-700">Basic reporting</span>
            </div>
            <div className="flex items-center">
              <X className="w-5 h-5 text-gray-400 mr-2" />
              <span className="text-sm text-gray-500">No integrations</span>
            </div>
          </div>
        </div>

        <div className="bg-white shadow rounded-lg p-6 border-2 border-blue-500">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-medium text-gray-900">Pro</h3>
            <span className="px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">
              Popular
            </span>
          </div>
          <div className="space-y-3">
            <div className="flex items-center">
              <Check className="w-5 h-5 text-green-500 mr-2" />
              <span className="text-sm text-gray-700">Unlimited invoices</span>
            </div>
            <div className="flex items-center">
              <Check className="w-5 h-5 text-green-500 mr-2" />
              <span className="text-sm text-gray-700">Advanced reporting</span>
            </div>
            <div className="flex items-center">
              <Check className="w-5 h-5 text-green-500 mr-2" />
              <span className="text-sm text-gray-700">Xero/QuickBooks integration</span>
            </div>
          </div>
        </div>

        <div className="bg-white shadow rounded-lg p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Enterprise</h3>
          <div className="space-y-3">
            <div className="flex items-center">
              <Check className="w-5 h-5 text-green-500 mr-2" />
              <span className="text-sm text-gray-700">Unlimited everything</span>
            </div>
            <div className="flex items-center">
              <Check className="w-5 h-5 text-green-500 mr-2" />
              <span className="text-sm text-gray-700">Priority support</span>
            </div>
            <div className="flex items-center">
              <Check className="w-5 h-5 text-green-500 mr-2" />
              <span className="text-sm text-gray-700">Custom integrations</span>
            </div>
          </div>
        </div>
      </div>

      {/* Payment Method */}
      <div className="bg-white shadow rounded-lg p-6">
        <h2 className="text-lg font-medium text-gray-900 mb-4">Payment Method</h2>
        <div className="flex items-center">
          <CreditCard className="w-8 h-8 text-gray-400 mr-4" />
          <div>
            <p className="text-sm font-medium text-gray-900">No payment method on file</p>
            <p className="text-sm text-gray-500">Add a payment method to upgrade</p>
          </div>
          <button className="ml-auto px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50">
            Add Payment Method
          </button>
        </div>
      </div>
    </div>
  );
}
