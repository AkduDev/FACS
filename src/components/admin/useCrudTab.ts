import React, { useState, useCallback, useEffect } from 'react';
import { useUndoableDelete } from '../UndoableDelete';
import { useToast } from '../Toast';

interface CrudTabConfig<T extends { id: string }> {
  itemName: string;
  emptyForm: Omit<T, 'id'>;
  prefix: string;
  validate?: (form: Omit<T, 'id'>) => string | null;
}

export function useCrudTab<T extends { id: string }>(
  config: CrudTabConfig<T>,
  items: T[],
  onItemsChange: (updater: (prev: T[]) => T[]) => void
) {
  const { showToast } = useToast();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [filteredItems, setFilteredItems] = useState<T[]>(items);
  const [form, setForm] = useState<Omit<T, 'id'>>(config.emptyForm);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Sync filteredItems when items change from parent (e.g. polling)
  useEffect(() => {
    setFilteredItems(items);
  }, [items]);

  const { handleDelete } = useUndoableDelete({
    items,
    onItemsChange,
    onDelete: useCallback(() => {}, []),
    itemName: config.itemName,
  });

  const resetForm = useCallback(() => {
    setEditingId(null);
    setForm(config.emptyForm);
  }, [config.emptyForm]);

  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();

    if (config.validate) {
      const error = config.validate(form);
      if (error) {
        showToast(error, 'error');
        return;
      }
    }

    setIsSubmitting(true);
    try {
      if (editingId) {
        onItemsChange(prev => prev.map(item =>
          item.id === editingId ? { ...item, ...form } : item
        ));
      } else {
        const newItem = { id: config.prefix + crypto.randomUUID().slice(0, 8), ...form } as T;
        onItemsChange(prev => [newItem, ...prev]);
      }
      resetForm();
    } finally {
      setIsSubmitting(false);
    }
  }, [form, editingId, config, onItemsChange, resetForm, showToast]);

  const startEdit = useCallback((item: T) => {
    setEditingId(item.id);
    const { id: _, ...rest } = item;
    setForm(rest as Omit<T, 'id'>);
  }, []);

  return {
    editingId,
    filteredItems,
    setFilteredItems,
    form,
    setForm,
    isSubmitting,
    resetForm,
    handleSubmit,
    startEdit,
    handleDelete,
  };
}
