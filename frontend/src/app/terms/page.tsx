'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { authService } from '@/services/auth.service';

export default function TermsPage() {
  const router = useRouter();
  const [terms, setTerms] = useState<any>(null);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const loadTerms = async () => {
      try {
        const response = await authService.getTerms();
        setTerms(response);
      } catch (err) {
        setError('Erreur lors du chargement des conditions d\'utilisation');
      }
    };

    loadTerms();
  }, []);

  const handleAccept = async () => {
    try {
      setIsLoading(true);
      setError('');

      await authService.acceptTerms(terms.version);
      router.push('/dashboard');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Erreur lors de l\'acceptation des conditions');
    } finally {
      setIsLoading(false);
    }
  };

  if (!terms) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="bg-white shadow sm:rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <h3 className="text-lg leading-6 font-medium text-gray-900">
              Conditions d'utilisation
            </h3>
            <div className="mt-2 max-w-xl text-sm text-gray-500">
              <p>Version {terms.version} - Dernière mise à jour le {new Date(terms.updatedAt).toLocaleDateString()}</p>
            </div>

            {error && (
              <div className="mt-4 bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded">
                {error}
              </div>
            )}

            <div className="mt-6 prose prose-sm max-w-none">
              <div dangerouslySetInnerHTML={{ __html: terms.content }} />
            </div>

            <div className="mt-6 flex justify-end">
              <button
                type="button"
                onClick={handleAccept}
                disabled={isLoading}
                className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? 'Acceptation en cours...' : 'J\'accepte les conditions'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 