import React, { useEffect, useState } from 'react';
import { Workouts } from '../models';

import Box from '@mui/material/Box';
import styles from './TrainingCalendar.module.sass';

type TrainingCalendarProps = {
    workouts: Workouts
}

const today = new Date();

const defaultFromDate = new Date();

defaultFromDate.setDate(today.getDate() - 7);

const defaultToDate = new Date();

defaultToDate.setDate(today.getDate() + 2);

const TrainingCalendar = (props: TrainingCalendarProps) => {
    
    const [ fromDate, setFromDate ] = useState<Date>(defaultFromDate);

    const [ toDate, setToDate ] = useState<Date>(defaultToDate); 

    const [ visibleDays, setVisibleDays ] = useState<Date[]>([]);

    console.log(fromDate.getDate(), toDate.getDate());

    useEffect(() => {
        const days = [];

        const toDateDate = toDate.getDate();

        const fromDateDate = fromDate.getDate();

        for (let d = 0; d <= toDateDate - fromDateDate; d++) {
            const newDate = new Date();
            newDate.setDate(fromDate.getDate() + d);
            console.log(newDate.getDate());
            days.push(newDate);
        }

        console.log(fromDateDate, toDateDate, days);

        setVisibleDays(days);
    },[fromDate, toDate]);

    return <Box sx={{
        pb: 1
    }} className={styles.container}>
        {visibleDays.map((day) => {
            const dateString = day.toLocaleDateString();
            const isToday = day.getDate() === today.getDate();
            return <div key={dateString} className={[
                styles.day,
                isToday && styles.today
            ].join(' ')}>
                <Box component='div' sx={{
                    pt: 1,
                    pb: 1,
                    pl: 2,
                    pr: 2,
                    borderRadius: 5
                }} className={styles.date}>{day.getDate()}</Box>
            </div>
        })}
    </Box>
};

export default TrainingCalendar;