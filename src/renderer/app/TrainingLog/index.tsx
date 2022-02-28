import React, { useCallback, useEffect, useState } from 'react';
import { ExerciseRecord, ExerciseSet, TrainingSession } from '../../models';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import styles from './TrainingLog.module.sass';
import IconButton from '@mui/material/IconButton';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import RemoveIcon from '@mui/icons-material/Remove';
import Paper from '@mui/material/Paper';
import Chip from '@mui/material/Chip';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Form from '../Form';
import DataService from 'renderer/services/data';
import Timer from '../Timer';
import TextField from '@mui/material/TextField';
import { repMaxPercentage } from '../analysis';

const SET_FIELD_WIDTH = 70;

type TrainingLogProps = {
    selectedDate: Date | null,
    trainingSession: TrainingSession[],
    onLogTrainingSession: (date: Date | null) => void,
    onDeleteTrainingSession:  (id: number) => void,
    exerciseRecordsById: {[record_id: number]: ExerciseRecord},
    exerciseRecordsBySessionId: {[training_session_id: number]: number[]},
    onAddExerciseToSession: (
        exercise_name: string,
        training_session_id: string
    ) => void,
    onUpdateExerciseRecord: (
        data: any
    ) => void,
    onRemoveExerciseRecord: (record_id: number) => void,
    sets: ExerciseSet[],
    setsById: {[exercise_set_id: number]: ExerciseSet},
    onAddSet: (params: {
        exercise_record_id: number,
        reps: number,
        load: number,
        rest: number,
        rpe: number,
        rpt: number
    }) => void,
    onUpdateSet: (params: ExerciseSet) => void,
    onRemoveSet: (set_id: number, record_id: number) => void,
    // workouts: Workouts,
    // onLogWorkout: (timestamp: number) => void,
    // onDeleteWorkout: (timestamp: number) => void
}

type WorkoutsByDay = {
    [date: string]: TrainingSession[]
}

const DAYS_PAST = 7;
const DAYS_FUTURE = 2;

const DaySelectors = {
    Box,
    Paper
};

const TrainingLog = (props: TrainingLogProps) => {
    
    const [ fromDate, setFromDate ] = useState<Date>();

    const [ toDate, setToDate ] = useState<Date>(); 

    const [ visibleDays, setVisibleDays ] = useState<Date[]>([]);

    useEffect(() => {
        if (props.selectedDate) {
            const _fromDate = new Date();

            _fromDate.setDate(props.selectedDate.getDate() - DAYS_PAST);

            setFromDate(_fromDate);

            const _toDate = new Date();

            _toDate.setDate(props.selectedDate.getDate() + DAYS_FUTURE);

            setToDate(_toDate);
        }

    }, [props.selectedDate]);

    useEffect(() => {
        if (toDate && fromDate) {
            const days = [];
    
            const toDateDate = toDate.getDate();
    
            const fromDateDate = fromDate.getDate();
    
            for (let d = 0; (days.length <= 0) || (days[days.length - 1].getTime() < toDate.getTime()) ; d++) {
                // console.log(d);
    
                const newDate = new Date();
                newDate.setDate(fromDate.getDate() + d);
                days.push(newDate);
            }
    
            // console.log(fromDateDate, toDateDate, days);
    
            setVisibleDays(days);
        }
    },[fromDate, toDate]);

    const onLogTrainingSession = useCallback(() => {
        props.onLogTrainingSession(props.selectedDate);
    }, [props.selectedDate, props.onLogTrainingSession]);

    const [ trainingSessionsOnSelectedDate, setTrainingSessionsOnSelectedDate ] = useState<TrainingSession[]>([]);

    useEffect(() => {
        setTrainingSessionsOnSelectedDate([
            ...DataService.getTrainingSessionByDate(props.selectedDate)
        ])
    },[ props.trainingSession, props.selectedDate]);

    const onAddExerciseToSession = useCallback((data) => {
        console.log('onAddExerciseToSession', data);
        if (data.exercise?.name && data.training_session_id) {
            props.onAddExerciseToSession(data.exercise.name, data.training_session_id);
        }
    }, [props.onAddExerciseToSession]);

    return <Box className={styles.container} sx={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'stretch',
        alignItems: 'stretch'
    }}>
        <Box sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            position: 'sticky',
            top: 0,
            zIndex: 10,
            backgroundColor: 'background.default'
        }}>
            <Typography variant='h5' color='text.primary'>Training log</Typography>
            <Button 
                onClick={onLogTrainingSession}
                variant={'text'}
                size='large'
            >
                Log new session
            </Button>
        </Box>
        <Paper sx={{
            flexGrow: 1,
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'stretch',
            alignItems: 'flex-start',
            background: 'none'
        }}>
            <Box sx={{
                height: '100%',
                width: '100%'
            }}>
                {trainingSessionsOnSelectedDate.map((session) => {
                    return <Paper key={session.id}  sx={{
                        mb: 2,
                        // p: 4,
                        background: 'none'
                    }}>
                        <Stack direction='row' spacing={2} sx={{
                            alignItems: 'center',
                            width: '100%',
                            mb: 2,
                            position: 'sticky',
                            top: 46,
                            pt: 2,
                            pb: 2,
                            backgroundColor: 'background.default',
                            zIndex: 2
                        }}>
                            <Typography 
                                variant='h6' 
                                sx={{
                                    marginBottom: 0
                                }}
                            >
                                Training Session <small>{props.selectedDate?.toLocaleDateString()}</small>
                            </Typography>
                            <IconButton 
                                sx={{
                                    marginTop: '-16px!important',
                                    marginBottom: '-16px!important'
                                }} 
                                onClick={() => {
                                    props.onDeleteTrainingSession(session.id);
                                }}
                            >
                                <DeleteIcon/>
                            </IconButton>
                        </Stack>
                        <div className={styles.records}>
                            {props.exerciseRecordsBySessionId[session.id]?.map(record_id => {
                                const exercise_record = props.exerciseRecordsById[record_id];
                                        
                                return <fieldset className={styles.exercise_record}>
                                    <legend>
                                        {exercise_record?.exercise_name}&nbsp;&nbsp;
                                        <Form 
                                            id={`modify-exercise-record-${exercise_record?.id}`} 
                                            direction={'row'} 
                                            size='small'
                                            fields={[{
                                                name: 'training_max',
                                                label: 'Training max',
                                                type: 'number',
                                                width: 100,
                                                value: exercise_record?.training_max || 0
                                            }, {
                                                name: 'id',
                                                type: 'hidden',
                                                value: exercise_record?.id || ''
                                            }]}
                                            onSubmit={props.onUpdateExerciseRecord}
                                            submitOnChange={true}
                                        />&nbsp;&nbsp;
                                        <Button size='small' variant='text' onClick={() => props.onRemoveExerciseRecord(record_id)}>
                                            remove
                                        </Button>
                                    </legend>
                                    <div>
                                        {exercise_record?.sets?.map((set_id) => {
                                            const _set = props.setsById[set_id];

                                            // console.log('_set', _set, props.sets);

                                            return _set && <Box key={set_id} sx={{
                                                mb: 3,
                                                display: 'flex'
                                            }}>
                                                <Form
                                                    id={`modify-set-${set_id}`}
                                                    direction={'row'}
                                                    size='small'
                                                    fields={[{
                                                        name: 'reps',
                                                        label: 'reps',
                                                        type: 'number',
                                                        width: SET_FIELD_WIDTH,
                                                        value: _set.reps
                                                    }, {
                                                        name: 'load',
                                                        label: 'load',
                                                        type: 'number',
                                                        width: SET_FIELD_WIDTH,
                                                        value: _set.load
                                                    }, {
                                                        name: 'rest',
                                                        label: 'rest',
                                                        type: 'number',
                                                        width: SET_FIELD_WIDTH,
                                                        value: _set.rest
                                                    }, {
                                                        name: 'rpe',
                                                        label: 'rpe',
                                                        type: 'number',
                                                        width: SET_FIELD_WIDTH,
                                                        value: _set.rpe
                                                    }, {
                                                        name: 'rpt',
                                                        label: 'rpt',
                                                        type: 'number',
                                                        width: SET_FIELD_WIDTH,
                                                        value: _set.rpt
                                                    }, {
                                                        name: 'id',
                                                        type: 'hidden',
                                                        value: set_id
                                                    }]}
                                                    onSubmit={props.onUpdateSet}
                                                    submitOnChange={true}
                                                />
                                                {exercise_record.training_max > 0 && <TextField 
                                                    size='small' 
                                                    sx={{
                                                        ml: 2,
                                                        width: 130
                                                    }} 
                                                    variant='outlined' 
                                                    label={'intensity (relative)'} 
                                                    className={styles.intensity} 
                                                    defaultValue={`${(_set.load / exercise_record.training_max * 100).toFixed()}% (${(_set.load / (repMaxPercentage[_set.reps] * exercise_record.training_max) * 100 ).toFixed()}%)`}
                                                    InputProps={{
                                                        readOnly: true
                                                    }}
                                                />}
                                                <IconButton onClick={() => props.onRemoveSet(set_id, record_id)}><DeleteIcon/></IconButton>
                                            </Box>
                                        })}
                                        <Box sx={{
                                            opacity: 0.3,
                                            '&:hover': {
                                                opacity: 1
                                            }
                                        }}>
                                            <Form
                                                id='add-set'
                                                direction={'row'}
                                                size='small'
                                                fields={[{
                                                    name: 'reps',
                                                    label: 'reps',
                                                    type: 'number',
                                                    width: SET_FIELD_WIDTH
                                                }, {
                                                    name: 'load',
                                                    label: 'load',
                                                    type: 'number',
                                                    width: SET_FIELD_WIDTH
                                                }, {
                                                    name: 'rest',
                                                    label: 'rest',
                                                    type: 'number',
                                                    width: SET_FIELD_WIDTH
                                                }, {
                                                    name: 'rpe',
                                                    label: 'rpe',
                                                    type: 'number',
                                                    width: SET_FIELD_WIDTH
                                                }, {
                                                    name: 'rpt',
                                                    label: 'rpt',
                                                    type: 'number',
                                                    width: SET_FIELD_WIDTH
                                                }, {
                                                    name: 'exercise_record_id',
                                                    type: 'hidden',
                                                    value: record_id
                                                }]}
                                                onSubmit={props.onAddSet}
                                                submitLabel='Add'
                                            />
                                        </Box>
                                    </div>
                                </fieldset>;
                            })}
                        </div>
                        <Box>
                            <Form
                                id='add-exercise'
                                size='small'
                                // title={'Add exercise'}
                                direction={'row'}
                                fields={[{
                                    name: 'exercise',
                                    label: 'Exercise name',
                                    type: 'exercise'
                                },{
                                    type: 'hidden',
                                    label: 'Session id',
                                    value: session.id,
                                    name: 'training_session_id'
                                }]}
                                onSubmit={onAddExerciseToSession}
                                submitLabel='Add'
                            />
                        </Box>
                    </Paper>;
                })}
            </Box>
            <Timer sx={{
                position: 'sticky',
                top: 46,
                pt: 2
            }}/>
        </Paper>
    </Box>;
};

export default TrainingLog;