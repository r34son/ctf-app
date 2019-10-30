import React from 'react'
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableRow,
    Paper,
    makeStyles
} from '@material-ui/core'

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
    const teams = [{
        name: 'Arkanyx',
        score: 300,
        tasks: [{
            name: 'C1',
            score: '-',
        },{
            name: 'C2',
            score: '20',
        },{
            name: 'C3',
            score: '-',
        },{
            name: 'C4',
            score: '100',
        }]
    }]

    const tasks = ['C1', 'C2', 'C3', 'C4']

    return (
        <Paper className={classes.root} elevation={4}>
        <Table /*className={classes.table}*/ aria-label="simple table" stickyHeader>
          <TableHead>
            <TableRow>
              <TableCell align="center">Team</TableCell>
              <TableCell align="center">Score</TableCell>
              { localStorage.getItem('isAdmin') && 
              tasks.map(task => <TableCell align="center" key={task}>{task}</TableCell>)
              }
            </TableRow>
          </TableHead>
          <TableBody>
            {teams.map(team => (
              <TableRow key={team.name}>
                <TableCell align="center" component="th" scope="row">{team.name}</TableCell>
                <TableCell align="center">{team.score}</TableCell>
                { localStorage.getItem('isAdmin') && 
                team.tasks.map(task => <TableCell align="center" key={`${team.name} ${task.score}`}>{task.score}</TableCell>)
                }
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Paper>
    )
}

export default Scoreboard
