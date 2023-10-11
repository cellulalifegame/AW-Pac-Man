import { useEffect, useRef } from 'react';

function useDebounce<T extends (...args: any[]) => any>(callback: T, delay: number): T {
    const callbackRef = useRef(callback);
    const timerRef = useRef<NodeJS.Timeout>();

    useEffect(() => {
        callbackRef.current = callback;
    }, [callback]);

    return ((...args: any[]) => {
        const bounce = () => {
            callbackRef.current(...args);
        };

        if (timerRef.current) {
            clearTimeout(timerRef.current);
        }

        timerRef.current = setTimeout(bounce, delay);
    }) as T;
}

export default useDebounce;