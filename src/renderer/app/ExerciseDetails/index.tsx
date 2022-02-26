import React from 'react';
import Typography from '@mui/material/Typography';
import DataService from '../services/data';
import { useParams } from 'react-router-dom';

const ExerciseDetails = () => {
    const { id } = useParams();

    return <div>
        <Typography variant='h4'>{DataService.getExerciseById(Number(id))?.name}</Typography>
    </div>;
};

export default ExerciseDetails;