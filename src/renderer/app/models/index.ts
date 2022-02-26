export type Exercise = {
    id: number,
    name: string,
    desc?: string,
};

export type ExerciseSet = {
    reps: number,
    load: number,
    rpe: number,
    rpt: number
}

export type ExerciseRecord = {
    exercise_name: string,
    workout_id: number,
    sets: ExerciseSet[]
};

export type Workout = {
    timestamp: number,
    exercises: ExerciseRecord[]
};

export type WorkoutsByTimestamp = {
    [timestamp: string]: Workout
}

export type ExercisesByName = {
    [name: string]: Exercise
}