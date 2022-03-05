import React, { useCallback, useEffect, useRef, useState } from 'react';
import { HashRouter, Outlet, Route, Routes, Link, useNavigate, useParams } from 'react-router-dom';
import useBreadcrumbs from 'use-react-router-breadcrumbs';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Breadcrumbs from '@mui/material/Breadcrumbs';
import Popover from '@mui/material/Popover';
import RemoveIcon from '@mui/icons-material/Remove';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import AdapterDateFns from '@mui/lab/AdapterDateFns';
import LocalizationProvider from '@mui/lab/LocalizationProvider';
import StaticDatePicker from '@mui/lab/StaticDatePicker';
import Stack from '@mui/material/Stack';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Drawer from '@mui/material/Drawer';
import Dialog, { DialogProps } from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Divider from '@mui/material/Divider';
import Autocomplete from '@mui/material/Autocomplete';
import parse from 'autosuggest-highlight/parse';
import match from 'autosuggest-highlight/match';
import Form from './Form';


import styles from './index.module.sass';

import logo from './logo.svg';
import TrainingLog from './TrainingLog';
import DataService from '../services/data';
import { BodyweightLog, Exercise, ExerciseRecord, ExerciseSet, TrainingSession } from '../models';
import ExerciseDetails from './ExerciseDetails';
import { PickersDay } from '@mui/lab';
import { Badge } from '@mui/material';
import RPEChart from './RPEChart';

// import Countdown from 'react-countdown';
// import humanizeDuration from 'humanize-duration';

// const shortEnglishHumanizer = humanizeDuration.humanizer({
//     language: "shortEn",
//     languages: {
//       shortEn: {
//         y: () => "y",
//         mo: () => "mo",
//         w: () => "w",
//         d: () => "d",
//         h: () => "h",
//         m: () => "m",
//         s: () => "s",
//         ms: () => "ms",
//       },
//     },
// });

const paths = {
    exercises: {
        root: 'exercises',
        rpe: 'rpe/:name'
    },
    injuries: {
        root: 'injuries'
    },
    training: {
        root: 'training'
    },
    RPEChart: {
        root: 'rpe-chart',
    },
    records: {

    }
}

const App = () => {
    const navigate = useNavigate();
    const breadcrumbs = useBreadcrumbs([{
        path: '/exercises/:exerciseId', 
        breadcrumb: ({ match }) => (<span>{DataService.getExerciseById(Number(match.params.exerciseId))?.name || 'unknown'}</span>)
    }]);

    const exerciseMenuToggleRef = useRef(null);

    const [ isExerciseMenuOpened, setIsExerciseMenuOpened ] = useState(false);

    const onExerciseMenuToggleClick = useCallback(() => {
        setIsExerciseMenuOpened(!isExerciseMenuOpened);
    },[isExerciseMenuOpened]);

    const onCloseExerciseMenu = useCallback(() => {
        setIsExerciseMenuOpened(false);
    }, []);

    /** Exercises */

    const [ exercises, setExercises ] = useState<Exercise[]>(DataService.getExercises());

    const onNewExerciseSubmitted = useCallback((data) => {
        setExercises([
            ...DataService.createExercise(data.name, data.desc)
        ]);
    },[]);

    const onRemoveExercise = useCallback((id: number) => {
        setExercises([
            ...DataService.deleteExercise(id)
        ]);
    },[]);

    const onSelectExercise = useCallback((event, exercise: Exercise | null) => {
        exercise && navigate(paths.exercises.root + '/' + exercise.id);
        setIsExerciseMenuOpened(false);
    },[]);

    /** Training Sessions */

    const [ trainingSessions, setTrainingSessions ] = useState<TrainingSession[]>(DataService.getTrainingSessions());

    const onLogTrainingSession = useCallback((date: Date | null) => {
        if (date) {
            setTrainingSessions([
                ...DataService.createTrainingSession(date.getTime())
            ]);
        };
    }, []);

    const onDeleteTrainingSession = useCallback((id: number) => {
        setTrainingSessions([
            ...DataService.deleteTrainingSession(id)
        ]);
    }, []);

    /** Exercise record */

    const [ exerciseRecords, setExerciseRecords ] = useState<ExerciseRecord[]>(DataService.getExerciseRecords());

    const onAddExerciseToSession = useCallback((exercise_name, training_session_id) => {
        console.log('onAddExerciseToSession', exercise_name, training_session_id);
        setExerciseRecords([
            ...DataService.createExerciseRecord(exercise_name, training_session_id)
        ]);
    }, []);

    const onUpdateExerciseRecord = useCallback((data) => {
        setExerciseRecords([
            ...DataService.updateExerciseRecord(data)
        ]);
    }, []);

    const onRemoveExerciseRecord = useCallback(record_id => {
        setExerciseRecords([
            ...DataService.deleteExerciseRecord(record_id)
        ])
    }, []);

    const [ exerciseRecordsBySessionId, setExerciseRecordsBySessionId ] = useState<{[session_id: number]: number[]}>({});

    const [ exerciseRecordsById, setExerciseRecordsById ] = useState<{[record_id: number]: ExerciseRecord}>({});

    useEffect(() => {
        const _exerciseRecordsBySessionId:{[session_id: number]: number[]} = {};
        const _exerciseRecordsById:{[record_id: number]: ExerciseRecord} = {};

        exerciseRecords.map((record) => {
            if (!_exerciseRecordsBySessionId[record.training_session_id]) {
                _exerciseRecordsBySessionId[record.training_session_id] = [];
            }

            _exerciseRecordsById[record.id] = record;

            _exerciseRecordsBySessionId[record.training_session_id].push(record.id);
        });

        setExerciseRecordsBySessionId(_exerciseRecordsBySessionId);
        setExerciseRecordsById(_exerciseRecordsById);

    },[ exerciseRecords ]);

    const [ exerciseSets, setExerciseSets ] = useState<ExerciseSet[]>(DataService.getSets());

    const [ exerciseSetsById, setExerciseSetsById ] = useState<{[exercise_set_id: number]: ExerciseSet}>({});

    useEffect(() => {
        const _exerciseSetsById:{[exercise_set_id: number]: ExerciseSet} = {};

        exerciseSets.map((set) => {
            _exerciseSetsById[set.id] = set;
        });

        setExerciseSetsById(_exerciseSetsById);

    },[ exerciseSets ]);

    const onAddSet = useCallback((data: {
        exercise_record_id: number,
        reps: number,
        load: number,
        rest: number,
        rpe: number,
        rpt: number
    }) => {
        setExerciseRecords([
            ...DataService.createSet(data)
        ]);

        setExerciseSets([
            ...DataService.getSets()
        ]);
    }, [])

    const onUpdateSet = useCallback((data: ExerciseSet) => {
        setExerciseSets([
            ...DataService.updateSet(data)
        ]);
    },[]);

    const onRemoveSet = useCallback((set_id: number, record_id: number) => {
        setExerciseSets([
            ...DataService.deleteSet(set_id)
        ]);
    },[]);

    /** Calendar */

    const [ selectedDate, setSelectedDate ] = useState<Date | null>(new Date());

    /** body weight */

    const [ bodyweightLog, setBodyweightLog ] = useState<BodyweightLog[]>(DataService.getBodyweightLog());

    const onLogBodyweight = useCallback(({weight} : {weight: number}) => {
        setBodyweightLog([
            ...DataService.logBodyweight(weight)
        ]);
    },[setBodyweightLog]);

    return <div>
        <Routes>
            <Route path='/' element={<div className={styles.root}>
                <Box sx={{ p: 4, pt: 2, pb: 2, display: 'flex', alignItems: 'center', textAlign: 'center', marginBottom: 'auto', flexGrow: 0 }}>
                    <Breadcrumbs color='text.primary' aria-label="breadcrumb" separator={<NavigateNextIcon fontSize="small" />}>
                        {breadcrumbs.map(({ breadcrumb, match }) => <div key={match.pathname} onClick={() => navigate(match.pathname)}>{match.pathname === '/' ? <div className={styles.logo} onClick={() => { navigate('/'); }}>
                        <img src={logo}/><div className={styles.name}>LOG3</div>
                    </div> :  breadcrumb}</div>)}
                    </Breadcrumbs>
                    <Button 
                        sx={{
                            marginLeft: 'auto',
                            color: 'inherit'
                        }} 
                        variant='text' 
                        onClick={onExerciseMenuToggleClick}
                        ref={exerciseMenuToggleRef}
                    >
                        Exercises ({Object.keys(exercises).length})
                    </Button>
                    <Popover
                        id='exercise-menu'
                        anchorEl={exerciseMenuToggleRef.current}
                        open={isExerciseMenuOpened}
                        onClose={onCloseExerciseMenu}
                        anchorOrigin={{
                            vertical: 'bottom',
                            horizontal: 'left',
                        }}
                    >
                        <Paper variant="outlined" square sx={{
                            p: 2,
                            width: 400
                        }}>
                            <Autocomplete
                                disablePortal
                                fullWidth={true}
                                id="exercises"
                                open={true}
                                options={exercises}
                                renderInput={(params) => <TextField 
                                    {...params} 
                                    label="Search exercises" 
                                    inputProps={{
                                        ...params.inputProps,
                                        autoComplete: 'new-password', // disable autocomplete and autofill
                                    }}/>}
                                placeholder={'Search exercise'}
                                getOptionLabel={(option) => option.name}
                                PopperComponent={(props) => <Box {...props} sx={{
                                    position: 'relative!important',
                                    width: '100%!important'
                                }}/>}
                                onChange={onSelectExercise}
                                renderOption={(props, option, { inputValue }) => {
                                    const matches = match(option.name, inputValue);
                                    const parts = parse(option.name, matches);

                                    return (
                                        <li {...props} style={{
                                            ...props.style,
                                            paddingRight: 6
                                        }}>
                                            <div style={{
                                                display: 'flex',
                                                alignItems: 'center',
                                                width: '100%'
                                            }}>
                                                <div>
                                                    {parts.map((part: any, index: any) => (
                                                        <span
                                                        key={index}
                                                        style={{
                                                        fontWeight: part.highlight ? 500 : 400,
                                                        }}
                                                        >
                                                            {part.text}
                                                        </span>
                                                    ))}
                                                </div>
                                                <IconButton sx={{
                                                    marginLeft: 'auto'
                                                }} onClick={(e) => { 
                                                    onRemoveExercise(option.id);
                                                    e.stopPropagation();
                                                }}><RemoveIcon/></IconButton>
                                            </div>
                                        </li>
                                    );
                                }}
                            />
                            <Divider sx={{
                                pl: 2,
                                pr: 2,
                                mt: 2,
                                mb: 2
                            }}/>
                            <Box sx={{
                                p: 2
                            }}>
                                <Form 
                                    id='new-exercise'
                                    onSubmit={onNewExerciseSubmitted}
                                    submitLabel={'Create'}
                                    title={'New exercise'}
                                    fields={[{
                                        name: 'name',
                                        label: 'Exercise name',
                                        type: 'text'
                                    },{
                                        name: 'desc',
                                        label: 'Description',
                                        type: 'text'
                                    }]}
                                />
                            </Box>
                        </Paper>
                    </Popover>
                    <Button sx={{
                        marginLeft: 1,
                        color: 'inherit'
                    }} variant='text' onClick={() => navigate(paths.injuries.root)}>
                        Injuries log
                    </Button>
                    <Button sx={{
                        marginLeft: 1,
                        color: 'inherit'
                    }} variant='text' onClick={() => navigate(paths.RPEChart.root)}>
                        RPE Chart
                    </Button>
                    <Button sx={{
                        marginLeft: 1
                    }} variant='outlined' onClick={() => navigate(paths.training.root)}>
                        Training log
                    </Button>
                </Box>
                <Box sx={{
                    flexGrow: 1,
                    width: '100%',
                    position: 'relative'
                }}>
                    <Box className={styles.mainContent} sx={{
                        display: 'flex',
                        position: 'relative',
                        flexDirection: 'row',
                        p: 4, pt: 2,
                        justifyContent: 'stretch',
                    }}>
                        <Box sx={{
                            pr: 8,
                            width: 400
                        }}>
                            <Typography variant='h5'>
                                Calendar
                            </Typography>
                            <Box sx={{
                                ml: -3
                            }}>
                                <LocalizationProvider dateAdapter={AdapterDateFns}>
                                    <StaticDatePicker
                                        orientation='portrait'
                                        displayStaticWrapperAs='desktop'
                                        openTo='day'
                                        value={selectedDate}
                                        showDaysOutsideCurrentMonth={true}
                                        onChange={(day) => {
                                            setSelectedDate(day);
                                        }}
                                        renderDay={(day, selectedDates, pickersDayProp) => {
                                            // console.log(day, DataService.getTrainingSessionByDate(day));

                                            return <div key={day?.getTime()}>
                                                {/* <Badge overlap='circular' anchorOrigin={{
                                                    vertical: 'bottom',
                                                    horizontal: 'right'
                                                }} color='secondary' variant='dot' invisible={DataService.getTrainingSessionByDate(day).length <= 0}> */}
                                                    <PickersDay {...pickersDayProp} sx={DataService.getTrainingSessionByDate(day).length > 0 ? {
                                                        borderColor: 'primary.main',
                                                        borderStyle: 'solid',
                                                        borderWidth: 1
                                                    } : undefined}/>
                                                {/* </Badge> */}
                                            </div>;
                                        }}
                                        renderInput={(params) => <TextField {...params} />}
                                    />
                                </LocalizationProvider>
                            </Box>
                            <Typography variant='h5'>
                                Bodyweight
                            </Typography>
                            <Box sx={{
                                p: 0
                            }}>
                                <Typography variant='h3' color='primary'>{bodyweightLog[bodyweightLog.length-1]?.weight || 0}kg <small>{new Date(bodyweightLog[bodyweightLog.length-1]?.timestamp || 0).toLocaleTimeString()}</small></Typography>
                                <Divider sx={{
                                    mt: 2,
                                    mb: 2
                                }}/>
                                <Form 
                                    id='bodyweight-log'
                                    submitLabel='Log'
                                    size='small'
                                    direction='row'
                                    onSubmit={onLogBodyweight}
                                    fields={[{
                                        type: 'number',
                                        label: 'weight',
                                        name: 'weight'
                                    }]}
                                />
                                <Divider sx={{
                                    mt: 2,
                                    mb: 2
                                }}/>
                                <Typography variant='h7'>TDEE: {Math.ceil(Number(bodyweightLog[bodyweightLog.length-1]?.weight) * 2.2 * 16)}Cal</Typography>
                                <Typography variant='body1'>Protein: {Math.ceil(Number(bodyweightLog[bodyweightLog.length-1]?.weight) * 2.2)}g</Typography>
                                <Typography variant='body1'>Fat: {Math.ceil(Number(bodyweightLog[bodyweightLog.length-1]?.weight) * 1)}g</Typography>
                                <Typography variant='body1'>Carb: {Math.floor(Number(bodyweightLog[bodyweightLog.length-1]?.weight) * (2.2 * 16 - 2.2 * 4 - 9) / 4)}g</Typography>
                            </Box>
                        </Box>
                        <Box sx={{ 
                            flexGrow: 1
                        }}>
                            <Outlet/>
                        </Box>
                    </Box>
                </Box>
            </div>}>
                <Route path={paths.RPEChart.root} element={<RPEChart exercises={exercises}/>}/>
                <Route path={paths.exercises.root + '/:id'} element={<ExerciseDetails/>}/>
                <Route path={paths.training.root} element={
                    <TrainingLog
                        selectedDate={selectedDate}
                        trainingSession={trainingSessions}
                        onLogTrainingSession={onLogTrainingSession}
                        onDeleteTrainingSession={onDeleteTrainingSession}
                        exerciseRecordsById={exerciseRecordsById}
                        exerciseRecordsBySessionId={exerciseRecordsBySessionId}
                        onAddExerciseToSession={onAddExerciseToSession}
                        onUpdateExerciseRecord={onUpdateExerciseRecord}
                        onRemoveExerciseRecord={onRemoveExerciseRecord}
                        onAddSet={onAddSet}
                        sets={exerciseSets}
                        setsById={exerciseSetsById}
                        onUpdateSet={onUpdateSet}
                        onRemoveSet={onRemoveSet}
                    />}>
                </Route>
                {/* <Route path={paths.exercises.root} element={<Box>
                    <Form 
                        id='new-exercise'
                        onSubmit={onNewExerciseSubmitted}
                        submitLabel={'Create'}
                        fields={[{
                            name: 'name',
                            label: 'Exercise name',
                            type: 'text'
                        },{
                            name: 'desc',
                            label: 'Description',
                            type: 'text'
                        }]}
                    />
                </Box>}/> */}
                <Route path={'*'} element={<div></div>}/>
            </Route>
        </Routes>
    </div>;
};

export default App;