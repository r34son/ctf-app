import React from 'react'
import { Grid, Chip, Typography, makeStyles } from '@material-ui/core'

const useStyles = makeStyles({
    root: {
        margin: '0 auto',
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
                <Grid sm={12/categories.length} container direction='column' alignItems='center'>
                    <Typography gutterBottom>
                        {category.name}
                    </Typography>
                    {category.tasks.map(({ value, ...rest }) => 
                        <Chip className={classes.chip} label={value} onClick={openTask.bind(this, rest)}/>
                    )}  
                </Grid>
            )}
        </Grid>
    )
}

export default Tasks
