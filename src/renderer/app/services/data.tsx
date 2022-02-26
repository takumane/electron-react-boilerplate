import { Exercise } from "../models";

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

const FILE_KEYS = {
    EXERCISE: 'exercise',
    EXERCISE_INDEX_COUNTER: 'exercise_index_counter'
}

const exercises: Exercise[] = window.electron.store.get(FILE_KEYS.EXERCISE) || [];
let exercise_index_counter: number = window.electron.store.get(FILE_KEYS.EXERCISE_INDEX_COUNTER);


export default class DataService {
    static getExercises = () => {
        return exercises;
    }

    static getExerciseById = (id: number) => {
        return exercises.find((exercise) => exercise.id === id);
    }

    static getExercisesByName = (name: string) => {
        return exercises.find((exercise) => exercise.name === name);
    }

    static createExercise = (name: string, desc?: string) => {
        exercises.push({
            id: exercise_index_counter++,
            name,
            desc
        });

        DataService.saveExerciseToFile();

        return exercises;
    }

    static deleteExercise = (id: number) => {
        const indexToRemove = exercises.findIndex((exercise) => {
            return exercise.id === id;
        });

        if (indexToRemove >= 0) {
            exercises.splice(indexToRemove, 1);
        } else {
            console.error('Cant find exercise id', id);
        }

        DataService.saveExerciseToFile();

        return exercises;
    }

    static saveExerciseToFile = () => {
        window.electron.store.set(FILE_KEYS.EXERCISE, exercises);
        window.electron.store.set(FILE_KEYS.EXERCISE_INDEX_COUNTER, exercise_index_counter);
    }
}