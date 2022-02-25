export type Exercise = {
    name: string 
};

export type ExerciseSet = {
    reps: number,
    load: number
}

export type ExerciseRecord = {
    exercise_name: string,
    date: Date,
    sets: ExerciseSet[]
};

export type Workout = {
    exercises: ExerciseRecord[]
};

export type Workouts = {
    [timestamp: number]: Workout
}

export type Exercises = {
    [name: string]: {
        desc?: string,
    }
}