import React, { useState } from 'react';
import { Plus, Trash2, Edit2 } from 'lucide-react';
import { NewsItem } from '../../types';
import { TabComponentProps } from './types';
import ImageUploader from './ImageUploader';

export default function NewsTab({ items, onItemsChange }: TabComponentProps<NewsItem>) {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [imageMode, setImageMode] = useState<'url' | 'upload'>('url');
  const [form, setForm] = useState<Omit<NewsItem, 'id'>>({
    title: '',
    content: '',
    date: new Date().toISOString().split('T')[0],
    image: '',
    localImage: '',
    author: 'Administrador FCAS',
    category: 'federacion'
  });

  const generateId = () => 'n_' + Math.random().toString(36).substring(2, 9);

  const resetForm = () => {
    setEditingId(null);
    setImageMode('url');
    setForm({
      title: '',
      content: '',
      date: new Date().toISOString().split('T')[0],
      image: '',
      localImage: '',
      author: 'Administrador FCAS',
      category: 'federacion'
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title || !form.content) {
      alert('Por favor complete los campos obligatorios.');
      return;
    }

    if (editingId) {
      onItemsChange(prev => prev.map(item => item.id === editingId ? { ...item, ...form } : item));
    } else {
      const newItem: NewsItem = { id: generateId(), ...form };
      onItemsChange(prev => [newItem, ...prev]);
    }
    resetForm();
  };

  const startEdit = (item: NewsItem) => {
    setEditingId(item.id);
    setForm({
      title: item.title,
      content: item.content,
      date: item.date,
      image: item.image || '',
      localImage: item.localImage || '',
      author: item.author,
      category: item.category
    });
    setImageMode(item.localImage ? 'upload' : 'url');
  };

  const handleDelete = (id: string) => {
    if (confirm('¿Está seguro de eliminar esta noticia?')) {
      onItemsChange(prev => prev.filter(item => item.id !== id));
    }
  };

  return (
    <div className="space-y-8">
      {/* Form */}
      <div className="bg-white border border-gray-100 rounded-3xl p-6 sm:p-8 shadow-sm">
        <h3 className="text-xl font-display font-extrabold text-marine-950 mb-6 flex items-center space-x-2">
          <Plus className="h-5 w-5 text-cyan-600" />
          <span>{editingId ? 'Editar Comunicado / Noticia' : 'Crear Nueva Noticia o Comunicado'}</span>
        </h3>

        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="md:col-span-2">
            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Título del Comunicado (Obligatorio)</label>
            <input
              type="text"
              placeholder="ej. Expedición científica reporta reaparición de corales cuerno de ciervo..."
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              className="w-full border border-gray-200 px-4 py-2.5 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500"
              required
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Autor / Comité Emisor</label>
            <input
              type="text"
              value={form.author}
              onChange={(e) => setForm({ ...form, author: e.target.value })}
              className="w-full border border-gray-200 px-4 py-2.5 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Categoría</label>
            <select
              value={form.category}
              onChange={(e) => setForm({ ...form, category: e.target.value as NewsItem['category'] })}
              className="w-full border border-gray-200 px-4 py-2.5 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500"
            >
              <option value="conservacion">Conservación</option>
              <option value="federacion">Federativo / Institucional</option>
              <option value="seguridad">Seguridad y Normas</option>
              <option value="exploracion">Exploración y Ciencia</option>
            </select>
          </div>
          <div className="md:col-span-2">
            <ImageUploader
              mode={imageMode}
              onModeChange={setImageMode}
              url={form.image || ''}
              onUrlChange={(url) => setForm({ ...form, image: url })}
              onUploadComplete={(url) => setForm({ ...form, image: url, localImage: url })}
              onUploadError={(error) => alert(error)}
              label="Imagen Ilustrativa"
              uploadLabel="Subir imagen de noticia"
            />
          </div>
          <div className="md:col-span-2">
            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Contenido Completo de la Noticia</label>
            <textarea
              rows={6}
              placeholder="Escriba los párrafos de la noticia..."
              value={form.content}
              onChange={(e) => setForm({ ...form, content: e.target.value })}
              className="w-full border border-gray-200 px-4 py-2.5 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500"
              required
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Fecha Publicación</label>
            <input
              type="date"
              value={form.date}
              onChange={(e) => setForm({ ...form, date: e.target.value })}
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
              {editingId ? 'Actualizar Noticia' : 'Publicar Noticia'}
            </button>
          </div>
        </form>
      </div>

      {/* Listing */}
      <div className="bg-white border border-gray-100 rounded-3xl overflow-hidden shadow-sm">
        <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest bg-gray-50 px-6 py-4 border-b border-gray-100">Lista de noticias actuales</h3>
        <div className="divide-y divide-gray-100">
          {items.map(item => (
            <div key={item.id} className="p-4 sm:p-6 flex items-center justify-between gap-4 flex-wrap sm:flex-nowrap hover:bg-gray-50 transition-colors">
              <div className="flex-1">
                <div className="flex items-center space-x-2">
                  <span className="text-[10px] uppercase font-extrabold px-2 py-0.5 bg-gray-100 border border-gray-200 rounded text-gray-600">
                    {item.category}
                  </span>
                  <span className="text-xs text-gray-400 font-mono">{item.date}</span>
                </div>
                <h4 className="font-bold text-gray-950 mt-1 text-sm">{item.title}</h4>
                <p className="text-xs text-gray-500 line-clamp-1 mt-0.5">{item.content}</p>
              </div>

              <div className="flex items-center space-x-2 shrink-0">
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
