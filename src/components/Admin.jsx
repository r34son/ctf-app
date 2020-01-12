import React, { useState, useEffect } from 'react';
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
import { getData } from '../utils';
import withSocket from '../hoc/withSocket';

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
    marginRight: 20
  }
}));

const Admin = ({ socket }) => {
  const [tasks, setTasks] = useState([]);
  const [categories, setCategories] = useState([]);
  const [duration, setDuration] = useState('');

  const [isLoading, setIsLoading] = useState(false);
  const [started, setStarted] = useState(null);
  const [paused, setPaused] = useState(null);
  const [stoped, setStoped] = useState(null);
  const [resumed, setResumed] = useState(null);
  const [migrated, setMigrated] = useState(null);
  const [msg, setMsg] = useState('');

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
      moment.duration(+duration, 'hours').asMilliseconds()
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

  return !getData().isAdmin ? (
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
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-around',
                    alignItems: 'center'
                  }}
                  key={_id}
                >
                  <Typography>{points}</Typography>
                  <Switch
                    checked={enabled}
                    onChange={() => onToggle(_id, enabled)}
                    color='primary'
                  />
                </div>
              ))}
            </Grid>
          ))
        ) : (
          <Typography gutterBottom>{tasks.message}</Typography>
        )}
      </Grid>
      <Grid item md={3} spacing={3} container className={classes.root}>
        <div
          style={{
            width: '100%',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '20px'
          }}
        >
          <Typography>Поставить на паузу таймер</Typography>
          <Button
            variant='contained'
            size='medium'
            color='primary'
            onClick={pause}
          >
            Pause
          </Button>
          <Snackbar
            anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
            open={paused}
            onClose={() => setPaused(false)}
            message={
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <InfoIcon style={{ marginRight: '20px' }} />
                {msg}
              </div>
            }
          />
        </div>
        <div
          style={{
            width: '100%',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '20px'
          }}
        >
          <Typography>Продолжить таймер</Typography>
          <Button
            variant='contained'
            size='medium'
            color='primary'
            onClick={resume}
          >
            Resume
          </Button>
          <Snackbar
            anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
            open={resumed}
            onClose={() => setResumed(false)}
            message={
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <InfoIcon style={{ marginRight: '20px' }} />
                {msg}
              </div>
            }
          />
        </div>
        <div
          style={{
            width: '100%',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '20px'
          }}
        >
          <Typography>Включить таймер</Typography>
          <TextField
            id='standard-number'
            label='Часы'
            type='number'
            className={classes.textField}
            style={{ marginLeft: 10 }}
            margin='dense'
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
          <Snackbar
            anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
            open={started}
            onClose={() => setStarted(false)}
            message={
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <InfoIcon style={{ marginRight: '20px' }} />
                {msg}
              </div>
            }
          />
        </div>
        <div
          style={{
            width: '100%',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '20px'
          }}
        >
          <Typography>Выключить таймер</Typography>
          <Button
            variant='contained'
            size='medium'
            color='primary'
            onClick={stop}
          >
            Off
          </Button>
          <Snackbar
            anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
            open={stoped}
            onClose={() => setStoped(false)}
            message={
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <InfoIcon style={{ marginRight: '20px' }} />
                {msg}
              </div>
            }
          />
        </div>
        <div
          style={{
            width: '100%',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '20px'
          }}
        >
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
        </div>
        <div
          style={{
            width: '100%',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '20px'
          }}
        >
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
        </div>
      </Grid>
    </Grid>
  );
};

export default withSocket(Admin);
