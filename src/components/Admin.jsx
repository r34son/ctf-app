import React, { useState, useEffect } from 'react'
import { 
    Grid, 
    Typography, 
    makeStyles, 
    Switch,
    Button,
    Snackbar,
    TextField
} from '@material-ui/core'
import { Link } from 'react-router-dom'

import InfoIcon from '@material-ui/icons/Info';
import config from '../config'
import moment from 'moment'

const useStyles = makeStyles(theme => ({
    grid: {
        outline: '0',
        outlineOffset: '0',
    },
    root: {
        margin: '20px 0px',
        padding: '15px',
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

const Admin = () => {
    const [tasks, setTasks] = useState([]);
    const [categories, setCategories] = useState([])
    const [duration, setDuration] = useState()

    const [isLoading, setIsLoading] = useState(false);
    const [started, setStarted] = useState(null);
    const [paused, setPaused] = useState(null);
    const [stoped, setStoped] = useState(null);
    const [resumed, setResumed] = useState(null);
    const [migrated, setMigrated] = useState(null)
    const [msg, setMsg] = useState('');

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
        // setTasks([{
        //         title: 'Crypto 50',
        //         category: 'crypto',
        //         description: 'dkjdfdfslds\n\n[URL](https://google.com)',
        //         points: 50,
        //     },
        //     {
        //         title: 'Crypto 200',
        //         category: 'crypto',
        //         description: 'dkjssdjlsjdsjdjlds',
        //         points: 200,
        //     },
        //     {
        //         title: 'Web 200',
        //         category: 'web',
        //         description: 'dkjssfsflds',
        //         points: 200,
        //     },
        //     {
        //         title: 'Reverse 50',
        //         category: 'reverse',
        //         description: 'dkjslds',
        //         points: 50,
        // }])
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

    const turnOn = (hours) => {
        setIsLoading(true);
        console.log('Sending request to start timer', hours);
        fetch(`${config.protocol}://${config.server}:${config.port}/api/timer/start`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json;charset=utf-8',
                'auth': localStorage.getItem('authToken')
            }, 
            body: duration ? 
            JSON.stringify({ duration: moment.duration(+hours, 'h').asMilliseconds() }) 
            : JSON.stringify({ duration: 3600000 }) 
        })
        .then(response => {
            if (!response.ok) {
            throw new Error('Failed to fetch.');
            }
            return response.json();
        })
        .then(data => {
            setIsLoading(false); 
            setMsg('Timer started')
            setStarted(true);
        })
        .catch(err => {
            console.log(err);
            setIsLoading(false);
            setMsg(err.error)
            setStarted(true);
        })
    }

    const turnOff = () => {
        setIsLoading(true);
        console.log('Sending request to stop timer');
        fetch(`${config.protocol}://${config.server}:${config.port}/api/timer/stop`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json;charset=utf-8',
                'auth': localStorage.getItem('authToken')
            }
        })
        .then(response => {
            // if (!response.ok) {
            // throw new Error('Failed to fetch.');
            // }
            return response.json();
        })
        .then(data => {
            setIsLoading(false); 
            setMsg(data.error || data.message)
            setStoped(true);
        })
        .catch(err => {
            console.log(err);
            setIsLoading(false);
        })
    }

    const pause = () => {
        setIsLoading(true);
        console.log('Sending request to pause timer');
        fetch(`${config.protocol}://${config.server}:${config.port}/api/timer/pause`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json;charset=utf-8',
                'auth': localStorage.getItem('authToken')
            }
        })
        .then(response => {
            // if (!response.ok) {
            // throw new Error('Failed to fetch.');
            // }
            return response.json();
        })
        .then(data => {
            setIsLoading(false); 
            setMsg(data.error || data.message)
            setPaused(true);
        })
        .catch(err => {
            console.log(err);
            setIsLoading(false);
            setMsg(err.error)
            setPaused(true);
        })
    }

    const resume = () => {
        setIsLoading(true);
        console.log('Sending request to stop timer');
        fetch(`${config.protocol}://${config.server}:${config.port}/api/timer/resume`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json;charset=utf-8',
                'auth': localStorage.getItem('authToken')
            }
        })
        .then(response => {
            // if (!response.ok) {
            // throw new Error('Failed to fetch.');
            // }
            return response.json();
        })
        .then(data => {
            setIsLoading(false); 
            setMsg(data.error || data.message)
            setResumed(true);
        })
        .catch(err => {
            console.log(err);
            setIsLoading(false);
            setMsg(err.error)
            setResumed(true);
        })
    }

    const migrate = () => {
        setIsLoading(true);
        console.log('Sending request to migrate');
        fetch(`${config.protocol}://${config.server}:${config.port}/api/task/migrate`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json;charset=utf-8',
                'auth': localStorage.getItem('authToken')
            }
        })
        .then(response => {
            // if (!response.ok) {
            // throw new Error('Failed to fetch.');
            // }
            return response.json();
        })
        .then(data => {
            setIsLoading(false); 
            setMsg(data.error || data.message)
            setMigrated(true);
        })
        .catch(err => {
            console.log(err);
            setIsLoading(false);
            setMsg(err.error)
            setMigrated(true);
        })
    }

    const onToggle = (id, enabled) => {
        setIsLoading(true);
        console.log('Sending request to enable task');
        fetch(`${config.protocol}://${config.server}:${config.port}/api/task/force`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json;charset=utf-8',
                'auth': localStorage.getItem('authToken')
            },
            body: JSON.stringify({ force: enabled ? -1 : 1 , taskId: id })
        })
        .then(response => {
            // if (!response.ok) {
            // throw new Error('Failed to fetch.');
            // }
            return response.json();
        })
        .then(data => {
            console.log(data)
            setIsLoading(false); 
            getTasks();
        })
        .catch(err => {
            console.log(err);
            setIsLoading(false);
        })
    }

    const classes = useStyles();

    return (
        !localStorage.getItem("isAdmin") ?
        <Typography>You should be admin to see that</Typography>
        :
        <Grid container md={12} justifyContent='space-between'>
            <Grid 
                container 
                spacing={3} 
                md={9}    
                className={classes.root}        
            >
                {categories.map(category =>
                    <Grid sm={12/categories.length} container direction='column' alignItems='center' key={category.name}>
                        <Typography gutterBottom>
                            {category.name}
                        </Typography>
                        {category.tasks.map(({ _id, title, points, enabled }) => 
                            <div style={{ display: 'flex', justifyContent: 'space-around', alignItems: 'center' }} key={_id}>
                                <Typography>{points}</Typography>
                                <Switch checked={enabled} onChange={() => onToggle(_id, enabled)} color='primary'/>
                            </div>
                        )}  
                    </Grid>
                )}
            </Grid>
            <Grid
                md={3}
                container
                className={classes.root}        
            >
                <div style={{ width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                    <Typography>Поставить на паузу таймер</Typography>
                    <Button variant='contained' size='medium' color='primary' onClick={pause}>Pause</Button>
                    <Snackbar
                        anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
                        open={paused}
                        onClose={() => setPaused(false)}
                        message={<div style={{display: 'flex', alignItems: 'center', }}><InfoIcon style={{ marginRight: '20px'}}/>{msg}</div>}
                    />
                </div>
                <div style={{ width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                    <Typography>Продолжить таймер</Typography>
                    <Button variant='contained' size='medium' color='primary' onClick={resume}>Resume</Button>
                    <Snackbar
                        anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
                        open={resumed}
                        onClose={() => setResumed(false)}
                        message={<div style={{display: 'flex', alignItems: 'center', }}><InfoIcon style={{ marginRight: '20px'}}/>{msg}</div>}
                    />
                </div>
                <div style={{ width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                    <Typography>Включить таймер</Typography>
                    <TextField
                        id="standard-number"
                        label="Часы"
                        type="number"
                        className={classes.textField}
                        InputLabelProps={{
                            shrink: true,
                        }}
                        margin="dense"
                        value={duration}
                        onChange={e => setDuration(e.target.value)}
                    />
                    <Button variant='contained' size='medium' color='primary' onClick={() => turnOn(duration)}>On</Button>
                    <Snackbar
                        anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
                        open={started}
                        onClose={() => setStarted(false)}
                        message={<div style={{display: 'flex', alignItems: 'center', }}><InfoIcon style={{ marginRight: '20px'}}/>{msg}</div>}
                    />
                </div>
                <div style={{ width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                    <Typography>Выключить таймер</Typography>
                    <Button variant='contained' size='medium' color='primary' onClick={turnOff}>Off</Button>
                    <Snackbar
                        anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
                        open={stoped}
                        onClose={() => setStoped(false)}
                        message={<div style={{display: 'flex', alignItems: 'center', }}><InfoIcon style={{ marginRight: '20px'}}/>{msg}</div>}
                    />
                </div>
                <div style={{ width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                    <Typography>Обновить задания</Typography>
                    <Button variant='contained' size='medium' color='primary' onClick={migrate}>Update</Button>
                    <Snackbar
                        anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
                        open={migrated}
                        onClose={() => setMigrated(false)}
                        message={<div style={{display: 'flex', alignItems: 'center', }}><InfoIcon style={{ marginRight: '20px'}}/>{msg}</div>}
                    />
                </div>
                <div style={{ width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                    <Typography>Добавить команду</Typography> 
                    <Button variant='contained' size='medium' color='primary' component={Link} to='/addteam'>
                        Add
                    </Button>
                </div>
            </Grid> 
        </Grid>
    )
}

export default Admin
