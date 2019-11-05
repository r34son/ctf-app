import React, { useState, useEffect } from 'react'
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableRow,
    Paper,
    makeStyles
} from '@material-ui/core'
import config from '../config'

const useStyles = makeStyles({
    root: {
        margin: '20px',
    },
    table: {
      minWidth: '250px',
    },
  });

const Scoreboard = () => {
    const classes = useStyles();

    const [isLoading, setIsLoading] = useState(false);
    const [scoreboard, setScoreboard] = useState({});
  
    const getScoreboard = () => {
        setIsLoading(true);
        console.log('Sending request to get tasks');
        fetch(`${config.protocol}://${config.server}:${config.port}/api/task/scoreboard`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json;charset=utf-8',
                'auth': localStorage.getItem('authToken')
            }
        }).then(response => {
            if (!response.ok) {
                throw new Error('Failed to fetch.');
            }

            return response.json();
        }).then(data => {
            setIsLoading(false); 
            setScoreboard(data.scoreboard);
        }).catch(err => {
            console.log(err);
            setIsLoading(false);
        })
    }

    useEffect(() => {
      getScoreboard(); 
    }, [])

    // useEffect(() => {
    //   console.log(Array.from(new Set(Object.keys(scoreboard).map(teamname => scoreboard[teamname].map(a => a.title)).flat(1))))
    // }, [scoreboard])

    return (
      <Paper className={classes.root} elevation={4}>
        <Table /*className={classes.table}*/ aria-label="simple table" stickyHeader>
          <TableHead>
            <TableRow>
              <TableCell align="center">Team</TableCell>
              <TableCell align="center">Score</TableCell>
              {/* { localStorage.getItem('isAdmin') && 
              Array.from(new Set(Object.keys(scoreboard).map(teamname => scoreboard[teamname].map(a => a.title)).flat(1)))
              .map(task => <TableCell align="center" key={task}>{task}</TableCell>)
              } */}
            </TableRow>
          </TableHead>
          <TableBody>
            {Object.keys(scoreboard).map(teamname => (
              <TableRow key={teamname}>
                <TableCell align="center" component="th" scope="row">{teamname}</TableCell>
                <TableCell align="center">{scoreboard[teamname].length == undefined ? 
                  scoreboard[teamname] 
                  : scoreboard[teamname].reduce((score, task) => score + +task.points, 0) }</TableCell>
                {/* { localStorage.getItem('isAdmin') && 
                  scoreboard[teamname].map(a => a.points).map(task => <TableCell align="center" key={`${team.name} ${task.score}`}>{task.score}</TableCell>)
                } */}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Paper>
    )
}

export default Scoreboard
