import { useState } from 'react';

export function useLocalStorage<T>(key: string, initialValue: T) {
    // Obter valor do localStorage na inicialização
    const [storedValue, setStoredValue] = useState<T>(() => {
        try {
            if (typeof window !== 'undefined') {
                const item = window.localStorage.getItem(key);
                return item ? JSON.parse(item) : initialValue;
            }
            return initialValue;
        } catch (error) {
            console.warn(`Erro ao ler localStorage key "${key}":`, error);
            return initialValue;
        }
    });

    // Função para definir valor no state e localStorage
    const setValue = (value: T | ((val: T) => T)) => {
        try {
            // Permitir que value seja uma função para ser consistente com useState
            const valueToStore = value instanceof Function ? value(storedValue) : value;
            setStoredValue(valueToStore);

            // Salvar no localStorage apenas no lado do cliente
            if (typeof window !== 'undefined') {
                window.localStorage.setItem(key, JSON.stringify(valueToStore));
            }
        } catch (error) {
            console.warn(`Erro ao definir localStorage key "${key}":`, error);
        }
    };

    return [storedValue, setValue] as const;
}
