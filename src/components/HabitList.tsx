import { eachDayOfInterval, endOfWeek, format, isFuture, startOfWeek } from "date-fns";
import Button from "./Button";

export default function HabitList() {
    const habits = [
        { id: 1, name: "Hi" },
        { id: 2, name: "Bye" },
    ];
    if (habits.length === 0) {
        return <h1 className="text-center text-shadow-zinc-500 py-12">No habits yet. Add one above to get started</h1>
    }
    return (
        <div className="flex flex-col gap-3">
            {habits.map(habit => <HabitItem key={habit.id} habit={habit} />)}
        </div>
    )
}

type HabitItemProps = {
    habit: {id: number, name: string }
}
function HabitItem({ habit }: HabitItemProps) {
    const visibleDates = eachDayOfInterval({
        start: startOfWeek(new Date(), { weekStartsOn: 1 }),
        end: endOfWeek(new Date(), { weekStartsOn: 1 })
    });

    return (
        <div className="rounded-xl bg-zinc-800 p-4 flex flex-col gap-3">
            <div className="flex items-center justify-between">
                <div className="flex gap-3 items-center">
                    <span className="font-medium">{habit.name}</span>
                    <span className="text-sm text-amber-400">🔥 3</span>
                </div>
                <Button variant="ghost-destructive" className="text-sm">
                    Delete
                </Button>
            </div>
            <div className="flex gap-1.5">
                {visibleDates.map(date => (
                    <Button 
                        className="flex flex-1 flex-col items-center gap-0.5 rounded-lg text-xs" 
                        key={date.toISOString()} 
                        disabled={isFuture(date)}
                    >
                        <span className="font-medium">{format(date, "EEE")}</span>
                        <span className="font-medium">{format(date, "d")}</span>
                    </Button>
                ))}
            </div>
        </div>
    )
}