import React, { useState } from 'react'
import { 
    Grid, 
    Typography, 
    makeStyles, 
    Switch,
    Button,
    Snackbar,
} from '@material-ui/core'

import InfoIcon from '@material-ui/icons/Info';
import config from '../config'

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
    }
}));

  const tasks = [{
      title: 'Crypto 50',
      category: 'crypto',
      description: 'dkjdfdfslds',
      points: 50,
  },
  {
    title: 'Crypto 200',
    category: 'crypto',
    description: 'dkjssdjlsjdsjdjlds',
    url: 'https://google.com',
    points: 200,
  },
  {
    title: 'Web 200',
    category: 'web',
    description: 'dkjssfsflds',
    url: 'https://google.com',
    points: 200,
  },
  {
    title: 'Reverse 50',
    category: 'reverse',
    description: 'dkjslds',
    points: 50,
}]


const Admin = () => {
    const [categories] = useState(Array.from(new Set(tasks.map(task => task.category))).map(category => {
        return { 
            name: category,
            tasks: tasks.filter(task => task.category == category).map(({category, ...task}) => task)
        }
    }
    ))

    const [isLoading, setIsLoading] = useState(false);
    const [started, setStarted] = useState(null);
    const [paused, setPaused] = useState(null);
    const [stoped, setStoped] = useState(null);
    const [resumed, setResumed] = useState(null);
    const [msg, setMsg] = useState('');

    const turnOn = () => {
        setIsLoading(true);
        console.log('Sending request to start timer');
        fetch(`${config.protocol}://${config.server}:${config.port}/api/timer/start`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json;charset=utf-8',
                'auth': localStorage.getItem('authToken')
            }, 
            body: JSON.stringify({
                duration: 360000,
            })
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
                        {category.tasks.map(({ id, title, points, enabled }) => 
                            <div style={{ display: 'flex', justifyContent: 'space-around', alignItems: 'center' }} key={title}>
                                <Typography>{points}</Typography>
                                <Switch checked={enabled} onChange={() => {}} color='primary'/>
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
                    <Button variant='contained' size='medium' color='primary' onClick={turnOn}>On</Button>
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
            </Grid> 
        </Grid>
    )
}

export default Admin
