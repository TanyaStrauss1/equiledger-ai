// Main dashboard page with financial overview
'use client';

import { useEffect, useState } from 'react';
import { DollarSign, TrendingUp, FileText, Users } from 'lucide-react';

interface DashboardStats {
  totalRevenue: number;
  totalExpenses: number;
  unpaidInvoices: number;
  activeClients: number;
  vatCollected: number;
  vatClaimable: number;
}

export default function DashboardPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch dashboard stats
    fetchDashboardStats();
  }, []);

  const fetchDashboardStats = async () => {
    try {
      // TODO: Replace with actual API call
      // const response = await fetch('/api/dashboard/stats');
      // const data = await response.json();
      
      // Mock data for now
      setStats({
        totalRevenue: 125000,
        totalExpenses: 45000,
        unpaidInvoices: 5,
        activeClients: 12,
        vatCollected: 18750,
        vatClaimable: 6750,
      });
    } catch (error) {
      console.error('Error fetching stats:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading || !stats) {
    return <div className="text-center p-8">Loading...</div>;
  }

  const profit = stats.totalRevenue - stats.totalExpenses;
  const netVAT = stats.vatCollected - stats.vatClaimable;

  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg shadow-lg p-6 text-white">
        <h1 className="text-2xl font-bold mb-2">Welcome back!</h1>
        <p className="text-blue-100">Here's your financial overview for this month</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Total Revenue"
          value={`R${stats.totalRevenue.toLocaleString()}`}
          icon={DollarSign}
          trend="+12%"
          trendUp={true}
        />
        <StatCard
          title="Total Expenses"
          value={`R${stats.totalExpenses.toLocaleString()}`}
          icon={TrendingUp}
          trend="-5%"
          trendUp={true}
        />
        <StatCard
          title="Net Profit"
          value={`R${profit.toLocaleString()}`}
          icon={FileText}
          trend="+18%"
          trendUp={true}
        />
        <StatCard
          title="Unpaid Invoices"
          value={stats.unpaidInvoices.toString()}
          icon={Users}
          trend={`R${(stats.unpaidInvoices * 10000).toLocaleString()}`}
          trendUp={false}
        />
      </div>

      {/* VAT Summary */}
      <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                  <DollarSign className="w-5 h-5 text-white" />
                </div>
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    VAT Collected
                  </dt>
                  <dd className="text-2xl font-semibold text-gray-900">
                    R{stats.vatCollected.toLocaleString()}
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                  <TrendingUp className="w-5 h-5 text-white" />
                </div>
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    VAT Claimable
                  </dt>
                  <dd className="text-2xl font-semibold text-gray-900">
                    R{stats.vatClaimable.toLocaleString()}
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Net VAT Owed */}
      <div className="bg-white overflow-hidden shadow rounded-lg">
        <div className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-medium text-gray-900">Net VAT Owed</h3>
              <p className="text-sm text-gray-500">Amount to pay to SARS</p>
            </div>
            <div className="text-right">
              <p className="text-3xl font-bold text-gray-900">
                R{netVAT.toLocaleString()}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white shadow rounded-lg">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900">Quick Actions</h3>
        </div>
        <div className="p-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
          <button className="text-left p-4 border border-gray-200 rounded-lg hover:bg-gray-50">
            <FileText className="w-6 h-6 text-blue-600 mb-2" />
            <h4 className="font-medium text-gray-900">Create Invoice</h4>
            <p className="text-sm text-gray-500">Generate a new invoice</p>
          </button>
          <button className="text-left p-4 border border-gray-200 rounded-lg hover:bg-gray-50">
            <DollarSign className="w-6 h-6 text-green-600 mb-2" />
            <h4 className="font-medium text-gray-900">Log Expense</h4>
            <p className="text-sm text-gray-500">Record a business expense</p>
          </button>
          <button className="text-left p-4 border border-gray-200 rounded-lg hover:bg-gray-50">
            <Users className="w-6 h-6 text-purple-600 mb-2" />
            <h4 className="font-medium text-gray-900">Add Client</h4>
            <p className="text-sm text-gray-500">Register a new client</p>
          </button>
        </div>
      </div>
    </div>
  );
}

function StatCard({ title, value, icon: Icon, trend, trendUp }: {
  title: string;
  value: string;
  icon: React.ComponentType<{ className?: string }>;
  trend: string;
  trendUp: boolean;
}) {
  return (
    <div className="bg-white overflow-hidden shadow rounded-lg">
      <div className="p-5">
        <div className="flex items-center">
          <div className="flex-shrink-0">
            <Icon className="h-6 w-6 text-gray-400" />
          </div>
          <div className="ml-5 w-0 flex-1">
            <dl>
              <dt className="text-sm font-medium text-gray-500 truncate">
                {title}
              </dt>
              <dd className="flex items-baseline">
                <div className="text-2xl font-semibold text-gray-900">
                  {value}
                </div>
                <div className={`ml-2 flex items-baseline text-sm font-semibold ${
                  trendUp ? 'text-green-600' : 'text-red-600'
                }`}>
                  {trend}
                </div>
              </dd>
            </dl>
          </div>
        </div>
      </div>
    </div>
  );
}
