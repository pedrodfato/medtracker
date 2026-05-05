import { useState } from 'react'
import { eachDayOfInterval, subDays, addDays, format, isSameDay } from "date-fns";
import './App.css'
import { Swiper, SwiperSlide } from 'swiper/react'
import 'swiper/css'
import ProgressTracker from './components/progressTracker'
import DayStreak from './components/daysStreak'



function App() {

  
  // const [today, setToday] = useState(new Date())

  
  return (
    <div className='flex flex-col gap-4'>
      <DayStreak />
      <ProgressTracker />
    </div>
  )
}

export default App;
