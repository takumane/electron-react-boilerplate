import React, { useCallback, useEffect, useState } from 'react';
import { HashRouter, Outlet, Route, Routes, Link } from 'react-router-dom';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';

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

type Exercise = {
    name: string 
};

type ExerciseSet = {
    reps: number,
    load: number
}

type ExerciseRecord = {
    exercise_name: string,
    sets: ExerciseSet[]
};

type Exercises = {
    [name: string]: {
        desc?: string,
    }
}

const paths = {
    exercises: {
        root: 'exercises',
        add: 'new',
        view: ':id',
        edit: ':id/edit',
        record: {
            root: 'record',
            add: 'new',
            view: ':id',
            edit: ':id/edit',
        }
    },
}

// window.electron.store.set('exercises',[]);

const App = () => {
    const [ newExerciseName, setNewExerciseName ] = useState('');

    const [ exercises, setExercises ] = useState<Exercises>(window.electron.store.get('exercises') || {});

    const addExercise = useCallback(() => {
        setExercises({
            ...exercises,
            [newExerciseName]: {}
        });
    },[exercises, newExerciseName]);

    useEffect(() => {
        window.electron.store.set('exercises', exercises);
    },[exercises]);

    const onNewExerciseNameChanged = useCallback((event) => {
        console.log('onNewExerciseNameChanged', event.target.value);
        setNewExerciseName(event.target.value);
    }, [setNewExerciseName]);

    return <div>
        <HashRouter>
            <Routes>
                <Route path='/' element={<div>
                    <Typography variant='h3' component='h1'>ONISTRONG</Typography>
                    <Button>
                        <Link to={paths.exercises.root}>Exercises</Link>
                    </Button>
                    <Outlet/>
                </div>}>
                    <Route path={paths.exercises.root} element={<div>
                        Exercises
                        {Object.keys(exercises).map((exercise_name) => <div key={exercise_name}>
                            {exercise_name}
                        </div>)}
                        <Button>
                            <Link to={paths.exercises.add}>New</Link>
                        </Button>
                        <Outlet/>
                    </div>}>
                        <Route path={paths.exercises.add} element={<div>
                            <div>New exercise</div>
                            <br/>
                            <TextField
                                label={'Name'}
                                value={newExerciseName}
                                onChange={onNewExerciseNameChanged}
                                size={'small'}
                                InputLabelProps={{ shrink: true }}
                            />
                            <Button size='small' onClick={addExercise}>Save</Button>
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
        </HashRouter>
    </div>;
};

export default App;