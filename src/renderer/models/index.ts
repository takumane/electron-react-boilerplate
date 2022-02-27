export type Exercise = {
    id: number,
    name: string,
    desc?: string,
};

export type ExerciseSet = {
    id: number,
    reps: number,
    load: number,
    rest: number,
    rpe: number,
    rpt: number
}

export type ExerciseRecord = {
    id: number,
    exercise_name: string,
    training_session_id: number,
    sets: number[]
};

export type TrainingSession = {
    id: number,
    startTime: number,
    endTime?: number,
    preparedness?: number,
    fatigue?: number,
    rating?: number,
};