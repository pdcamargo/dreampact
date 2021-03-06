import { useState, useEffect, useCallback } from 'react';

function tryParse<T>(value?: string): T {
  try {
    return JSON.parse(value);
  } catch (err) {
    return (value as unknown) as T;
  }
}

function fireEvent<T = string>(payload: { key: string; value: T }) {
  return new CustomEvent('onLocalStorageChange', { detail: payload });
}

export function isTypeOfLocalStorageChanged<TValue>(evt: any, key: string): boolean {
  return evt && evt.detail && evt.detail.key === key;
}

export function writeStorage<T = string>(key: string, value: T) {
  localStorage.setItem(key, typeof value === 'object' ? JSON.stringify(value) : `${value}`);
  window.dispatchEvent(
    fireEvent<T>({ key, value }),
  );
}

export function removeFromStorage(key: string) {
  localStorage.removeItem(key);
  window.dispatchEvent(fireEvent({ key, value: '' }));
}

export function useLocalStorage<T = string>(key: string, initialValue?: T): [T, (value: T) => void, () => void] {
  const [localState, setLocalState] = useState<T>(
    localStorage.getItem(key) === null ? initialValue : tryParse(localStorage.getItem(key)),
  );

  const onLocalStorageChange = useCallback(
    (event: any | StorageEvent) => {
      if (isTypeOfLocalStorageChanged(event, key)) {
        setLocalState(event.detail.value);
      } else {
        if (event.key === key) {
          if (event.newValue) {
            setLocalState(tryParse(event.newValue));
          }
        }
      }
    },
    [key],
  );

  useEffect(() => {
    setLocalState(localStorage.getItem(key) === null ? initialValue : tryParse(localStorage.getItem(key)));
  }, [key, initialValue]);

  const changeState = useCallback((value: T) => writeStorage(key, value), [key]);
  const deleteState = useCallback(() => removeFromStorage(key), [key]);

  useEffect(() => {
    setLocalState(localStorage.getItem(key) === null ? initialValue : tryParse(localStorage.getItem(key)));
  }, [key, initialValue]);

  useEffect(() => {
    // The custom storage event allows us to update our component
    // when a change occurs in localStorage outside of our component
    const listener = (e: Event) => onLocalStorageChange(e);
    window.addEventListener('onLocalStorageChange', listener);

    // The storage event only works in the context of other documents (eg. other browser tabs)
    window.addEventListener('storage', listener);

    if (initialValue !== undefined && localStorage.getItem(key) === null) {
      changeState(initialValue);
    }

    return () => {
      window.removeEventListener('onLocalStorageChange', listener);
      window.removeEventListener('storage', listener);
    };
  }, [key, changeState, initialValue, onLocalStorageChange]);

  return [localState === null ? initialValue : localState, changeState, deleteState];
}
