import React, { useState } from 'react';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import { SxProps } from '@mui/system';

import { CountdownCircleTimer } from "react-countdown-circle-timer";
import formatDuration from 'format-duration';

import bell from './bell.mp3';

// import SoundPlayer from 'play-sound';

function playSound(url: string) {
    const audio = new Audio(url);
    audio.play();
}

// const soundPlayer = SoundPlayer();

import styles from './Timer.module.sass';

const _1_SEC = 1000;

const _1_MINUTE = 60 * 1000;

const restTimes = [
    30 * _1_SEC,
    _1_MINUTE,
    90 * _1_SEC,
    2 * _1_MINUTE,
    3 * _1_MINUTE,
    4 * _1_MINUTE,
    5 * _1_MINUTE,
]

type TimerProps = {
    sx?: SxProps
};

const Timer = (props: TimerProps) => {
    const [ countdownTo, setCountdownTo ] = useState<number>(0);

    const [ instance, setInstance ] = useState<number>(0);

    return <Paper sx={props.sx}
    >
        <Typography variant='h6'>
            Timer
        </Typography>
        <Box sx={{
            mb: 2
        }}>
            <CountdownCircleTimer
                isPlaying
                key={instance}
                duration={countdownTo}
                colors={['#de3d4f', '#de3d4f']}
                colorsTime={[10, 0]}
                trailColor={'rgba(0,0,0,0.2)'}
                onComplete={() => {
                    playSound(bell);
                    return { shouldRepeat: false, delay: 1 };
                }}
            >
                {({ remainingTime }) => {
                    if (remainingTime === 0) {
                        return <div className={styles.timer}>Finished</div>;
                    }

                    return (
                        <div className={styles.timer}>
                            <div className="text">Remaining</div>
                            <Typography variant='h3' color='primary' sx={{
                                fontWeight: 300
                            }}>{formatDuration(remainingTime *  1000)}</Typography>
                        </div>
                    );
                }}
            </CountdownCircleTimer>
        </Box>
        <Box sx={{
            maxWidth: '100%',
            display: 'grid',
            gridTemplateColumns: '1fr 1fr 1fr 1fr',
            gridGap: 8
        }}>
            {restTimes.map((duration) => <Button  
                key={duration}      
                variant='outlined' 
                size='small'
                onClick={() => {
                    setCountdownTo(duration / 1000);
                    setInstance(Date.now);
                }}
                sx={{
                    flexShrink: 0,
                    whiteSpace: 'nowrap'
                }}
            >
                {formatDuration(duration)}
            </Button>)}
        </Box>
    </Paper>;
}

export default Timer;