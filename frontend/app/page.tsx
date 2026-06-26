'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { 
  FileText, 
  ShieldCheck, 
  Activity, 
  Users, 
  Clock, 
  ArrowRight, 
  CheckCircle2, 
  Menu, 
  X, 
  Download, 
  Lock, 
  Sparkles, 
  Search, 
  Filter 
} from 'lucide-react';

export default function LandingPage() {
  const [mounted, setMounted] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 dark:bg-slate-950 dark:text-slate-100 font-sans selection:bg-indigo-500 selection:text-white">
      
      {/* NAVBAR */}
      <nav className="sticky top-0 z-50 backdrop-blur-md bg-white/70 dark:bg-slate-950/70 border-b border-slate-200 dark:border-slate-800 transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="bg-indigo-600 p-2 rounded-xl text-white shadow-md shadow-indigo-500/20">
              <Activity size={22} />
            </div>
            <span className="text-xl font-bold tracking-tight bg-gradient-to-r bg-clip-text text-transparent from-indigo-600 to-violet-500 dark:from-indigo-400 dark:to-violet-400">
              MediPrescript
            </span>
          </div>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-600 dark:text-slate-300">
            <a href="#caracteristicas" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition">Características</a>
            <a href="#beneficios" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition">Beneficios</a>
            <a href="#estadisticas" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition">Impacto</a>
            <a href="#testimonios" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition">Opiniones</a>
          </div>

          <div className="hidden md:flex items-center gap-4">
            <Link href="/login" className="text-sm font-semibold text-slate-700 dark:text-slate-200 hover:text-indigo-600 dark:hover:text-indigo-400 transition">
              Iniciar Sesión
            </Link>
            <Link href="/login?register=true" className="inline-flex items-center justify-center bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-semibold px-4 py-2 rounded-xl shadow-lg shadow-indigo-600/10 hover:shadow-indigo-600/20 transition active:scale-98">
              Registrarse
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="md:hidden p-2 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-900 rounded-lg">
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Dropdown */}
        {mobileMenuOpen && (
          <div className="md:hidden border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 px-4 pt-2 pb-4 space-y-3 shadow-xl">
            <a href="#caracteristicas" onClick={() => setMobileMenuOpen(false)} className="block px-3 py-2 text-base font-medium rounded-lg hover:bg-slate-50 dark:hover:bg-slate-900">Características</a>
            <a href="#beneficios" onClick={() => setMobileMenuOpen(false)} className="block px-3 py-2 text-base font-medium rounded-lg hover:bg-slate-50 dark:hover:bg-slate-900">Beneficios</a>
            <a href="#estadisticas" onClick={() => setMobileMenuOpen(false)} className="block px-3 py-2 text-base font-medium rounded-lg hover:bg-slate-50 dark:hover:bg-slate-900">Impacto</a>
            <a href="#testimonios" onClick={() => setMobileMenuOpen(false)} className="block px-3 py-2 text-base font-medium rounded-lg hover:bg-slate-50 dark:hover:bg-slate-900">Opiniones</a>
            <div className="h-px bg-slate-200 dark:bg-slate-800 my-2" />
            <div className="grid grid-cols-2 gap-3 pt-2">
              <Link href="/login" className="flex items-center justify-center border p-2 rounded-xl text-sm font-semibold">Iniciar Sesión</Link>
              <Link href="/login?register=true" className="flex items-center justify-center bg-indigo-600 text-white p-2 rounded-xl text-sm font-semibold">Registrarse</Link>
            </div>
          </div>
        )}
      </nav>

      {/* HERO SECTION */}
      <section className="relative overflow-hidden pt-16 pb-20 lg:pt-24 lg:pb-28">
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(35rem_25rem_at_top,rgba(99,102,241,0.08),transparent)]" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-indigo-50 text-indigo-700 dark:bg-indigo-950/40 dark:text-indigo-400 mb-6 border border-indigo-100 dark:border-indigo-900/40 animate-pulse">
            <Sparkles size={12} /> Gestión Médica del Futuro, Hoy
          </div>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight max-w-4xl mx-auto leading-tight">
            Prescripciones médicas electrónicas{' '}
            <span className="bg-gradient-to-r bg-clip-text text-transparent from-indigo-600 via-purple-600 to-pink-500 dark:from-indigo-400 dark:via-purple-400 dark:to-pink-400">
              fáciles, seguras y al instante
            </span>
          </h1>
          <p className="mt-6 text-base sm:text-lg text-slate-500 dark:text-slate-400 max-w-2xl mx-auto leading-relaxed">
            Conectamos a médicos y pacientes en un ecosistema ágil. Emite recetas digitales con firmas validadas, consulta historiales clínicos en tiempo real y descarga tus órdenes en formato PDF de alta calidad.
          </p>
          <div className="mt-10 flex flex-wrap justify-center gap-4">
            <Link href="/login" className="inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold px-6 py-3 rounded-xl shadow-xl shadow-indigo-600/20 hover:shadow-indigo-600/30 transition transform hover:-translate-y-0.5 active:scale-98">
              Comenzar como Médico <ArrowRight size={16} />
            </Link>
            <Link href="/login" className="inline-flex items-center gap-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-200 font-semibold px-6 py-3 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800 transition transform hover:-translate-y-0.5 shadow-sm">
              Acceso Pacientes
            </Link>
          </div>
        </div>
      </section>

      {/* SECCIÓN MOCKUP PREVIEW */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 mb-20">
        <div className="bg-gradient-to-br from-indigo-100 to-purple-100 dark:from-slate-900 dark:to-slate-800 p-3 sm:p-4 rounded-2xl shadow-2xl border border-slate-200/50 dark:border-slate-700/50">
          <div className="bg-slate-900 rounded-xl overflow-hidden shadow-inner h-[28rem] sm:h-[36rem] relative flex items-center justify-center text-center px-4">
            {/* Simulación del Panel Estilizado en 3D */}
            <div className="absolute inset-0 bg-slate-950/40 backdrop-blur-xs flex flex-col items-center justify-center p-6">
              <div className="bg-white/10 dark:bg-black/20 p-4 rounded-full mb-4 text-indigo-400 backdrop-blur-md">
                <FileText size={48} className="animate-bounce" />
              </div>
              <h3 className="text-white text-xl sm:text-2xl font-bold mb-2">Panel de Control Inteligente</h3>
              <p className="text-slate-300 text-sm max-w-md mb-6">
                Visualiza el historial de recetas emitidas, filtra por pacientes, controla las dosis y administra estados de consumo en un entorno web de última generación.
              </p>
              <div className="flex gap-2 p-1.5 bg-white/5 rounded-lg border border-white/10 text-xs text-slate-300">
                <span className="px-2 py-1 bg-green-500/20 text-green-400 rounded font-semibold">PostgreSQL</span>
                <span className="px-2 py-1 bg-indigo-500/20 text-indigo-400 rounded font-semibold">NestJS Backend</span>
                <span className="px-2 py-1 bg-violet-500/20 text-violet-400 rounded font-semibold">Next.js Client</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECCIÓN CARACTERÍSTICAS TÉCNICAS */}
      <section id="caracteristicas" className="py-20 bg-white dark:bg-slate-900 border-y border-slate-200 dark:border-slate-800 transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
              Todo lo que necesitas para una gestión médica óptima
            </h2>
            <p className="mt-4 text-slate-500 dark:text-slate-400">
              Diseñado meticulosamente para cumplir con las exigencias de velocidad, trazabilidad y seguridad requeridas en el sector salud.
            </p>
          </div>

          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {/* Card 1 */}
            <div className="p-6 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 hover:shadow-xl transition">
              <div className="text-indigo-600 dark:text-indigo-400 mb-4 p-3 bg-white dark:bg-slate-900 rounded-xl w-fit shadow-sm">
                <FileText size={24} />
              </div>
              <h3 className="font-bold text-lg mb-2">Emisión Dinámica</h3>
              <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
                Formularios reactivos rápidos para doctores. Agrega múltiples medicamentos, posologías exactas e instrucciones específicas por receta con un par de clics.
              </p>
            </div>
            {/* Card 2 */}
            <div className="p-6 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 hover:shadow-xl transition">
              <div className="text-indigo-600 dark:text-indigo-400 mb-4 p-3 bg-white dark:bg-slate-900 rounded-xl w-fit shadow-sm">
                <Search size={24} />
              </div>
              <h3 className="font-bold text-lg mb-2">Buscador Predictivo</h3>
              <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
                Olvídate de buscar códigos pesados de bases de datos. Filtra pacientes en tiempo real de forma predictiva por nombre o correo electrónico al instante.
              </p>
            </div>
            {/* Card 3 */}
            <div className="p-6 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 hover:shadow-xl transition">
              <div className="text-indigo-600 dark:text-indigo-400 mb-4 p-3 bg-white dark:bg-slate-900 rounded-xl w-fit shadow-sm">
                <Download size={24} />
              </div>
              <h3 className="font-bold text-lg mb-2">Exportación PDF Estricta</h3>
              <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
                Generación y renderizado de prescripciones médicas oficiales en PDF desde memoria, listas para imprimir o despachar en cualquier farmacia de cadena.
              </p>
            </div>
            {/* Card 4 */}
            <div className="p-6 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 hover:shadow-xl transition">
              <div className="text-indigo-600 dark:text-indigo-400 mb-4 p-3 bg-white dark:bg-slate-900 rounded-xl w-fit shadow-sm">
                <Filter size={24} />
              </div>
              <h3 className="font-bold text-lg mb-2">Filtros y Paginación Avanzada</h3>
              <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
                Control de flujos optimizado con segmentación por estado (Pendientes / Consumidas) y paginaciones fluidas indexadas directamente desde la base de datos.
              </p>
            </div>
            {/* Card 5 */}
            <div className="p-6 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 hover:shadow-xl transition">
              <div className="text-indigo-600 dark:text-indigo-400 mb-4 p-3 bg-white dark:bg-slate-900 rounded-xl w-fit shadow-sm">
                <ShieldCheck size={24} />
              </div>
              <h3 className="font-bold text-lg mb-2">Validación Criptográfica</h3>
              <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
                Cada orden médica cuenta con un hash único criptográfico e intransferible que previene cualquier tipo de alteración o fraude de medicamentos.
              </p>
            </div>
            {/* Card 6 */}
            <div className="p-6 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 hover:shadow-xl transition">
              <div className="text-indigo-600 dark:text-indigo-400 mb-4 p-3 bg-white dark:bg-slate-900 rounded-xl w-fit shadow-sm">
                <Lock size={24} />
              </div>
              <h3 className="font-bold text-lg mb-2">Autenticación Segura</h3>
              <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
                Control de accesos robusto basado en Roles (RBAC) mediante JSON Web Tokens (JWT) firmados de manera segura en las cabeceras de comunicación.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ESTADÍSTICAS */}
      <section id="estadisticas" className="py-16 bg-indigo-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          <div>
            <div className="text-4xl font-extrabold mb-1">99.9%</div>
            <div className="text-xs text-indigo-200 uppercase tracking-wider font-semibold">Disponibilidad del Sistema</div>
          </div>
          <div>
            <div className="text-4xl font-extrabold mb-1">+10k</div>
            <div className="text-xs text-indigo-200 uppercase tracking-wider font-semibold">Recetas Firmadas</div>
          </div>
          <div>
            <div className="text-4xl font-extrabold mb-1">&lt; 2s</div>
            <div className="text-xs text-indigo-200 uppercase tracking-wider font-semibold">Tiempo de Respuesta API</div>
          </div>
          <div>
            <div className="text-4xl font-extrabold mb-1">Zero</div>
            <div className="text-xs text-indigo-200 uppercase tracking-wider font-semibold">Papel Desperdiciado</div>
          </div>
        </div>
      </section>

      {/* BENEFICIOS SEPARADOS POR ROL */}
      <section id="beneficios" className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-3xl font-bold tracking-tight mb-6">Optimizado para Médicos Especialistas</h2>
            <p className="text-slate-500 dark:text-slate-400 mb-6 leading-relaxed">
              Sabemos que el tiempo en consulta es oro. Rediseñamos los flujos clínicos tradicionales para que puedas emitir recetas válidas en segundos desde tu tablet, laptop o celular.
            </p>
            <ul className="space-y-3">
              {['Historial clínico completo por paciente a la mano', 'Módulo de medicamentos autocompletable', 'Filtro dinámico de recetas emitidas por mes'].map((item, i) => (
                <li key={i} className="flex items-start gap-3 text-sm">
                  <CheckCircle2 size={18} className="text-green-500 shrink-0 mt-0.5" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="bg-gradient-to-br from-indigo-500 to-purple-600 p-8 rounded-2xl text-white shadow-xl">
            <h2 className="text-3xl font-bold tracking-tight mb-6 text-white">Transparente para Pacientes</h2>
            <p className="text-indigo-100 mb-6 leading-relaxed">
              No más recetas perdidas o con letras ilegibles. Accede a tu panel personal, lleva el control exacto de tus tratamientos médicos vigentes y descárgalos cuando quieras.
            </p>
            <ul className="space-y-3">
              {['Visualización limpia de dosis y horarios', 'Botón interactivo para marcar medicamentos consumidos', 'Descarga directa de PDF oficial firmado por tu doctor'].map((item, i) => (
                <li key={i} className="flex items-start gap-3 text-sm text-indigo-50">
                  <CheckCircle2 size={18} className="text-indigo-200 shrink-0 mt-0.5" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* TESTIMONIOS */}
      <section id="testimonios" className="py-20 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <h2 className="text-3xl font-bold tracking-tight">Avalado por Profesionales de la Salud</h2>
          </div>
          <div className="grid gap-8 md:grid-cols-3">
            <div className="p-6 bg-slate-50 dark:bg-slate-800 rounded-2xl border dark:border-slate-700">
              <p className="text-sm italic text-slate-600 dark:text-slate-300 mb-4 leading-relaxed">
                "La velocidad con la que puedo buscar a un paciente por su nombre y generarle la receta con múltiples medicamentos ha aligerado mi flujo diario un 40%."
              </p>
              <div className="font-semibold text-sm">Dr. Alejandro Mendoza</div>
              <div className="text-xs text-slate-400">Cardiólogo Clínico</div>
            </div>
            <div className="p-6 bg-slate-50 dark:bg-slate-800 rounded-2xl border dark:border-slate-700">
              <p className="text-sm italic text-slate-600 dark:text-slate-300 mb-4 leading-relaxed">
                "Mis pacientes de la tercera edad ya no sufren por descifrar mi letra. Simplemente abren su sesión, tocan el botón de PDF y lo tienen listo en la farmacia."
              </p>
              <div className="font-semibold text-sm">Dra. Beatriz Hernandez</div>
              <div className="text-xs text-slate-400">Médico General Interina</div>
            </div>
            <div className="p-6 bg-slate-50 dark:bg-slate-800 rounded-2xl border dark:border-slate-700">
              <p className="text-sm italic text-slate-600 dark:text-slate-300 mb-4 leading-relaxed">
                "Como paciente, me encanta poder marcar mis recetas como consumidas. Me ayuda a llevar un diario preciso de mis antibióticos sin confusiones."
              </p>
              <div className="font-semibold text-sm">Carlos R. Castro</div>
              <div className="text-xs text-slate-400">Paciente Crónico Verificado</div>
            </div>
          </div>
        </div>
      </section>

      {/* FOOTER CALL TO ACTION */}
      <section className="py-16 text-center max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-bold tracking-tight mb-4">¿Listo para transformar tu consulta médica?</h2>
        <p className="text-slate-500 dark:text-slate-400 mb-8 max-w-xl mx-auto text-sm sm:text-base">
          Únete a la plataforma de prescripciones electrónicas que optimiza el flujo de atención médica de principio a fin de manera robusta.
        </p>
        <Link href="/login" className="inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold px-8 py-3.5 rounded-xl shadow-xl shadow-indigo-600/20 hover:shadow-indigo-600/30 transition transform hover:-translate-y-0.5">
          Crear una Cuenta Gratis <ArrowRight size={16} />
        </Link>
      </section>

      {/* FOOTER FINAL */}
      <footer className="border-t border-slate-200 dark:border-slate-800 py-8 bg-slate-100 dark:bg-slate-950 text-xs text-slate-400 transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row justify-between items-center gap-4">
          <div>&copy; 2026 MediPrescript. Todos los derechos reservados de salud digital.</div>
          <div className="flex gap-6">
            <span className="hover:underline cursor-pointer">Términos de Servicio</span>
            <span className="hover:underline cursor-pointer">Privacidad de Datos (HIPAA)</span>
            <span className="hover:underline cursor-pointer">Soporte Técnico</span>
          </div>
        </div>
      </footer>

    </div>
  );
}