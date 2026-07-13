import React from 'react';
import { Plus, Trash2, Edit2 } from 'lucide-react';
import { NewsItem } from '../../types';
import { TabComponentProps } from './types';
import ImageUploader from './ImageUploader';
import { SearchFilter } from '../SearchFilter';
import { useCrudTab } from './useCrudTab';
import { useThemeLang } from '../../ThemeLangContext';
import { adminT } from '../../utils/adminTranslations';

const NEWS_CATEGORIES = [
  { value: 'conservacion', label: 'Conservación' },
  { value: 'federacion', label: 'Federativo / Institucional' },
  { value: 'seguridad', label: 'Seguridad y Normas' },
  { value: 'exploracion', label: 'Exploración y Ciencia' },
];

const EMPTY_FORM: Omit<NewsItem, 'id'> = {
  title: '', content: '', date: new Date().toISOString().split('T')[0],
  image: '', localImage: '', author: 'Administrador FCAS', category: 'federacion',
};

export default function NewsTab({ items, onItemsChange }: TabComponentProps<NewsItem>) {
  const { lang } = useThemeLang();
  const t = adminT(lang);

  const validate = (form: Omit<NewsItem, 'id'>): string | null => {
    if (!form.title || !form.content) return t.newsValidate;
    return null;
  };

  const {
    editingId, filteredItems, setFilteredItems, form, setForm,
    isSubmitting, resetForm, handleSubmit, startEdit, handleDelete,
  } = useCrudTab<NewsItem>(
    { itemName: t.tabNews, emptyForm: EMPTY_FORM, prefix: 'n_', validate },
    items, onItemsChange
  );

  return (
    <div className="space-y-8">
      <div className="bg-white border border-gray-100 rounded-3xl p-6 sm:p-8 shadow-sm">
        <h3 className="text-xl font-display font-extrabold text-marine-950 mb-6 flex items-center space-x-2">
          <Plus className="h-5 w-5 text-cyan-600" />
          <span>{editingId ? t.newsEdit : t.newsAdd}</span>
        </h3>
        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="md:col-span-2">
            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">{t.newsTitleLabel}</label>
            <input type="text" placeholder={lang === 'es' ? 'ej. Expedición científica...' : 'e.g. Scientific expedition...'} value={form.title}
              onChange={(e) => setForm(prev => ({ ...prev, title: e.target.value }))}
              className="w-full border border-gray-200 px-4 py-2.5 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500" required />
          </div>
          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">{t.newsAuthor}</label>
            <input type="text" value={form.author}
              onChange={(e) => setForm(prev => ({ ...prev, author: e.target.value }))}
              className="w-full border border-gray-200 px-4 py-2.5 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500" />
          </div>
          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">{t.categoria}</label>
            <select value={form.category}
              onChange={(e) => setForm(prev => ({ ...prev, category: e.target.value as NewsItem['category'] }))}
              className="w-full border border-gray-200 px-4 py-2.5 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500">
              {NEWS_CATEGORIES.map(c => <option key={c.value} value={c.value}>{c.label}</option>)}
            </select>
          </div>
          <div className="md:col-span-2">
            <ImageUploader
              onUploadComplete={(url) => setForm(prev => ({ ...prev, image: url, localImage: url }))}
              onUploadError={() => {}}
              onClear={() => setForm(prev => ({ ...prev, image: '', localImage: '' }))}
              label={t.newsImageLabel} uploadLabel={t.subirImagen}
              initialPreview={form.localImage || form.image || undefined} />
          </div>
          <div className="md:col-span-2">
            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">{t.newsContentLabel}</label>
            <textarea rows={6} placeholder={lang === 'es' ? 'Escriba los párrafos de la noticia...' : 'Write the news paragraphs...'} value={form.content}
              onChange={(e) => setForm(prev => ({ ...prev, content: e.target.value }))}
              className="w-full border border-gray-200 px-4 py-2.5 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500" required />
          </div>
          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">{t.newsDateLabel}</label>
            <input type="date" value={form.date}
              onChange={(e) => setForm(prev => ({ ...prev, date: e.target.value }))}
              className="w-full border border-gray-200 px-4 py-2.5 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500" />
          </div>

          {/* EN Fields */}
          <div className="md:col-span-2 border-t border-gray-100 pt-6 mt-2">
            <p className="text-xs font-bold text-cyan-600 uppercase tracking-wider mb-4">{t.enFields}</p>
          </div>
          <div className="md:col-span-2">
            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">{t.tituloEn}</label>
            <input type="text" value={(form as Record<string, unknown>).titleEn as string || ''}
              onChange={(e) => setForm(prev => ({ ...prev, titleEn: e.target.value } as Record<string, unknown>))}
              className="w-full border border-gray-200 px-4 py-2.5 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500" />
          </div>
          <div className="md:col-span-2">
            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">{t.categoriaEn}</label>
            <input type="text" value={(form as Record<string, unknown>).categoryEn as string || ''}
              onChange={(e) => setForm(prev => ({ ...prev, categoryEn: e.target.value } as Record<string, unknown>))}
              className="w-full border border-gray-200 px-4 py-2.5 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500" />
          </div>
          <div className="md:col-span-2">
            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">{t.descripcionEn} ({lang === 'es' ? 'Contenido' : 'Content'})</label>
            <textarea rows={4} value={(form as Record<string, unknown>).contentEn as string || ''}
              onChange={(e) => setForm(prev => ({ ...prev, contentEn: e.target.value } as Record<string, unknown>))}
              className="w-full border border-gray-200 px-4 py-2.5 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500" />
          </div>

          <div className="md:col-span-2 flex justify-end space-x-3 pt-4 border-t border-gray-100">
            {editingId && (
              <button type="button" onClick={resetForm}
                className="px-5 py-2.5 rounded-xl border border-gray-200 text-gray-600 text-sm font-semibold hover:bg-gray-50 cursor-pointer">
                {t.cancelar}
              </button>
            )}
            <button type="submit" disabled={isSubmitting}
              className="bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-sm px-6 py-2.5 rounded-xl transition-all cursor-pointer disabled:opacity-50">
              {editingId ? t.newsUpdate : t.newsSave}
            </button>
          </div>
        </form>
      </div>
      <SearchFilter<NewsItem> items={items} onFilteredItems={setFilteredItems}
        searchFields={['title', 'content', 'author']} categories={NEWS_CATEGORIES} categoryField="category"
        placeholder={t.newsSearch} />
      <div className="bg-white border border-gray-100 rounded-3xl overflow-hidden shadow-sm">
        <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest bg-gray-50 px-6 py-4 border-b border-gray-100">{t.newsList}</h3>
        <div className="divide-y divide-gray-100">
          {filteredItems.map(item => (
            <div key={item.id} className="p-4 sm:p-6 flex items-center justify-between gap-4 flex-wrap sm:flex-nowrap hover:bg-gray-50 transition-colors">
              <div className="flex-1">
                <div className="flex items-center space-x-2">
                  <span className="text-[10px] uppercase font-extrabold px-2 py-0.5 bg-gray-100 border border-gray-200 rounded text-gray-600">{item.category}</span>
                  <span className="text-xs text-gray-400 font-mono">{item.date}</span>
                </div>
                <h4 className="font-bold text-gray-950 mt-1 text-sm">{item.title}</h4>
                <p className="text-xs text-gray-500 line-clamp-1 mt-0.5">{item.content}</p>
              </div>
              <div className="flex items-center space-x-2 shrink-0">
                <button onClick={() => startEdit(item)} className="p-2 rounded-xl bg-gray-50 hover:bg-cyan-50 text-gray-500 hover:text-cyan-600 border border-gray-100 cursor-pointer transition-colors" title={t.editar}>
                  <Edit2 className="h-4 w-4" />
                </button>
                <button onClick={() => handleDelete(item.id)} className="p-2 rounded-xl bg-gray-50 hover:bg-red-50 text-gray-500 hover:text-red-600 border border-gray-100 cursor-pointer transition-colors" title={t.eliminar}>
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
