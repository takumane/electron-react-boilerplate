import React, { useCallback, useEffect, useState } from 'react';
import { HashRouter, Outlet, Route, Routes, Link, useNavigate } from 'react-router-dom';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import parse from 'autosuggest-highlight/parse';
import match from 'autosuggest-highlight/match';
import Form from './Form';

import styles from './index.module.sass';

import logo from '../logo.png';
import TrainingCalendar from './TrainingCalendar';
import { Exercises, Workouts } from './models';
declare global {
    interface Window {
      electron: {
        store: {
          get: (key: string) => any;
          set: (key: string, val: any) => void;
          // any other methods you've defined...
        };
      };
    }
}

const paths = {
    exercises: {
        root: 'exercises',
        add: 'new',
        view: ':id'
    },
    records: {

    }
}

// window.electron.store.set('exercises',[]);

const TABLES = {
    EXERCISES: 'exercises',
    WORKOUTS: 'workouts'
}

const App = () => {
    const navigate = useNavigate();

    const [ exercises, setExercises ] = useState<Exercises>(window.electron.store.get(TABLES.EXERCISES) || {});

    useEffect(() => {
        window.electron.store.set(TABLES.EXERCISES, exercises);
    },[exercises]);

    const [ selectedExerciseName, setSelectedExerciseName ] = useState('');

    const onNewExerciseSubmitted = useCallback((data) => {
        setExercises({
            ...exercises,
            [data.name]: {
                ...data
            }
        });
        setSelectedExerciseName(data.name);
    },[exercises]);

    const onChangeExercise = useCallback((event, newValue) => {
        console.log('onChangeExercise', event);
        setSelectedExerciseName(newValue);
    }, []);

    const [ workouts, setWorkouts ] = useState<Workouts>(window.electron.store.get(TABLES.WORKOUTS) || {});
    
    // useEffect(() => {
    //     window.electron.store.set(TABLES.WORKOUTS, workouts);
    // }, [workouts]);

    const onStartTraining = useCallback(() => {
        setWorkouts({
            ...workouts,
            [Date.now()]: {
                exercises: []
            }
        });
    }, []);

    const onLogoClick = useCallback(() => {
        navigate('/');
    }, []);

    return <div>
        <Routes>
            <Route path='/' element={<div>
                <Box sx={{ display: 'flex', alignItems: 'center', textAlign: 'center' }}>
                    <div className={styles.logo} onClick={onLogoClick}><img src={logo}/><div className={styles.name}>ONISTRONG</div></div>
                    <Button sx={{
                        marginLeft: 'auto'
                    }}>
                        <Link to={paths.exercises.root}>Exercises ({Object.keys(exercises).length})</Link>
                    </Button>
                    <Button sx={{
                        marginLeft: 1
                    }} variant='contained' onClick={onStartTraining}>
                        Start training
                    </Button>
                </Box>
                <TrainingCalendar workouts={workouts}/>
                <Outlet/>
            </div>}>
                <Route path={paths.exercises.root} element={<div>
                    <Autocomplete
                        disablePortal
                        fullWidth={false}
                        id="exercises"
                        options={Object.keys(exercises)}
                        renderInput={(params) => <TextField {...params} label="Exercises" />}
                        value={selectedExerciseName}
                        onChange={onChangeExercise}
                        renderOption={(props, option, { inputValue }) => {
                            const matches = match(option, inputValue);
                            const parts = parse(option, matches);
                    
                            return (
                                <li {...props}>
                                    <div>
                                        {parts.map((part: any, index: any) => (
                                            <span
                                            key={index}
                                            style={{
                                            fontWeight: part.highlight ? 700 : 400,
                                            }}
                                            >
                                                {part.text}
                                            </span>
                                        ))}
                                    </div>
                                </li>
                            );
                        }}
                    />
                    <Button>
                        <Link to={paths.exercises.add}>New</Link>
                    </Button>
                    <Outlet/>
                </div>}>
                    <Route path={paths.exercises.add} element={<div>
                        <div>New exercise</div>
                        <br/>
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
                    </div>}></Route>
                    <Route path={paths.exercises.view} element={([...args]) => {
                        console.log(args);
                        return <div>
                            {}
                        </div>;
                    }}></Route>
                </Route>
            </Route>
        </Routes>
    </div>;
};

export default App;