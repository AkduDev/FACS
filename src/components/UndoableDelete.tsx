import { useState, useCallback, useEffect, useRef } from 'react';
import { useToast } from './Toast';

interface UndoableDeleteProps<T extends { id: string }> {
  items: T[];
  onItemsChange: (updater: (prev: T[]) => T[]) => void;
  onDelete: (id: string) => void;
  itemName?: string;
}

export function useUndoableDelete<T extends { id: string }>({
  items,
  onItemsChange,
  onDelete,
  itemName = 'elemento',
}: UndoableDeleteProps<T>) {
  const { showToast } = useToast();
  const [pendingDelete, setPendingDelete] = useState<{ item: T; timeout: NodeJS.Timeout } | null>(null);
  const itemsRef = useRef(items);
  itemsRef.current = items;

  const handleDelete = useCallback((id: string) => {
    const item = itemsRef.current.find(i => i.id === id);
    if (!item) return;

    onItemsChange(prev => prev.filter(i => i.id !== id));

    const timeout = setTimeout(() => {
      onDelete(id);
      setPendingDelete(null);
    }, 5000);

    setPendingDelete({ item, timeout });
    showToast(`${itemName} eliminado. ¿Deshacer?`, 'info');
  }, [onItemsChange, onDelete, itemName, showToast]);

  const undoDelete = useCallback(() => {
    if (!pendingDelete) return;

    clearTimeout(pendingDelete.timeout);
    onItemsChange(prev => [pendingDelete.item, ...prev]);
    setPendingDelete(null);
    showToast('Eliminación deshecha', 'success');
  }, [pendingDelete, onItemsChange, showToast]);

  useEffect(() => {
    return () => {
      if (pendingDelete) {
        clearTimeout(pendingDelete.timeout);
      }
    };
  }, [pendingDelete]);

  return { handleDelete, undoDelete, hasPendingDelete: !!pendingDelete };
}
