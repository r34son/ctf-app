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
  const [scoreboardTasks, setScoreboardTasks] = useState();

  const getScoreboard = () => {
    setIsLoading(true);
    api
      .getScore()
      .then(data => {
        setIsLoading(false);
        setScoreboard(data.scoreboard);
        setScoreboardTasks(data.scoreboardTasks);
      })
      .catch(err => {
        console.log(err);
        setIsLoading(false);
      });
  };

  useEffect(getScoreboard, []);

  const sortedTeams = Object.keys(scoreboard).sort((a, b) => scoreboard[b] - scoreboard[a])
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
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {sortedTeams.map(teamname => (
                        <TableRow key={teamname}>
                          <TableCell align='center' component='th' scope='row'>
                            {teamname}
                          </TableCell>
                          <TableCell align='center'>
                            {scoreboard[teamname]}
                          </TableCell>
                        </TableRow>
                      ))}
                  </TableBody>
                </Table>
              </Paper>
              {scoreboardTasks && (
                <Paper className={classes.root} elevation={4}>
                  {sortedTeams.map(teamname => (
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
                          {scoreboardTasks[teamname].length ? (
                            <List dense>
                              {scoreboardTasks[teamname].map(task => (
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
              )}
            </>
          )}
        </>
      )}
    </>
  );
};

export default Scoreboard;
