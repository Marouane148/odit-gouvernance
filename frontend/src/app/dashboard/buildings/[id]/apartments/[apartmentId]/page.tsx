'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { ArrowLeft, Home, Users, ClipboardList, DollarSign, FileText } from 'lucide-react';

// Types
type Apartment = {
  id: number;
  number: string;
  floor: number;
  area: number;
  status: 'occupied' | 'vacant';
  description?: string;
  tenant?: {
    id: number;
    name: string;
    email: string;
    phone?: string;
  };
  // Ajoutez d'autres champs pertinents ici (ex: bail, historique paiements, etc.)
};

// Données de test (à remplacer par l'appel API)
const apartment: Apartment = {
  id: 1,
  number: 'A101',
  floor: 1,
  area: 75,
  status: 'occupied',
  description: 'Appartement lumineux avec balcon',
  tenant: {
    id: 1,
    name: 'Jean Dupont',
    email: 'jean.dupont@email.com',
    phone: '06 12 34 56 78',
  },
};

export default function ApartmentDetailsPage() {
  const params = useParams();
  const buildingId = params.id as string;
  const apartmentId = params.apartmentId as string;

  const [activeTab, setActiveTab] = useState<'overview' | 'tenant' | 'lease' | 'payments' | 'documents'>('overview');

  // TODO: Charger les données de l'appartement et du bâtiment à partir de l'API en utilisant buildingId et apartmentId

  return (
    <div>
      <div className="mb-6">
        <Link
          href={`/dashboard/buildings/${buildingId}`}
          className="inline-flex items-center text-sm font-medium text-gray-600 hover:text-gray-900"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Retour au bâtiment
        </Link>
      </div>

      {/* En-tête de l'appartement */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <Home className="h-8 w-8 text-gray-400" />
            <div className="ml-4">
              <h1 className="text-2xl font-semibold text-gray-900">Appartement {apartment.number}</h1>
              <p className="text-sm text-gray-500">Étage {apartment.floor} - {apartment.area} m²</p>
            </div>
          </div>
          <div className="flex space-x-3">
            <Link
              href={`/dashboard/buildings/${buildingId}/apartments/${apartment.id}/edit`}
              className="inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary-dark focus:ring-offset-2"
            >
              Modifier l'appartement
            </Link>
            {/* TODO: Ajouter un bouton pour gérer le locataire (ajouter/modifier/retirer) */}
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
          {apartment.status === 'occupied' && (
            <button
              onClick={() => setActiveTab('tenant')}
              className={`${
                activeTab === 'tenant'
                  ? 'border-primary-dark text-primary-dark'
                  : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
              } whitespace-nowrap border-b-2 py-4 px-1 text-sm font-medium`}
            >
              Locataire
            </button>
          )}
          {/* TODO: Ajouter des onglets conditionnels pour Bail, Paiements, Documents si pertinent */}
          <button
            onClick={() => setActiveTab('lease')}
            className={`${
              activeTab === 'lease'
                ? 'border-primary-dark text-primary-dark'
                : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
            } whitespace-nowrap border-b-2 py-4 px-1 text-sm font-medium`}
          >
            Bail
          </button>
             <button
            onClick={() => setActiveTab('payments')}
            className={`${
              activeTab === 'payments'
                ? 'border-primary-dark text-primary-dark'
                : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
            } whitespace-nowrap border-b-2 py-4 px-1 text-sm font-medium`}
          >
            Paiements
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
          <div className="rounded-lg bg-white shadow p-6">
            <h3 className="text-lg font-medium leading-6 text-gray-900 mb-4">Informations Générales</h3>
            <dl className="grid grid-cols-1 gap-x-4 gap-y-8 sm:grid-cols-2">
              <div className="sm:col-span-1">
                <dt className="text-sm font-medium text-gray-500">Statut</dt>
                <dd className="mt-1 text-sm text-gray-900">
                   <span
                              className={`inline-flex rounded-full px-2 text-xs font-semibold leading-5 ${
                                apartment.status === 'occupied'
                                  ? 'bg-green-100 text-green-800'
                                  : 'bg-gray-100 text-gray-800'
                              }`}
                            >
                              {apartment.status === 'occupied' ? 'Occupé' : 'Libre'}
                            </span>
                </dd>
              </div>
               <div className="sm:col-span-1">
                <dt className="text-sm font-medium text-gray-500">Numéro</dt>
                <dd className="mt-1 text-sm text-gray-900">{apartment.number}</dd>
              </div>
               <div className="sm:col-span-1">
                <dt className="text-sm font-medium text-gray-500">Étage</dt>
                <dd className="mt-1 text-sm text-gray-900">{apartment.floor}</dd>
              </div>
               <div className="sm:col-span-1">
                <dt className="text-sm font-medium text-gray-500">Surface</dt>
                <dd className="mt-1 text-sm text-gray-900">{apartment.area} m²</dd>
              </div>
               {apartment.description && (
                 <div className="sm:col-span-2">
                <dt className="text-sm font-medium text-gray-500">Description</dt>
                <dd className="mt-1 text-sm text-gray-900">{apartment.description}</dd>
              </div>
               )}
            </dl>
          </div>
        )}

        {activeTab === 'tenant' && apartment.tenant && (
          <div className="rounded-lg bg-white shadow p-6">
             <h3 className="text-lg font-medium leading-6 text-gray-900 mb-4">Informations Locataire</h3>
             <dl className="grid grid-cols-1 gap-x-4 gap-y-8 sm:grid-cols-2">
               <div className="sm:col-span-1">
                <dt className="text-sm font-medium text-gray-500">Nom</dt>
                <dd className="mt-1 text-sm text-gray-900">{apartment.tenant.name}</dd>
              </div>
                <div className="sm:col-span-1">
                <dt className="text-sm font-medium text-gray-500">Email</dt>
                <dd className="mt-1 text-sm text-gray-900">{apartment.tenant.email}</dd>
              </div>
               {apartment.tenant.phone && (
                  <div className="sm:col-span-1">
                <dt className="text-sm font-medium text-gray-500">Téléphone</dt>
                <dd className="mt-1 text-sm text-gray-900">{apartment.tenant.phone}</dd>
              </div>
               )}
               {/* TODO: Ajouter d'autres infos locataire si nécessaire */}
             </dl>
          </div>
        )}

        {activeTab === 'lease' && (
            <div className="text-center py-12">
            <ClipboardList className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">Aucun bail associé</h3>
            <p className="mt-1 text-sm text-gray-500">Commencez par ajouter un bail pour cet appartement.</p>
            {/* TODO: Ajouter un bouton pour créer un nouveau bail */}
          </div>
        )}

        {activeTab === 'payments' && (
             <div className="text-center py-12">
            <DollarSign className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">Aucun paiement enregistré</h3>
            <p className="mt-1 text-sm text-gray-500">Enregistrez les paiements reçus pour cet appartement.</p>
             {/* TODO: Ajouter un bouton pour enregistrer un paiement */}
          </div>
        )}

         {activeTab === 'documents' && (
             <div className="text-center py-12">
            <FileText className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">Aucun document</h3>
            <p className="mt-1 text-sm text-gray-500">Ajoutez les documents relatifs à cet appartement (baux, quittances, etc.).</p>
             {/* TODO: Ajouter un bouton pour ajouter un document */}
          </div>
        )}
      </div>
    </div>
  );
} 