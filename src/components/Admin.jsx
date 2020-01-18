import React, { useState, useEffect, useContext } from 'react';
import {
  Grid,
  Typography,
  makeStyles,
  Switch,
  Button,
  Snackbar,
  TextField
} from '@material-ui/core';
import { Link } from 'react-router-dom';
import moment from 'moment';
import Loader from './Loader';

import InfoIcon from '@material-ui/icons/Info';
import api from '../api';
import socketContext from '../contexts/socketContext'
import userContext from "../contexts/userContext";

const useStyles = makeStyles(theme => ({
  grid: {
    outline: '0',
    outlineOffset: '0'
  },
  root: {
    margin: '20px 0px',
    padding: '15px'
  },
  mt20: {
    marginTop: '20px'
  },
  mt10: {
    marginTop: '10px'
  },
  textField: {
    flexGrow: 1,
    marginRight: 20,
    marginLeft: 20 
  }
}));

const Admin = () => {
  const [tasks, setTasks] = useState([]);
  const [categories, setCategories] = useState([]);
  const [duration, setDuration] = useState('');

  const [isLoading, setIsLoading] = useState(false);
  const [migrated, setMigrated] = useState(null);
  const [msg, setMsg] = useState('');
  const socket = useContext(socketContext);
  const [{ isAdmin }] = useContext(userContext);

  const getTasks = () => {
    setIsLoading(true);
    api
      .getTasks()
      .then(data => {
        setIsLoading(false);
        setTasks(data);
      })
      .catch(err => {
        console.log(err);
        setIsLoading(false);
      });
  };

  useEffect(() => {
    getTasks();
    const timer = setInterval(getTasks, 60000);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (!tasks.message) {
      tasks.length !== 0 &&
        setCategories(
          Array.from(new Set(tasks.map(task => task.category))).map(
            category => ({
              name: category,
              tasks: tasks
                .filter(task => task.category === category)
                .map(({ category, ...task }) => task)
            })
          )
        );
    } else {
      setCategories([]);
    }
  }, [tasks]);

  const start = duration => {
    socket.emit(
      'timer:start',
      moment.duration(duration).asMilliseconds()
    );
  };
  const stop = () => socket.emit('timer:stop');
  const pause = () => socket.emit('timer:pause');
  const resume = () => socket.emit('timer:resume');

  const migrate = () => {
    setIsLoading(true);
    api
      .migrate()
      .then(data => {
        setIsLoading(false);
        setMsg(data.error || data.message);
        setMigrated(true);
      })
      .catch(err => {
        console.log(err);
        setIsLoading(false);
        setMsg(err.error);
        setMigrated(true);
      });
  };

  const onToggle = (id, enabled) => {
    setIsLoading(true);
    api
      .onToggle(id, enabled)
      .then(data => {
        console.log(data);
        setIsLoading(false);
        getTasks();
      })
      .catch(err => {
        console.log(err);
        setIsLoading(false);
      });
  };

  const classes = useStyles();

  return !isAdmin ? (
    <Typography>You should be admin to see that</Typography>
  ) : (
    <Grid container item md={12}>
      <Grid
        container
        item
        justify='center'
        spacing={3}
        md={9}
        className={classes.root}
      >
        {isLoading ? (
          <Loader />
        ) : categories.length !== 0 ? (
          categories.map(category => (
            <Grid
              item
              sm={Math.floor(12 / categories.length)}
              container
              direction='column'
              alignItems='center'
              key={category.name}
            >
              <Typography gutterBottom>{category.name}</Typography>
              {category.tasks.map(({ _id, points, enabled }) => (
                <Grid
                  container
                  justify='space-evenly'
                  alignItems='center'
                  key={_id}
                >
                  <Typography>{points}</Typography>
                  <Switch
                    checked={enabled}
                    onChange={() => onToggle(_id, enabled)}
                    color='primary'
                  />
                </Grid>
              ))}
            </Grid>
          ))
        ) : (
          <Typography gutterBottom>{tasks.message}</Typography>
        )}
      </Grid>
      <Grid item md={3} spacing={3} container className={classes.root}>
        <Grid item container justify='space-between'>
          <Typography>Поставить на паузу таймер</Typography>
          <Button
            variant='contained'
            size='medium'
            color='primary'
            onClick={pause}
          >
            Pause
          </Button>
        </Grid>
        <Grid item container justify='space-between'>
          <Typography>Продолжить таймер</Typography>
          <Button
            variant='contained'
            size='medium'
            color='primary'
            onClick={resume}
          >
            Resume
          </Button>
        </Grid>
        <Grid
          item
          container
          justify='space-between'
          alignItems='center'
          wrap='nowrap'
        >
          <Typography>Включить таймер</Typography>
          <TextField
            type='time'
            className={classes.textField}
            margin='none'
            value={duration}
            onChange={e => setDuration(e.target.value)}
          />
          <Button
            variant='contained'
            size='medium'
            color='primary'
            onClick={() => start(duration)}
          >
            On
          </Button>
        </Grid>
        <Grid item container justify='space-between'>
          <Typography>Выключить таймер</Typography>
          <Button
            variant='contained'
            size='medium'
            color='primary'
            onClick={stop}
          >
            Off
          </Button>
        </Grid>
        <Grid item container justify='space-between'>
          <Typography>Обновить задания</Typography>
          <Button
            variant='contained'
            size='medium'
            color='primary'
            onClick={migrate}
          >
            Update
          </Button>
          <Snackbar
            anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
            open={migrated}
            onClose={() => setMigrated(false)}
            message={
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <InfoIcon style={{ marginRight: '20px' }} />
                {msg}
              </div>
            }
          />
        </Grid>
        <Grid item container justify='space-between'>
          <Typography>Добавить команду</Typography>
          <Button
            variant='contained'
            size='medium'
            color='primary'
            component={Link}
            to='/addteam'
          >
            Add
          </Button>
        </Grid>
      </Grid>
    </Grid>
  );
};

export default Admin;
