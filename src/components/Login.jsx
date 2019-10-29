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
    makeStyles,
    Typography
} from '@material-ui/core'
import {
    Visibility,
    VisibilityOff,
} from '@material-ui/icons'

import config from '../config'
import { Redirect } from 'react-router-dom'


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

const Login = (props) => {
    const [values, setValues] = useState({
        team: '',
        password: '',
        showPassword: false,
    })

    const [isLoading, setIsLoading] = useState(false);
    const [fetchedData, setFetchedData] = useState(null);
  
   

    const login = () => {
        setIsLoading(true);
        console.log('Sending request');
        fetch(`${config.protocol}://${config.server}:${config.port}/api/auth/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json;charset=utf-8'
            }, 
            body: JSON.stringify({
                login: values.team,
                password: values.password,
            }),
        }).then(response => {
            if (!response.ok) {
                throw new Error('Failed to fetch.');
            }

            return response.json();
        }).then(data => {
            setIsLoading(false); 
            localStorage.setItem("authToken", data.token)
            if(data.isAdmin) localStorage.setItem("isAdmin", true)
            setFetchedData(data);
        }).catch(err => {
            console.log(err);
            setIsLoading(false);
        })
    }

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
            {localStorage.getItem('authToken') ? 
            <Redirect to={{
                pathname: '/tasks',
                state: {from: props.location }
            }}/>
            :
            <Grid item>
                <Paper style={{ padding: '30px'}} elevation={4}>
                {isLoading ? <Typography>Loading...</Typography> :
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
                    <Button variant='contained' size='medium' color='primary' onClick={login}>
                        Login
                    </Button>
                </FormControl>
                }
                </Paper>
            </Grid>
            }
        </Grid>
    )
}

export default Login
