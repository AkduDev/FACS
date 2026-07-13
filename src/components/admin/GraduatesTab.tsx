import React from 'react';
import { Plus, Trash2, Edit2 } from 'lucide-react';
import { Graduate } from '../../types';
import { TabComponentProps } from './types';
import { SearchFilter } from '../SearchFilter';
import { useCrudTab } from './useCrudTab';
import { useThemeLang } from '../../ThemeLangContext';
import { adminT } from '../../utils/adminTranslations';

const EMPTY_FORM: Omit<Graduate, 'id'> = {
  name: '', certificationCode: '',
  courseName: 'Open Water Diver (1 Estrella)',
  graduationDate: new Date().toISOString().split('T')[0],
  instructorName: '', level: '1-star',
};

export default function GraduatesTab({ items, onItemsChange }: TabComponentProps<Graduate>) {
  const { lang } = useThemeLang();
  const t = adminT(lang);

  const LEVEL_OPTIONS = [
    { value: '1-star', label: t.level1StarFull },
    { value: '2-star', label: t.level2StarFull },
    { value: '3-star', label: t.level3StarFull },
    { value: 'divemaster', label: t.levelDivemasterFull },
    { value: 'instructor', label: t.levelInstructorFull },
  ];

  const LEVEL_LABELS: Record<string, string> = {
    '1-star': t.level1Star, '2-star': t.level2Star, '3-star': t.level3Star,
    'divemaster': t.levelDivemaster, 'instructor': t.levelInstructor,
  };

  const validate = (form: Omit<Graduate, 'id'>): string | null => {
    if (!form.name || !form.certificationCode || !form.instructorName)
      return t.graduatesValidate;
    return null;
  };

  const {
    editingId, filteredItems, setFilteredItems, form, setForm,
    isSubmitting, resetForm, handleSubmit, startEdit, handleDelete,
  } = useCrudTab<Graduate>(
    { itemName: t.tabGraduates, emptyForm: EMPTY_FORM, prefix: 'gd_', validate },
    items, onItemsChange
  );

  return (
    <div className="space-y-8">
      <div className="bg-white border border-gray-100 rounded-3xl p-6 sm:p-8 shadow-sm">
        <h3 className="text-xl font-display font-extrabold text-marine-950 mb-6 flex items-center space-x-2">
          <Plus className="h-5 w-5 text-cyan-600" />
          <span>{editingId ? t.graduatesEdit : t.graduatesAdd}</span>
        </h3>
        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">{t.graduatesName}</label>
            <input type="text" placeholder={lang === 'es' ? 'ej. Ernesto Pérez Alonso' : 'e.g. Ernesto Perez Alonso'} value={form.name}
              onChange={(e) => setForm(prev => ({ ...prev, name: e.target.value }))}
              className="w-full border border-gray-200 px-4 py-2.5 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500" required />
          </div>
          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">{t.graduatesCert}</label>
            <input type="text" placeholder="e.g. FCAS-OW-2026-004" value={form.certificationCode}
              onChange={(e) => setForm(prev => ({ ...prev, certificationCode: e.target.value }))}
              className="w-full border border-gray-200 px-4 py-2.5 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500" required />
          </div>
          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">{t.graduatesCourse}</label>
            <input type="text" placeholder="e.g. Open Water Diver (1 Star)" value={form.courseName}
              onChange={(e) => setForm(prev => ({ ...prev, courseName: e.target.value }))}
              className="w-full border border-gray-200 px-4 py-2.5 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500" required />
          </div>
          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">{t.graduatesLevel}</label>
            <select value={form.level}
              onChange={(e) => setForm(prev => ({ ...prev, level: e.target.value as Graduate['level'] }))}
              className="w-full border border-gray-200 px-4 py-2.5 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500">
              {LEVEL_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">{t.graduatesInstructor}</label>
            <input type="text" placeholder={lang === 'es' ? 'ej. Alejandro "El Capi" Silva' : 'e.g. Alejandro Silva'} value={form.instructorName}
              onChange={(e) => setForm(prev => ({ ...prev, instructorName: e.target.value }))}
              className="w-full border border-gray-200 px-4 py-2.5 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500" required />
          </div>
          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">{t.graduatesDate}</label>
            <input type="date" value={form.graduationDate}
              onChange={(e) => setForm(prev => ({ ...prev, graduationDate: e.target.value }))}
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
              {editingId ? t.graduatesUpdate : t.graduatesSave}
            </button>
          </div>
        </form>
      </div>
      <SearchFilter<Graduate> items={items} onFilteredItems={setFilteredItems}
        searchFields={['name', 'courseName', 'instructorName', 'certificationCode']}
        placeholder={t.graduatesSearch} />
      <div className="bg-white border border-gray-100 rounded-3xl overflow-hidden shadow-sm">
        <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest bg-gray-50 px-6 py-4 border-b border-gray-100">{t.graduatesList}</h3>
        <div className="divide-y divide-gray-100">
          {filteredItems.map(item => (
            <div key={item.id} className="p-4 sm:p-6 flex items-center justify-between gap-4 flex-wrap sm:flex-nowrap hover:bg-gray-50 transition-colors">
              <div>
                <h4 className="font-bold text-gray-950 text-sm">{item.name}</h4>
                <p className="text-xs text-gray-500">{t.graduatesCurso}: {item.courseName} • {t.graduatesInstructorLabel}: {item.instructorName}</p>
                <div className="flex items-center space-x-2 mt-1.5">
                  <span className="text-[10px] font-mono text-cyan-600 font-bold bg-cyan-50 border border-cyan-100 px-2 py-0.5 rounded">{item.certificationCode}</span>
                  <span className="text-[10px] text-gray-400 font-semibold uppercase">{LEVEL_LABELS[item.level] || item.level}</span>
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
