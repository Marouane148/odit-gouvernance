'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

const buildingSchema = z.object({
  name: z
    .string()
    .min(1, 'Le nom est requis')
    .max(100, 'Le nom ne doit pas dépasser 100 caractères'),
  address: z
    .string()
    .min(1, 'L\'adresse est requise')
    .max(200, 'L\'adresse ne doit pas dépasser 200 caractères'),
  totalArea: z
    .number()
    .min(1, 'La surface totale doit être supérieure à 0')
    .max(10000, 'La surface totale ne doit pas dépasser 10000 m²'),
  description: z
    .string()
    .max(500, 'La description ne doit pas dépasser 500 caractères')
    .optional(),
  status: z.enum(['active', 'inactive']),
});

type BuildingFormData = z.infer<typeof buildingSchema>;

export default function NewBuildingPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<BuildingFormData>({
    resolver: zodResolver(buildingSchema),
    defaultValues: {
      status: 'active',
    },
  });

  const onSubmit = async (data: BuildingFormData) => {
    try {
      setIsLoading(true);
      setError('');

      // TODO: Appel API pour créer le bâtiment
      console.log('Données du formulaire:', data);

      // Redirection vers la liste des bâtiments
      router.push('/dashboard/buildings');
    } catch (err: any) {
      setError(err.message || 'Une erreur est survenue lors de la création du bâtiment');
    } finally {
      setIsLoading(false);
    }
  };

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

      <div className="md:grid md:grid-cols-3 md:gap-6">
        <div className="md:col-span-1">
          <h3 className="text-lg font-medium leading-6 text-gray-900">Nouveau bâtiment</h3>
          <p className="mt-1 text-sm text-gray-500">
            Remplissez les informations ci-dessous pour créer un nouveau bâtiment.
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
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                    Nom du bâtiment
                  </label>
                  <div className="mt-1">
                    <input
                      type="text"
                      {...register('name')}
                      className="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-dark focus:ring-primary-dark sm:text-sm"
                    />
                    {errors.name && (
                      <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>
                    )}
                  </div>
                </div>

                <div>
                  <label htmlFor="address" className="block text-sm font-medium text-gray-700">
                    Adresse
                  </label>
                  <div className="mt-1">
                    <input
                      type="text"
                      {...register('address')}
                      className="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-dark focus:ring-primary-dark sm:text-sm"
                    />
                    {errors.address && (
                      <p className="mt-1 text-sm text-red-600">{errors.address.message}</p>
                    )}
                  </div>
                </div>

                <div>
                  <label htmlFor="totalArea" className="block text-sm font-medium text-gray-700">
                    Surface totale (m²)
                  </label>
                  <div className="mt-1">
                    <input
                      type="number"
                      {...register('totalArea', { valueAsNumber: true })}
                      className="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-dark focus:ring-primary-dark sm:text-sm"
                    />
                    {errors.totalArea && (
                      <p className="mt-1 text-sm text-red-600">{errors.totalArea.message}</p>
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

                <div>
                  <label htmlFor="status" className="block text-sm font-medium text-gray-700">
                    Statut
                  </label>
                  <div className="mt-1">
                    <select
                      {...register('status')}
                      className="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-dark focus:ring-primary-dark sm:text-sm"
                    >
                      <option value="active">Actif</option>
                      <option value="inactive">Inactif</option>
                    </select>
                    {errors.status && (
                      <p className="mt-1 text-sm text-red-600">{errors.status.message}</p>
                    )}
                  </div>
                </div>
              </div>

              <div className="bg-gray-50 px-4 py-3 text-right sm:px-6">
                <button
                  type="submit"
                  disabled={isLoading}
                  className="inline-flex justify-center rounded-md border border-transparent bg-primary-dark py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-primary-dark/90 focus:outline-none focus:ring-2 focus:ring-primary-dark focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? 'Création en cours...' : 'Créer le bâtiment'}
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
} 