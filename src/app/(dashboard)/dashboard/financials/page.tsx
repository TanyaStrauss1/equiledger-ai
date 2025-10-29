// Financials/Reports page
'use client';

import { useState } from 'react';
import { TrendingUp, Calendar } from 'lucide-react';

export default function FinancialsPage() {
  const [period, setPeriod] = useState('month');

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Financial Reports</h1>
          <p className="text-gray-500">View your financial insights and reports</p>
        </div>
        <div className="flex items-center space-x-2">
          <select
            value={period}
            onChange={(e) => setPeriod(e.target.value)}
            className="border border-gray-300 rounded-md px-3 py-2 text-sm"
          >
            <option value="month">This Month</option>
            <option value="quarter">This Quarter</option>
            <option value="year">This Year</option>
          </select>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0 bg-green-500 rounded-md p-3">
                <TrendingUp className="w-6 h-6 text-white" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">Revenue</dt>
                  <dd className="text-lg font-semibold text-gray-900">R125,000</dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0 bg-red-500 rounded-md p-3">
                <TrendingUp className="w-6 h-6 text-white" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">Expenses</dt>
                  <dd className="text-lg font-semibold text-gray-900">R45,000</dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0 bg-blue-500 rounded-md p-3">
                <TrendingUp className="w-6 h-6 text-white" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">Profit</dt>
                  <dd className="text-lg font-semibold text-gray-900">R80,000</dd>
                </dl>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* VAT Summary */}
      <div className="bg-white shadow rounded-lg p-6">
        <h2 className="text-lg font-medium text-gray-900 mb-4">VAT Summary</h2>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-gray-500">VAT Collected</p>
            <p className="text-2xl font-semibold text-gray-900">R18,750</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">VAT Claimable</p>
            <p className="text-2xl font-semibold text-gray-900">R6,750</p>
          </div>
          <div className="col-span-2 pt-4 border-t">
            <p className="text-sm text-gray-500">Net VAT Owed to SARS</p>
            <p className="text-2xl font-semibold text-blue-600">R12,000</p>
          </div>
        </div>
      </div>

      {/* Chart Placeholder */}
      <div className="bg-white shadow rounded-lg p-6">
        <h2 className="text-lg font-medium text-gray-900 mb-4">Revenue Trend</h2>
        <div className="h-64 bg-gray-50 rounded-lg flex items-center justify-center">
          <p className="text-gray-500">Chart visualization coming soon</p>
        </div>
      </div>
    </div>
  );
}
