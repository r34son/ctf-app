import React, { useState } from 'react'
import { 
    Grid,
    FormControl, 
    FormLabel, 
    FormGroup, 
    TextField, 
    Paper,
    Button,
    Divider,
    Typography,
    makeStyles,
    Snackbar
} from '@material-ui/core'
import InfoIcon from '@material-ui/icons/Info'

import config from '../config'

const useStyles = makeStyles(theme => ({
    root: {
      display: 'flex',
      flexWrap: 'wrap',
    },
    marginb: {
      marginBottom: theme.spacing(3),
    },
    label: {
        display: 'flex',
        justifyContent: 'center',
        fontSize: '18px'
    }
  }));

const AddTeam = () => {
    const [values, setValues] = useState({
        team: '',
        password: '',
    })

    const [open, setOpen] = useState(false)
    const [isLoading, setIsLoading] = useState(false);
    const [fetchedData, setFetchedData] = useState(null);

    const addteam = () => {
        setIsLoading(true);
        console.log('Sending request');
        fetch(`${config.protocol}://${config.server}:${config.port}/api/auth/addUser`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json;charset=utf-8',
                'auth': localStorage.getItem('authToken')
            }, 
            body: JSON.stringify({
                login: values.team,
                password: values.password,
            })
        })
        .then(response => {
            if (!response.ok) {
            throw new Error('Failed to fetch.');
            }
            return response.json();
        })
        .then(data => {
            setOpen(true)
            setIsLoading(false); 
            setFetchedData(data);
            setValues({
                team: '',
                password: '',
            })
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
        <Grid
            container
            spacing={0}
            direction='column'
            alignItems='center'
            justify='center'
            style={{ minHeight: '90vh' }}
        >
            <Grid container style={{ width: '300px'}}>
                <Paper style={{ padding: '30px', width: '100%' }} elevation={4}>
                <FormControl style={{ width: '100%' }}>
                    <FormLabel filled className={`${classes.marginb} ${classes.label}`}>
                        Add team
                    </FormLabel>
                    <Divider/>
                    <FormGroup>
                        <TextField 
                            label='Team'
                            value={values.team}
                            onChange={(e) => setValues({ ...values, team: e.target.value })}
                            margin='normal'
                            fullWidth
                        />
                        <TextField 
                            label='Password'
                            value={values.password}
                            onChange={(e) => setValues({ ...values, password: e.target.value })}
                            margin='normal'
                            fullwidth
                        />
                    </FormGroup>
                    <Button variant='contained' size='medium' color='primary' style={{ marginTop: '10px'}} onClick={addteam}>
                        Add
                    </Button>
                </FormControl>
                </Paper>
                <Snackbar
                    anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
                    open={open}
                    onClose={() => {
                        setOpen(false)
                    }}
                    message={<div style={{display: 'flex', alignItems: 'center', }}><InfoIcon style={{ marginRight: '20px'}}/>Команда добавлена</div>}
                />
            </Grid>
        </Grid>
    )
}

export default AddTeam
