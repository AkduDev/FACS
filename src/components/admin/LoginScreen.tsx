import React, { useState } from 'react';
import { ShieldAlert, Lock } from 'lucide-react';
import fcasLogo from '../../assets/images/fcas_logo_v2_1783530295569.jpg';
import { LoginScreenProps } from './types';

export default function LoginScreen({ onLogin, onBack }: LoginScreenProps) {
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const success = await onLogin(password);
    if (!success) {
      setLoginError('Contraseña incorrecta');
    } else {
      setLoginError('');
      setPassword('');
    }
  };

  return (
    <div className="min-h-screen bg-marine-950 flex flex-col justify-center items-center px-4 relative overflow-hidden">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-marine-800/10 rounded-full blur-3xl pointer-events-none" />

      <div className="w-full max-w-md bg-marine-900 border border-marine-800 rounded-3xl p-8 shadow-2xl relative z-10">
        <div className="text-center mb-8">
          <div className="relative mx-auto w-20 h-20 bg-white rounded-full flex items-center justify-center mb-5 shadow-2xl p-1 border-2 border-cyan-400">
            <img
              src={fcasLogo}
              alt="Logo FCAS"
              className="w-full h-full object-contain rounded-full"
              referrerPolicy="no-referrer"
            />
            <div className="absolute -bottom-1 -right-1 bg-red-600 p-1.5 rounded-full shadow-lg border border-marine-900">
              <Lock className="h-3 w-3 text-white" />
            </div>
          </div>
          <h1 className="text-3xl font-display font-extrabold text-white tracking-tight">Acceso Administrativo</h1>
          <p className="text-xs text-marine-300 uppercase font-bold tracking-widest mt-2">Federación de Actividades Subacuáticas</p>
          <p className="text-sm text-marine-200 mt-4 leading-relaxed">
            Inicie sesión para editar y gestionar el catálogo de graduados, galería, instructores y noticias de la web de la FCAS.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-xs font-bold text-marine-300 uppercase tracking-widest mb-2">
              Contraseña de Administrador
            </label>
            <input
              type="password"
              placeholder="Introduzca la clave oficial..."
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-marine-950 text-white px-4 py-3 border border-marine-800 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500 font-sans"
            />

          </div>

          {loginError && (
            <div className="bg-red-950/40 border border-red-800 text-red-400 text-xs px-4 py-3 rounded-xl flex items-center space-x-2">
              <ShieldAlert className="h-4 w-4 shrink-0" />
              <span>{loginError}</span>
            </div>
          )}

          <button
            type="submit"
            className="w-full bg-gradient-to-r from-cyan-500 to-marine-500 hover:from-cyan-400 hover:to-marine-400 text-white py-3 px-4 rounded-2xl text-sm font-bold shadow-lg shadow-cyan-900/30 transition-all duration-200 hover:-translate-y-0.5 cursor-pointer"
          >
            Iniciar Sesión
          </button>
        </form>
      </div>

      <div className="mt-8 text-center">
        <button
          onClick={onBack}
          className="text-sm font-semibold text-marine-300 hover:text-white transition-all flex items-center space-x-1.5 cursor-pointer"
        >
          <span>← Volver a la página de inicio</span>
        </button>
      </div>
    </div>
  );
}
