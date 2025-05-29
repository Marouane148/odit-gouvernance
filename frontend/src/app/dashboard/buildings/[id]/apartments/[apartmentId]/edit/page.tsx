'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

// Types (doit correspondre à la structure des données de l'API)
type Apartment = {
  id: number;
  number: string;
  floor: number;
  area: number;
  status: 'occupied' | 'vacant';
  description?: string;
  // Ajoutez d'autres champs pertinents ici
};

const apartmentSchema = z.object({
  number: z.string().min(1, 'Le numéro d\'appartement est requis').max(50, 'Le numéro ne doit pas dépasser 50 caractères'),
  floor: z.number().min(0, 'L\'étage ne peut pas être négatif').max(100, 'L\'étage ne doit pas dépasser 100'),
  area: z.number().min(1, 'La surface doit être supérieure à 0').max(500, 'La surface ne doit pas dépasser 500 m²'),
  status: z.enum(['occupied', 'vacant']),
  description: z.string().max(500, 'La description ne doit pas dépasser 500 caractères').optional(),
});

type ApartmentFormData = z.infer<typeof apartmentSchema>;

// Données de test pour le chargement (à remplacer par l'appel API)
const mockApartment: Apartment = {
  id: 1,
  number: 'A101',
  floor: 1,
  area: 75,
  status: 'occupied',
  description: 'Appartement lumineux avec balcon',
};

export default function EditApartmentPage() {
  const router = useRouter();
  const params = useParams();
  const buildingId = params.id as string;
  const apartmentId = params.apartmentId as string;

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [apartment, setApartment] = useState<Apartment | null>(null);
  const [pageLoading, setPageLoading] = useState(true);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ApartmentFormData>({
    resolver: zodResolver(apartmentSchema),
  });

  useEffect(() => {
    // TODO: Charger les données de l'appartement depuis l'API
    // Exemple avec données mockées:
    const fetchApartment = async () => {
       // Simuler un chargement API
      await new Promise(resolve => setTimeout(resolve, 500));
      setApartment(mockApartment);
      reset(mockApartment); // Pré-remplir le formulaire avec les données chargées
      setPageLoading(false);
    };

    fetchApartment();

  }, [buildingId, apartmentId, reset]); // Dependances pour re-exécuter si l'ID change


  const onSubmit = async (data: ApartmentFormData) => {
    try {
      setIsLoading(true);
      setError('');

      // TODO: Appel API pour modifier l'appartement
      console.log('Données du formulaire de modification:', data, 'pour l\'appartement', apartmentId, 'dans le bâtiment', buildingId);

      // Redirection vers la page de détails de l'appartement
      router.push(`/dashboard/buildings/${buildingId}/apartments/${apartmentId}`);
    } catch (err: any) {
      setError(err.message || 'Une erreur est survenue lors de la modification de l\'appartement');
    } finally {
      setIsLoading(false);
    }
  };

  if (pageLoading) {
    return <div className="text-center py-12">Chargement de l'appartement...</div>;
  }

  if (!apartment) {
      return <div className="text-center py-12 text-red-600">Erreur: Appartement introuvable.</div>;
  }

  return (
    <div>
      <div className="mb-6">
        <Link
          href={`/dashboard/buildings/${buildingId}/apartments/${apartmentId}`}
          className="inline-flex items-center text-sm font-medium text-gray-600 hover:text-gray-900"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Retour à l'appartement
        </Link>
      </div>

      <div className="md:grid md:grid-cols-3 md:gap-6">
        <div className="md:col-span-1">
          <h3 className="text-lg font-medium leading-6 text-gray-900">Modifier l'appartement</h3>
          <p className="mt-1 text-sm text-gray-500">
            Modifiez les informations de l'appartement.
          </p>
        </div>

        <div className="mt-5 md:col-span-2 md:mt-0">
          <form onSubmit={handleSubmit(onSubmit)}>
            {error && (
              <div className="mb-4 rounded-md bg-red-50 p-4">
                <div className="flex">
                  <div className="ml-3">
                    <h3 className="text-sm font-medium text-red-800">{error}</h3>
                  </div>
                </div>
              </div>
            )}

            <div className="shadow sm:overflow-hidden sm:rounded-md">
              <div className="space-y-6 bg-white px-4 py-5 sm:p-6">
                <div>
                  <label htmlFor="number" className="block text-sm font-medium text-gray-700">
                    Numéro d'appartement
                  </label>
                  <div className="mt-1">
                    <input
                      type="text"
                      {...register('number')}
                      className="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-dark focus:ring-primary-dark sm:text-sm"
                    />
                    {errors.number && (
                      <p className="mt-1 text-sm text-red-600">{errors.number.message}</p>
                    )}
                  </div>
                </div>

                <div>
                  <label htmlFor="floor" className="block text-sm font-medium text-gray-700">
                    Étage
                  </label>
                  <div className="mt-1">
                    <input
                      type="number"
                      {...register('floor', { valueAsNumber: true })}
                      className="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-dark focus:ring-primary-dark sm:text-sm"
                    />
                    {errors.floor && (
                      <p className="mt-1 text-sm text-red-600">{errors.floor.message}</p>
                    )}
                  </div>
                </div>

                <div>
                  <label htmlFor="area" className="block text-sm font-medium text-gray-700">
                    Surface (m²)
                  </label>
                  <div className="mt-1">
                    <input
                      type="number"
                      {...register('area', { valueAsNumber: true })}
                      className="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-dark focus:ring-primary-dark sm:text-sm"
                    />
                    {errors.area && (
                      <p className="mt-1 text-sm text-red-600">{errors.area.message}</p>
                    )}
                  </div>
                </div>

                <div>
                  <label htmlFor="status" className="block text-sm font-medium text-gray-700">
                    Statut
                  </label>
                  <div className="mt-1">
                    <select
                      {...register('status')}
                      className="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-dark focus:ring-primary-dark sm:text-sm"
                    >
                      <option value="vacant">Libre</option>
                      <option value="occupied">Occupé</option>
                    </select>
                    {errors.status && (
                      <p className="mt-1 text-sm text-red-600">{errors.status.message}</p>
                    )}
                  </div>
                </div>

                 <div>
                  <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                    Description
                  </label>
                  <div className="mt-1">
                    <textarea
                      {...register('description')}
                      rows={3}
                      className="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-dark focus:ring-primary-dark sm:text-sm"
                    />
                    {errors.description && (
                      <p className="mt-1 text-sm text-red-600">{errors.description.message}</p>
                    )}
                  </div>
                </div>

                {/* Section Locataire (conditionnelle) - À implémenter plus tard */}
                {/* {
                  apartment && apartment.status === 'occupied' && (
                    <div>
                      <h4 className="text-lg font-medium leading-6 text-gray-900 mt-6">Informations Locataire</h4>
                      <div className="mt-4 space-y-4">
                         TODO: Champs locataire pour modification
                      </div>
                    </div>
                  )
                } */}

              </div>

              <div className="bg-gray-50 px-4 py-3 text-right sm:px-6">
                <button
                  type="submit"
                  disabled={isLoading}
                  className="inline-flex justify-center rounded-md border border-transparent bg-primary-dark py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-primary-dark/90 focus:outline-none focus:ring-2 focus:ring-primary-dark focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? 'Modification en cours...' : 'Enregistrer les modifications'}
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
} 