import { isSameDay } from "date-fns";
import { useState, type ReactNode } from "react";
import { HabitContext, type Habit } from "./useHabits";
import useLocalStorage from "../hooks/useLocalStorage";

type HabitProviderProps = {
    children: ReactNode
}

export default function HabitProvider({ children }: HabitProviderProps) {
    const [habits, setHabits] = useLocalStorage<Habit[]>("Habits", []);

    function addHabit(name: string) {
        setHabits([...habits, { id: crypto.randomUUID(), name, completions: [] }]); //this is fine if we completely overwrite
        //setHabits(curr => [...curr, { id: crypto.randomUUID(), name }]) is the function version,
        //which allows multiple changes to habits in the same function. 
    }

    function deleteHabit(id: string) {
        setHabits(curr => curr.filter(h => h.id !== id)) //need to use function version bc it depends on the existing state
    }

    function toggleHabit(id: string, date: Date) {
        setHabits(curr => (
            curr.map(h => {
                if (h.id !== id) {
                    return h;
                }
                const alreadyDone = h.completions.some(c => isSameDay(c, date));
                const completions = alreadyDone ? h.completions.filter(c => !isSameDay(c, date)) : [...h.completions, date];
                //if current date is already done, remove the date from completions array
                //else, add date to completions array
                return { ...h, completions };
            })
        ));
    }
    return <HabitContext value={{ habits, addHabit, toggleHabit, deleteHabit }}>{children}</HabitContext>
}