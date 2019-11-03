import React, { useState, useEffect } from 'react'
import { Grid, Typography } from '@material-ui/core'
import moment from 'moment'
import config from '../config'

export default () => {
  const [isLoading, setIsLoading] = useState(false);
  const [time, setTime] = useState(null);

  const getTimeLeft = () => {
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
  }

  useEffect(() => {
    getTimeLeft(); 
    const timer = setInterval(getTimeLeft, 30000)
    return () => clearInterval(timer)
  }, [])

  return ( 
    time && 
    <Grid container justify='flex-end'>
      <Typography style={{ margin: '50px'}}>
        {!time.paused ? 
          `${moment.duration(time.timeLeft).hours()} hours : ${moment.duration(time.timeLeft).minutes()} minutes` 
          : 
          (!time.message ? 'Paused' : `${time.message}`)}
      </Typography>
    </Grid>
  )
}