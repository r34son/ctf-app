import React, { useState } from 'react'
import { 
    Grid,
    FormControl, 
    FormLabel, 
    FormGroup, 
    TextField, 
    InputAdornment,
    Input, 
    InputLabel,  
    IconButton, 
    Paper,
    Button,
    Divider,
    makeStyles
} from '@material-ui/core'
import {
    Visibility,
    VisibilityOff,
} from '@material-ui/icons'

const useStyles = makeStyles(theme => ({
        root: {
          display: 'flex',
          flexWrap: 'wrap',
        },
        marginb: {
          marginBottom: theme.spacing(3),
        },
        label: {
            display: 'flex',
            justifyContent: 'center',
            fontSize: '18px'
        }
      }));

const Login = () => {
    const [values, setValues] = useState({
        team: '',
        password: '',
        showPassword: false,
    })

    const classes = useStyles();
      
    return (
        <Grid
            container
            spacing={0}
            direction='column'
            alignItems='center'
            justify='center'
            style={{ minHeight: '90vh' }}
        >
            <Grid item>
                <Paper style={{ padding: '30px'}} elevation={4}>
                <FormControl>
                    <FormLabel filled className={`${classes.marginb} ${classes.label}`}>
                        Login
                    </FormLabel>
                    <Divider/>
                    <FormGroup>
                        <TextField 
                            label='Team'
                            value={values.team}
                            onChange={(e) => setValues({ ...values, team: e.target.value })}
                            margin='normal'
                        />
                        <FormControl className={classes.marginb}>
                            <InputLabel htmlFor="password">Password</InputLabel>
                            <Input
                                id="password"
                                type={values.showPassword ? 'text' : 'password'}
                                value={values.password}
                                onChange={(e) => setValues({ ...values, password: e.target.value })}
                                endAdornment={
                                    <InputAdornment position="end">
                                    <IconButton
                                        aria-label="toggle password visibility"
                                        onClick={() => setValues({ ...values, showPassword: !values.showPassword })}
                                        onMouseDown={(e) => e.preventDefault()}
                                    >
                                        {values.showPassword ? <Visibility /> : <VisibilityOff />}
                                    </IconButton>
                                    </InputAdornment>
                            }
                            />
                        </FormControl>
                    </FormGroup>
                    <Button variant='contained' size='medium' color='primary'>
                        Login
                    </Button>
                </FormControl>
                </Paper>
            </Grid>
        </Grid>
        
        
    )
}

export default Login
