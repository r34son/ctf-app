import React, { useState } from 'react'
import { 
    Grid, 
    Chip, 
    Typography, 
    Modal, 
    Divider, 
    Link, 
    makeStyles, 
    Backdrop, 
    Fade, 
    Paper, 
    FormGroup, 
    TextField, 
    Button 
} from '@material-ui/core'

const useStyles = makeStyles(theme => ({
    modal: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
    },
    paper: {
        backgroundColor: theme.palette.background.paper,
        //border: '2px solid #000',
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


const Tasks = () => {
    const [open, setOpen] = useState(false)
    const [task, setTask] = useState({})
    const [flag, setFlag] = useState('')
    const [categories] = useState(Array.from(new Set(tasks.map(task => task.category))).map(category => {
        return { 
            name: category,
            tasks: tasks.filter(task => task.category == category).map(({category, ...task}) => task)
        }
    }
    ))
    const classes = useStyles();

    const submitFlag = () => {

    }

    return (
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
                            {task.url && <Typography className={classes.mt10}>URL: <Link href={task.url}>{task.url}</Link></Typography>}
                            {/*TODO add more task info*/}
                            <FormGroup row className={classes.mt10}> 
                                <TextField 
                                    label='Flag'
                                    value={flag}
                                    onChange={(e) => setFlag(e.target.value)}
                                    margin='none'
                                    placeholder='CTF{...}'
                                    style={{flexGrow: '1', marginRight: '15px'}}
                                />
                                <Button variant='contained' size='medium' color='primary' onClick={submitFlag}>
                                    Submit
                                </Button>
                            </FormGroup> 
                        </Paper>
                    </Grid>
                </Fade>
            </Modal>
        </Grid>
    )
}

export default Tasks
