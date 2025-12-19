import React, { useState, useEffect } from 'react';
import { initializeApp } from 'firebase/app';
import { 
  getAuth, 
  signInAnonymously, 
  onAuthStateChanged 
} from 'firebase/auth';
import { 
  getFirestore, 
  collection, 
  addDoc, 
  serverTimestamp 
} from 'firebase/firestore';
import { 
  Calendar, 
  MapPin, 
  CheckCircle, 
  Send, 
  Shield, 
  Server, 
  Laptop, 
  Settings, 
  Hash, 
  Briefcase, 
  Clock, 
  Info, 
  AlertCircle, 
  Loader2 
} from 'lucide-react';

// ========================================================
// CONFIGURACIÓN DE FIREBASE
// ========================================================
const firebaseConfig = {
  apiKey: "AIzaSyBeXNB09pqi7BbNMMfCwg8eiuBSn5XDbfs",
  authDomain: "tech-day-cuantico-hp.firebaseapp.com",
  projectId: "tech-day-cuantico-hp",
  storageBucket: "tech-day-cuantico-hp.firebasestorage.app",
  messagingSenderId: "1039572277326",
  appId: "1:1039572277326:web:0d26d25a2babe58c9acb1f",
  measurementId: "G-RN7ZMVJX9N"
};
// ========================================================

// CORRECCIÓN: Simplificamos la validación para que solo verifique que existe una llave
const isConfigValid = firebaseConfig.apiKey && firebaseConfig.apiKey.length > 0;

// Inicialización de Firebase
// Usamos un bloque try-catch para evitar que la app se rompa si la config tiene algún error
let app = null;
let auth = null;
let db = null;

try {
  if (isConfigValid) {
    app = initializeApp(firebaseConfig);
    auth = getAuth(app);
    db = getFirestore(app);
  }
} catch (e) {
  console.error("Error inicializando Firebase:", e);
}

const appId = 'hp-tech-day-2026';

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

  useEffect(() => {
    if (!isConfigValid) {
      setError("Falta la API Key en la configuración.");
      return;
    }

    if (!auth) {
      setError("Error interno: Firebase no se pudo inicializar.");
      return;
    }

    const initAuth = async () => {
      try {
        await signInAnonymously(auth);
      } catch (err) {
        console.error("Error de autenticación:", err);
        setError("No se pudo establecer una conexión segura. Verifique que 'Anonymous' esté habilitado en Firebase Authentication.");
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
    if (!user || !db) {
      setError("La conexión con la base de datos no está lista. Intente recargar la página.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
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
      // Mensaje de error amigable para el usuario
      if (err.code === 'permission-denied') {
        setError("Permiso denegado. Verifique las Reglas (Rules) en Firestore Database.");
      } else {
        setError("Ocurrió un error al guardar. Intente nuevamente.");
      }
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-2xl p-8 text-center border-t-8 border-blue-600">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="text-green-600 w-12 h-12" />
          </div>
          <h2 className="text-2xl font-bold mb-2 text-slate-800">¡Registro Exitoso!</h2>
          <p className="text-slate-600 mb-6 font-medium">
            Gracias, {formData.fullName}. Su información ha sido recibida para el Tech Day en HP Zapopan.
          </p>
          <button 
            onClick={() => setSubmitted(false)}
            className="bg-blue-600 text-white px-8 py-3 rounded-xl font-bold hover:bg-blue-700 transition-all shadow-lg active:scale-95"
          >
            Registrar a otro asistente
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900 pb-12">
      <header className="bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 text-white py-14 px-4 shadow-xl border-b border-blue-500/20">
        <div className="max-w-5xl mx-auto flex flex-col md:flex-row justify-between items-center gap-10">
          <div className="flex-1 text-center md:text-left">
            <h1 className="text-4xl md:text-6xl font-black mb-3 italic tracking-tight uppercase">Tech Day 2026</h1>
            <p className="text-xl md:text-2xl text-blue-300 font-light mb-8">Cuantico + HP: Forjando Infraestructuras Rentables</p>
            
            <div className="space-y-5 text-left inline-block md:block">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-blue-600/20 rounded-xl border border-blue-400/30">
                  <Calendar className="text-blue-400" size={24} />
                </div>
                <div>
                  <p className="font-bold text-lg leading-none">10 de Febrero, 2026</p>
                  <p className="text-blue-300 text-sm">09:00 AM — 12:00 PM</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="p-3 bg-blue-600/20 rounded-xl border border-blue-400/30">
                  <MapPin className="text-blue-400" size={24} />
                </div>
                <div>
                  <p className="font-bold text-lg leading-none">HP Inc México</p>
                  <p className="text-blue-300 text-xs max-w-sm">Av. Camino al ITESO 8270, Zapopan, Jal.</p>
                </div>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-6 bg-white/10 p-8 rounded-3xl backdrop-blur-md border border-white/20">
             <div className="text-center font-black text-2xl">HP</div>
             <div className="text-2xl font-thin text-white/30">|</div>
             <div className="text-center font-black tracking-tighter italic text-xl">CUANTICO</div>
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 py-12 -mt-10">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-1 space-y-6">
            <div className="bg-white p-6 rounded-2xl shadow-lg border border-slate-100">
              <h3 className="font-bold text-lg mb-4 flex items-center gap-2 text-slate-800"><Info className="text-blue-600" size={20} /> Agenda:</h3>
              <ul className="space-y-4 text-sm text-slate-600 font-medium">
                <li>• Portafolio HP 2026</li>
                <li>• Estrategias de rentabilidad</li>
                <li>• Networking especializado</li>
              </ul>
            </div>
          </div>

          <div className="lg:col-span-2">
            <div className="bg-white rounded-3xl shadow-2xl overflow-hidden border border-slate-100 p-8 md:p-10">
              <h2 className="text-3xl font-bold text-slate-800 mb-8 border-b pb-4">Registro de Invitados</h2>
              
              {error && (
                <div className={`mb-8 p-4 border-l-4 rounded-r-lg flex items-center gap-3 bg-red-50 border-red-500 text-red-700`}>
                  <AlertCircle size={24}/>
                  <p className="text-sm font-semibold">{error}</p>
                </div>
              )}
              
              <form onSubmit={handleSubmit} className="space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <input type="text" name="fullName" required className="w-full px-4 py-3 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 bg-slate-50/50" placeholder="Nombre Completo *" onChange={handleInputChange} />
                  <input type="text" name="company" required className="w-full px-4 py-3 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 bg-slate-50/50" placeholder="Compañía *" onChange={handleInputChange} />
                  <input type="text" name="jobTitle" required className="w-full px-4 py-3 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 bg-slate-50/50" placeholder="Puesto / Cargo *" onChange={handleInputChange} />
                  <input type="email" name="email" required className="w-full px-4 py-3 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 bg-slate-50/50" placeholder="Email Corporativo *" onChange={handleInputChange} />
                </div>

                <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200 space-y-6 shadow-inner">
                  <h4 className="text-xs font-black text-blue-600 uppercase flex items-center gap-2 tracking-widest"><Hash size={16} /> Perfil Técnico Actual</h4>
                  <input type="text" name="currentManufacturer" required className="w-full px-4 py-3 border border-slate-200 rounded-xl outline-none bg-white focus:ring-2 focus:ring-blue-500" placeholder="¿A qué fabricante compra actualmente? *" onChange={handleInputChange} />
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div className="relative"><Laptop className="absolute left-4 top-3.5 text-slate-400" size={18} /><input type="number" name="installedBase" className="w-full pl-12 pr-4 py-3 border border-slate-200 rounded-xl outline-none bg-white" placeholder="Equipos de cómputo" onChange={handleInputChange} /></div>
                    <div className="relative"><Server className="absolute left-4 top-3.5 text-slate-400" size={18} /><input type="number" name="physicalServers" className="w-full pl-12 pr-4 py-3 border border-slate-200 rounded-xl outline-none bg-white" placeholder="Servidores físicos" onChange={handleInputChange} /></div>
                  </div>
                </div>

                <div className="space-y-6">
                  <h4 className="text-xs font-black text-blue-600 uppercase flex items-center gap-2 tracking-widest"><Briefcase size={16} /> Planeación</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-slate-700 italic">¿Proyecto de renovación activo?</label>
                      <div className="flex gap-8">
                        {['Si', 'No'].map((opt) => (
                          <label key={opt} className="flex items-center gap-2 cursor-pointer group">
                            <input type="radio" name="hasRenewalProject" value={opt.toLowerCase()} className="w-5 h-5 text-blue-600" onChange={handleInputChange} />
                            <span className="text-sm font-semibold text-slate-600 group-hover:text-blue-600 transition-colors">{opt}</span>
                          </label>
                        ))}
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-slate-700"><Clock size={16} className="inline mr-1 text-blue-600"/> Plazo estimado</label>
                      <select name="projectTimeframe" className="w-full px-4 py-3 border border-slate-200 rounded-xl bg-white outline-none focus:ring-2 focus:ring-blue-500 shadow-sm" onChange={handleInputChange}>
                        <option value="">Seleccionar plazo...</option>
                        <option value="3">3 Meses</option>
                        <option value="6">6 Meses</option>
                        <option value="12">12 Meses</option>
                      </select>
                    </div>
                  </div>
                </div>

                <div className="pt-6 border-t border-slate-100 text-center">
                  <button type="submit" disabled={loading || !user} className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-slate-300 text-white font-black py-5 rounded-2xl shadow-xl transition-all flex items-center justify-center gap-3 text-lg uppercase tracking-widest transform hover:-translate-y-1 active:scale-95">
                    {loading ? <>Procesando... <Loader2 className="animate-spin" size={24} /></> : <>Confirmar Registro en HP <Send size={22} /></>}
                  </button>
                  {!user && !error && isConfigValid && <p className="text-[10px] text-slate-400 mt-4 animate-pulse">Estableciendo conexión segura...</p>}
                </div>
              </form>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default App;