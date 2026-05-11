import ProgressTracker from '../components/progressTracker'
import DayStreak from '../components/daysStreak'
import { useEffect, useState } from 'react'
import type { Medication } from '../types/medType';

interface MedicationProps {
  dados: Medication;
}

export function Dashboard() {
    const [medications, setMedications] = useState<MedicationProps[]>([])

    useEffect(() => {
        const loadMedications = async () => {
          try {
            const response = await fetch(`${import.meta.env.VITE_API_URL}/medications`, {
              method: 'GET',
              credentials: 'include'
          });

          if (!response.ok) {
            throw new Error('Failed to fetch medications');
        }

        const responseData = await response.json();
        console.log('Medications:', responseData);
        setMedications(responseData.data);
         } catch (error) {
            console.error('Error fetching medications:', error);
         }
      
      };
      loadMedications();
    }, []
    )


     return (
    <div className='flex flex-col gap-4'>
      <DayStreak />
      <ProgressTracker />
    </div>
  )
}