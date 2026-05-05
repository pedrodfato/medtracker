import ProgressTracker from '../components/progressTracker'
import DayStreak from '../components/daysStreak'


export function Dashboard() {
     return (
    <div className='flex flex-col gap-4'>
      <DayStreak />
      <ProgressTracker />
    </div>
  )
}