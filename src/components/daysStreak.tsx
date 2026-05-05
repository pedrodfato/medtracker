import { Flame, Pill, Check } from 'lucide-react';
import { startOfWeek, endOfWeek, eachDayOfInterval, format, isSameDay } from 'date-fns';


export default function DayStreak() {
  const days = 2
  const StartofWeek = startOfWeek(new Date(), {weekStartsOn: 1});
  const EndofWeek = endOfWeek(new Date(), {weekStartsOn: 1});

  const today = new Date()
  
  const WeekDays = eachDayOfInterval({
    start: StartofWeek, 
    end: EndofWeek,
  })
  


  return (
    <div className="flex flex-col p-8 bg-[#0d0f18] rounded-2xl w-full max-w-sm mx-auto shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] border-4 border-black text-white gap-5">
      <div className="flex justify-between">
        <div className='flex items-center'>
          <Flame className={`size-15 ${days > 1 ? 'text-amber-400' : 'text-gray-400'}`} />
          <div className='flex flex-col justify-center ml-4 items-start'>
            <h2 className='text-md font-bold text-white/60'>Streak</h2>
            <p className='text-2xl'><span className='text-[#fbbf24] font-bold text-3xl'>{days}</span> {days > 1 ? 'Dias' : 'Dia'}</p>
          </div>
        </div>
        <Pill className="text-white/40 size-6"/>
      </div>
      <div className="border-t border-white/15 pt-4 flex flex-row justify-between ">
        {WeekDays.map((day, i ) => {
        const isToday = isSameDay(day, today);

        return <div className={`flex justify-center items-center flex-col gap-1 text-white/70`} key={i}>
          <Check className={`flex items-center justify-center p-2 size-10  rounded-full ${isToday ? 'border-3 border-amber-400 text-black' : 'bg-[#16171D] text-[#16171D]'}`}/>
          {format(day, 'eee')}
        </div>
        })}
      </div>
    </div>
  )
}