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
        border: '2px solid #000',
        boxShadow: theme.shadows[5],
        padding: theme.spacing(2, 4, 3),
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

  const categories = [{
    name: 'crypto',
    tasks: [{
        value: 50,
        title: 'Crypto 50',
        url: 'https://google.com',
    },
    {
        value: 200,
        title: 'Crypto 200',
        url: 'https://google.com',
    }]
  }, 
  {
    name: 'ppc',
    tasks: [{
        value: 50,
        title: 'PPC 50',
        url: 'https://google.com',
    },
    {
        value: 200,
        title: 'PPC 200',
        url: 'https://google.com',
    }]
  }, 
  {
    name: 'web',
    tasks: [{
        value: 50,
        title: 'Web 50',
        url: 'https://google.com',
    },
    {
        value: 200,
        title: 'Web 200',
        url: 'https://google.com',
    }]
  }, 
  {
    name: 'forensics',
    tasks: [{
        value: 50,
        title: 'Forensics 50',
        url: 'https://google.com',
    },
    {
        value: 200,
        title: 'Forensics 200',
        url: 'https://google.com',
    }]
  }, 
  {
    name: 'dkjd',
    tasks: [{
        value: 50,
        title: 'DJJ 50',
        url: 'https://google.com',
    },
    {
        value: 200,
        title: 'Crsdsdypto 200',
        url: 'https://google.com',
    }]
  }, 
  {
    name: 'reverse',
    tasks: [{
        value: 50,
        title: 'Reverse 50',
        url: 'https://google.com',
    },
    {
        value: 200,
        title: 'Reverse 200',
        url: 'https://google.com',
    }]
  }]

const Tasks = () => {
    const [open, setOpen] = useState(false)
    const [task, setTask] = useState({})
    const [flag, setFlag] = useState('')
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
                <Grid sm={12/categories.length} container direction='column' alignItems='center' key={category.name}>
                    <Typography gutterBottom>
                        {category.name}
                    </Typography>
                    {category.tasks.map(({ value, ...rest }) => 
                        <Chip key={rest.title} className={classes.mt20} label={value} onClick={() => { 
                            console.log(rest)
                            setTask(rest)
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
