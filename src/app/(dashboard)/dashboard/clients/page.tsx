// Clients page
'use client';

import { useState, useEffect } from 'react';
import { Users, Plus, Mail, Phone } from 'lucide-react';

interface Client {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  invoiceCount: number;
}

export default function ClientsPage() {
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchClients();
  }, []);

  const fetchClients = async () => {
    try {
      // TODO: Replace with actual API call
      // const response = await fetch('/api/clients');
      // const data = await response.json();
      
      // Mock data
      setClients([
        { id: '1', name: 'ABC Corp', email: 'contact@abccorp.com', phone: '+27123456789', invoiceCount: 5 },
        { id: '2', name: 'XYZ Ltd', email: 'hello@xyzltd.com', phone: '+27987654321', invoiceCount: 3 },
        { id: '3', name: 'Tech Startup', email: 'info@techstartup.co.za', invoiceCount: 2 },
      ]);
    } catch (error) {
      console.error('Error fetching clients:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="text-center p-8">Loading...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Clients</h1>
          <p className="text-gray-500">Manage your clients and contacts</p>
        </div>
        <button className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700">
          <Plus className="w-5 h-5 mr-2" />
          Add Client
        </button>
      </div>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {clients.map((client) => (
          <div key={client.id} className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <Users className="h-8 w-8 text-blue-600" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">Client</dt>
                    <dd className="text-lg font-semibold text-gray-900">{client.name}</dd>
                  </dl>
                </div>
              </div>
              <div className="mt-4 space-y-2">
                {client.email && (
                  <div className="flex items-center text-sm text-gray-500">
                    <Mail className="w-4 h-4 mr-2" />
                    {client.email}
                  </div>
                )}
                {client.phone && (
                  <div className="flex items-center text-sm text-gray-500">
                    <Phone className="w-4 h-4 mr-2" />
                    {client.phone}
                  </div>
                )}
                <div className="pt-2 border-t">
                  <span className="text-sm text-gray-500">
                    {client.invoiceCount} invoice{client.invoiceCount !== 1 ? 's' : ''}
                  </span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
