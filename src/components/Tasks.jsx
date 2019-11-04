import React, { useState, useEffect } from 'react';
import { 
    Grid, 
    Chip, 
    Typography, 
    Modal, 
    Divider, 
    makeStyles, 
    Backdrop, 
    Fade, 
    Paper, 
    FormGroup, 
    TextField, 
    Button,
    Snackbar 
} from '@material-ui/core';
import ReactMarkdown from 'react-markdown';
import InfoIcon from '@material-ui/icons/Info';
import Timer from './Timer'
import Loader from './Loader'
import config from '../config'

const useStyles = makeStyles(theme => ({
    modal: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
    },
    paper: {
        backgroundColor: theme.palette.background.paper,
        boxShadow: theme.shadows[5],
        padding: theme.spacing(3, 4, 3),
    },
    grid: {
        outline: '0',
        outlineOffset: '0',
    },
    root: {
        margin: '20px auto',
    },
    mt20: {
        marginTop: '20px'
    },
    mt10: {
        marginTop: '10px'
    }
}));

const Tasks = () => {
    const [open, setOpen] = useState(false)
    const [task, setTask] = useState({})
    const [flag, setFlag] = useState('')   
    const [isLoading, setIsLoading] = useState(false);
    const [tasks, setTasks] = useState([]);
    const [categories, setCategories] = useState([])
    const [submitStatus, setSubmitStatus] = useState()
    const [submitMsg, setSubmitMsg] = useState()
    const classes = useStyles();
  
    const getTasks = () => {
        setIsLoading(true);
        console.log('Sending request to get tasks');
        fetch(`${config.protocol}://${config.server}:${config.port}/api/task/`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json;charset=utf-8',
                'auth': localStorage.getItem('authToken')
            }
        }).then(response => {
            if (!response.ok) {
                throw new Error('Failed to fetch.');
            }

            return response.json();
        }).then(data => {
            setIsLoading(false); 
            setTasks(data);
        }).catch(err => {
            console.log(err);
            setIsLoading(false);
        })
    }

    useEffect(() => {
        getTasks()
        const timer = setInterval(getTasks, 60000)
        return () => clearTimeout(timer)
    }, [])

    useEffect(() => {
        setCategories(Array.from(new Set(tasks.map(task => task.category))).map(category => ({
            name: category,
            tasks: tasks.filter(task => task.category == category).map(({category, ...task}) => task)
        })))
    }, [tasks])

    const submitFlag = (id) => {
        setIsLoading(true);
        console.log('Sending request');
        fetch(`${config.protocol}://${config.server}:${config.port}/api/task/`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json;charset=utf-8',
                'auth': localStorage.getItem('authToken')
            },
            body: JSON.stringify({ flag })
        }).then(response => {
            if (!response.ok) {
                throw new Error('Failed to fetch.');
            }

            return response.json();
        }).then(data => {
            setIsLoading(false); 
            setSubmitStatus(true);
            setSubmitMsg(data);
        }).catch(err => {
            console.log(err);
            setIsLoading(false);
            setSubmitStatus(true);
        })
    }

    return (    
      <>
        <Timer />
        {isLoading ? <Loader /> : 
        <Grid 
            container 
            spacing={1} 
            md={8}    
            className={classes.root}        
        >
            {categories.map(category =>
                <Grid sm={12/categories.length} xs={12/categories.length} container direction='column' alignItems='center' key={category.name}>
                    <Typography gutterBottom>
                        {category.name}
                    </Typography>
                    {category.tasks.map(({ points, ...task }) => 
                        <Chip key={task.title} className={classes.mt20} label={points} onClick={() => { 
                            setTask(task)
                            setOpen(true)
                        }}/>
                    )}  
                </Grid>
            )}
        </Grid>}
        <Modal
            closeAfterTransition
            BackdropComponent={Backdrop}
            BackdropProps={{
                timeout: 500,
            }}
            disableAutoFocus
            open={open}
            onClose={() => setOpen(false)}
            className={classes.modal}
        >
            <Fade in={open}>
                <Grid 
                    md={5}
                    className={classes.grid} 
                >
                    <Paper className={classes.paper}>
                        <Typography gutterBottom>
                            {task.title}
                        </Typography>
                        <Divider />
                        <Typography className={classes.mt10}>
                            <ReactMarkdown source={task.description} />
                        </Typography>
                        <FormGroup row className={classes.mt10}> 
                            <TextField 
                                label='Flag'
                                value={flag}
                                onChange={(e) => setFlag(e.target.value)}
                                margin='none'
                                placeholder='CTF{...}'
                                style={{flexGrow: '1', marginRight: '15px'}}
                            />
                            <Button variant='contained' size='medium' color='primary' onClick={() => submitFlag(task.id)}>
                                Submit
                            </Button>
                        </FormGroup> 
                    </Paper>
                </Grid>
            </Fade>
        </Modal>
        <Snackbar
            anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
            open={submitStatus}
            onClose={() => setSubmitStatus(false)}
            message={<div style={{display: 'flex', alignItems: 'center', }}><InfoIcon style={{ marginRight: '20px'}}/>{submitMsg}</div>}
        />
      </>
    )
}

export default Tasks
