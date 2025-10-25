'use client';

import { useState, useEffect } from 'react';

interface Service {
  name: string;
  endpoint: string;
  status: string;
}

interface Report {
  id: number;
  reportId: string;
  type: string;
  title: string;
  status: string;
  period: string;
  submittedDate: string | null;
}

export default function Home() {
  const [services, setServices] = useState<Service[]>([]);
  const [reports, setReports] = useState<Report[]>([]);

  useEffect(() => {
    const checkServices = async () => {
      const serviceUrls = [
        { name: 'API Gateway', endpoint: '/health' },
        { name: 'Customer Service', endpoint: '/api/customers/health' },
        { name: 'Payments Service', endpoint: '/api/payments/health' },
        { name: 'Partner Integration', endpoint: '/api/partners/health' },
        { name: 'Regulatory Reporting', endpoint: '/api/regulatory/health' },
        { name: 'Core Banking Adapter', endpoint: '/api/core-banking/health' },
      ];

      const apiGateway = process.env.NEXT_PUBLIC_API_GATEWAY_URL || 'http://localhost:3000';

      const statuses = await Promise.all(
        serviceUrls.map(async (service) => {
          try {
            const response = await fetch(`${apiGateway}${service.endpoint}`);
            return {
              ...service,
              status: response.ok ? 'Running' : 'Down'
            };
          } catch (error) {
            return {
              ...service,
              status: 'Down'
            };
          }
        })
      );

      setServices(statuses);
    };

    checkServices();
  }, []);

  useEffect(() => {
    const fetchReports = async () => {
      const apiGateway = process.env.NEXT_PUBLIC_API_GATEWAY_URL || 'http://localhost:3000';
      
      try {
        const response = await fetch(`${apiGateway}/api/regulatory/reports`);
        const data = await response.json();
        if (data.success && data.data) {
          setReports(data.data);
        }
      } catch (error) {
        console.error('Error fetching reports:', error);
      }
    };

    fetchReports();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-8">
      <div className="max-w-7xl mx-auto">
        <header className="mb-12 text-center">
          <h1 className="text-5xl font-bold text-gray-800 mb-4">
            Banking System Modernization
          </h1>
          <p className="text-xl text-gray-600">
            Microservices Architecture Dashboard
          </p>
        </header>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((service, index) => (
            <div
              key={index}
              className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow"
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-semibold text-gray-800">
                  {service.name}
                </h3>
                <span
                  className={`px-3 py-1 rounded-full text-sm font-medium ${
                    service.status === 'Running'
                      ? 'bg-green-100 text-green-800'
                      : 'bg-red-100 text-red-800'
                  }`}
                >
                  {service.status}
                </span>
              </div>
              <p className="text-gray-600 text-sm">
                Endpoint: <code className="bg-gray-100 px-2 py-1 rounded">{service.endpoint}</code>
              </p>
            </div>
          ))}
        </div>

        <div className="mt-12 bg-white rounded-lg shadow-lg p-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">
            Architecture Overview
          </h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-700 mb-3">Services</h3>
              <ul className="space-y-2 text-gray-600">
                <li>✓ API Gateway - Central routing hub</li>
                <li>✓ Customer Service - Customer management</li>
                <li>✓ Payments Service - Payment processing</li>
                <li>✓ Partner Integration - External integrations</li>
                <li>✓ Regulatory Reporting - Compliance monitoring</li>
                <li>✓ Core Banking Adapter - Legacy system bridge</li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-700 mb-3">Technologies</h3>
              <ul className="space-y-2 text-gray-600">
                <li>• Next.js - Frontend UI</li>
                <li>• Node.js/Express - Backend services</li>
                <li>• Docker - Containerization</li>
                <li>• Docker Compose - Orchestration</li>
                <li>• RESTful APIs - Communication</li>
              </ul>
            </div>
          </div>
        </div>

        <div className="mt-12 bg-white rounded-lg shadow-lg p-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">
            Regulatory Reports Status
          </h2>
          {reports.length === 0 ? (
            <p className="text-gray-600">Loading reports...</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Report ID
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Report Type
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Period
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Submitted Date
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {reports.map((report) => (
                    <tr key={report.id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {report.reportId}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                        {report.type}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          report.status === 'submitted' 
                            ? 'bg-green-100 text-green-800'
                            : report.status === 'pending'
                            ? 'bg-yellow-100 text-yellow-800'
                            : 'bg-gray-100 text-gray-800'
                        }`}>
                          {report.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                        {report.period}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                        {report.submittedDate 
                          ? new Date(report.submittedDate).toLocaleDateString('en-US', {
                              year: 'numeric',
                              month: 'short',
                              day: 'numeric'
                            })
                          : 'N/A'
                        }
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
