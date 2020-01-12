import React, { useState, useEffect } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Paper,
  makeStyles,
  ExpansionPanel,
  ExpansionPanelSummary,
  ExpansionPanelDetails,
  Typography,
  List,
  ListItem,
  ListItemText,
} from '@material-ui/core';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import Loader from './Loader';

import api from '../api';
import { getData } from '../utils';

const useStyles = makeStyles({
  root: {
    margin: '20px',
  },
  broot: {
    width: '100%',
  },
  heading: {
    fontSize: 15,
  },
});

const Scoreboard = () => {
  const classes = useStyles();

  const [isLoading, setIsLoading] = useState(false);
  const [scoreboard, setScoreboard] = useState({});

  const getScoreboard = () => {
    setIsLoading(true);
    api
      .getScore()
      .then(data => {
        setIsLoading(false);
        setScoreboard(data.scoreboard);
      })
      .catch(err => {
        console.log(err);
        setIsLoading(false);
      });
  };

  useEffect(getScoreboard, []);

  // useEffect(() => {
  //   console.log(Array.from(new Set(Object.keys(scoreboard).map(teamname => scoreboard[teamname].map(a => a.title)).flat(1))))
  // }, [scoreboard])

  return (
    <>
      {isLoading ? (
        <Loader />
      ) : (
        <>
          {scoreboard && (
            <>
              <Paper className={classes.root} elevation={4}>
                <Table stickyHeader>
                  <TableHead>
                    <TableRow>
                      <TableCell align='center'>Team</TableCell>
                      <TableCell align='center'>Score</TableCell>
                      {/* { localStorage.getItem('isAdmin') && 
              Array.from(new Set(Object.keys(scoreboard).map(teamname => scoreboard[teamname].map(a => a.title)).flat(1)))
              .map(task => <TableCell align="center" key={task}>{task}</TableCell>)
              } */}
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {scoreboard &&
                      Object.keys(scoreboard).map(teamname => (
                        <TableRow key={teamname}>
                          <TableCell align='center' component='th' scope='row'>
                            {teamname}
                          </TableCell>
                          <TableCell align='center'>
                            {scoreboard[teamname].length === undefined
                              ? scoreboard[teamname]
                              : scoreboard[teamname].reduce(
                                  (score, task) => score + +task.points,
                                  0,
                                )}
                          </TableCell>
                          {/* { localStorage.getItem('isAdmin') && 
                  scoreboard[teamname].map(a => a.points).map(task => <TableCell align="center" key={`${team.name} ${task.score}`}>{task.score}</TableCell>)
                } */}
                        </TableRow>
                      ))}
                  </TableBody>
                </Table>
              </Paper>
              <Paper className={classes.root} elevation={4}>
                {getData().isAdmin &&
                  scoreboard &&
                  Object.keys(scoreboard).map(teamname => (
                    <ExpansionPanel key={teamname}>
                      <ExpansionPanelSummary
                        expandIcon={<ExpandMoreIcon />}
                        aria-controls='panel1a-content'
                        id='panel1a-header'
                      >
                        <Typography className={classes.heading}>
                          {teamname}
                        </Typography>
                      </ExpansionPanelSummary>
                      <ExpansionPanelDetails>
                        {scoreboard[teamname].length !== undefined ? (
                          <List dense>
                            {scoreboard[teamname].map(task => (
                              <ListItem key={task.title}>
                                <ListItemText primary={`${task.title}`} />
                              </ListItem>
                            ))}
                          </List>
                        ) : (
                          <Typography>Не решены</Typography>
                        )}
                      </ExpansionPanelDetails>
                    </ExpansionPanel>
                  ))}
              </Paper>
            </>
          )}
        </>
      )}
    </>
  );
};

export default Scoreboard;
