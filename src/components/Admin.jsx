import React, { useState, useEffect, useContext } from "react";
import {
  Grid,
  Typography,
  makeStyles,
  Switch,
  Button,
  TextField,
  Modal,
  Paper,
  Backdrop,
  FormControlLabel,
  Checkbox,
  Fade
} from "@material-ui/core";
import NumberFormat from "react-number-format";
import { Link } from "react-router-dom";
import moment from "moment";
import Loader from "./Loader";

import api from "../api";
import socketContext from "../contexts/socketContext";
import userContext from "../contexts/userContext";

const CATEGORIES = ['reverse', 'web', 'stegano', 'osint', 'crypto', 'pwn', 'admin', 'forensic', 'joy', 'PPC', 'mix'];

const useStyles = makeStyles(theme => ({
  grid: {
    outline: "0",
    outlineOffset: "0"
  },
  root: {
    margin: "20px 0px",
    padding: "15px"
  },
  mt20: {
    marginTop: "20px"
  },
  mt10: {
    marginTop: "10px"
  },
  modal: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center"
  },
  paper: {
    backgroundColor: theme.palette.background.paper,
    boxShadow: theme.shadows[5],
    padding: theme.spacing(3, 4, 3)
  }
}));

const Admin = () => {
  const [tasks, setTasks] = useState([]);
  const [categories, setCategories] = useState([]);
  const [duration, setDuration] = useState("");
  const [addTask, setAddTask] = useState(false);
  const [newTask, setNewTask] = useState({});
  const [after, setAfter] = useState(false);

  const [isLoading, setIsLoading] = useState(false);
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
    socket.emit("timer:start", moment.duration(duration).asMilliseconds());
  };
  const stop = () => socket.emit("timer:stop");
  const pause = () => socket.emit("timer:pause");
  const resume = () => socket.emit("timer:resume");

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

  const handleChange = e => {
    e.persist();
    setNewTask(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const classes = useStyles();

  return !isAdmin ? (
    <Typography>You should be admin to see that</Typography>
  ) : (
    <Grid container item md={12}>
      <Grid
        container
        item
        justify="center"
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
              direction="column"
              alignItems="center"
              key={category.name}
            >
              <Typography gutterBottom>{category.name}</Typography>
              {category.tasks.map(({ _id, points, enabled }) => (
                <Grid
                  container
                  justify="space-evenly"
                  alignItems="center"
                  key={_id}
                >
                  <Typography>{points}</Typography>
                  <Switch
                    checked={enabled}
                    onChange={() => onToggle(_id, enabled)}
                    color="primary"
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
        <Grid item container justify="space-between">
          <Typography>Поставить на паузу таймер</Typography>
          <Button
            variant="contained"
            size="medium"
            color="primary"
            onClick={pause}
          >
            Pause
          </Button>
        </Grid>
        <Grid item container justify="space-between">
          <Typography>Продолжить таймер</Typography>
          <Button
            variant="contained"
            size="medium"
            color="primary"
            onClick={resume}
          >
            Resume
          </Button>
        </Grid>
        <Grid
          item
          container
          justify="space-between"
          alignItems="center"
          wrap="nowrap"
        >
          <Typography>Включить таймер</Typography>
          <TextField
            type="time"
            margin="none"
            value={duration}
            onChange={e => setDuration(e.target.value)}
          />
          <Button
            variant="contained"
            size="medium"
            color="primary"
            onClick={() => start(duration)}
          >
            On
          </Button>
        </Grid>
        <Grid item container justify="space-between">
          <Typography>Выключить таймер</Typography>
          <Button
            variant="contained"
            size="medium"
            color="primary"
            onClick={stop}
          >
            Off
          </Button>
        </Grid>
        <Grid item container justify="space-between">
          <Typography>Добавить команду</Typography>
          <Button
            variant="contained"
            size="medium"
            color="primary"
            component={Link}
            to="/addteam"
          >
            Add
          </Button>
        </Grid>
        <Grid item container justify="space-between">
          <Typography>Добавить задание</Typography>
          <Button
            variant="contained"
            size="medium"
            color="primary"
            onClick={() => setAddTask(true)}
          >
            Add
          </Button>
          <Modal
            closeAfterTransition
            BackdropComponent={Backdrop}
            BackdropProps={{
              timeout: 500
            }}
            disableAutoFocus
            open={addTask}
            onClose={() => {
              setAddTask(false);
              //clearform
            }}
            className={classes.modal}
          >
            <Fade in={addTask}>
              <Grid item md={5} className={classes.grid}>
                <Paper className={classes.paper}>
                  <form
                    onSubmit={e => {
                      e.preventDefault();
                      api
                        .addTask({
                          ...newTask,
                          title: `${newTask.category[0].toUpperCase() +
                            newTask.category.slice(1)} ${newTask.points}`,
                          description: newTask.description.replace(
                            "\n",
                            "\n\n"
                          ),
                          enableAfter: moment
                            .duration(newTask.enableAfter)
                            .asMilliseconds()
                        })
                        .then(() => setNewTask({}))
                        .catch(console.err);
                    }}
                  >
                    <Grid container spacing={3} style={{ padding: 12 }}>
                      <Grid item xs={12}>
                        <Typography variant="h5" gutterBottom align="center">
                          Новый таск
                        </Typography>
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <TextField
                          select
                          fullWidth
                          required
                          label="Категория"
                          name="category"
                          value={newTask.category || ""}
                          onChange={handleChange}
                          helperText={
                            newTask.category ? "" : "Выберите категорию"
                          }
                          SelectProps={{
                            native: true
                          }}
                        >
                          <option />
                          {CATEGORIES.map((name) => (
                            <option key={name} value={name}>
                              {name}
                            </option>
                          ))}
                        </TextField>
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <NumberFormat
                          customInput={TextField}
                          allowNegative={false}
                          required
                          fullWidth
                          label="Очки"
                          name="points"
                          value={newTask.points || ""}
                          onValueChange={({ floatValue: points }) =>
                            setNewTask(prev => ({ ...prev, points }))
                          }
                          helperText={
                            newTask.points ? "" : "Введите количество очков"
                          }
                        />
                      </Grid>
                      <Grid item xs={12}>
                        <TextField
                          label="Описание (в формате md)"
                          required
                          multiline
                          fullWidth
                          name="description"
                          value={newTask.description || ""}
                          onChange={handleChange}
                          helperText={
                            newTask.description ? "" : "Введите описание"
                          }
                        />
                      </Grid>
                      <Grid item xs={12}>
                        <TextField
                          label="Флаг"
                          required
                          fullWidth
                          name="flag"
                          value={newTask.flag || ""}
                          onChange={handleChange}
                          helperText={newTask.flag ? "" : "Введите флаг"}
                        />
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <FormControlLabel
                          control={
                            <Checkbox
                              checked={after}
                              onChange={e => {
                                setAfter(e.target.checked);
                                if (!e.target.checked) {
                                  setNewTask(prev => ({
                                    ...prev,
                                    enableAfter: 0
                                  }));
                                }
                              }}
                              color="primary"
                            />
                          }
                          label="Отложенное"
                        />
                      </Grid>
                      {after && (
                        <Grid item xs={12} sm={6}>
                          <TextField
                            fullWidth
                            required
                            type="time"
                            value={newTask.enableAfter || ""}
                            onChange={e => {
                              e.persist();
                              setNewTask(prev => ({
                                ...prev,
                                enableAfter: e.target.value
                              }));
                            }}
                          />
                        </Grid>
                      )}
                      <Grid item container xs={12} justify="center">
                        <Button
                          variant="contained"
                          color="primary"
                          type="submit"
                        >
                          Добавить
                        </Button>
                      </Grid>
                    </Grid>
                  </form>
                </Paper>
              </Grid>
            </Fade>
          </Modal>
        </Grid>
      </Grid>
    </Grid>
  );
};

export default Admin;
