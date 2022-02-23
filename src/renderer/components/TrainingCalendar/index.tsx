import { Button, Card, Divider, Layout, PageHeader, Space, Tooltip } from 'antd';
import Title from 'antd/lib/typography/Title';
import * as React from 'react';
import { useState } from 'react';

import Plate from '../Plate';
import Icon from '@ant-design/icons';
import styles from './TrainingCalendar.module.sass';
import Rack from '../../icons/rack.svg';
import { Content, Footer } from 'antd/lib/layout/layout';
import Meta from 'antd/lib/card/Meta';

const days:Date[] = [];

const today = new Date();

const datesToThePast = 7;

const datesToTheFuture = 3;

for (let i = datesToThePast; i > 0; i--) {
    const newDate = new Date();
    newDate.setDate(newDate.getDate() - i);
    days.push(newDate);
}

days.push(today);

for (let i = 1; i < datesToTheFuture; i++) {
    const newDate = new Date();
    newDate.setDate(newDate.getDate() + i);
    days.push(newDate);
}

const exercisesData:{[key: string]: {
    icon?: any,
    max: number
}} = {
    'Squat': {
        icon: <svg fill="#45bac4" xmlns="http://www.w3.org/2000/svg"  viewBox="0 0 32 32" width="24" height="24"><path d="M 15.5 4 C 13.578125 4 12 5.578125 12 7.5 C 12 9.421875 13.578125 11 15.5 11 C 17.421875 11 19 9.421875 19 7.5 C 19 5.578125 17.421875 4 15.5 4 Z M 15.5 6 C 16.339844 6 17 6.660156 17 7.5 C 17 8.339844 16.339844 9 15.5 9 C 14.660156 9 14 8.339844 14 7.5 C 14 6.660156 14.660156 6 15.5 6 Z M 13.375 12 C 12.902344 12 12.425781 12.1875 12.0625 12.5 C 11.109375 13.320313 8.355469 15.839844 8.03125 19.375 C 7.953125 20.265625 8.675781 21 9.53125 21 L 16.1875 21 L 13.96875 27.25 L 15.875 27.90625 L 18.0625 21.65625 C 18.511719 20.382813 17.535156 19 16.1875 19 L 10.1875 19 C 10.675781 16.695313 12.644531 14.628906 13.375 14 L 17.78125 14.96875 L 18 15.03125 L 18.1875 14.96875 L 23.1875 13.96875 L 22.8125 12.03125 L 18.03125 13 L 13.5625 12.03125 L 13.46875 12 Z"/></svg>,
        max: 182.5
    },
    'Sumo Deadlift': {
        icon: <svg fill="#45bac4" xmlns="http://www.w3.org/2000/svg"  viewBox="0 0 50 50" width="24" height="24"><path d="M 25 3 C 22.250421 3 20 5.2504209 20 8 C 20 10.749579 22.250421 13 25 13 C 27.749579 13 30 10.749579 30 8 C 30 5.2504209 27.749579 3 25 3 z M 25 5 C 26.668699 5 28 6.3313011 28 8 C 28 9.6686989 26.668699 11 25 11 C 23.331301 11 22 9.6686989 22 8 C 22 6.3313011 23.331301 5 25 5 z M 20.5 14 C 17.475695 14 15 16.476746 15 19.5 L 15 30 L 11 30 L 11 24 A 1.0001 1.0001 0 0 0 9.984375 22.986328 A 1.0001 1.0001 0 0 0 9 24 L 9 38 A 1.0001 1.0001 0 1 0 11 38 L 11 32 L 15.1875 32 C 15.604868 33.157321 16.706873 34 18 34 C 19.293127 34 20.395132 33.157321 20.8125 32 L 29.1875 32 C 29.604868 33.157321 30.706873 34 32 34 C 33.293127 34 34.395132 33.157321 34.8125 32 L 39 32 L 39 38 A 1.0001 1.0001 0 1 0 41 38 L 41 24 A 1.0001 1.0001 0 0 0 39.984375 22.986328 A 1.0001 1.0001 0 0 0 39 24 L 39 30 L 35 30 L 35 19.5 C 35 16.476746 32.524305 14 29.5 14 L 20.5 14 z M 20.5 16 L 29.5 16 C 31.439695 16 33 17.561254 33 19.5 L 33 31 C 33 31.56503 32.56503 32 32 32 C 31.43497 32 31 31.56503 31 31 L 31 21 A 1.0001 1.0001 0 1 0 29 21 L 29 30 L 21 30 L 21 21 A 1.0001 1.0001 0 1 0 19 21 L 19 31 C 19 31.56503 18.56503 32 18 32 C 17.43497 32 17 31.56503 17 31 L 17 19.5 C 17 17.561254 18.560305 16 20.5 16 z M 5.984375 22.986328 A 1.0001 1.0001 0 0 0 5 24 L 5 30 L 4 30 A 1.0001 1.0001 0 1 0 4 32 L 5 32 L 5 38 A 1.0001 1.0001 0 1 0 7 38 L 7 31.167969 A 1.0001 1.0001 0 0 0 7 30.841797 L 7 24 A 1.0001 1.0001 0 0 0 5.984375 22.986328 z M 43.984375 22.986328 A 1.0001 1.0001 0 0 0 43 24 L 43 30.832031 A 1.0001 1.0001 0 0 0 43 31.158203 L 43 38 A 1.0001 1.0001 0 1 0 45 38 L 45 32 L 46 32 A 1.0001 1.0001 0 1 0 46 30 L 45 30 L 45 24 A 1.0001 1.0001 0 0 0 43.984375 22.986328 z M 22.164062 34 L 19.978516 44.208984 C 19.865516 44.739984 19.290016 45.087516 18.791016 44.978516 C 18.252016 44.862516 17.907438 44.331016 18.023438 43.791016 L 19.765625 35.662109 C 19.213625 35.871109 18.623 36 18 36 C 17.881 36 17.769344 35.972844 17.652344 35.964844 L 16.066406 43.371094 C 15.899406 44.155094 16.044469 44.957859 16.480469 45.630859 C 16.915469 46.303859 17.587094 46.765594 18.371094 46.933594 C 18.576094 46.977594 18.787953 47 19.001953 47 C 20.405953 47 21.638594 46.002906 21.933594 44.628906 L 24.210938 34 L 22.164062 34 z M 25.789062 34 L 28.066406 44.628906 C 28.360406 46.002906 29.594047 47 30.998047 47 C 31.212047 47 31.424906 46.977594 31.628906 46.933594 C 32.412906 46.765594 33.082578 46.303859 33.517578 45.630859 C 33.953578 44.957859 34.101594 44.155094 33.933594 43.371094 L 32.345703 35.964844 C 32.229703 35.972844 32.119 36 32 36 C 31.377 36 30.786328 35.872109 30.236328 35.662109 L 31.978516 43.791016 C 32.094516 44.330016 31.748984 44.861516 31.208984 44.978516 C 30.713984 45.087516 30.135484 44.740984 30.021484 44.208984 L 27.835938 34 L 25.789062 34 z"/></svg>,
        max: 230
    },
    'Bulgarian split squat': {
        max: 30
    }
}

const maxRepData = [
    1,
    0.97,
    0.94,
    0.92,
    0.89,
    0.86,
    0.83,
    0.81,
    0.78,
    0.75,
    0.73,
    0.71
];

const workoutData = {[today.getDate() - 2]: [{
    name: 'Squat',
        sets: [{
            reps: 10,
            load: 20
        },{
            reps: 10,
            load: 40
        },{
            reps: 5,
            load: 60
        },{
            reps: 5,
            load: 80
        },{
            reps: 3,
            load: 100
        },{
            reps: 1,
            load: 120
        },{
            reps: 1,
            load: 140
        },{
            reps: 6,
            load: 156
        },{
            reps: 6,
            load: 156
        },{
            reps: 6,
            load: 156
        },{
            reps: 6,
            load: 156
        }]
    },{
        name: 'Sumo Deadlift',
        sets: [{
            reps: 10,
            load: 70
        },{
            reps: 10,
            load: 100
        },{
            reps: 5,
            load: 130
        },{
            reps: 5,
            load: 150
        },{
            reps: 3,
            load: 170
        },{
            reps: 1,
            load: 190
        },{
            reps: 1,
            load: 200
        },{
            reps: 6,
            load: 205
        },{
            reps: 6,
            load: 205
        },{
            reps: 6,
            load: 205
        },{
            reps: 6,
            load: 205
        }]
    }],
    [today.getDate()]: [{
        name: 'Squat',
        sets: [{
            reps: 10,
            load: 20
        },{
            reps: 10,
            load: 40
        },{
            reps: 5,
            load: 60
        },{
            reps: 5,
            load: 80
        },{
            reps: 3,
            load: 100
        },{
            reps: 1,
            load: 120
        },{
            reps: 1,
            load: 140
        },{
            reps: 5,
            load: 160
        },{
            reps: 5,
            load: 160
        },{
            reps: 5,
            load: 160
        }]
    },{
        name: 'Sumo Deadlift',
        sets: [{
            reps: 10,
            load: 70
        },{
            reps: 5,
            load: 100
        },{
            reps: 5,
            load: 140
        },{
            reps: 3,
            load: 160
        },{
            reps: 1,
            load: 180
        },{
            reps: 5,
            load: 200
        },{
            reps: 5,
            load: 200
        },{
            reps: 5,
            load: 160
        },{
            reps: 5,
            load: 200
        },{
            reps: 5,
            load: 200
        }]
    },{
        name: 'Bulgarian split squat',
        sets: [{
            reps: 15,
            load: 15
        },{
            reps: 15,
            load: 15
        },{
            reps: 15,
            load: 15
        },{
            reps: 15,
            load: 15
        },{
            reps: 15,
            load: 15
        },{
            reps: 15,
            load: 15
        }]
    },{
        name: 'Squat',
        sets: [{
            reps: 10,
            load: 120
        },{
            reps: 10,
            load: 120
        },{
            reps: 10,
            load: 120
        },{
            reps: 10,
            load: 120
        },{
            reps: 10,
            load: 120
        },{
            reps: 10,
            load: 120
        },{
            reps: 10,
            load: 120
        },{
            reps: 10,
            load: 120
        },{
            reps: 10,
            load: 120
        },{
            reps: 10,
            load: 120
        }]
    }]
};

const TrainingCalendar = () => {
    return <div className={styles.calendar}>
        {days.map((date) => {
            const isToday = date === today;
            const isFuture = date > today;
            const workoutDataForCurrenDate = workoutData[date.getDate()];

            return <Layout className={[
                styles.day,
                isToday && styles.selected
            ].join(' ')}>
                <Content>
                    <Divider className={styles.dateGroup}>
                        <div className={styles.dayOfWeek}>
                            <small>{date.toLocaleDateString('en-gb', { weekday: 'short'})}</small>
                        </div>
                        <Button shape='round' size='middle' type={isToday ? 'primary' : (isFuture ? 'text' : 'text')} className={styles.date}>
                            {date.toLocaleDateString('en-gb', { day: 'numeric'})}
                        </Button>
                    </Divider>
                    <div className={styles.workout}>
                        {/* {isToday && <div className={styles.workoutControls}>
                            <div className={styles.duration}>1<small>h</small> 13<small>m</small> 30<small>s</small></div>
                            <div className={styles.duration}>450<small>kcal</small></div>
                            <div className={styles.duration}>{workoutDataForCurrenDate.reduce(  (prev, current, currentIndex, all) => {
                                return {
                                    name: 'total',
                                    sets: [{
                                        reps: 1,
                                        load: prev.sets.reduce((prevSet, currentSet) => {
                                            return {
                                                reps: 1,
                                                load: prevSet.reps * prevSet.load + currentSet.reps * currentSet.load
                                            };
                                        }).load + current.sets.reduce((prevSet, currentSet) => {
                                            return {
                                                reps: 1,
                                                load: prevSet.reps * prevSet.load + currentSet.reps * currentSet.load
                                            };
                                        }).load
                                    }]
                                }
                            }).sets[0].load}<small>kg</small></div>
                        </div>} */}
                        {workoutDataForCurrenDate && <div className={styles.exercises}>
                            {workoutDataForCurrenDate?.map((exercise) => {
                                const exerciseData = exercisesData[exercise.name];

                                return <div className={styles.exercise}>
                                    <div className={styles.meta}>
                                        {/* <Icon component={() => exerciseData.icon}/> */}
                                        <div className={styles.name}>{exercise.name}</div>
                                        <Button shape='round' type='link' icon={<Icon component={() => <svg fill="#45bac4" xmlns="http://www.w3.org/2000/svg"  viewBox="0 0 24 24" width="16" height="16"><path d="M 22 0 C 20.894531 0 20 0.894531 20 2 C 20 2.398438 20.109375 2.78125 20.3125 3.09375 L 18.40625 6.03125 C 18.277344 6.003906 18.136719 6 18 6 C 17.570313 6 17.171875 6.144531 16.84375 6.375 L 14.96875 5.25 C 14.980469 5.167969 15 5.085938 15 5 C 15 3.894531 14.105469 3 13 3 C 11.894531 3 11 3.894531 11 5 C 11 5.183594 11.015625 5.363281 11.0625 5.53125 L 8.9375 7.25 C 8.65625 7.101563 8.339844 7 8 7 C 6.894531 7 6 7.894531 6 9 C 6 9.042969 5.996094 9.082031 6 9.125 L 3.28125 10.46875 C 2.933594 10.179688 2.488281 10 2 10 C 0.894531 10 0 10.894531 0 12 C 0 13.105469 0.894531 14 2 14 C 3.105469 14 4 13.105469 4 12 C 4 11.96875 4 11.9375 4 11.90625 L 6.71875 10.53125 C 7.066406 10.820313 7.511719 11 8 11 C 9.105469 11 10 10.105469 10 9 C 10 8.816406 9.984375 8.636719 9.9375 8.46875 L 12.0625 6.75 C 12.34375 6.898438 12.660156 7 13 7 C 13.429688 7 13.828125 6.855469 14.15625 6.625 L 16.03125 7.75 C 16.019531 7.832031 16 7.914063 16 8 C 16 9.105469 16.894531 10 18 10 C 19.105469 10 20 9.105469 20 8 C 20 7.601563 19.890625 7.21875 19.6875 6.90625 L 21.625 3.96875 C 21.746094 3.992188 21.871094 4 22 4 C 23.105469 4 24 3.105469 24 2 C 24 0.894531 23.105469 0 22 0 Z M 22 13 C 20.894531 13 20 13.894531 20 15 C 20 15.363281 20.109375 15.707031 20.28125 16 L 18.34375 19.03125 C 18.230469 19.011719 18.117188 19 18 19 C 17.738281 19 17.480469 19.03125 17.25 19.125 L 14.875 16.75 C 14.96875 16.519531 15 16.261719 15 16 C 15 14.894531 14.105469 14 13 14 C 11.894531 14 11 14.894531 11 16 C 11 16.183594 11.015625 16.363281 11.0625 16.53125 L 8.9375 18.25 C 8.65625 18.101563 8.339844 18 8 18 C 7.292969 18 6.667969 18.355469 6.3125 18.90625 L 3.9375 18.53125 C 3.726563 17.652344 2.941406 17 2 17 C 0.894531 17 0 17.894531 0 19 C 0 20.105469 0.894531 21 2 21 C 2.707031 21 3.332031 20.644531 3.6875 20.09375 L 6.0625 20.46875 C 6.273438 21.347656 7.058594 22 8 22 C 9.105469 22 10 21.105469 10 20 C 10 19.816406 9.984375 19.636719 9.9375 19.46875 L 12.0625 17.75 C 12.34375 17.898438 12.660156 18 13 18 C 13.261719 18 13.519531 17.96875 13.75 17.875 L 16.125 20.25 C 16.03125 20.480469 16 20.738281 16 21 C 16 22.105469 16.894531 23 18 23 C 19.105469 23 20 22.105469 20 21 C 20 20.585938 19.871094 20.195313 19.65625 19.875 L 21.5625 16.96875 C 21.703125 17 21.851563 17 22 17 C 23.105469 17 24 16.105469 24 15 C 24 13.894531 23.105469 13 22 13 Z"/></svg>} />}></Button>
                                        <div className={styles.total}>
                                            {exercise.sets.reduce((prevSet, currentSet) => {
                                                return {
                                                    reps: 1,
                                                    load: prevSet.reps * prevSet.load + currentSet.reps * currentSet.load
                                                };
                                            }).load}<small>kg</small>
                                        </div>
                                    </div>
                                    <div className={styles.data}>
                                        <div className={styles.setHeader}>
                                            <div>Reps</div>
                                            <div>Load</div>
                                            <div>RPE</div>
                                            <div>Intensity (Rel)</div>
                                        </div>
                                        {exercise.sets.map((set) => {
                                            return <div className={styles.set}>
                                                <div>{set.reps}</div>
                                                <div>{set.load}<small>kg</small></div>
                                                <div></div>
                                                <div>
                                                    <Tooltip title={`current 1rm: ${exerciseData.max} kg`}>{(set.load / exerciseData.max * 100).toFixed(0)}<small>%</small></Tooltip> (<Tooltip title={`current ${set.reps}rm: ${(exerciseData.max * maxRepData[set.reps - 1]).toFixed(0)} kg`}>{(set.load / (exerciseData.max * maxRepData[set.reps - 1]) * 100).toFixed(0)}<small>%</small></Tooltip>)
                                                </div>
                                            </div>
                                        })}
                                    </div>
                                </div>;
                            })}
                        </div>}
                        <div className={styles.footer}>
                            <Button shape="round" type='text' icon={<Icon component={() => <img height='16' src={Rack}/>}/>}>Add</Button>
                        </div>
                    </div>
                </Content>
                {/* <Footer className={styles.footer}>
                    {isToday && <Button shape="round" size='large' type='primary' icon={<Icon component={() => <img height='16' src={Rack}/>}/>}>Add exercise</Button>}
                </Footer> */}
            </Layout>
        })}
    </div>;
};

export default TrainingCalendar;