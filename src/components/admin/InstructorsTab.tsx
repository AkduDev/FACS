import React from 'react';
import { Plus, Trash2, Edit2 } from 'lucide-react';
import { Instructor } from '../../types';
import { TabComponentProps } from './types';
import { getImageUrl } from '../../utils/imageUtils';
import ImageUploader from './ImageUploader';
import { SearchFilter } from '../SearchFilter';
import { useCrudTab } from './useCrudTab';
import { useThemeLang } from '../../ThemeLangContext';
import { adminT } from '../../utils/adminTranslations';

const EMPTY_FORM: Omit<Instructor, 'id'> = {
  name: '', bio: '', level: '', certificationCode: '', photo: '',
  localPhoto: '', experienceYears: 5,
};

export default function InstructorsTab({ items, onItemsChange }: TabComponentProps<Instructor>) {
  const { lang } = useThemeLang();
  const t = adminT(lang);

  const validate = (form: Omit<Instructor, 'id'>): string | null => {
    if (!form.name || !form.certificationCode) return t.instructorsValidate;
    return null;
  };

  const {
    editingId, filteredItems, setFilteredItems, form, setForm,
    isSubmitting, resetForm, handleSubmit, startEdit, handleDelete,
  } = useCrudTab<Instructor>(
    { itemName: t.tabInstructors, emptyForm: EMPTY_FORM, prefix: 'i_', validate },
    items, onItemsChange
  );

  const photoToSave = form.photo || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=800&q=80';

  const handleInstructorSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setForm(prev => ({ ...prev, photo: prev.photo || photoToSave }));
    handleSubmit(e);
  };

  return (
    <div className="space-y-8">
      <div className="bg-white border border-gray-100 rounded-3xl p-6 sm:p-8 shadow-sm">
        <h3 className="text-xl font-display font-extrabold text-marine-950 mb-6 flex items-center space-x-2">
          <Plus className="h-5 w-5 text-cyan-600" />
          <span>{editingId ? t.instructorsEdit : t.instructorsAdd}</span>
        </h3>
        <form onSubmit={handleInstructorSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">{t.instructorsName}</label>
            <input type="text" placeholder={lang === 'es' ? 'ej. Dra. Mayra González' : 'e.g. Dr. Mayra Gonzalez'} value={form.name}
              onChange={(e) => setForm(prev => ({ ...prev, name: e.target.value }))}
              className="w-full border border-gray-200 px-4 py-2.5 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500" required />
          </div>
          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">{t.instructorsCert}</label>
            <input type="text" placeholder="e.g. CUB-INST-115" value={form.certificationCode}
              onChange={(e) => setForm(prev => ({ ...prev, certificationCode: e.target.value }))}
              className="w-full border border-gray-200 px-4 py-2.5 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500" required />
          </div>
          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">{t.instructorsLevel}</label>
            <input type="text" placeholder={lang === 'es' ? 'ej. Instructor de Especialidades Técnicas' : 'e.g. Technical Specialties Instructor'} value={form.level}
              onChange={(e) => setForm(prev => ({ ...prev, level: e.target.value }))}
              className="w-full border border-gray-200 px-4 py-2.5 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500" />
          </div>
          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">{t.instructorsYears}</label>
            <input type="number" value={form.experienceYears}
              onChange={(e) => setForm(prev => ({ ...prev, experienceYears: parseInt(e.target.value, 10) || 0 }))}
              className="w-full border border-gray-200 px-4 py-2.5 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500" />
          </div>
          <div className="md:col-span-2">
            <ImageUploader
              onUploadComplete={(url) => setForm(prev => ({ ...prev, photo: url, localPhoto: url }))}
              onUploadError={() => {}}
              onClear={() => setForm(prev => ({ ...prev, photo: '', localPhoto: '' }))}
              label={t.instructorsPhoto} uploadLabel={t.subirImagen}
              initialPreview={form.localPhoto || form.photo || undefined} />
          </div>
          <div className="md:col-span-2">
            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">{t.instructorsBio}</label>
            <textarea rows={3} placeholder={lang === 'es' ? 'Escriba un resumen de su trayectoria...' : 'Write a summary of their career...'} value={form.bio}
              onChange={(e) => setForm(prev => ({ ...prev, bio: e.target.value }))}
              className="w-full border border-gray-200 px-4 py-2.5 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500" />
          </div>

          {/* EN Fields */}
          <div className="md:col-span-2 border-t border-gray-100 pt-6 mt-2">
            <p className="text-xs font-bold text-cyan-600 uppercase tracking-wider mb-4">{t.enFields}</p>
          </div>
          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">{t.instructorsLevelEn}</label>
            <input type="text" value={(form as Record<string, unknown>).levelEn as string || ''}
              onChange={(e) => setForm(prev => ({ ...prev, levelEn: e.target.value } as Record<string, unknown>))}
              className="w-full border border-gray-200 px-4 py-2.5 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500" />
          </div>
          <div className="md:col-span-2">
            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">{t.instructorsBioEn}</label>
            <textarea rows={3} value={(form as Record<string, unknown>).bioEn as string || ''}
              onChange={(e) => setForm(prev => ({ ...prev, bioEn: e.target.value } as Record<string, unknown>))}
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
              {editingId ? t.instructorsUpdate : t.instructorsSave}
            </button>
          </div>
        </form>
      </div>
      <SearchFilter<Instructor> items={items} onFilteredItems={setFilteredItems}
        searchFields={['name', 'level', 'certificationCode']}
        placeholder={t.instructorsSearch} />
      <div className="bg-white border border-gray-100 rounded-3xl overflow-hidden shadow-sm">
        <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest bg-gray-50 px-6 py-4 border-b border-gray-100">{t.instructorsList}</h3>
        <div className="divide-y divide-gray-100">
          {filteredItems.map(item => (
            <div key={item.id} className="p-4 sm:p-6 flex items-center justify-between gap-4 flex-wrap sm:flex-nowrap hover:bg-gray-50 transition-colors">
              <div className="flex items-center space-x-4">
                <img src={getImageUrl(item) || item.photo} alt={item.name}
                  className="w-12 h-12 rounded-full object-cover border border-gray-150 shrink-0" referrerPolicy="no-referrer" />
                <div>
                  <h4 className="font-bold text-gray-950 text-sm">{item.name}</h4>
                  <p className="text-xs text-gray-500">{item.level} • {item.experienceYears} {t.instructorsYearsLabel}</p>
                  <span className="text-[10px] font-mono text-cyan-600 font-bold bg-cyan-50 border border-cyan-100 px-2 py-0.5 rounded mt-1 inline-block">{item.certificationCode}</span>
                </div>
              </div>
              <div className="flex items-center space-x-2">
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
