'use client';

import { Building2, Receipt, CreditCard, Users } from 'lucide-react';

const stats = [
  { name: 'Bâtiments', value: '12', icon: Building2, change: '+2', changeType: 'increase' },
  { name: 'Charges en cours', value: '24', icon: Receipt, change: '+4', changeType: 'increase' },
  { name: 'Paiements du mois', value: '€15,400', icon: CreditCard, change: '+12%', changeType: 'increase' },
  { name: 'Utilisateurs actifs', value: '45', icon: Users, change: '+3', changeType: 'increase' },
];

const recentActivity = [
  {
    id: 1,
    type: 'paiement',
    description: 'Paiement reçu de Jean Dupont',
    amount: '€1,200',
    date: 'Il y a 2 heures',
  },
  {
    id: 2,
    type: 'charge',
    description: 'Nouvelle charge créée : Entretien ascenseur',
    amount: '€800',
    date: 'Il y a 5 heures',
  },
  {
    id: 3,
    type: 'document',
    description: 'Nouveau document ajouté : Rapport annuel',
    date: 'Il y a 1 jour',
  },
];

export default function DashboardPage() {
  return (
    <div>
      <h1 className="text-2xl font-semibold text-gray-900">Tableau de bord</h1>

      {/* Stats */}
      <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <div
            key={stat.name}
            className="relative overflow-hidden rounded-lg bg-white px-4 py-5 shadow sm:px-6 sm:py-6"
          >
            <dt>
              <div className="absolute rounded-md bg-primary-dark p-3">
                <stat.icon className="h-6 w-6 text-white" aria-hidden="true" />
              </div>
              <p className="ml-16 truncate text-sm font-medium text-gray-500">{stat.name}</p>
            </dt>
            <dd className="ml-16 flex items-baseline">
              <p className="text-2xl font-semibold text-gray-900">{stat.value}</p>
              <p
                className={`ml-2 flex items-baseline text-sm font-semibold ${
                  stat.changeType === 'increase' ? 'text-green-600' : 'text-red-600'
                }`}
              >
                {stat.change}
              </p>
            </dd>
          </div>
        ))}
      </div>

      {/* Recent Activity */}
      <div className="mt-8">
        <h2 className="text-lg font-medium text-gray-900">Activité récente</h2>
        <div className="mt-4 overflow-hidden rounded-lg bg-white shadow">
          <ul role="list" className="divide-y divide-gray-200">
            {recentActivity.map((activity) => (
              <li key={activity.id} className="px-4 py-4 sm:px-6">
                <div className="flex items-center justify-between">
                  <p className="truncate text-sm font-medium text-gray-900">{activity.description}</p>
                  <div className="ml-2 flex flex-shrink-0">
                    <p className="inline-flex rounded-full bg-green-100 px-2 text-xs font-semibold leading-5 text-green-800">
                      {activity.date}
                    </p>
                  </div>
                </div>
                {activity.amount && (
                  <div className="mt-2">
                    <p className="text-sm text-gray-500">{activity.amount}</p>
                  </div>
                )}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
} 