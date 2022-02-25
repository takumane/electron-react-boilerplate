import React, { useCallback, useEffect, useState } from 'react';
import { HashRouter, Outlet, Route, Routes, Link } from 'react-router-dom';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import parse from 'autosuggest-highlight/parse';
import match from 'autosuggest-highlight/match';
import Form from './Form';

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
    date: Date,
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
        record: {
            root: 'record',
            add: 'new',
            view: ':id',
        }
    },
}

// window.electron.store.set('exercises',[]);

const TABLES = {
    EXERCISES: 'exercises'
}

const App = () => {
    const [ exercises, setExercises ] = useState<Exercises>(window.electron.store.get(TABLES.EXERCISES) || {});

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

    useEffect(() => {
        window.electron.store.set(TABLES.EXERCISES, exercises);
    },[exercises]);

    const onChangeExercise = useCallback((event, newValue) => {
        console.log('onChangeExercise', event);
        setSelectedExerciseName(newValue);
    }, []);

    return <div>
        <HashRouter>
            <Routes>
                <Route path='/' element={<div>
                    <Typography variant='h3' component='h1'>ONISTRONG</Typography>
                    <Button>
                        <Link to={paths.exercises.root}>Exercises ({Object.keys(exercises).length})</Link>
                    </Button>
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
                            {/* <TextField
                                label={'Name'}
                                value={newExerciseName}
                                onChange={onNewExerciseNameChanged}
                                size={'small'}
                                InputLabelProps={{ shrink: true }}
                            />
                            <Button size='small' onClick={addExercise}>Save</Button> */}
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