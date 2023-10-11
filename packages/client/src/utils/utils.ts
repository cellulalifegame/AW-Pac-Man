import { useState, useEffect, useRef, useCallback } from 'react';

export function useCountdownSeconds() {
    const [count, setCount] = useState<number>(0);
    const intervalId = useRef<NodeJS.Timeout | null>(null);

    const countdown = useCallback(
        (initCount: number, callback?: any, timeInterval = 1000) => {
            setCount(initCount);
            intervalId.current = setInterval(() => {
                setCount(prevCount => {
                    if (prevCount <= 1) {
                        clearInterval(intervalId.current as NodeJS.Timeout);
                        callback?.();
                        return 0;
                    } else {
                        return prevCount - 1;
                    }
                });
            }, timeInterval);
        },
        []
    );

    useEffect(() => {
        return () => {
            if (intervalId.current) {
                clearInterval(intervalId.current);
            }
        };
    }, []);

    return {
        count,
        countdown,
        setCount
    };
}
export const getSrc = (name: string) => {
    const path = `/src/assets/images/${name}`;
    const modules = import.meta.globEager('/src/assets/images/**/*') as Record<string, { default: string }>;

    if (modules[path]) {
        return modules[path].default;
    } else {
        console.warn(`Image not found: ${name}`);
        return '';
    }
};

export function useInterval(callback: any, delay: any) {
    const callbackRef: any = useRef(callback);

    // Remember the latest callback.
    useEffect(() => {
        callbackRef.current = callback;
    }, [callback]);

    // Set up the interval.
    useEffect(() => {
        function tick() {
            callbackRef.current();
        }
        if (delay !== null) {
            const id = setInterval(tick, delay);
            return () => clearInterval(id);
        }
    }, [delay]);
}