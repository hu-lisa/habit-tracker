import { eachDayOfInterval, endOfWeek, format, isFuture, isSameDay, startOfWeek, subDays } from "date-fns";
import Button from "./Button";

export type Habit = { id: string, name: string, completions: Date[] }

type HabitListProps = {
    habits: Habit[]
    deleteHabit: (id: string) => void;
    toggleHabit: (id: string, date: Date) => void;
}
export default function HabitList({ habits, deleteHabit, toggleHabit }: HabitListProps) {
    if (habits.length === 0) {
        return <h1 className="text-center text-shadow-zinc-500 py-12">No habits yet. Add one above to get started</h1>
    }
    return (
        <div className="flex flex-col gap-3">
            {habits.map(habit => <HabitItem deleteHabit={deleteHabit} toggleHabit={toggleHabit} key={habit.id} habit={habit} />)}
        </div>
    )
}

type HabitItemProps = {
    habit: Habit
    deleteHabit: (id: string) => void;
    toggleHabit: (id: string, date: Date) => void;
}
function HabitItem({ habit, deleteHabit, toggleHabit }: HabitItemProps) {
    const visibleDates = eachDayOfInterval({
        start: startOfWeek(new Date(), { weekStartsOn: 1 }),
        end: endOfWeek(new Date(), { weekStartsOn: 1 })
    });

    const streak = getStreak(habit.completions);

    return (
        <div className="rounded-xl bg-zinc-800 p-4 flex flex-col gap-3">
            <div className="flex items-center justify-between">
                <div className="flex gap-3 items-center">
                    <span className="font-medium">{habit.name}</span>
                    {streak !== 0 && (
                        <span className="text-sm text-amber-400">🔥 {streak}</span>
                    )}
                </div>
                <Button onClick={() => deleteHabit(habit.id)} variant="ghost-destructive" className="text-sm">
                    Delete
                </Button>
            </div>
            <div className="flex gap-1.5">
                {visibleDates.map(date => (
                    <Button 
                        className="flex flex-1 flex-col items-center gap-0.5 rounded-lg text-xs" 
                        key={date.toISOString()} 
                        disabled={isFuture(date)}
                        onClick={() => toggleHabit(habit.id, date)}
                        variant={habit.completions.some(d => isSameDay(date, d)) ? "primary" : "secondary"}
                    >
                        <span className="font-medium">{format(date, "EEE")}</span>
                        <span className="font-medium">{format(date, "d")}</span>
                    </Button>
                ))}
            </div>
        </div>
    )
}

function getStreak(completions: Date[]) {
    let streak = 0;
    let date = new Date();

    while (completions.some(c => isSameDay(c, date))) { //counts backwards from the current day
        streak++;
        date = subDays(date, 1);
    }
    return streak;
}