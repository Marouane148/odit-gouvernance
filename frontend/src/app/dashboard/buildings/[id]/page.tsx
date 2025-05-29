'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { ArrowLeft, Building2, Home, Users, Calendar, FileText, Plus } from 'lucide-react';

// Types
type Building = {
  id: number;
  name: string;
  address: string;
  totalArea: number;
  description: string;
  status: 'active' | 'inactive';
  createdAt: string;
};

type Apartment = {
  id: number;
  number: string;
  floor: number;
  area: number;
  status: 'occupied' | 'vacant';
  tenant?: {
    name: string;
    email: string;
  };
};

// Données de test (à remplacer par l'appel API)
const building: Building = {
  id: 1,
  name: 'Résidence Les Jardins',
  address: '123 Avenue des Fleurs, Paris',
  totalArea: 2400,
  description: 'Résidence moderne avec jardin et parking souterrain',
  status: 'active',
  createdAt: '2024-01-15',
};

const apartments: Apartment[] = [
  {
    id: 1,
    number: 'A101',
    floor: 1,
    area: 75,
    status: 'occupied',
    tenant: {
      name: 'Jean Dupont',
      email: 'jean.dupont@email.com',
    },
  },
  {
    id: 2,
    number: 'A102',
    floor: 1,
    area: 85,
    status: 'vacant',
  },
  // Ajoutez d'autres appartements de test ici
];

export default function BuildingDetailsPage() {
  const params = useParams();
  const [activeTab, setActiveTab] = useState<'overview' | 'apartments' | 'charges' | 'documents'>('overview');

  return (
    <div>
      <div className="mb-6">
        <Link
          href="/dashboard/buildings"
          className="inline-flex items-center text-sm font-medium text-gray-600 hover:text-gray-900"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Retour à la liste
        </Link>
      </div>

      {/* En-tête du bâtiment */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <Building2 className="h-8 w-8 text-gray-400" />
            <div className="ml-4">
              <h1 className="text-2xl font-semibold text-gray-900">{building.name}</h1>
              <p className="text-sm text-gray-500">{building.address}</p>
            </div>
          </div>
          <div className="flex space-x-3">
            <Link
              href={`/dashboard/buildings/${building.id}/edit`}
              className="inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary-dark focus:ring-offset-2"
            >
              Modifier
            </Link>
            <Link
              href={`/dashboard/buildings/${building.id}/apartments/new`}
              className="inline-flex items-center rounded-md border border-transparent bg-primary-dark px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-primary-dark/90 focus:outline-none focus:ring-2 focus:ring-primary-dark focus:ring-offset-2"
            >
              <Plus className="mr-2 h-4 w-4" />
              Nouvel appartement
            </Link>
          </div>
        </div>
      </div>

      {/* Onglets */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          <button
            onClick={() => setActiveTab('overview')}
            className={`${
              activeTab === 'overview'
                ? 'border-primary-dark text-primary-dark'
                : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
            } whitespace-nowrap border-b-2 py-4 px-1 text-sm font-medium`}
          >
            Aperçu
          </button>
          <button
            onClick={() => setActiveTab('apartments')}
            className={`${
              activeTab === 'apartments'
                ? 'border-primary-dark text-primary-dark'
                : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
            } whitespace-nowrap border-b-2 py-4 px-1 text-sm font-medium`}
          >
            Appartements
          </button>
          <button
            onClick={() => setActiveTab('charges')}
            className={`${
              activeTab === 'charges'
                ? 'border-primary-dark text-primary-dark'
                : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
            } whitespace-nowrap border-b-2 py-4 px-1 text-sm font-medium`}
          >
            Charges
          </button>
          <button
            onClick={() => setActiveTab('documents')}
            className={`${
              activeTab === 'documents'
                ? 'border-primary-dark text-primary-dark'
                : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
            } whitespace-nowrap border-b-2 py-4 px-1 text-sm font-medium`}
          >
            Documents
          </button>
        </nav>
      </div>

      {/* Contenu des onglets */}
      <div className="mt-8">
        {activeTab === 'overview' && (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            <div className="overflow-hidden rounded-lg bg-white shadow">
              <div className="p-5">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <Home className="h-6 w-6 text-gray-400" />
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="truncate text-sm font-medium text-gray-500">Surface totale</dt>
                      <dd className="text-lg font-medium text-gray-900">{building.totalArea} m²</dd>
                    </dl>
                  </div>
                </div>
              </div>
            </div>

            <div className="overflow-hidden rounded-lg bg-white shadow">
              <div className="p-5">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <Users className="h-6 w-6 text-gray-400" />
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="truncate text-sm font-medium text-gray-500">Appartements</dt>
                      <dd className="text-lg font-medium text-gray-900">{apartments.length}</dd>
                    </dl>
                  </div>
                </div>
              </div>
            </div>

            <div className="overflow-hidden rounded-lg bg-white shadow">
              <div className="p-5">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <Calendar className="h-6 w-6 text-gray-400" />
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="truncate text-sm font-medium text-gray-500">Date de création</dt>
                      <dd className="text-lg font-medium text-gray-900">
                        {new Date(building.createdAt).toLocaleDateString()}
                      </dd>
                    </dl>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'apartments' && (
          <div className="mt-8 flow-root">
            <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
              <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
                <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 sm:rounded-lg">
                  <table className="min-w-full divide-y divide-gray-300">
                    <thead className="bg-gray-50">
                      <tr>
                        <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6">
                          Numéro
                        </th>
                        <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                          Étage
                        </th>
                        <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                          Surface
                        </th>
                        <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                          Statut
                        </th>
                        <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                          Locataire
                        </th>
                        <th scope="col" className="relative py-3.5 pl-3 pr-4 sm:pr-6">
                          <span className="sr-only">Actions</span>
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 bg-white">
                      {apartments.map((apartment) => (
                        <tr key={apartment.id}>
                          <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6">
                            {apartment.number}
                          </td>
                          <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{apartment.floor}</td>
                          <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{apartment.area} m²</td>
                          <td className="whitespace-nowrap px-3 py-4 text-sm">
                            <span
                              className={`inline-flex rounded-full px-2 text-xs font-semibold leading-5 ${
                                apartment.status === 'occupied'
                                  ? 'bg-green-100 text-green-800'
                                  : 'bg-gray-100 text-gray-800'
                              }`}
                            >
                              {apartment.status === 'occupied' ? 'Occupé' : 'Libre'}
                            </span>
                          </td>
                          <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                            {apartment.tenant ? (
                              <div>
                                <div className="font-medium text-gray-900">{apartment.tenant.name}</div>
                                <div className="text-gray-500">{apartment.tenant.email}</div>
                              </div>
                            ) : (
                              '-'
                            )}
                          </td>
                          <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                            <Link
                              href={`/dashboard/buildings/${building.id}/apartments/${apartment.id}`}
                              className="text-primary-dark hover:text-primary-dark/80"
                            >
                              Voir détails
                            </Link>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'charges' && (
          <div className="text-center py-12">
            <FileText className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">Aucune charge</h3>
            <p className="mt-1 text-sm text-gray-500">Commencez par ajouter une charge pour ce bâtiment.</p>
            <div className="mt-6">
              <Link
                href={`/dashboard/buildings/${building.id}/charges/new`}
                className="inline-flex items-center rounded-md border border-transparent bg-primary-dark px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-primary-dark/90 focus:outline-none focus:ring-2 focus:ring-primary-dark focus:ring-offset-2"
              >
                <Plus className="mr-2 h-4 w-4" />
                Nouvelle charge
              </Link>
            </div>
          </div>
        )}

        {activeTab === 'documents' && (
          <div className="text-center py-12">
            <FileText className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">Aucun document</h3>
            <p className="mt-1 text-sm text-gray-500">Commencez par ajouter un document pour ce bâtiment.</p>
            <div className="mt-6">
              <Link
                href={`/dashboard/buildings/${building.id}/documents/new`}
                className="inline-flex items-center rounded-md border border-transparent bg-primary-dark px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-primary-dark/90 focus:outline-none focus:ring-2 focus:ring-primary-dark focus:ring-offset-2"
              >
                <Plus className="mr-2 h-4 w-4" />
                Nouveau document
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
} 