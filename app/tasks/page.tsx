import HabitList from '@/components/HabitList'

export default function TasksPage() {
  return (
    <div className="flex flex-col">
      <HabitList isTasksView={true} />
    </div>
  )
}

