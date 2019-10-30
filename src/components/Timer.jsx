import React, { useState, useEffect } from 'react'
import { Grid, Typography } from '@material-ui/core'
import config from '../config'

export default () => {
  const [isLoading, setIsLoading] = useState(false);
  const [time, setTime] = useState(null);

  useEffect(() => {
    setIsLoading(true);
    fetch(`${config.protocol}://${config.server}:${config.port}/api/timer/timeLeft`)
    .then(response => {
        if (!response.ok) {
        throw new Error('Failed to fetch.');
        }
        return response.json();
    })
    .then(data => {
        setIsLoading(false); 
        setTime(data);
    })
    .catch(err => {
        console.log(err);
        setIsLoading(false);
    })
  }, [])

  return ( 
    !isLoading && time && 
    <Grid container justify='flex-end'>
      <Typography style={{ margin: '50px'}}>
        {time.timeLeft} hours : {time.timeLeft} minutes
      </Typography>
    </Grid>
  )
}