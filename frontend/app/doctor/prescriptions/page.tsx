'use client';

import { useEffect, useState } from 'react';
import { fetcher } from '@/lib/fetcher';
import { useAuthStore } from '@/store/authStore';
import { Plus, Trash2, FilePlus, CheckCircle, Clock, LogOut, Search } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface NewItem {
  name: string;
  dosage: string;
  quantity: number;
  instructions: string;
}

interface PatientDB {
  id: string; // ID real de la tabla Patient
  user: {
    name: string;
    email: string;
  };
}

interface Prescription {
  id: string;
  createdAt: string;
  consumed: boolean;
  notes?: string;
  patient: {
    user: {
      name: string;
      email: string;
    };
  };
  items: any[];
}

export default function DoctorPrescriptionsPage() {
  const { user, logout } = useAuthStore();
  const router = useRouter();

  const [mounted, setMounted] = useState(false);
  const [prescriptions, setPrescriptions] = useState<Prescription[]>([]);
  const [loadingList, setLoadingList] = useState(true);

  // Estados para el Buscador de Pacientes
  const [patients, setPatients] = useState<PatientDB[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPatient, setSelectedPatient] = useState<PatientDB | null>(null);
  const [showDropdown, setShowDropdown] = useState(false);

  // Estados del formulario
  const [notes, setNotes] = useState('');
  const [items, setItems] = useState<NewItem[]>([
    { name: '', dosage: '', quantity: 1, instructions: '' }
  ]);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    setMounted(true);
    if (!user || user.role !== 'doctor') {
      router.push('/login');
      return;
    }
    loadDoctorPrescriptions();
    loadPatients();
  }, [user]);

  const loadDoctorPrescriptions = async () => {
    try {
      setLoadingList(true);
      const data = await fetcher('/prescriptions');
      setPrescriptions(data);
    } catch (err: any) {
      console.error('Error al cargar recetas:', err);
    } finally {
      setLoadingList(false);
    }
  };

  // Carga los pacientes para el selector
  const loadPatients = async () => {
    try {
      const data = await fetcher('/prescriptions/patients/search');
      setPatients(data);
    } catch (err) {
      console.error('Error al cargar pacientes para el buscador:', err);
    }
  };

  // Filtrado de pacientes en tiempo real por nombre o email
  const filteredPatients = patients.filter(p =>
    p.user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.user.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleAddItem = () => {
    setItems([...items, { name: '', dosage: '', quantity: 1, instructions: '' }]);
  };

  const handleRemoveItem = (index: number) => {
    if (items.length === 1) return;
    setItems(items.filter((_, i) => i !== index));
  };

  const handleItemChange = (index: number, field: keyof NewItem, value: any) => {
    const newItems = [...items];
    (newItems[index] as any)[field] = value;
    setItems(newItems);
  };

  const handleSubmitPrescription = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedPatient) {
      setError('Por favor, selecciona un paciente de la lista.');
      return;
    }

    try {
      setSubmitting(true);
      setError('');

      const payload = {
        patientId: selectedPatient.id, // Enviamos el ID real de la tabla Patient ya mapeado
        notes,
        items: items.map(item => ({
          name: item.name,
          dosage: item.dosage,
          quantity: Number(item.quantity),
          instructions: item.instructions
        }))
      };

      await fetcher('/prescriptions', {
        method: 'POST',
        body: JSON.stringify(payload),
      });

      // Resetear todo
      setSelectedPatient(null);
      setSearchQuery('');
      setNotes('');
      setItems([{ name: '', dosage: '', quantity: 1, instructions: '' }]);
      
      await loadDoctorPrescriptions();
      alert('¡Prescripción médica creada con éxito!');
    } catch (err: any) {
      setError(err.message || 'Error al crear la prescripción');
    } finally {
      setSubmitting(false);
    }
  };

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
      {/* Header */}
      <header className="mb-8 flex items-center justify-between border-b pb-4 dark:border-gray-800">
        <div>
          <h1 className="text-2xl font-bold">Panel Médico - Prescripciones</h1>
          <p className="text-sm text-gray-500">
            Dr. {mounted ? (user?.name || 'Profesional de la Salud') : 'Cargando...'}
          </p>
        </div>
        <button onClick={handleLogout} className="flex items-center gap-2 rounded bg-gray-200 px-3 py-1.5 text-sm hover:bg-gray-300 dark:bg-gray-800 dark:hover:bg-gray-700">
          <LogOut size={16} /> Salir
        </button>
      </header>

      <div className="grid gap-8 lg:grid-cols-3">
        {/* Formulario */}
        <div className="lg:col-span-2 bg-white p-6 rounded-lg shadow dark:bg-gray-800">
          <div className="flex items-center gap-2 mb-6 border-b pb-2 dark:border-gray-700">
            <FilePlus className="text-indigo-600" size={20} />
            <h2 className="text-lg font-bold">Emitir Nueva Receta Médica</h2>
          </div>

          <form onSubmit={handleSubmitPrescription} className="space-y-6">
            {error && <div className="p-3 bg-red-100 text-red-700 rounded text-sm">{error}</div>}

            {/* BUSCADOR INTERACTIVO DE PACIENTES */}
            <div className="relative">
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-400 mb-1">Paciente Destinatario</label>
              
              {selectedPatient ? (
                <div className="flex items-center justify-between p-2.5 bg-indigo-50 border border-indigo-200 rounded dark:bg-indigo-900/20 dark:border-indigo-800">
                  <div>
                    <span className="font-semibold text-indigo-900 dark:text-indigo-300">{selectedPatient.user.name}</span>
                    <span className="text-xs text-indigo-500 block">{selectedPatient.user.email}</span>
                  </div>
                  <button 
                    type="button" 
                    onClick={() => { setSelectedPatient(null); setSearchQuery(''); }}
                    className="text-xs text-red-500 underline hover:text-red-400"
                  >
                    Cambiar
                  </button>
                </div>
              ) : (
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                    <Search size={16} />
                  </div>
                  <input
                    type="text"
                    placeholder="Escribe el nombre o correo del paciente..."
                    value={searchQuery}
                    onChange={(e) => { setSearchQuery(e.target.value); setShowDropdown(true); }}
                    onFocus={() => setShowDropdown(true)}
                    className="w-full rounded border pl-9 p-2 text-sm dark:bg-gray-700 dark:border-gray-600"
                  />
                  
                  {/* Desplegable de Coincidencias */}
                  {showDropdown && searchQuery && (
                    <div className="absolute z-10 w-full mt-1 bg-white border rounded shadow-lg max-h-60 overflow-y-auto dark:bg-gray-800 dark:border-gray-700">
                      {filteredPatients.length === 0 ? (
                        <div className="p-3 text-xs text-gray-500 italic">No se encontraron pacientes médicos</div>
                      ) : (
                        filteredPatients.map((p) => (
                          <button
                            key={p.id}
                            type="button"
                            onClick={() => {
                              setSelectedPatient(p);
                              setShowDropdown(false);
                            }}
                            className="w-full text-left p-2.5 hover:bg-gray-100 dark:hover:bg-gray-700 border-b last:border-0 dark:border-gray-700 text-sm"
                          >
                            <div className="font-medium text-gray-900 dark:text-gray-100">{p.user.name}</div>
                            <div className="text-xs text-gray-400">{p.user.email}</div>
                          </button>
                        ))
                      )}
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Listado dinámico de medicamentos */}
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-400">Medicamentos y Posología</label>
                <button
                  type="button"
                  onClick={handleAddItem}
                  className="flex items-center gap-1 text-xs font-semibold text-indigo-600 hover:text-indigo-500 dark:text-indigo-400"
                >
                  <Plus size={14} /> Añadir Medicamento
                </button>
              </div>

              {items.map((item, index) => (
                <div key={index} className="p-4 bg-gray-50 dark:bg-gray-700/40 rounded-lg border dark:border-gray-700 space-y-3 relative">
                  {items.length > 1 && (
                    <button
                      type="button"
                      onClick={() => handleRemoveItem(index)}
                      className="absolute top-2 right-2 text-gray-400 hover:text-red-500"
                    >
                      <Trash2 size={16} />
                    </button>
                  )}
                  
                  <div className="grid gap-3 md:grid-cols-3">
                    <div className="md:col-span-2">
                      <input
                        type="text"
                        required
                        placeholder="Nombre del medicamento (ej: Amoxicilina 500mg)"
                        value={item.name}
                        onChange={(e) => handleItemChange(index, 'name', e.target.value)}
                        className="w-full rounded border p-2 text-sm dark:bg-gray-700 dark:border-gray-600"
                      />
                    </div>
                    <div>
                      <input
                        type="number"
                        min="1"
                        required
                        placeholder="Cant."
                        value={item.quantity}
                        onChange={(e) => handleItemChange(index, 'quantity', e.target.value)}
                        className="w-full rounded border p-2 text-sm dark:bg-gray-700 dark:border-gray-600"
                      />
                    </div>
                  </div>

                  <div className="grid gap-3 md:grid-cols-2">
                    <input
                      type="text"
                      required
                      placeholder="Dosificación (ej: 1 tableta cada 8 horas)"
                      value={item.dosage}
                      onChange={(e) => handleItemChange(index, 'dosage', e.target.value)}
                      className="w-full rounded border p-2 text-sm dark:bg-gray-700 dark:border-gray-600"
                    />
                    <input
                      type="text"
                      placeholder="Instrucciones adicionales (Opcional)"
                      value={item.instructions}
                      onChange={(e) => handleItemChange(index, 'instructions', e.target.value)}
                      className="w-full rounded border p-2 text-sm dark:bg-gray-700 dark:border-gray-600"
                    />
                  </div>
                </div>
              ))}
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-400 mb-1">Diagnóstico / Notas de Soporte</label>
              <textarea
                rows={3}
                placeholder="Notas adicionales o recomendaciones de reposo..."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="w-full rounded border p-2 text-sm dark:bg-gray-700 dark:border-gray-600"
              />
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full rounded bg-indigo-600 p-2.5 text-sm font-semibold text-white hover:bg-indigo-500 disabled:bg-gray-400"
            >
              {submitting ? 'Emitiendo Receta...' : 'Firmar y Registrar Prescripción'}
            </button>
          </form>
        </div>

        {/* Historial */}
        <div className="space-y-4">
          <h2 className="text-lg font-bold flex items-center gap-2">Historial Reciente</h2>
          
          {loadingList ? (
            <div className="text-sm text-gray-500">Cargando historial...</div>
          ) : prescriptions.length === 0 ? (
            <div className="text-sm text-gray-500 italic">No has emitido recetas aún.</div>
          ) : (
            <div className="space-y-4 max-h-[75vh] overflow-y-auto pr-1">
              {prescriptions.map((p) => (
                <div key={p.id} className="bg-white p-4 rounded-lg shadow dark:bg-gray-800 text-sm border-l-4 border-indigo-500">
                  <div className="flex justify-between items-start mb-2">
                    <span className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium ${
                      p.consumed ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {p.consumed ? <CheckCircle size={10} /> : <Clock size={10} />}
                      {p.consumed ? 'Consumida' : 'Pendiente'}
                    </span>
                    <span className="text-xs text-gray-400">
                      {mounted ? new Date(p.createdAt).toLocaleDateString() : ''}
                    </span>
                  </div>
                  <p className="font-semibold text-gray-700 dark:text-gray-200">
                    Paciente: {mounted ? (p.patient?.user?.name || 'Desconocido') : 'Cargando...'}
                  </p>
                  <p className="text-xs text-gray-400 mb-2">ID: {p.id}</p>
                  <div className="text-xs text-gray-500 dark:text-gray-400">
                    <strong>Medicamentos:</strong> {p.items?.length || 0} items registrados.
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}