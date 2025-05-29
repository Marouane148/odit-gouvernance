'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Plus, Search, Edit, Trash2, Building2 } from 'lucide-react';

// Type pour les bâtiments
type Building = {
  id: number;
  name: string;
  address: string;
  apartmentsCount: number;
  totalArea: number;
  status: 'active' | 'inactive';
};

// Données de test (à remplacer par l'appel API)
const buildings: Building[] = [
  {
    id: 1,
    name: 'Résidence Les Jardins',
    address: '123 Avenue des Fleurs, Paris',
    apartmentsCount: 24,
    totalArea: 2400,
    status: 'active',
  },
  {
    id: 2,
    name: 'Immeuble Le Parc',
    address: '45 Rue du Commerce, Lyon',
    apartmentsCount: 12,
    totalArea: 1200,
    status: 'active',
  },
  // Ajoutez d'autres bâtiments de test ici
];

export default function BuildingsPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [buildingToDelete, setBuildingToDelete] = useState<number | null>(null);

  const filteredBuildings = buildings.filter((building) =>
    building.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    building.address.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleDeleteClick = (buildingId: number) => {
    setBuildingToDelete(buildingId);
    setShowConfirmModal(true);
  };

  const handleConfirmDelete = () => {
    if (buildingToDelete !== null) {
      // TODO: Appeler l'API pour supprimer le bâtiment avec l'ID buildingToDelete
      console.log('Supprimer le bâtiment avec ID:', buildingToDelete);
      // Mettre à jour l'état ou recharger les données après suppression réussie
    }
    // Fermer la modale quelle que soit l'issue (succès/échec sera géré par l'API)
    setShowConfirmModal(false);
    setBuildingToDelete(null);
  };

  const handleCancelDelete = () => {
    setShowConfirmModal(false);
    setBuildingToDelete(null);
  };

  return (
    <div>
      <div className="sm:flex sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Bâtiments</h1>
          <p className="mt-2 text-sm text-gray-700">
            Liste de tous les bâtiments gérés dans l'application
          </p>
        </div>
        <div className="mt-4 sm:mt-0">
          <Link
            href="/dashboard/buildings/new"
            className="inline-flex items-center justify-center rounded-md border border-transparent bg-primary-dark px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-primary-dark/90 focus:outline-none focus:ring-2 focus:ring-primary-dark focus:ring-offset-2"
          >
            <Plus className="mr-2 h-4 w-4" />
            Nouveau bâtiment
          </Link>
        </div>
      </div>

      {/* Search bar */}
      <div className="mt-4">
        <div className="relative rounded-md shadow-sm">
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
            <Search className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="block w-full rounded-md border-gray-300 pl-10 focus:border-primary-dark focus:ring-primary-dark sm:text-sm"
            placeholder="Rechercher un bâtiment..."
          />
        </div>
      </div>

      {/* Buildings table */}
      <div className="mt-8 flow-root">
        <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
          <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
            <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 sm:rounded-lg">
              <table className="min-w-full divide-y divide-gray-300">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6">
                      Nom
                    </th>
                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                      Adresse
                    </th>
                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                      Appartements
                    </th>
                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                      Surface totale
                    </th>
                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                      Statut
                    </th>
                    <th scope="col" className="relative py-3.5 pl-3 pr-4 sm:pr-6">
                      <span className="sr-only">Actions</span>
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 bg-white">
                  {filteredBuildings.map((building) => (
                    <tr key={building.id}>
                      <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6">
                        <div className="flex items-center">
                          <Building2 className="mr-2 h-5 w-5 text-gray-400" />
                          {building.name}
                        </div>
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{building.address}</td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{building.apartmentsCount}</td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{building.totalArea} m²</td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm">
                        <span
                          className={`inline-flex rounded-full px-2 text-xs font-semibold leading-5 ${
                            building.status === 'active'
                              ? 'bg-green-100 text-green-800'
                              : 'bg-red-100 text-red-800'
                          }`}
                        >
                          {building.status === 'active' ? 'Actif' : 'Inactif'}
                        </span>
                      </td>
                      <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                        <div className="flex justify-end space-x-2">
                          <Link
                            href={`/dashboard/buildings/${building.id}/edit`}
                            className="text-secondary-light hover:text-secondary-light/80"
                          >
                            <Edit className="h-5 w-5" />
                          </Link>
                          <button
                            onClick={() => handleDeleteClick(building.id)}
                            className="text-red-600 hover:text-red-900"
                          >
                            <Trash2 className="h-5 w-5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      {/* Confirmation Modal */}
      {showConfirmModal && (
        <div
          className="relative z-10" // Higher z-index to appear on top
          aria-labelledby="modal-title"
          role="dialog"
          aria-modal="true"
        >
          <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"></div>

          <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
            <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
              <div className="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg">
                <div className="bg-white px-4 pb-4 pt-5 sm:p-6 sm:pb-4">
                  <div className="sm:flex sm:items-start">
                    <div className="mx-auto flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10">
                      <Trash2 className="h-6 w-6 text-red-600" aria-hidden="true" />
                    </div>
                    <div className="mt-3 text-center sm:ml-4 sm:mt-0 sm:text-left">
                      <h3
                        className="text-base font-semibold leading-6 text-gray-900"
                        id="modal-title"
                      >
                        Supprimer le bâtiment
                      </h3>
                      <div className="mt-2">
                        <p className="text-sm text-gray-500">
                          Êtes-vous sûr de vouloir supprimer ce bâtiment ? Cette action est irréversible et supprimera également tous les appartements associés.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
                  <button
                    type="button"
                    className="inline-flex w-full justify-center rounded-md bg-red-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-red-500 sm:ml-3 sm:w-auto"
                    onClick={handleConfirmDelete}
                  >
                    Supprimer
                  </button>
                  <button
                    type="button"
                    className="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:mt-0 sm:w-auto"
                    onClick={handleCancelDelete}
                  >
                    Annuler
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 