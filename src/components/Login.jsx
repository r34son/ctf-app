import React, { useState, useContext } from 'react';
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
} from '@material-ui/core';
import { Visibility, VisibilityOff } from '@material-ui/icons';
import Loader from './Loader';

import api from '../api';
import userContext from "../contexts/userContext";
import { useHistory } from 'react-router-dom';

const useStyles = makeStyles(theme => ({
  root: {
    display: 'flex',
    flexWrap: 'wrap'
  },
  marginb: {
    marginBottom: theme.spacing(3)
  },
  label: {
    display: 'flex',
    justifyContent: 'center',
    fontSize: '18px'
  }
}));

const Login = () => {
  const [values, setValues] = useState({
    login: '',
    password: ''
  });
  const [showPassword, setShowPassword] = useState(false);

  const setUser = useContext(userContext)[1];
  const history = useHistory();
  const [isLoading, setIsLoading] = useState(false);

  const login = () => {
    setIsLoading(true);
    api
      .login(values)
      .then(data => {
        setIsLoading(false);
        setUser(data);
        history.push('/')
      })
      .catch(err => {
        console.log(err);
        setIsLoading(false);
      });
  };

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
      {isLoading ? (
        <Loader />
      ) : (
        <Grid item>
          <Paper style={{ padding: '30px' }} elevation={4}>
            <form
              onSubmit={e => {
                e.preventDefault();
                login();
              }}
            >
              <FormControl>
                <FormLabel
                  filled
                  className={`${classes.marginb} ${classes.label}`}
                >
                  Login
                </FormLabel>
                <Divider />
                <FormGroup>
                  <TextField
                    label='Team'
                    value={values.login}
                    onChange={e => setValues({ ...values, login: e.target.value })}
                    margin='normal'
                    autoFocus
                  />
                  <FormControl className={classes.marginb}>
                    <InputLabel htmlFor='password'>Password</InputLabel>
                    <Input
                      id='password'
                      type={showPassword ? 'text' : 'password'}
                      value={values.password}
                      onChange={e =>
                        setValues({ ...values, password: e.target.value })
                      }
                      endAdornment={
                        <InputAdornment position='end'>
                          <IconButton
                            style={{ padding: 4 }}
                            onClick={() => setShowPassword(!showPassword)}
                            onMouseDown={e => e.preventDefault()}
                          >
                            {showPassword ? <Visibility /> : <VisibilityOff />}
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
                  type='submit'
                >
                  Login
                </Button>
              </FormControl>
            </form>
          </Paper>
        </Grid>
      )}
    </Grid>
  );
};

export default Login;
