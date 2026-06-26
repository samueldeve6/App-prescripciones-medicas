'use client';

import { useEffect, useState } from 'react';
import { fetcher } from '@/lib/fetcher';
import { useAuthStore } from '@/store/authStore';
import { Plus, Trash2, FilePlus, CheckCircle, Clock, LogOut, Search, Filter, ChevronLeft, ChevronRight } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface NewItem {
  name: string;
  dosage: string;
  quantity: number;
  instructions: string;
}

interface PatientDB {
  id: string;
  user: {
    name: string;
    email: string;
  };
}

interface Prescription {
  id: string;
  createdAt: string;
  status: string; // 'pending' | 'consumed'
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

  // Estados para el Buscador de Pacientes (Creación)
  const [patients, setPatients] = useState<PatientDB[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPatient, setSelectedPatient] = useState<PatientDB | null>(null);
  const [showDropdown, setShowDropdown] = useState(false);

  // ESTADOS DE FILTROS Y PAGINACIÓN (Para el Historial Clínico)
  const [historySearch, setHistorySearch] = useState(''); // Filtro por nombre en historial
  const [statusFilter, setStatusFilter] = useState(''); // '' = Todas, 'pending', 'consumed'
  const [page, setPage] = useState(1);
  const limit = 5; // Cantidad de recetas por página en el historial

  // Estados del formulario de creación
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
    loadPatients();
  }, [user]);

  // Cada vez que cambie la página, el filtro de estado o la búsqueda de texto, recargamos el historial
  useEffect(() => {
    if (user && user.role === 'doctor') {
      loadDoctorPrescriptions();
    }
  }, [page, statusFilter, historySearch, user]);

  const loadDoctorPrescriptions = async () => {
    try {
      setLoadingList(true);
      
      // Construimos los query parameters dinámicamente según soporte tu backend
      let url = `/prescriptions?page=${page}&limit=${limit}`;
      if (statusFilter) url += `&status=${statusFilter}`;
      if (historySearch) url += `&search=${encodeURIComponent(historySearch)}`;

      const data = await fetcher(url);
      setPrescriptions(data);
    } catch (err: any) {
      console.error('Error al cargar recetas del doctor:', err);
    } finally {
      setLoadingList(false);
    }
  };

  const loadPatients = async () => {
    try {
      const data = await fetcher('/prescriptions/patients/search');
      setPatients(data);
    } catch (err) {
      console.error('Error al cargar pacientes:', err);
    }
  };

  // Filtrado reactivo local únicamente para el buscador del formulario
  const filteredPatientsForForm = patients.filter(p =>
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
        patientId: selectedPatient.id,
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

      setSelectedPatient(null);
      setSearchQuery('');
      setNotes('');
      setItems([{ name: '', dosage: '', quantity: 1, instructions: '' }]);
      
      setPage(1); // Resetea a la primera página para ver el estreno de la receta
      await loadDoctorPrescriptions();
      alert('¡Prescripción médica creada con éxito!');
    } catch (err: any) {
      setError(err.message || 'Error al crear la prescripción');
    } finally {
      setSubmitting(false);
    }
  };

  const handleFilterStatusChange = (status: string) => {
    setStatusFilter(status);
    setPage(1); // Reinicia paginación
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
        {/* COLUMNA 1 y 2: Formulario de Emisión */}
        <div className="lg:col-span-2 bg-white p-6 rounded-lg shadow dark:bg-gray-800 h-fit">
          <div className="flex items-center gap-2 mb-6 border-b pb-2 dark:border-gray-700">
            <FilePlus className="text-indigo-600" size={20} />
            <h2 className="text-lg font-bold">Emitir Nueva Receta Médica</h2>
          </div>

          <form onSubmit={handleSubmitPrescription} className="space-y-6">
            {error && <div className="p-3 bg-red-100 text-red-700 rounded text-sm">{error}</div>}

            {/* Buscador del Formulario */}
            <div className="relative">
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-400 mb-1">Paciente Destinatario</label>
              {selectedPatient ? (
                <div className="flex items-center justify-between p-2.5 bg-indigo-50 border border-indigo-200 rounded dark:bg-indigo-900/20 dark:border-indigo-800">
                  <div>
                    <span className="font-semibold text-indigo-900 dark:text-indigo-300">{selectedPatient.user.name}</span>
                    <span className="text-xs text-indigo-500 block">{selectedPatient.user.email}</span>
                  </div>
                  <button type="button" onClick={() => { setSelectedPatient(null); setSearchQuery(''); }} className="text-xs text-red-500 underline hover:text-red-400">
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
                  {showDropdown && searchQuery && (
                    <div className="absolute z-10 w-full mt-1 bg-white border rounded shadow-lg max-h-48 overflow-y-auto dark:bg-gray-800 dark:border-gray-700">
                      {filteredPatientsForForm.length === 0 ? (
                        <div className="p-3 text-xs text-gray-500 italic">No se encontraron pacientes</div>
                      ) : (
                        filteredPatientsForForm.map((p) => (
                          <button
                            key={p.id}
                            type="button"
                            onClick={() => { setSelectedPatient(p); setShowDropdown(false); }}
                            className="w-full text-left p-2.5 hover:bg-gray-100 dark:hover:bg-gray-700 border-b last:border-0 dark:border-gray-700 text-sm"
                          >
                            <div className="font-medium">{p.user.name}</div>
                            <div className="text-xs text-gray-400">{p.user.email}</div>
                          </button>
                        ))
                      )}
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Medicamentos dinámicos */}
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-400">Medicamentos y Posología</label>
                <button type="button" onClick={handleAddItem} className="flex items-center gap-1 text-xs font-semibold text-indigo-600 hover:text-indigo-500 dark:text-indigo-400">
                  <Plus size={14} /> Añadir Medicamento
                </button>
              </div>

              {items.map((item, index) => (
                <div key={index} className="p-4 bg-gray-50 dark:bg-gray-700/40 rounded-lg border dark:border-gray-700 space-y-3 relative">
                  {items.length > 1 && (
                    <button type="button" onClick={() => handleRemoveItem(index)} className="absolute top-2 right-2 text-gray-400 hover:text-red-500">
                      <Trash2 size={16} />
                    </button>
                  )}
                  <div className="grid gap-3 md:grid-cols-3">
                    <div className="md:col-span-2">
                      <input type="text" required placeholder="Medicamento (ej: Paracetamol 500mg)" value={item.name} onChange={(e) => handleItemChange(index, 'name', e.target.value)} className="w-full rounded border p-2 text-sm dark:bg-gray-700 dark:border-gray-600" />
                    </div>
                    <div>
                      <input type="number" min="1" required placeholder="Cant." value={item.quantity} onChange={(e) => handleItemChange(index, 'quantity', e.target.value)} className="w-full rounded border p-2 text-sm dark:bg-gray-700 dark:border-gray-600" />
                    </div>
                  </div>
                  <div className="grid gap-3 md:grid-cols-2">
                    <input type="text" required placeholder="Dosificación (ej: Cada 8 horas)" value={item.dosage} onChange={(e) => handleItemChange(index, 'dosage', e.target.value)} className="w-full rounded border p-2 text-sm dark:bg-gray-700 dark:border-gray-600" />
                    <input type="text" placeholder="Instrucciones adicionales (Opcional)" value={item.instructions} onChange={(e) => handleItemChange(index, 'instructions', e.target.value)} className="w-full rounded border p-2 text-sm dark:bg-gray-700 dark:border-gray-600" />
                  </div>
                </div>
              ))}
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-400 mb-1">Diagnóstico / Notas</label>
              <textarea rows={3} placeholder="Notas médicas secundarias..." value={notes} onChange={(e) => setNotes(e.target.value)} className="w-full rounded border p-2 text-sm dark:bg-gray-700 dark:border-gray-600" />
            </div>

            <button type="submit" disabled={submitting} className="w-full rounded bg-indigo-600 p-2.5 text-sm font-semibold text-white hover:bg-indigo-500 disabled:bg-gray-400">
              {submitting ? 'Emitiendo Receta...' : 'Firmar y Registrar Prescripción'}
            </button>
          </form>
        </div>

        {/* COLUMNA 3: Historial Controlado con Filtros y Paginación */}
        <div className="space-y-4">
          <h2 className="text-lg font-bold flex items-center gap-2">Historial de Recetas</h2>

          {/* Filtros avanzados del historial */}
          <div className="bg-white p-4 rounded-lg shadow space-y-3 dark:bg-gray-800 text-xs">
            {/* Input de búsqueda por nombre */}
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-2.5 flex items-center pointer-events-none text-gray-400">
                <Search size={14} />
              </div>
              <input
                type="text"
                placeholder="Buscar paciente en historial..."
                value={historySearch}
                onChange={(e) => { setHistorySearch(e.target.value); setPage(1); }}
                className="w-full rounded border pl-8 p-1.5 text-xs dark:bg-gray-700 dark:border-gray-600"
              />
            </div>

            {/* Selector por estado */}
            <div className="flex gap-1 justify-between border-t pt-2 dark:border-gray-700">
              <button onClick={() => handleFilterStatusChange('')} className={`flex-1 py-1 px-2 rounded transition font-medium ${statusFilter === '' ? 'bg-indigo-600 text-white' : 'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-300'}`}>
                Todas
              </button>
              <button onClick={() => handleFilterStatusChange('pending')} className={`flex-1 py-1 px-2 rounded transition font-medium ${statusFilter === 'pending' ? 'bg-yellow-500 text-white' : 'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-300'}`}>
                Pendientes
              </button>
              <button onClick={() => handleFilterStatusChange('consumed')} className={`flex-1 py-1 px-2 rounded transition font-medium ${statusFilter === 'consumed' ? 'bg-green-600 text-white' : 'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-300'}`}>
                Consumidas
              </button>
            </div>
          </div>
          
          {/* Listado dinámico filtrado */}
          {loadingList ? (
            <div className="text-sm text-gray-500">Cargando historial...</div>
          ) : prescriptions.length === 0 ? (
            <div className="text-sm text-gray-500 italic bg-white p-4 rounded-lg dark:bg-gray-800 text-center shadow">
              No se encontraron coincidencias.
            </div>
          ) : (
            <div className="space-y-3 max-h-[55vh] overflow-y-auto pr-1">
              {prescriptions.map((p) => {
                // SOLUCIÓN AL BADGE: Mapeamos usando tu columna string 'status'
                const isConsumed = p.status === 'consumed' || (p as any).status === 'consumed';

                return (
                  <div key={p.id} className="bg-white p-4 rounded-lg shadow dark:bg-gray-800 text-sm border-l-4 border-indigo-500">
                    <div className="flex justify-between items-start mb-2">
                      <span className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium ${
                        isConsumed ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400'
                      }`}>
                        {isConsumed ? <CheckCircle size={10} /> : <Clock size={10} />}
                        {isConsumed ? 'Consumida' : 'Pendiente'}
                      </span>
                      <span className="text-xs text-gray-400">
                        {mounted ? new Date(p.createdAt).toLocaleDateString() : ''}
                      </span>
                    </div>
                    <p className="font-semibold text-gray-700 dark:text-gray-200">
                      Paciente: {mounted ? (p.patient?.user?.name || 'Desconocido') : 'Cargando...'}
                    </p>
                    <p className="text-xs text-gray-400 mb-1">ID Receta: {p.id}</p>
                    <div className="text-xs text-gray-500 dark:text-gray-400 italic">
                      {p.items?.length || 0} medicamento(s) registrado(s).
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* PAGINACIÓN DEL HISTORIAL */}
          <div className="flex items-center justify-between border-t pt-3 dark:border-gray-800 text-xs bg-white p-2.5 rounded-lg shadow dark:bg-gray-800">
            <button
              onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
              disabled={page === 1}
              className="flex items-center gap-1 rounded border p-1 px-2 hover:bg-gray-50 disabled:opacity-30 dark:border-gray-700 dark:hover:bg-gray-700"
            >
              <ChevronLeft size={12} /> Ant.
            </button>
            <span className="font-medium text-gray-500">Pág. {page}</span>
            <button
              onClick={() => setPage((prev) => prev + 1)}
              disabled={prescriptions.length < limit}
              className="flex items-center gap-1 rounded border p-1 px-2 hover:bg-gray-50 disabled:opacity-30 dark:border-gray-700 dark:hover:bg-gray-700"
            >
              Sig. <ChevronRight size={12} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}