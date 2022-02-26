import React, { useCallback, useEffect, useState } from 'react';
import { Workouts, Workout } from '../models';

import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import styles from './TrainingCalendar.module.sass';
import IconButton from '@mui/material/IconButton';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import Card from '@mui/material/Card';
import Chip from '@mui/material/Chip';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';

type TrainingCalendarProps = {
    workouts: Workouts,
    onLogWorkout: (timestamp: number) => void,
    onDeleteWorkout: (timestamp: number) => void
}

type WorkoutsByDay = {
    [date: string]: Workout[]
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

    const [ workoutsByDate, setWorkoutsByDate ] = useState<WorkoutsByDay>({});

    useEffect(() => {
        const _workoutsByDate:WorkoutsByDay = {};

        Object.keys(props.workouts).sort((a, b) => {
            return Number(a) - Number(b);
        }).map((timestamp) => {
            const dateString = (new Date(Number(timestamp))).toLocaleDateString();

            if (!_workoutsByDate[dateString]) {
                _workoutsByDate[dateString] = [];
            }

            _workoutsByDate[dateString].push(props.workouts[timestamp]);
        });
        
        setWorkoutsByDate(_workoutsByDate);

        console.log('workouts by date', workoutsByDate);
    },[props.workouts]);

    useEffect(() => {
        const days = [];

        const toDateDate = toDate.getDate();

        const fromDateDate = fromDate.getDate();

        for (let d = 0; d <= toDateDate - fromDateDate + 1; d++) {
            const newDate = new Date();
            newDate.setDate(fromDate.getDate() + d);
            days.push(newDate);
        }

        setVisibleDays(days);
    },[fromDate, toDate]);

    const onLogClick = useCallback((timestamp: number) => {
        props.onLogWorkout(timestamp);
    }, [props.onLogWorkout]);

    return <Box className={styles.container}>
        <Box sx={{
            pl: 4,
            pr: 4
        }} className={styles.scrollContent}>
            {visibleDays.map((day, index) => {
                const dateString = day.toLocaleDateString();
                const isToday = day.getDate() === today.getDate();

                return <Box key={dateString} className={[
                    styles.day,
                    isToday && styles.today
                ].join(' ')} sx={{
                    pb: 4
                }}>
                    {(index === 0 || day.getDate() === 1) && <Button className={styles.month}>
                        {day.toLocaleString('default', { month: 'short' })}
                    </Button>}
                    
                    {/* Workouts */}

                    {workoutsByDate[dateString]?.map((workout) => {
                        return <Chip 
                            key={workout.timestamp} 
                            label={(new Date(Number(workout.timestamp))).toLocaleTimeString()}
                            onDelete={() => {
                                props.onDeleteWorkout(workout.timestamp);
                            }}
                        />;
                    })}

                    <IconButton className={styles.logButton} onClick={() => {
                        onLogClick(day.getTime());
                    }}>
                        <AddIcon/>
                    </IconButton>
                    <Button variant={isToday ? 'contained' : 'text'} component='div' sx={{
                        pt: 1,
                        pb: 1,
                        pl: 2,
                        pr: 2,
                        borderRadius: 54
                    }} className={styles.date}>{day.getDate()}</Button>
                </Box>
            })}
        </Box>
    </Box>
};

export default TrainingCalendar;