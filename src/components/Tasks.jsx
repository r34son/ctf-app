import React from 'react'
import { Grid, Chip, Typography, makeStyles } from '@material-ui/core'

const useStyles = makeStyles({
    root: {
        margin: '20px auto',
    },
    chip: {
        marginTop: '20px'
    }
  });

  const categories = [{
    name: 'crypto',
    tasks: [{
        value: 50,
        title: 'Crypto 50',
        url: 'jhwdknwdlwldw',
    },
    {
        value: 200,
        title: 'Crypto 200',
        url: 'jhwdknwdlwldw',
    }]
  }, 
  {
    name: 'ppc',
    tasks: [{
        value: 50,
        title: 'Crypto 50',
        url: 'jhwdknwdlwldw',
    },
    {
        value: 200,
        title: 'Crypto 200',
        url: 'jhwdknwdlwldw',
    }]
  }, 
  {
    name: 'web',
    tasks: [{
        value: 50,
        title: 'Crypto 50',
        url: 'jhwdknwdlwldw',
    },
    {
        value: 200,
        title: 'Crypto 200',
        url: 'jhwdknwdlwldw',
    }]
  }, 
  {
    name: 'forensics',
    tasks: [{
        value: 50,
        title: 'Crypto 50',
        url: 'jhwdknwdlwldw',
    },
    {
        value: 200,
        title: 'Crypto 200',
        url: 'jhwdknwdlwldw',
    }]
  }, 
  {
    name: 'dkjd',
    tasks: [{
        value: 50,
        title: 'Crypto 50',
        url: 'jhwdknwdlwldw',
    },
    {
        value: 200,
        title: 'Crypto 200',
        url: 'jhwdknwdlwldw',
    }]
  }, 
  {
    name: 'reverse',
    tasks: [{
        value: 50,
        title: 'Crypto 50',
        url: 'jhwdknwdlwldw',
    },
    {
        value: 200,
        title: 'Crypto 200',
        url: 'jhwdknwdlwldw',
    }]
  }]

const Tasks = () => {
    const classes = useStyles();

    const openTask = (task) => {
        console.log(task.title)
    }
    return (
        <Grid 
            container 
            spacing={1} 
            md={8}    
            className={classes.root}        
        >
            {categories.map(category =>
                <Grid sm={12/categories.length} container direction='column' alignItems='center' key={category.name}>
                    <Typography gutterBottom>
                        {category.name}
                    </Typography>
                    {category.tasks.map(({ value, ...rest }) => 
                        <Chip key={rest.title} className={classes.chip} label={value} onClick={() => openTask(rest)}/>
                    )}  
                </Grid>
            )}
        </Grid>
    )
}

export default Tasks
