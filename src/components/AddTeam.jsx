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
    makeStyles
} from '@material-ui/core'

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

    const classes = useStyles();

    return (
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
                    <Button variant='contained' size='medium' color='primary' style={{ marginTop: '10px'}}>
                        Add
                    </Button>
                </FormControl>
                </Paper>
            </Grid>
        </Grid>
    )
}

export default AddTeam
