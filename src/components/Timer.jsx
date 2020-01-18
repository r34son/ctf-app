import React, { useState, useEffect, useContext } from 'react';
import { Typography } from '@material-ui/core';
import moment from 'moment';
import 'moment-duration-format';
import socketContext from '../contexts/socketContext'

const Timer = ({ update }) => {
  const [time, setTime] = useState(null);
  const socket = useContext(socketContext);

  useEffect(() => {
    socket && socket.on('timer:tick', setTime);
  }, [socket]);

  useEffect(update, [update, time])

  return (
    <>
      {time !== null && (
        <Typography
          className='timer flex-center'
          variant='h6'
        >
          {moment.duration(time).format('h:mm:ss')}
        </Typography>
      )}
    </>
  );
};

export default Timer;
