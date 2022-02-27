import React, { useCallback, useEffect } from 'react';

import { useForm, Controller } from 'react-hook-form';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import AdapterDateFns from '@mui/lab/AdapterDateFns';
import LocalizationProvider from '@mui/lab/LocalizationProvider';
import DatePicker from '@mui/lab/DatePicker';
import Autocomplete from '@mui/material/Autocomplete';
import DataService from 'renderer/services/data';

import styles from './Form.module.sass';

type FormFieldDef = {
    name: string,
    label?: string,
    value?: any,
    width?: any,
    type: 'text' | 'date' | 'number' | 'exercise' | 'hidden'
}

type FormProps = {
    id: string,
    direction?: "row" | "column" | "row-reverse" | "column-reverse",
    fields?: FormFieldDef[],
    title?: string,
    submitLabel?: string,
    submitOnChange?: boolean,
    size?: 'large' | 'medium' | 'small',
    onSubmit?: (data: any) => void
}

const Form = (props: FormProps) => {
    const { register, control, handleSubmit, watch, formState: { errors } } = useForm();


    const onFormSubmit = useCallback((data: any) => {
        props.fields?.filter(fieldDef => fieldDef.type === 'hidden').map(fieldDef => {
            data[fieldDef.name] = fieldDef.value;
        })

        typeof props.onSubmit ===  'function' && props.onSubmit(data);

        return false;
    },[props.fields]);


    useEffect(() => {
        if (props.submitOnChange) {
            const subscription = watch(() => handleSubmit(onFormSubmit)());
            return () => subscription.unsubscribe();
        }
    }, [watch]);

    return <Box component='form' onSubmit={handleSubmit(onFormSubmit)} className={styles.container}>
        {props.title && <Typography variant='h6'>{props.title}</Typography>}
        <Stack direction={props.direction || 'column'} spacing={2}>
            {props.fields?.filter(fieldDef => fieldDef.type !== 'hidden').map(fieldDef => <Box 
                key={fieldDef.name}
            >
                <Controller
                    name={fieldDef.name}
                    control={control}
                    defaultValue={fieldDef.value}
                    render={({ field, fieldState, formState }) => {
                        const domId = `${props.id}_${fieldDef.name}`;

                        const inputSize = props.size !== 'large' ? (props.size || 'medium') : 'medium';

                        switch(fieldDef.type) {
                            case 'date' : {
                                return <LocalizationProvider dateAdapter={AdapterDateFns}>
                                    <DatePicker
                                        label={fieldDef.label}
                                        {...field}
                                        renderInput={(params) => <TextField
                                            id={domId} 
                                            InputLabelProps={{ shrink: true }} 
                                            {...params} 
                                            variant='outlined' 
                                            inputRef={field.ref} 
                                            fullWidth={true}
                                            InputProps={{
                                                classes: {
                                                    root: styles.textFieldRoot,
                                                    notchedOutline: styles.textFieldOutline
                                                }
                                            }}
                                            size={inputSize}
                                        />}
                                    />
                                </LocalizationProvider>;
                            }
                            case 'exercise' : {
                                return <Autocomplete
                                    disablePortal
                                    fullWidth={true}
                                    id="exercises"
                                    sx={{
                                        minWidth: 300
                                    }}
                                    options={DataService.getExercises()}
                                    {...field}
                                    onChange={(event, value) => {
                                        field.onChange({
                                            target: {
                                                value
                                            }
                                        });
                                    }}
                                    renderInput={(params) => <TextField 
                                        {...params} 
                                        label="Search exercises"
                                        InputLabelProps={{ shrink: true }}
                                        InputProps={{
                                            ...params.InputProps,
                                            classes: {
                                                root: styles.textFieldRoot,
                                                notchedOutline: styles.textFieldOutline
                                            },
                                        }}
                                        inputProps={{
                                            ...params.inputProps,
                                            autoComplete: 'new-password', // disable autocomplete and autofill
                                        }}
                                        size={inputSize}
                                    />}
                                    placeholder={'Search exercise'}
                                    getOptionLabel={(option) => option.name}
                                />
                            }
                            default : {
                                return <TextField 
                                    id={domId}
                                    label={`${fieldDef.label}`}
                                    type={fieldDef.type}
                                    variant='outlined'
                                    fullWidth={!fieldDef.width}
                                    InputLabelProps={{ shrink: true }}
                                    InputProps={{
                                        classes: {
                                            root: styles.textFieldRoot,
                                            notchedOutline: styles.textFieldOutline
                                        }
                                    }}
                                    {...field}
                                    size={inputSize}
                                    sx={{
                                        width: fieldDef.width
                                    }}
                                    inputRef={field.ref}
                                />;
                            }
                        }
                    }}
                />
            </Box>)}
            {props.submitLabel && <Button variant='contained' type='submit' size={props.size}>{props.submitLabel || 'Submit'}</Button>}
        </Stack>
    </Box>;
};

export default Form;