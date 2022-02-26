import React, { useCallback, useEffect, useRef, useState } from 'react';
import { HashRouter, Outlet, Route, Routes, Link, useNavigate, useParams } from 'react-router-dom';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Popover from '@mui/material/Popover';
import CancelIcon from '@mui/icons-material/Cancel';
import Popper from '@mui/material/Popper';
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
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import parse from 'autosuggest-highlight/parse';
import match from 'autosuggest-highlight/match';
import Form from './Form';

import styles from './index.module.sass';

import logo from '../logo.png';
import TrainingCalendar from './TrainingCalendar';
import DataService from './services/data';
import { Exercise } from './models';
import ExerciseDetails from './ExerciseDetails';

const paths = {
    exercises: {
        root: 'exercises'
    },
    injuries: {
        root: 'injuries'
    },
    records: {

    }
}

const TABLES = {
    EXERCISES: 'exercises',
    WORKOUTS: 'workouts'
}

// window.electron.store.set(TABLES.EXERCISES,[]);
// window.electron.store.set(TABLES.WORKOUTS, {});

const App = () => {
    const navigate = useNavigate();

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

    return <div>
        <Routes>
            <Route path='/' element={<div className={styles.root}>
                <Box sx={{ p: 4, display: 'flex', alignItems: 'center', textAlign: 'center', marginBottom: 'auto', flexGrow: 0 }}>
                    <div className={styles.logo} onClick={() => { navigate('/'); }}><img src={logo}/><div className={styles.name}>ONISTRONG</div></div>
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
                            p: 2
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
                                        <li {...props}>
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
                                                }}><CancelIcon/></IconButton>
                                            </div>
                                        </li>
                                    );
                                }}
                            />
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
                        </Paper>
                    </Popover>
                    <Button sx={{
                        marginLeft: 1,
                        color: 'inherit'
                    }} variant='text' onClick={() => navigate(paths.injuries.root)}>
                        Log Injury
                    </Button>
                    {/* <Button sx={{
                        marginLeft: 1
                    }} variant='outlined' onClick={onStartTraining}>
                        Start training
                    </Button> */}
                </Box>
                <Box sx={{ p: 4 }}>
                    <Outlet/>
                </Box>
                {/* <TrainingCalendar workouts={workouts} onLogWorkout={onLogWorkout} onDeleteWorkout={onDeleteWorkout}/> */}
            </div>}>
                <Route path={paths.exercises.root + '/:id'} element={<ExerciseDetails/>}/>
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
                <Route path={'*'} element={<div>
                    Feature not found
                </div>}/>
            </Route>
        </Routes>
    </div>;
};

export default App;