import { useState } from "react";
import HabitForm from "./components/HabitForm"
import HabitList, { type Habit } from "./components/HabitList"
import Header from "./components/Header"
import { isSameDay } from "date-fns";

export default function App() {
  const [habits, setHabits] = useState<Habit[]>([]);

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
        return {...h, completions};
      })
    ));
  }

  return (
    <div className="max-w-2xl mx-auto p-4 flex flex-col gap-4">
      <Header />
      <HabitForm addHabit={addHabit}/>
      <HabitList deleteHabit={deleteHabit} toggleHabit={toggleHabit} habits={habits}/>
    </div>
  )
}