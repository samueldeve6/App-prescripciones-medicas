'use client';

import { useEffect, useState } from 'react';
import { fetcher } from '@/lib/fetcher';
import { useAuthStore } from '@/store/authStore';
import { FileText, CheckCircle, Clock, LogOut } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface PrescriptionItem {
  id: string;
  name: string;
  dosage?: string;
  quantity?: number;
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
  const [prescriptions, setPrescriptions] = useState<Prescription[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  const { user, logout } = useAuthStore();
  const router = useRouter();

  useEffect(() => {
    if (!user || user.role !== 'patient') {
      router.push('/login');
      return;
    }
    loadPrescriptions();
  }, [user]);

  const loadPrescriptions = async () => {
    try {
      setLoading(true);
      // Ajusta este endpoint según tu backend (ej: /prescriptions o /prescriptions/patient)
      const data = await fetcher('/prescriptions/me');
      setPrescriptions(data);
    } catch (err: any) {
      setError(err.message || 'Error al cargar las prescripciones');
    } finally {
      setLoading(false);
    }
  };

  const handleConsume = async (id: string) => {
    try {
      // Endpoint según DTO de la prueba: { consumed: true }
      await fetcher(`/prescriptions/${id}/consume`, {
        method: 'PUT',
        
      });
      
      // Actualizamos el estado local para reflejar el cambio inmediato
      setPrescriptions((prev) =>
        prev.map((p) => (p.id === id ? { ...p, consumed: true } : p))
      );
    } catch (err: any) {
      alert(err.message || 'No se pudo marcar como consumida');
    }
  };

  const handleDownloadPdf = async (id: string) => {
    try {
      // Llamamos al endpoint del backend que genera el PDF usando pdfkit
      const blob = await fetcher(`/prescriptions/${id}/pdf`, { method: 'GET' });
      
      // Crear un link invisible para forzar la descarga en el navegador
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `Prescripcion_${id}.pdf`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
    } catch (err: any) {
      alert(err.message || 'Error al descargar el PDF');
    }
  };

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  if (loading) return <div className="flex min-h-screen items-center justify-center dark:bg-gray-900 dark:text-white">Cargando tus recetas médicas...</div>;
  if (error) return <div className="p-8 text-red-500 text-center dark:bg-gray-900">{error}</div>;

  return (
    <div className="min-h-screen bg-gray-50 p-6 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
      <header className="mb-8 flex items-center justify-between border-b pb-4 dark:border-gray-800">
        <div>
          <h1 className="text-2xl font-bold">Mis Prescripciones Médicas</h1>
          <p className="text-sm text-gray-500">
            Paciente: <span className="font-medium text-gray-700 dark:text-gray-300">{user?.name}</span>
          </p>
        </div>
        <button onClick={handleLogout} className="flex items-center gap-2 rounded bg-gray-200 px-3 py-1.5 text-sm hover:bg-gray-300 dark:bg-gray-800 dark:hover:bg-gray-700">
          <LogOut size={16} /> Salir
        </button>
      </header>

      {/* Manejo de estado vacío exigido por UX/UI */}
      {prescriptions.length === 0 ? (
        <div className="rounded-lg border-2 border-dashed p-12 text-center text-gray-500 dark:border-gray-700">
          No tienes prescripciones médicas asignadas actualmente.
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {prescriptions.map((prescription) => (
            <div key={prescription.id} className="relative rounded-lg bg-white p-6 shadow dark:bg-gray-800 flex flex-col justify-between">
              <div>
                <div className="mb-4 flex items-center justify-between">
                  <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium ${
                    prescription.consumed 
                      ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' 
                      : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400'
                  }`}>
                    {prescription.consumed ? <CheckCircle size={12} /> : <Clock size={12} />}
                    {prescription.consumed ? 'Consumida' : 'Pendiente'}
                  </span>
                  <span className="text-xs text-gray-400">
                    {new Date(prescription.createdAt).toLocaleDateString()}
                  </span>
                </div>

                <h3 className="font-semibold text-lg">
                Doctor {prescription.author?.user?.name || prescription.author?.name || 'No asignado'}
                </h3>
                <p className="text-xs text-gray-400 mb-4">
                {prescription.author?.user?.email || 'Sin correo'}
                </p>

                <div className="space-y-3 border-t pt-3 dark:border-gray-700">
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Medicamentos:</p>
                  {prescription.items.map((item) => (
                    <div key={item.id} className="text-sm">
                      <p className="font-medium text-indigo-600 dark:text-indigo-400">{item.name} <span className="text-xs text-gray-500">x{item.quantity || 1}</span></p>
                      {item.dosage && <p className="text-xs text-gray-500">Dosis: {item.dosage}</p>}
                      {item.instructions && <p className="text-xs text-gray-400 italic">Instrucciones: {item.instructions}</p>}
                    </div>
                  ))}
                </div>

                {prescription.notes && (
                  <div className="mt-3 rounded bg-gray-50 p-2 text-xs text-gray-600 dark:bg-gray-700/50 dark:text-gray-300">
                    <strong>Notas:</strong> {prescription.notes}
                  </div>
                )}
              </div>

              <div className="mt-6 grid grid-cols-2 gap-2 border-t pt-4 dark:border-gray-700">
                <button
                  onClick={() => handleDownloadPdf(prescription.id)}
                  className="flex items-center justify-center gap-1 rounded bg-indigo-50 px-3 py-2 text-xs font-medium text-indigo-600 hover:bg-indigo-100 dark:bg-indigo-950/40 dark:text-indigo-400 dark:hover:bg-indigo-900/50"
                >
                  <FileText size={14} /> PDF
                </button>
                
                <button
                  onClick={() => handleConsume(prescription.id)}
                  disabled={prescription.consumed}
                  className="rounded bg-green-600 px-3 py-2 text-xs font-medium text-white hover:bg-green-500 disabled:bg-gray-100 disabled:text-gray-400 dark:disabled:bg-gray-800 dark:disabled:text-gray-600"
                >
                  {prescription.consumed ? 'Consumida' : 'Marcar Consumo'}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}