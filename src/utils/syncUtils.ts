/**
 * Compara dos objetos de forma shallow (una sola capa de profundidad).
 * Más eficiente que JSON.stringify para detección de cambios.
 */
export function shallowEqual<T extends Record<string, unknown>>(a: T, b: T): boolean {
  if (a === b) return true;
  const keysA = Object.keys(a);
  const keysB = Object.keys(b);
  if (keysA.length !== keysB.length) return false;
  for (const key of keysA) {
    if (a[key] !== b[key]) return false;
  }
  return true;
}

export type SyncAction = 'add' | 'update' | 'delete';

export interface SyncResult<T> {
  action: SyncAction;
  item?: T;
  id?: string;
}

/**
 * Detecta el tipo de operación comparando arrays prev/next de forma eficiente.
 * Usa Map para búsquedas O(1) en lugar de Array.find O(n).
 */
export function detectSyncOperation<T extends { id: string }>(
  prev: T[],
  next: T[],
  hasChanges?: (prevItem: T, nextItem: T) => boolean
): SyncResult<T> | null {
  const prevLen = prev.length;
  const nextLen = next.length;

  // Eliminación: next tiene menos elementos
  if (nextLen < prevLen) {
    const prevMap = new Map(prev.map(item => [item.id, item]));
    for (const item of next) {
      prevMap.delete(item.id);
    }
    const deleted = prevMap.values().next().value;
    return deleted ? { action: 'delete', id: deleted.id } : null;
  }

  // Adición: next tiene más elementos
  if (nextLen > prevLen) {
    const prevIds = new Set(prev.map(item => item.id));
    const added = next.find(item => !prevIds.has(item.id));
    return added ? { action: 'add', item: added } : null;
  }

  // Misma longitud: buscar actualización usando Map O(1)
  const prevMap = new Map(prev.map(item => [item.id, item]));
  for (const nextItem of next) {
    const prevItem = prevMap.get(nextItem.id);
    if (prevItem) {
      const changed = hasChanges
        ? hasChanges(prevItem, nextItem)
        : !shallowEqual(prevItem as Record<string, unknown>, nextItem as Record<string, unknown>);
      if (changed) {
        return { action: 'update', item: nextItem };
      }
    }
  }

  return null;
}
