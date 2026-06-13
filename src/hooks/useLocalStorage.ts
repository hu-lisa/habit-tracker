import { parseISO } from "date-fns";
import { useEffect, useState } from "react";

export default function useLocalStorage<T>(key: string, initialValue: T) {
    const [storedValue, setStoredValue] = useState<T>(() => {
        try {
            const item = localStorage.getItem(key);
            if (item == null) {
                return initialValue;
            }
            return JSON.parse(item, dateReviver);
        } catch {
            return initialValue;
        }
    }); //function version of usestate will only be called the first time the component renders

    useEffect(() => { //when smth inside the dependency array changes, you want to run a side effect
        localStorage.setItem(key, JSON.stringify(storedValue));


        /*return () => {
            ...//cleanup function, add smth to remove your previous useEffect call everytime it gets rerun
            useful when useEffect is run multiple times in a row and has "cleanupable" effects
        }*/
    }, [storedValue, key]) //when storedValue changes, store it in local

    return [storedValue, setStoredValue] as const;
}

function dateReviver(key: string, value: unknown) { //problem: we're returning a JSON string, so we need to revive it into a date
    if (typeof value === "string" && /^\d{4}-\d{2}-\d{2}T/.test(value)) { //regex expr checks for an iso-formatted date, which is what stringified dates are
        return parseISO(value);
    }
    return value;
}