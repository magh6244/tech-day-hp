import React, { useState, useEffect } from 'react';
import { initializeApp } from 'firebase/app';
import { getAuth, signInAnonymously, signInWithCustomToken, onAuthStateChanged } from 'firebase/auth';
import { getFirestore, collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { Calendar, MapPin, CheckCircle, Send, Shield, Server, Laptop, Settings, Hash, Briefcase, Clock, Info, AlertCircle, Loader2 } from 'lucide-react';

// --- CONFIGURACIÓN DE FIREBASE ---
// Reemplaza los valores vacíos con los datos de tu consola de Firebase (Paso 1.4 de la guía)
// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBeXNB09pqi7BbNMMfCwg8eiuBSn5XDbfs",
  authDomain: "tech-day-cuantico-hp.firebaseapp.com",
  projectId: "tech-day-cuantico-hp",
  storageBucket: "tech-day-cuantico-hp.firebasestorage.app",
  messagingSenderId: "1039572277326",
  appId: "1:1039572277326:web:0d26d25a2babe58c9acb1f",
  measurementId: "G-RN7ZMVJX9N"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
// Inicialización de servicios
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const appId = typeof __app_id !== 'undefined' ? __app_id : 'hp-tech-day-2026';

const App = () => {
  const [user, setUser] = useState(null);
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({
    fullName: '',
    company: '',
    jobTitle: '',
    email: '',
    phone: '',
    attendance: 'confirmado',
    interestArea: '',
    installedBase: '',
    physicalServers: '',
    currentManufacturer: '',
    hasRenewalProject: 'no',
    projectTimeframe: ''
  });

  // Manejo de autenticación para permitir escritura en Firestore
  useEffect(() => {
    const initAuth = async () => {
      try {
        if (typeof __initial_auth_token !== 'undefined' && __initial_auth_token) {
          await signInWithCustomToken(auth, __initial_auth_token);
        } else {
          await signInAnonymously(auth);
        }
      } catch (err) {
        console.error("Error de autenticación:", err);
        setError("Error de conexión inicial. Verifique su configuración de Firebase.");
      }
    };
    
    initAuth();
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) {
      setError("No se ha podido establecer una sesión segura. Por favor, recargue la página.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // Referencia a la colección siguiendo las reglas de la plataforma
      const registrationsRef = collection(db, 'artifacts', appId, 'public', 'data', 'registrations');
      
      await addDoc(registrationsRef, {
        ...formData,
        userId: user.uid,
        createdAt: serverTimestamp(),
        registrationDate: new Date().toLocaleString()
      });

      setSubmitted(true);
    } catch (err) {
      console.error("Error al guardar:", err);
      setError("No pudimos procesar su registro. Asegúrese de que las 'Rules' de Firestore permitan escritura.");
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4 font-sans text-slate-900">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-2xl p-8 text-center border-t-8 border-blue-600">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="text-green-600 w-12 h-12" />
          </div>
          <h2 className="text-2xl font-bold mb-2 text-slate-800">¡Registro Exitoso!</h2>
          <p className="text-slate-600 mb-6">
            Gracias, <strong>{formData.fullName}</strong>. Hemos registrado su asistencia y perfil de infraestructura. Nos vemos en HP Zapopan.
          </p>
          <button 
            onClick={() => setSubmitted(false)}
            className="bg-blue-600 text-white px-8 py-3 rounded-xl font-bold hover:bg-blue-700 transition-all shadow-lg hover:shadow-blue-200"
          >
            Registrar a otro asistente
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900 pb-12">
      {/* Hero / Header Section */}
      <header className="bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 text-white py-14 px-4 shadow-xl border-b border-blue-500/20">
        <div className="max-w-5xl mx-auto flex flex-col md:flex-row justify-between items-center gap-10">
          <div className="flex-1 text-center md:text-left">
            <h1 className="text-4xl md:text-6xl font-black mb-3 italic tracking-tight uppercase">Tech Day 2026</h1>
            <p className="text-xl md:text-2xl text-blue-300 font-light mb-8">Cuantico + HP: Forjando Infraestructuras Rentables</p>
            
            <div className="space-y-5">
              <div className="flex items-center justify-center md:justify-start gap-4">
                <div className="p-3 bg-blue-600/20 rounded-xl border border-blue-400/30">
                  <Calendar className="text-blue-400" size={28} />
                </div>
                <div>
                  <p className="font-bold text-xl">10 de Febrero, 2026</p>
                  <p className="text-blue-300">Horario: 09:00 AM — 12:00 PM</p>
                </div>
              </div>
              
              <div className="flex items-center justify-center md:justify-start gap-4">
                <div className="p-3 bg-blue-600/20 rounded-xl border border-blue-400/30">
                  <MapPin className="text-blue-400" size={28} />
                </div>
                <div>
                  <p className="font-bold text-xl">HP Inc México</p>
                  <p className="text-blue-300 text-sm max-w-sm leading-tight">
                    Av. Camino al ITESO 8270, El Mante, 45608 Zapopan, Jal.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-6 bg-white/10 p-8 rounded-3xl backdrop-blur-md border border-white/20 shadow-2xl">
             <div className="text-center">
                <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center text-blue-900 font-black text-2xl shadow-inner">HP</div>
             </div>
             <div className="text-4xl font-thin text-white/20 hidden sm:block">|</div>
             <div className="text-center">
                <div className="text-2xl font-black tracking-tighter italic">CUANTICO</div>
             </div>
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 py-12 -mt-10">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Columna Lateral de Valor */}
          <div className="lg:col-span-1 space-y-6">
            <div className="bg-white p-6 rounded-2xl shadow-lg border border-slate-100">
              <h3 className="font-bold text-lg mb-4 flex items-center gap-2 text-slate-800">
                <Info className="text-blue-600" size={20} /> Agenda Ejecutiva:
              </h3>
              <ul className="space-y-4 text-sm text-slate-600 font-medium">
                <li className="flex gap-3">
                  <div className="w-1.5 h-1.5 bg-blue-600 rounded-full mt-1.5 shrink-0" />
                  <span>Showcase de Novedades HP 2026.</span>
                </li>
                <li className="flex gap-3">
                  <div className="w-1.5 h-1.5 bg-blue-600 rounded-full mt-1.5 shrink-0" />
                  <span>Modelos de rentabilidad y servicios.</span>
                </li>
                <li className="flex gap-3">
                  <div className="w-1.5 h-1.5 bg-blue-600 rounded-full mt-1.5 shrink-0" />
                  <span>Networking en el Centro de Innovación HP.</span>
                </li>
              </ul>
            </div>

            <div className="bg-blue-900 p-8 rounded-2xl text-white shadow-xl relative overflow-hidden group">
              <div className="absolute -bottom-4 -right-4 opacity-10 group-hover:scale-110 transition-transform">
                <Server size={120} />
              </div>
              <p className="text-sm leading-relaxed italic opacity-90 relative z-10">
                "Nuestra meta es transformar su gasto tecnológico en una inversión estratégica sólida y rentable."
              </p>
            </div>
          </div>

          {/* Formulario de Registro */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-3xl shadow-2xl overflow-hidden border border-slate-100">
              <div className="p-8 md:p-10">
                <h2 className="text-3xl font-bold text-slate-800 mb-8 border-b border-slate-100 pb-4">Registro de Asistencia</h2>
                
                {error && (
                  <div className="mb-8 p-4 bg-red-50 border-l-4 border-red-500 text-red-700 rounded-r-lg flex items-center gap-3">
                    <AlertCircle size={24} />
                    <p className="text-sm font-semibold">{error}</p>
                  </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-8">
                  {/* Datos Básicos */}
                  <div className="space-y-4">
                    <h4 className="text-xs font-black text-blue-600 uppercase tracking-widest">Información de Contacto</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                      <div className="space-y-1">
                        <label className="text-xs font-bold text-slate-500 uppercase ml-1">Nombre Completo *</label>
                        <input 
                          type="text" name="fullName" required
                          className="w-full px-4 py-3 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 transition-all bg-slate-50/50"
                          placeholder="Juan Pérez" onChange={handleInputChange}
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-xs font-bold text-slate-500 uppercase ml-1">Empresa *</label>
                        <input 
                          type="text" name="company" required
                          className="w-full px-4 py-3 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 transition-all bg-slate-50/50"
                          placeholder="Nombre de la Compañía" onChange={handleInputChange}
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-xs font-bold text-slate-500 uppercase ml-1">Puesto / Cargo *</label>
                        <input 
                          type="text" name="jobTitle" required
                          className="w-full px-4 py-3 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 transition-all bg-slate-50/50"
                          placeholder="Ej. CIO / Director de Operaciones" onChange={handleInputChange}
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-xs font-bold text-slate-500 uppercase ml-1">Email Corporativo *</label>
                        <input 
                          type="email" name="email" required
                          className="w-full px-4 py-3 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 transition-all bg-slate-50/50"
                          placeholder="usuario@empresa.com" onChange={handleInputChange}
                        />
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                      <div className="space-y-1">
                        <label className="text-xs font-bold text-slate-500 uppercase ml-1">Teléfono</label>
                        <input 
                          type="tel" name="phone"
                          className="w-full px-4 py-3 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 transition-all bg-slate-50/50"
                          placeholder="(33) 1234 5678" onChange={handleInputChange}
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-xs font-bold text-slate-500 uppercase ml-1">Disponibilidad *</label>
                        <select 
                          name="attendance" 
                          className="w-full px-4 py-3 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                          onChange={handleInputChange}
                        >
                          <option value="confirmado">Asistiré puntualmente</option>
                          <option value="pendiente">Interesado (Por confirmar)</option>
                        </select>
                      </div>
                    </div>
                  </div>

                  {/* Infraestructura Actual */}
                  <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200 space-y-6 shadow-inner">
                    <h4 className="text-xs font-black text-blue-600 uppercase tracking-widest flex items-center gap-2">
                      <Hash size={16} /> Diagnóstico de Infraestructura Actual
                    </h4>
                    
                    <div className="space-y-2">
                      <label className="block text-sm font-bold text-slate-700">
                        ¿Cuál es el principal socio tecnológico / fabricante en su parque actual? *
                      </label>
                      <input 
                        type="text" name="currentManufacturer" required
                        className="w-full px-4 py-3 border border-slate-200 rounded-xl outline-none bg-white focus:ring-2 focus:ring-blue-500"
                        placeholder="Ej. HP, Dell, Lenovo, etc." onChange={handleInputChange}
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                      <div className="space-y-1">
                        <label className="text-xs font-bold text-slate-500 uppercase">Base Instalada de Cómputo</label>
                        <div className="relative">
                          <Laptop className="absolute left-4 top-3.5 text-slate-400" size={18} />
                          <input 
                            type="number" name="installedBase"
                            className="w-full pl-12 pr-4 py-3 border border-slate-200 rounded-xl outline-none bg-white"
                            placeholder="Cant. equipos" onChange={handleInputChange}
                          />
                        </div>
                      </div>
                      <div className="space-y-1">
                        <label className="text-xs font-bold text-slate-500 uppercase">Servidores Físicos</label>
                        <div className="relative">
                          <Server className="absolute left-4 top-3.5 text-slate-400" size={18} />
                          <input 
                            type="number" name="physicalServers"
                            className="w-full pl-12 pr-4 py-3 border border-slate-200 rounded-xl outline-none bg-white"
                            placeholder="Cant. servidores" onChange={handleInputChange}
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Proyectos Estratégicos */}
                  <div className="space-y-6">
                    <h4 className="text-xs font-black text-blue-600 uppercase tracking-widest flex items-center gap-2">
                      <Briefcase size={16} /> Planeación y Proyectos
                    </h4>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      <div className="space-y-3">
                        <label className="block text-sm font-bold text-slate-700">
                          ¿Tiene contemplado algún proyecto de renovación en el corto/mediano plazo?
                        </label>
                        <div className="flex gap-8">
                          {['Si', 'No'].map((opt) => (
                            <label key={opt} className="flex items-center gap-3 cursor-pointer group">
                              <input 
                                type="radio" name="hasRenewalProject" value={opt.toLowerCase()} 
                                className="w-5 h-5 text-blue-600 border-slate-300 focus:ring-blue-500" 
                                onChange={handleInputChange} 
                              />
                              <span className="text-sm font-semibold text-slate-600 group-hover:text-blue-600 transition-colors">{opt}</span>
                            </label>
                          ))}
                        </div>
                      </div>
                      <div className="space-y-2">
                        <label className="block text-sm font-bold text-slate-700 flex items-center gap-2">
                          <Clock size={16} className="text-blue-600"/> Plazo de ejecución viable
                        </label>
                        <select 
                          name="projectTimeframe" 
                          className="w-full px-4 py-3 border border-slate-200 rounded-xl bg-white outline-none focus:ring-2 focus:ring-blue-500 shadow-sm"
                          onChange={handleInputChange}
                        >
                          <option value="">Seleccionar plazo...</option>
                          <option value="3">3 Meses (Inmediato)</option>
                          <option value="6">6 Meses</option>
                          <option value="9">9 Meses</option>
                          <option value="12">12 Meses</option>
                        </select>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <label className="block text-sm font-bold text-slate-700">Área de interés principal para el evento</label>
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                        {[
                          { id: 'computo', label: 'Cómputo', icon: <Laptop size={14}/> },
                          { id: 'servicios', label: 'Servicios TI', icon: <Settings size={14}/> },
                          { id: 'data', label: 'Datacenter', icon: <Server size={14}/> }
                        ].map(option => (
                          <label key={option.id} className="flex items-center p-4 border border-slate-200 rounded-xl hover:border-blue-500 hover:bg-blue-50/50 cursor-pointer transition-all shadow-sm">
                            <input 
                              type="radio" name="interestArea" value={option.id}
                              className="w-4 h-4 text-blue-600" onChange={handleInputChange}
                            />
                            <span className="ml-3 text-xs font-black text-slate-700 uppercase flex items-center gap-2">
                              {option.icon} {option.label}
                            </span>
                          </label>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Footer Form / Submit */}
                  <div className="pt-6 border-t border-slate-100">
                    <div className="flex items-start gap-4 p-4 bg-slate-50 rounded-2xl mb-8 border border-slate-100">
                      <Shield className="text-slate-400 mt-1 shrink-0" size={20} />
                      <p className="text-[11px] text-slate-500 leading-relaxed italic">
                        Los datos proporcionados serán tratados de forma confidencial por Cuantico y HP Inc. México para fines exclusivos de este evento y seguimiento técnico-comercial, conforme a la Ley Federal de Protección de Datos Personales en Posesión de los Particulares.
                      </p>
                    </div>

                    <button 
                      type="submit"
                      disabled={loading || !user}
                      className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-slate-300 text-white font-black py-5 rounded-2xl shadow-xl transition-all flex items-center justify-center gap-3 group text-lg uppercase tracking-widest transform hover:-translate-y-1 active:scale-95"
                    >
                      {loading ? (
                        <>Procesando registro... <Loader2 className="animate-spin" size={24} /></>
                      ) : (
                        <>Confirmar Asistencia en HP <Send size={22} className="group-hover:translate-x-1 transition-transform" /></>
                      )}
                    </button>
                    {!user && !error && (
                      <p className="text-center text-[10px] text-slate-400 mt-4 animate-pulse">Estableciendo canal seguro con HP Cloud Services...</p>
                    )}
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </main>

      <footer className="max-w-5xl mx-auto px-4 py-12 text-center">
        <div className="flex justify-center gap-8 mb-6 opacity-30 grayscale">
            <div className="font-bold text-xl">HP</div>
            <div className="font-bold text-xl italic tracking-tighter">CUANTICO</div>
        </div>
        <p className="text-slate-400 text-xs tracking-widest uppercase">
          © 2026 Cuantico & HP Inc. Todos los derechos reservados. Guadalajara, Jalisco.
        </p>
      </footer>
    </div>
  );
};

export default App;