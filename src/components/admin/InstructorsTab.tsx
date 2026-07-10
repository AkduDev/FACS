import React, { useState } from 'react';
import { Plus, Trash2, Edit2 } from 'lucide-react';
import { Instructor } from '../../types';
import { TabComponentProps } from './types';
import { getImageUrl } from '../../utils/imageUtils';
import ImageUploader from './ImageUploader';

export default function InstructorsTab({ items, onItemsChange }: TabComponentProps<Instructor>) {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [imageMode, setImageMode] = useState<'url' | 'upload'>('url');
  const [form, setForm] = useState<Omit<Instructor, 'id'>>({
    name: '',
    bio: '',
    level: '',
    certificationCode: '',
    photo: '',
    localPhoto: '',
    experienceYears: 5
  });

  const generateId = () => 'i_' + Math.random().toString(36).substring(2, 9);

  const resetForm = () => {
    setEditingId(null);
    setImageMode('url');
    setForm({
      name: '',
      bio: '',
      level: '',
      certificationCode: '',
      photo: '',
      localPhoto: '',
      experienceYears: 5
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.certificationCode) {
      alert('Por favor complete los campos obligatorios.');
      return;
    }

    const photoToSave = form.photo || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=800&q=80';

    if (editingId) {
      onItemsChange(prev => prev.map(item => item.id === editingId ? { ...item, ...form, photo: photoToSave } : item));
    } else {
      const newItem: Instructor = { id: generateId(), ...form, photo: photoToSave };
      onItemsChange(prev => [newItem, ...prev]);
    }
    resetForm();
  };

  const startEdit = (item: Instructor) => {
    setEditingId(item.id);
    setForm({
      name: item.name,
      bio: item.bio,
      level: item.level,
      certificationCode: item.certificationCode,
      photo: item.photo,
      localPhoto: item.localPhoto || '',
      experienceYears: item.experienceYears
    });
    setImageMode(item.localPhoto ? 'upload' : 'url');
  };

  const handleDelete = (id: string) => {
    if (confirm('¿Está seguro de eliminar este instructor?')) {
      onItemsChange(prev => prev.filter(item => item.id !== id));
    }
  };

  return (
    <div className="space-y-8">
      {/* Form */}
      <div className="bg-white border border-gray-100 rounded-3xl p-6 sm:p-8 shadow-sm">
        <h3 className="text-xl font-display font-extrabold text-marine-950 mb-6 flex items-center space-x-2">
          <Plus className="h-5 w-5 text-cyan-600" />
          <span>{editingId ? 'Editar Biografía de Instructor' : 'Inscribir Nuevo Instructor Certificado'}</span>
        </h3>

        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Nombre y Apellidos (Obligatorio)</label>
            <input
              type="text"
              placeholder="ej. Dra. Mayra González"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="w-full border border-gray-200 px-4 py-2.5 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500"
              required
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Código de Certificación CMAS (Obligatorio)</label>
            <input
              type="text"
              placeholder="ej. CUB-INST-115"
              value={form.certificationCode}
              onChange={(e) => setForm({ ...form, certificationCode: e.target.value })}
              className="w-full border border-gray-200 px-4 py-2.5 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500"
              required
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Nivel Técnico (ej. Instructor 2 Estrellas)</label>
            <input
              type="text"
              placeholder="ej. Instructor de Especialidades Técnicas"
              value={form.level}
              onChange={(e) => setForm({ ...form, level: e.target.value })}
              className="w-full border border-gray-200 px-4 py-2.5 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Años de Experiencia Activa</label>
            <input
              type="number"
              value={form.experienceYears}
              onChange={(e) => setForm({ ...form, experienceYears: parseInt(e.target.value, 10) || 0 })}
              className="w-full border border-gray-200 px-4 py-2.5 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500"
            />
          </div>
          <div className="md:col-span-2">
            <ImageUploader
              mode={imageMode}
              onModeChange={setImageMode}
              url={form.photo}
              onUrlChange={(url) => setForm({ ...form, photo: url })}
              onUploadComplete={(url) => setForm({ ...form, photo: url, localPhoto: url })}
              onUploadError={(error) => alert(error)}
              label="Foto de Perfil"
              uploadLabel="Subir foto de instructor"
            />
          </div>
          <div className="md:col-span-2">
            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Biografía Profesional y Especialidades</label>
            <textarea
              rows={3}
              placeholder="Escriba un resumen de su trayectoria, cantidad de inmersiones guiadas, títulos especiales, etc."
              value={form.bio}
              onChange={(e) => setForm({ ...form, bio: e.target.value })}
              className="w-full border border-gray-200 px-4 py-2.5 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500"
            />
          </div>

          <div className="md:col-span-2 flex justify-end space-x-3 pt-4 border-t border-gray-100">
            {editingId && (
              <button
                type="button"
                onClick={resetForm}
                className="px-5 py-2.5 rounded-xl border border-gray-200 text-gray-600 text-sm font-semibold hover:bg-gray-50 cursor-pointer"
              >
                Cancelar Edición
              </button>
            )}
            <button
              type="submit"
              className="bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-sm px-6 py-2.5 rounded-xl transition-all cursor-pointer"
            >
              {editingId ? 'Actualizar Biografía' : 'Guardar Instructor'}
            </button>
          </div>
        </form>
      </div>

      {/* Listing */}
      <div className="bg-white border border-gray-100 rounded-3xl overflow-hidden shadow-sm">
        <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest bg-gray-50 px-6 py-4 border-b border-gray-100">Instructores Registrados</h3>
        <div className="divide-y divide-gray-100">
          {items.map(item => (
            <div key={item.id} className="p-4 sm:p-6 flex items-center justify-between gap-4 flex-wrap sm:flex-nowrap hover:bg-gray-50 transition-colors">
              <div className="flex items-center space-x-4">
                <img
                  src={getImageUrl(item) || item.photo}
                  alt={item.name}
                  className="w-12 h-12 rounded-full object-cover border border-gray-150 shrink-0"
                  referrerPolicy="no-referrer"
                />
                <div>
                  <h4 className="font-bold text-gray-950 text-sm">{item.name}</h4>
                  <p className="text-xs text-gray-500">{item.level} • {item.experienceYears} años de servicio</p>
                  <span className="text-[10px] font-mono text-cyan-600 font-bold bg-cyan-50 border border-cyan-100 px-2 py-0.5 rounded mt-1 inline-block">
                    {item.certificationCode}
                  </span>
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <button
                  onClick={() => startEdit(item)}
                  className="p-2 rounded-xl bg-gray-50 hover:bg-cyan-50 text-gray-500 hover:text-cyan-600 border border-gray-100 cursor-pointer transition-colors"
                >
                  <Edit2 className="h-4 w-4" />
                </button>
                <button
                  onClick={() => handleDelete(item.id)}
                  className="p-2 rounded-xl bg-gray-50 hover:bg-red-50 text-gray-500 hover:text-red-600 border border-gray-100 cursor-pointer transition-colors"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
