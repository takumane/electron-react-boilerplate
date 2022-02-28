import { TrainingSession, Exercise, ExerciseRecord, ExerciseSet } from "renderer/models";

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
    EXERCISE_INDEX_COUNTER: 'exercise_index_counter',
    TRAINING_SESSION: 'training_session',
    TRAINING_SESSION_INDEX_COUNTER: 'training_session_index_counter',
    EXERCISE_RECORD: 'exercise_record',
    EXERCISE_RECORD_INDEX_COUNTER: 'exercise_record_index_counter',
    SET: 'set',
    SET_INDEX_COUNTER: 'set_index_counter'
}

const exercises: Exercise[] = window.electron.store.get(FILE_KEYS.EXERCISE) || [];
let exercise_index_counter: number = window.electron.store.get(FILE_KEYS.EXERCISE_INDEX_COUNTER);

const training_sessions: TrainingSession[] = window.electron.store.get(FILE_KEYS.TRAINING_SESSION) || [];
let training_session_index_counter: number = window.electron.store.get(FILE_KEYS.TRAINING_SESSION_INDEX_COUNTER);

const exercise_records: ExerciseRecord[] = window.electron.store.get(FILE_KEYS.EXERCISE_RECORD) || [];
let exercise_record_index_counter: number = window.electron.store.get(FILE_KEYS.EXERCISE_RECORD_INDEX_COUNTER);

const sets: ExerciseSet[] = window.electron.store.get(FILE_KEYS.SET) || [];
let set_index_counter: number = window.electron.store.get(FILE_KEYS.SET_INDEX_COUNTER);

console.log('Sets from file', sets);

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

    static getTrainingSessions = () => {
        return training_sessions;
    }

    static getTrainingSessionById = (id: number) => {
        return training_sessions.find((session) => session.id === id);
    }

    static getTrainingSessionByDate = (date: Date | null) => {
        return training_sessions.filter((session) => (new Date(session.startTime)).getDate() === date?.getDate());
    }

    static createTrainingSession = (timestamp: number) => {
        training_sessions.push({
            id: training_session_index_counter++,
            startTime: timestamp
        });

        DataService.saveTrainingSessionsToFile();

        return training_sessions;
    }

    static deleteTrainingSession = (id: number) => {
        const indexToRemove = training_sessions.findIndex((session) => {
            return session.id === id;
        });

        if (indexToRemove >= 0) {
            training_sessions.splice(indexToRemove, 1);
        } else {
            console.error('Cant find training session id', id);
        }

        DataService.saveTrainingSessionsToFile();

        return training_sessions;
    }

    static saveTrainingSessionsToFile = () => {
        window.electron.store.set(FILE_KEYS.TRAINING_SESSION, training_sessions);
        window.electron.store.set(FILE_KEYS.TRAINING_SESSION_INDEX_COUNTER, training_session_index_counter);
    }

    static getExerciseRecords = () => {
        return exercise_records;
    }

    static getExerciseRecordById = (id: number) => {
        return exercise_records.find((record) => record.id === id);
    }

    static getExerciseRecordByTrainingSessionId = (session_id: number) => {
        return exercise_records.filter((record) => record.training_session_id === session_id);
    }

    static createExerciseRecord = (exercise_name: string, training_session_id: number) => {
        exercise_records.push({
            id: exercise_record_index_counter++,
            exercise_name,
            training_max: 0,
            training_session_id,
            sets: []
        });

        DataService.saveExerciseRecordsToFile();

        return exercise_records;
    }

    static updateExerciseRecord = (data: ExerciseRecord) => {
        const record = DataService.getExerciseRecordById(data.id);

        if (record) {
            record.training_max = data.training_max;
        }

        DataService.saveExerciseRecordsToFile();

        return exercise_records;
    }

    static deleteExerciseRecord = (id: number) => {
        const indexToRemove = exercise_records.findIndex((record) => {
            return record.id === id;
        });

        if (indexToRemove >= 0) {
            exercise_records.splice(indexToRemove, 1);
        } else {
            console.error('Cant find exercise record id', id);
        }

        DataService.saveExerciseRecordsToFile();

        return exercise_records;
    }

    static saveExerciseRecordsToFile = () => {
        window.electron.store.set(FILE_KEYS.EXERCISE_RECORD, exercise_records);
        window.electron.store.set(FILE_KEYS.EXERCISE_RECORD_INDEX_COUNTER, exercise_record_index_counter);
    }

    static getSets = () => {
        return sets;
    }

    static getSetById = (id: number) => {
        return sets.find((sets) => sets.id === id);
    }

    static createSet = (data: { exercise_record_id: number, reps: number, load: number, rest: number, rpe: number, rpt: number }) => {
        const newSet = {
            id: set_index_counter++,
            reps: data.reps,
            load: data.load,
            rest: data.rest,
            rpe: data.rpe,
            rpt: data.rpt,
        };
        
        sets.push(newSet);

        DataService.getExerciseRecordById(data.exercise_record_id)?.sets?.push(newSet.id);

        DataService.saveSetsToFile();
        DataService.saveExerciseRecordsToFile();

        return exercise_records;
    }

    static updateSet = (data: ExerciseSet) => {
        const _set = DataService.getSetById(data.id);

        if (_set) {
            _set.load = data.load;
            _set.reps = data.reps;
            _set.rpe = data.rpe;
            _set.rpt = data.rpt;
            _set.rest = data.rest;
        }

        DataService.saveSetsToFile();

        return sets;
    }

    static deleteSet = (id: number) => {
        const indexToRemove = sets.findIndex((set) => {
            return set.id === id;
        });

        if (indexToRemove >= 0) {
            sets.splice(indexToRemove, 1);
        } else {
            console.error('Cant find set id', id);
        }

        DataService.saveSetsToFile();
        DataService.saveExerciseRecordsToFile();

        return sets;
    }

    static saveSetsToFile = () => {
        window.electron.store.set(FILE_KEYS.SET, sets);
        window.electron.store.set(FILE_KEYS.SET_INDEX_COUNTER, set_index_counter);
    }
}