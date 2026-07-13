import React from 'react';
import { Plus, Trash2, Edit2 } from 'lucide-react';
import { EventItem } from '../../types';
import { TabComponentProps } from './types';
import ImageUploader from './ImageUploader';
import { SearchFilter } from '../SearchFilter';
import { useCrudTab } from './useCrudTab';

const EVENT_CATEGORIES = [
  { value: 'competicion', label: 'Competencia / Torneo' },
  { value: 'limpieza', label: 'Limpieza de Fondos / Ecológico' },
  { value: 'curso', label: 'Curso o Taller Especial' },
  { value: 'reunion', label: 'Reunión o Asamblea' },
];

const EMPTY_FORM: Omit<EventItem, 'id'> = {
  title: '', date: new Date().toISOString().split('T')[0], location: '',
  description: '', category: 'curso', image: '', localImage: '',
};

function validate(form: Omit<EventItem, 'id'>): string | null {
  if (!form.title || !form.location) return 'Por favor complete los campos obligatorios.';
  return null;
}

export default function EventsTab({ items, onItemsChange }: TabComponentProps<EventItem>) {
  const {
    editingId, filteredItems, setFilteredItems, form, setForm,
    isSubmitting, resetForm, handleSubmit, startEdit, handleDelete,
  } = useCrudTab<EventItem>(
    { itemName: 'Evento', emptyForm: EMPTY_FORM, prefix: 'e_', validate },
    items, onItemsChange
  );

  return (
    <div className="space-y-8">
      <div className="bg-white border border-gray-100 rounded-3xl p-6 sm:p-8 shadow-sm">
        <h3 className="text-xl font-display font-extrabold text-marine-950 mb-6 flex items-center space-x-2">
          <Plus className="h-5 w-5 text-cyan-600" />
          <span>{editingId ? 'Editar Evento' : 'Crear Nuevo Evento'}</span>
        </h3>
        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="md:col-span-2">
            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Nombre del Evento (Obligatorio)</label>
            <input type="text" placeholder="ej. Campaña de Limpieza del Naufragio de Varadero" value={form.title}
              onChange={(e) => setForm(prev => ({ ...prev, title: e.target.value }))}
              className="w-full border border-gray-200 px-4 py-2.5 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500" required />
          </div>
          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Fecha del Evento</label>
            <input type="date" value={form.date}
              onChange={(e) => setForm(prev => ({ ...prev, date: e.target.value }))}
              className="w-full border border-gray-200 px-4 py-2.5 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500" />
          </div>
          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Lugar / Ubicación (Obligatorio)</label>
            <input type="text" placeholder="ej. Varadero, Matanzas" value={form.location}
              onChange={(e) => setForm(prev => ({ ...prev, location: e.target.value }))}
              className="w-full border border-gray-200 px-4 py-2.5 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500" required />
          </div>
          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Categoría</label>
            <select value={form.category}
              onChange={(e) => setForm(prev => ({ ...prev, category: e.target.value as EventItem['category'] }))}
              className="w-full border border-gray-200 px-4 py-2.5 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500">
              {EVENT_CATEGORIES.map(c => <option key={c.value} value={c.value}>{c.label}</option>)}
            </select>
          </div>
          <div>
            <ImageUploader
              onUploadComplete={(url) => setForm(prev => ({ ...prev, image: url, localImage: url }))}
              onUploadError={() => {}}
              onClear={() => setForm(prev => ({ ...prev, image: '', localImage: '' }))}
              label="Imagen de Portada" uploadLabel="Subir imagen de evento"
              initialPreview={form.localImage || form.image || undefined} />
          </div>
          <div className="md:col-span-2">
            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Descripción Detallada e Instrucciones</label>
            <textarea rows={3} placeholder="Detalle los requisitos mínimos de buceo..." value={form.description}
              onChange={(e) => setForm(prev => ({ ...prev, description: e.target.value }))}
              className="w-full border border-gray-200 px-4 py-2.5 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500" />
          </div>
          <div className="md:col-span-2 flex justify-end space-x-3 pt-4 border-t border-gray-100">
            {editingId && (
              <button type="button" onClick={resetForm}
                className="px-5 py-2.5 rounded-xl border border-gray-200 text-gray-600 text-sm font-semibold hover:bg-gray-50 cursor-pointer">
                Cancelar Edición
              </button>
            )}
            <button type="submit" disabled={isSubmitting}
              className="bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-sm px-6 py-2.5 rounded-xl transition-all cursor-pointer disabled:opacity-50">
              {editingId ? 'Actualizar Evento' : 'Crear Evento'}
            </button>
          </div>
        </form>
      </div>
      <SearchFilter<EventItem> items={items} onFilteredItems={setFilteredItems}
        searchFields={['title', 'location', 'description']} categories={EVENT_CATEGORIES} categoryField="category"
        placeholder="Buscar eventos por nombre, lugar o descripción..." />
      <div className="bg-white border border-gray-100 rounded-3xl overflow-hidden shadow-sm">
        <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest bg-gray-50 px-6 py-4 border-b border-gray-100">Eventos Programados</h3>
        <div className="divide-y divide-gray-100">
          {filteredItems.map(item => (
            <div key={item.id} className="p-4 sm:p-6 flex items-center justify-between gap-4 flex-wrap sm:flex-nowrap hover:bg-gray-50 transition-colors">
              <div>
                <div className="flex items-center space-x-2">
                  <span className="text-[10px] uppercase font-extrabold px-2 py-0.5 bg-gray-100 border border-gray-200 rounded text-gray-600">{item.category}</span>
                  <span className="text-xs text-gray-450 font-semibold">{item.location}</span>
                </div>
                <h4 className="font-bold text-gray-950 mt-1 text-sm">{item.title}</h4>
                <span className="text-xs font-mono text-cyan-600 font-bold">{item.date}</span>
              </div>
              <div className="flex items-center space-x-2">
                <button onClick={() => startEdit(item)} className="p-2 rounded-xl bg-gray-50 hover:bg-cyan-50 text-gray-500 hover:text-cyan-600 border border-gray-100 cursor-pointer transition-colors">
                  <Edit2 className="h-4 w-4" />
                </button>
                <button onClick={() => handleDelete(item.id)} className="p-2 rounded-xl bg-gray-50 hover:bg-red-50 text-gray-500 hover:text-red-600 border border-gray-100 cursor-pointer transition-colors">
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
