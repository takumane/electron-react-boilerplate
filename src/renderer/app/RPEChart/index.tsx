import { Box, Button, IconButton, Stack, TextField, Typography } from '@mui/material';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import React, { useCallback, useEffect } from 'react';
import { Link, Outlet } from 'react-router-dom';
import styles from './RPEChart.module.sass';
import Form, { FormFieldDef } from '../Form';
import { Exercise } from 'renderer/models';
import DataService from 'renderer/services/data';
import BookmarkAddedIcon from '@mui/icons-material/BookmarkAdded';
import BookmarkBorderIcon from '@mui/icons-material/BookmarkBorder';
import ExerciseAutocomplete from '../ExerciseAutocomplete';

type PersonalDataProps = {
    exercises: Exercise[]
}

const repsRange = [1,2,3,4,5,6,7,8,9,10,11, 12];

const rpeRange = [10,9,8,7,6];

const RPEChart = (props: PersonalDataProps) => {
    const [tabValue, setTabValue] = React.useState(0);
  
    const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
        setTabValue(newValue);
    };

    const [ fieldsDef, setFieldsDef ] = React.useState<FormFieldDef[]>([]);

    const [ exercise, setExercise ] = React.useState<Exercise>({ name: '', id: -1 });

    const [ bookmarkedExerciseIds, setBookmarkedExerciseIds ] = React.useState<Exercise['id'][]>(DataService.getRPEChartBookmarkedExerciseIds);

    const onBookmarkToggle = useCallback(() => {
        exercise && setBookmarkedExerciseIds([
            ...DataService.toggleExerciseBookmarkForRPEChart(exercise.id)
        ]);
    }, [exercise]);

    useEffect(() => {
        console.log('setFieldsDef', exercise);
        setFieldsDef([{
            name: 'exercise',
            label: 'Exercise name',
            type: 'exercise',
            value: exercise || null
        }]);
    }, [exercise]);

    const onExerciseSelected = useCallback((event: any, exercise : Exercise) => {
        console.log('onExerciseSelected', exercise);
        setExercise(exercise);
    },[]);

    return <div>
        <Stack direction='row' spacing={2} sx={{
            alignItems: 'center',
            mb: 3
        }}>
            <Typography variant='h5' sx={{mb: 0, lineHeight: '24px'}}>RPE Chart</Typography>
            {bookmarkedExerciseIds.map(id => {
                const _exercise = DataService.getExerciseById(id);
                return _exercise && <Button variant='contained' key={id} size='small' onClick={() => setExercise(_exercise)}>{_exercise.name}</Button>;
            })}
        </Stack>
        <Stack direction='row' spacing={2} sx={{
            alignItems: 'center',
            mb: 3
        }}>
            <ExerciseAutocomplete value={exercise} onChange={onExerciseSelected}/>
            {exercise && <IconButton onClick={onBookmarkToggle}>
                {bookmarkedExerciseIds.includes(exercise.id) ? <BookmarkAddedIcon color='secondary'/> : <BookmarkBorderIcon/>}
            </IconButton>}
        </Stack>
        {exercise && <Box sx={{
            display: 'grid',
            maxWidth: 600,
            gridTemplateColumns:  '1fr 1fr 1fr 1fr 1fr 1fr 1fr 1fr 1fr 1fr 1fr 1fr 1fr 1fr',
            gridTempalteRows: '1fr 1fr 1fr 1fr 1fr 1fr 1fr 1fr 1fr 1fr'
        }} className={styles.rpeChart}>
            <div className={styles.repsAxisLabel}>Reps</div>
            {repsRange.map((range) => <div key={range} className={styles.repsHeader}>{range}</div>)}
            <div className={styles.rpeAxisLabel}><span>R</span><span>P</span><span>E</span></div>
            {rpeRange.map((rpe, rpe_index) => <React.Fragment key={rpe}>
                <div className={styles.rpeHeader}>{rpe}</div>
                {repsRange.map((reps, reps_index) => <div id={`rpe${rpe}_reps${reps}`} key={`rpe${rpe}_reps${reps}`}><TextField className={styles.inputCell} size='small' variant='standard' value={DataService.getPercentageByRepsAndRPE(reps, rpe) || ''}/></div>)}
            </React.Fragment>)}
        </Box>}
    </div>;
}

export default RPEChart;