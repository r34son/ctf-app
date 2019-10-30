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
                duration: 50000,
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
            setStarted(true);
        })
        .catch(err => {
            console.log(err);
            setIsLoading(false);
        })
    }

    const turnOff = () => {}

    const classes = useStyles();

    return (
        !localStorage.getItem("isAdmin") ?
        <Typography>You should be admin to see that</Typography>
        :
        <Grid container md={12} justifyContent='space-between'>
            <Grid 
                container 
                spacing={3} 
                md={10}    
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
                md={2}
                container
                className={classes.root}        
            >
                <div style={{ width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Typography>Остановить таймер</Typography>
                    <Button variant='contained' size='medium' color='primary' onClick={turnOff}>Off</Button>
                    <Snackbar
                        anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
                        open={started}
                        onClose={() => setStarted(false)}
                        message={<div><InfoIcon /> Timer started</div>}
                    />
                </div>
                <div style={{ width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Typography>Включить таймер</Typography>
                    <Button variant='contained' size='medium' color='primary' onClick={turnOn}>On</Button>
                </div>
            </Grid> 
        </Grid>
    )
}

export default Admin
