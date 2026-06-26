'use client';

import { useEffect, useState } from 'react';
import { fetcher } from '@/lib/fetcher';
import { useAuthStore } from '@/store/authStore';
import { CheckCircle, Clock, FileText, LogOut, ChevronLeft, ChevronRight, Filter } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface PrescriptionItem {
  id: string;
  name: string;
  dosage: string;
  quantity: number;
  instructions?: string;
}

interface Prescription {
  id: string;
  createdAt: string;
  consumed: boolean;
  notes?: string;
  author?: {
    user: {
      name: string;
      email?: string;
    };
    name?: string;
  };
  items: PrescriptionItem[];
}

export default function PatientPrescriptionsPage() {
  const { user, logout } = useAuthStore();
  const router = useRouter();

  const [mounted, setMounted] = useState(false);
  const [prescriptions, setPrescriptions] = useState<Prescription[]>([]);
  const [loading, setLoading] = useState(true);

  // ESTADOS DE PAGINACIÓN Y FILTROS
  const [statusFilter, setStatusFilter] = useState<string>(''); // '' = Todas, 'pending', 'consumed'
  const [page, setPage] = useState<number>(1);
  const limit = 5; // Cantidad de recetas por página

  useEffect(() => {
    setMounted(true);
    if (!user || user.role !== 'patient') {
      router.push('/login');
    }
  }, [user]);

  // Cada vez que la página o el filtro cambien, volvemos a consultar al backend
  useEffect(() => {
    if (user && user.role === 'patient') {
      loadPrescriptions();
    }
  }, [page, statusFilter, user]);

  const loadPrescriptions = async () => {
    try {
      setLoading(true);
      
      // Construimos las Query Params dinámicamente para tu backend
      let url = `/prescriptions/me?page=${page}&limit=${limit}`;
      if (statusFilter) {
        url += `&status=${statusFilter}`;
      }

      const data = await fetcher(url);
      setPrescriptions(data);
    } catch (err) {
      console.error('Error al cargar prescripciones del paciente:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleConsume = async (id: string) => {
    try {
      await fetcher(`/prescriptions/${id}/consume`, { method: 'PUT' });
      // Actualización reactiva local
      setPrescriptions((prev) =>
        prev.map((p) => (p.id === id ? { ...p, consumed: true } : p))
      );
    } catch (err: any) {
      alert(err.message || 'No se pudo marcar como consumida');
    }
  };

  const handleDownloadPdf = (id: string) => {
    window.open(`http://localhost:3000/prescriptions/${id}/pdf`, '_blank');
  };

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  // Manejador para cambiar de filtro (resetea siempre a la página 1)
  const handleFilterChange = (status: string) => {
    setStatusFilter(status);
    setPage(1);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
      {/* Header */}
      <header className="mb-8 flex items-center justify-between border-b pb-4 dark:border-gray-800">
        <div>
          <h1 className="text-2xl font-bold">Mis Prescripciones Médicas</h1>
          <p className="text-sm text-gray-500">
            Paciente: <span className="font-medium text-gray-700 dark:text-gray-300">{mounted ? user?.name : 'Cargando...'}</span>
          </p>
        </div>
        <button onClick={handleLogout} className="flex items-center gap-2 rounded bg-gray-200 px-3 py-1.5 text-sm hover:bg-gray-300 dark:bg-gray-800 dark:hover:bg-gray-700">
          <LogOut size={16} /> Salir
        </button>
      </header>

      {/* BARRA DE FILTROS AVANZADOS */}
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4 bg-white p-4 rounded-lg shadow-sm dark:bg-gray-800">
        <div className="flex items-center gap-2 text-sm font-semibold text-gray-600 dark:text-gray-400">
          <Filter size={16} />
          <span>Filtrar por estado:</span>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => handleFilterChange('')}
            className={`px-3 py-1.5 text-xs font-medium rounded transition ${
              statusFilter === '' 
                ? 'bg-indigo-600 text-white' 
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600'
            }`}
          >
            Todas
          </button>
          <button
            onClick={() => handleFilterChange('pending')}
            className={`px-3 py-1.5 text-xs font-medium rounded transition ${
              statusFilter === 'pending' 
                ? 'bg-yellow-500 text-white' 
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600'
            }`}
          >
            Pendientes
          </button>
          <button
            onClick={() => handleFilterChange('consumed')}
            className={`px-3 py-1.5 text-xs font-medium rounded transition ${
              statusFilter === 'consumed' 
                ? 'bg-green-600 text-white' 
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600'
            }`}
          >
            Consumidas
          </button>
        </div>
      </div>

      {/* LISTADO DE RECETAS */}
      {loading ? (
        <div className="text-center py-12 text-gray-500">Cargando tus recetas...</div>
      ) : prescriptions.length === 0 ? (
        <div className="text-center py-12 text-gray-500 italic bg-white rounded-lg shadow-sm dark:bg-gray-800">
          No se encontraron recetas médicas con el filtro seleccionado.
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {prescriptions.map((prescription) => {
            const isConsumed = prescription.consumed || (prescription as any).status === 'consumed';

            return (
              <div key={prescription.id} className="relative flex flex-col justify-between rounded-xl bg-white p-6 shadow-md transition-shadow hover:shadow-lg dark:bg-gray-800 border-t-4 border-indigo-500">
                <div>
                  {/* Status Badge */}
                  <div className="mb-4 flex items-center justify-between">
                    <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                      isConsumed ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400'
                    }`}>
                      {isConsumed ? <CheckCircle size={12} /> : <Clock size={12} />}
                      {isConsumed ? 'Consumida' : 'Pendiente'}
                    </span>
                    <span className="text-xs text-gray-400">
                      {mounted ? new Date(prescription.createdAt).toLocaleDateString() : ''}
                    </span>
                  </div>

                  {/* Doctor Info */}
                  <h3 className="font-semibold text-lg">
                    Dr. {prescription.author?.user?.name || prescription.author?.name || 'No asignado'}
                  </h3>
                  <p className="text-xs text-gray-400 mb-4">
                    {prescription.author?.user?.email || 'Sin correo'}
                  </p>

                  {/* Items List */}
                  <div className="border-t pt-3 dark:border-gray-700">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-2">Medicamentos:</h4>
                    <ul className="space-y-3">
                      {prescription.items.map((item) => (
                        <li key={item.id} className="text-sm bg-gray-50 p-2 rounded dark:bg-gray-700/50">
                          <div className="font-semibold text-gray-800 dark:text-gray-200">
                            {item.name} <span className="text-xs text-gray-400">x{item.quantity}</span>
                          </div>
                          <div className="text-xs text-gray-500 dark:text-gray-400">Dosis: {item.dosage}</div>
                          {item.instructions && (
                            <div className="text-xs italic text-gray-400 mt-0.5">Inst: {item.instructions}</div>
                          )}
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Notas */}
                  {prescription.notes && (
                    <div className="mt-4 border-t pt-2 text-xs text-gray-500 dark:border-gray-700">
                      <strong>Notas:</strong> {prescription.notes}
                    </div>
                  )}
                </div>

                {/* Acciones */}
                <div className="mt-6 flex gap-2 border-t pt-4 dark:border-gray-700">
                  <button
                    onClick={() => handleDownloadPdf(prescription.id)}
                    className="flex flex-1 items-center justify-center gap-1.5 rounded border border-gray-300 py-2 text-xs font-medium hover:bg-gray-50 dark:border-gray-600 dark:hover:bg-gray-700"
                  >
                    <FileText size={14} /> PDF
                  </button>
                  
                  {!isConsumed && (
                    <button
                      onClick={() => handleConsume(prescription.id)}
                      className="flex flex-1 items-center justify-center rounded bg-green-600 py-2 text-xs font-semibold text-white hover:bg-green-500 transition"
                    >
                      Marcar Consumo
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* SECCIÓN DE PAGINACIÓN */}
      <div className="mt-8 flex items-center justify-center gap-4 border-t pt-4 dark:border-gray-800">
        <button
          onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
          disabled={page === 1}
          className="flex items-center gap-1 rounded border px-3 py-1.5 text-xs font-medium bg-white hover:bg-gray-50 disabled:opacity-40 disabled:hover:bg-white dark:bg-gray-800 dark:border-gray-700 dark:hover:bg-gray-700"
        >
          <ChevronLeft size={14} /> Anterior
        </button>
        
        <span className="text-xs font-semibold text-gray-500">
          Página {page}
        </span>

        <button
          onClick={() => setPage((prev) => prev + 1)}
          disabled={prescriptions.length < limit} // Si trae menos del límite, significa que es la última página
          className="flex items-center gap-1 rounded border px-3 py-1.5 text-xs font-medium bg-white hover:bg-gray-50 disabled:opacity-40 disabled:hover:bg-white dark:bg-gray-800 dark:border-gray-700 dark:hover:bg-gray-700"
        >
          Siguiente <ChevronRight size={14} />
        </button>
      </div>
    </div>
  );
}