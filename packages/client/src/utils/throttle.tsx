import { useRef, useEffect } from 'react';

function useThrottle<T extends (...args: any[]) => any>(callback: T, delay: number): T {
    const callbackRef = useRef(callback);
    const timerRef = useRef<NodeJS.Timeout>();
    const functionRunningRef = useRef(false);

    useEffect(() => {
        callbackRef.current = callback;
    }, [callback]);

    return ((...args: any[]) => {
        const run = () => {
            functionRunningRef.current = true;
            callbackRef.current(...args);
            timerRef.current = setTimeout(() => {
                functionRunningRef.current = false;
            }, delay);
        };

        if (!functionRunningRef.current && !timerRef.current) {
            run();
        }
    }) as T;
}

export default useThrottle;