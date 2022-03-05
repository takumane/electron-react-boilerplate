import React from 'react';
import Autocomplete from '@mui/material/Autocomplete';
import DataService from 'renderer/services/data';
import { ControllerRenderProps, FieldValues } from 'react-hook-form';
import { TextField } from '@mui/material';

type ExerciseAutocompleteType = {
    field?: ControllerRenderProps<FieldValues, string>,
    value?: any,
    onChange?: (event: any, value: any) => void
};

const ExerciseAutocomplete = (props: ExerciseAutocompleteType) => {
    return <Autocomplete
        disablePortal
        fullWidth={props.field ? true : false}
        id="exercises"
        sx={{
            minWidth: 300
        }}
        options={DataService.getExercises()}
        value={props.value}
        {...props.field}
        isOptionEqualToValue={(option, value) => option.id === value.id}
        onChange={props.field ? (event, value) => {
            props.field?.onChange({
                target: {
                    value
                }
            });
        } : props.onChange}
        renderInput={(params) => <TextField 
            {...params} 
            label="Search exercises"
            InputLabelProps={{ shrink: true }}
            InputProps={{
                ...params.InputProps,
                // classes: {
                //     root: styles.textFieldRoot,
                //     notchedOutline: styles.textFieldOutline
                // },
            }}
            inputProps={{
                ...params.inputProps,
                autoComplete: 'new-password', // disable autocomplete and autofill
            }}
            size={'small'}
        />}
        placeholder={'Search exercise'}
        getOptionLabel={(option) => option.name}
    />
}

export default ExerciseAutocomplete;