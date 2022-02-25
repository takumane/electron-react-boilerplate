import React, { useCallback } from 'react';

import { useForm, Controller } from 'react-hook-form';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import AdapterDateFns from '@mui/lab/AdapterDateFns';
import LocalizationProvider from '@mui/lab/LocalizationProvider';
import DatePicker from '@mui/lab/DatePicker';


type FormFieldDef = {
    name: string,
    label: string,
    type: 'text' | 'date' | 'number',
}

type FormProps = {
    id: string,
    fields: FormFieldDef[],
    submitLabel?: string,
    onSubmit: (data: {}) => void
}

const Form = (props: FormProps) => {
    const { register, control, handleSubmit, watch, formState: { errors } } = useForm();

    const onFormSubmit = useCallback((data: any) => {
        props.onSubmit(data);
        return false;
    },[]);

    return <Box component='form' onSubmit={handleSubmit(onFormSubmit)}>
        {props.fields.map(fieldDef => <Controller
            key={fieldDef.name}
            name={fieldDef.name}
            control={control}
            render={({ field, fieldState, formState }) => {
                const domId = `${props.id}_${fieldDef.name}`;

                switch(fieldDef.type) {
                    case 'date' : {
                        return <div><LocalizationProvider dateAdapter={AdapterDateFns}>
                            <DatePicker
                                label={fieldDef.label}
                                {...field}
                                renderInput={(params) => <TextField id={domId} variant='filled' {...params} inputRef={field.ref}/>}
                            />
                        </LocalizationProvider></div>;
                    }
                    default : {
                        return <div><TextField 
                            id={domId}
                            label={fieldDef.label}
                            type={fieldDef.type}
                            variant="filled"
                            {...field}
                            inputRef={field.ref}
                        /></div>;
                    }
                }
            }}
        />)}
        <Button variant='contained' type='submit'>{props.submitLabel || 'Submit'}</Button>
    </Box>;
};

export default Form;