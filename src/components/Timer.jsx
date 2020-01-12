import React, { useState, useEffect } from 'react';
import { Grid, Typography } from '@material-ui/core';
import moment from 'moment';
import 'moment-duration-format';
import withSocket from '../hoc/withSocket';

const Timer = ({ socket }) => {
  const [time, setTime] = useState(null);

  useEffect(() => {
    socket.on('timer:tick', setTime);
  }, [socket]);

  return (
    <>
      {time !== null && (
        <Grid container justify='center'>
          <Typography style={{ margin: '50px' }} variant='h4'>
            {moment.duration(time).format('h:mm:ss')}
          </Typography>
        </Grid>
      )}
    </>
  );
};

export default withSocket(Timer);
