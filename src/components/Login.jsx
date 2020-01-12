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
} from '@material-ui/core'
import {
    Visibility,
    VisibilityOff,
} from '@material-ui/icons'
import Loader from './Loader'

import api from '../api'
import { setData, getData } from '../utils' 
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

const Login = ({ location, setAuth }) => {
    const [values, setValues] = useState({
      login: '',
      password: '',
    })

    const [isLoading, setIsLoading] = useState(false);
  
    const login = () => {
      setIsLoading(true);
      api.login(values).then(data => {
        setIsLoading(false); 
        setData(data)
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
        {isLoading ? <Loader /> :
          getData() ? 
          <Redirect to={{
            pathname: '/tasks',
            state: {from: location }
          }}/>
          :
          <Grid item>
            <Paper style={{ padding: '30px'}} elevation={4}>
              <form onSubmit={login}>
                <FormControl>
                  <FormLabel 
                    filled 
                    className={`${classes.marginb} ${classes.label}`}
                  >
                    Login
                  </FormLabel>
                  <Divider/>
                  <FormGroup>
                    <TextField 
                      label='Team'
                      value={values.login}
                      onChange={e => setValues({ ...values, login: e.target.value })}
                      margin='normal'
                      autoFocus
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
                                  onClick={() => setValues({ ...values, showPassword: !values.showPassword })}
                                  onMouseDown={e => e.preventDefault()}
                              >
                                  {values.showPassword ? <Visibility /> : <VisibilityOff />}
                              </IconButton>
                              </InputAdornment>
                            }
                          />
                        </FormControl>
                    </FormGroup>
                    <Button 
                      variant='contained' 
                      size='medium' 
                      color='primary' 
                      onClick={login}
                      type='submit'
                    >
                      Login
                    </Button>
                </FormControl>
              </form>
            </Paper>
          </Grid>
      }
    </Grid>
  )
}

export default Login
