import React from 'react';
import { Plus, Trash2, Edit2 } from 'lucide-react';
import { GalleryItem } from '../../types';
import { TabComponentProps } from './types';
import { getImageUrl } from '../../utils/imageUtils';
import ImageUploader from './ImageUploader';
import { SearchFilter } from '../SearchFilter';
import { useCrudTab } from './useCrudTab';

const GALLERY_CATEGORIES = [
  { value: 'fauna', label: 'Fauna Marina' },
  { value: 'flora', label: 'Flora y Coral' },
  { value: 'naufragios', label: 'Naufragios' },
  { value: 'entrenamiento', label: 'Entrenamiento' },
  { value: 'paisaje', label: 'Paisajes' },
];

const EMPTY_FORM: Omit<GalleryItem, 'id'> = {
  url: '', title: '', description: '', category: 'fauna',
  date: new Date().toISOString().split('T')[0], localImage: '',
};

function validate(form: Omit<GalleryItem, 'id'>): string | null {
  if (!form.title) return 'Por favor complete el título (obligatorio).';
  if (!form.description) return 'Por favor complete la descripción (obligatoria).';
  if (!form.url && !form.localImage) return 'Por favor suba una imagen.';
  return null;
}

export default function GalleryTab({ items, onItemsChange }: TabComponentProps<GalleryItem>) {
  const {
    editingId, filteredItems, setFilteredItems, form, setForm,
    isSubmitting, resetForm, handleSubmit, startEdit, handleDelete,
  } = useCrudTab<GalleryItem>(
    { itemName: 'Foto', emptyForm: EMPTY_FORM, prefix: 'g_', validate },
    items, onItemsChange
  );

  return (
    <div className="space-y-8">
      <div className="bg-white border border-gray-100 rounded-3xl p-6 sm:p-8 shadow-sm">
        <h3 className="text-xl font-display font-extrabold text-marine-950 mb-6 flex items-center space-x-2">
          <Plus className="h-5 w-5 text-cyan-600" />
          <span>{editingId ? 'Editar Foto en Galería' : 'Añadir Nueva Foto a la Galería'}</span>
        </h3>
        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="md:col-span-2">
            <ImageUploader
              onUploadComplete={(url) => setForm(prev => ({ ...prev, url, localImage: url }))}
              onUploadError={() => {}}
              onClear={() => setForm(prev => ({ ...prev, url: '', localImage: '' }))}
              label="Imagen de la Galería"
              uploadLabel="Subir imagen de galería"
              initialPreview={form.localImage || form.url || undefined}
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Título de la Imagen (Obligatorio)</label>
            <input type="text" placeholder="ej. Coral Negro en María la Gorda" value={form.title}
              onChange={(e) => setForm(prev => ({ ...prev, title: e.target.value }))}
              className="w-full border border-gray-200 px-4 py-2.5 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500" required />
          </div>
          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Categoría</label>
            <select value={form.category}
              onChange={(e) => setForm(prev => ({ ...prev, category: e.target.value as GalleryItem['category'] }))}
              className="w-full border border-gray-200 px-4 py-2.5 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500">
              {GALLERY_CATEGORIES.map(c => <option key={c.value} value={c.value}>{c.label}</option>)}
            </select>
          </div>
          <div className="md:col-span-2">
            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Descripción Detallada (Obligatorio)</label>
            <textarea rows={3} placeholder="Describa el espécimen, el lugar o la historia detrás de la fotografía..."
              value={form.description}
              onChange={(e) => setForm(prev => ({ ...prev, description: e.target.value }))}
              className="w-full border border-gray-200 px-4 py-2.5 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500" required />
          </div>
          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Fecha del Registro</label>
            <input type="date" value={form.date}
              onChange={(e) => setForm(prev => ({ ...prev, date: e.target.value }))}
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
              {editingId ? 'Actualizar Foto' : 'Guardar en Galería'}
            </button>
          </div>
        </form>
      </div>
      <SearchFilter<GalleryItem> items={items} onFilteredItems={setFilteredItems}
        searchFields={['title', 'description']} categories={GALLERY_CATEGORIES} categoryField="category"
        placeholder="Buscar fotos por título o descripción..." />
      <div className="bg-white border border-gray-100 rounded-3xl overflow-hidden shadow-sm">
        <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest bg-gray-50 px-6 py-4 border-b border-gray-100">Lista de fotos actuales</h3>
        <div className="divide-y divide-gray-100">
          {filteredItems.map(item => (
            <div key={item.id} className="p-4 sm:p-6 flex items-center justify-between gap-4 flex-wrap sm:flex-nowrap hover:bg-gray-50 transition-colors">
              <div className="flex items-center space-x-4">
                <img src={getImageUrl(item) || item.url} alt={item.title}
                  className="w-16 h-16 object-cover rounded-xl border border-gray-100 shrink-0" referrerPolicy="no-referrer" />
                <div>
                  <span className="text-[10px] uppercase font-extrabold px-2 py-0.5 bg-gray-100 border border-gray-200 rounded text-gray-600">{item.category}</span>
                  <h4 className="font-bold text-gray-950 mt-1 text-sm">{item.title}</h4>
                  <p className="text-xs text-gray-500 line-clamp-1 mt-0.5">{item.description}</p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <button onClick={() => startEdit(item)} className="p-2 rounded-xl bg-gray-50 hover:bg-cyan-50 text-gray-500 hover:text-cyan-600 border border-gray-100 cursor-pointer transition-colors" title="Editar">
                  <Edit2 className="h-4 w-4" />
                </button>
                <button onClick={() => handleDelete(item.id)} className="p-2 rounded-xl bg-gray-50 hover:bg-red-50 text-gray-500 hover:text-red-600 border border-gray-100 cursor-pointer transition-colors" title="Eliminar">
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
