import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { AppBar, Tabs, Tab} from '@material-ui/core'

export default ({ auth }) => {
    const [current, setCurrent] = useState(1)

    return (
        <AppBar position='static'>
            <Tabs
                value={current}
                onChange={(_, value) => setCurrent(value)}
                centered
            >
                <Tab label='Tasks' component={Link} to='/tasks'/>
                <Tab label='Scoreboard' component={Link} to='/scoreboard'/>
                {!auth && <Tab label='Login' component={Link} to='/login'/>}
                {auth && localStorage.getItem('isAdmin') && <Tab label='Admin' component={Link} to='/admin'/>}
                {auth && <Tab label={`${localStorage.getItem('authLogin')} ${localStorage.getItem('isAdmin') ? '(Админ)' :''}`} disabled/>}
            </Tabs>
        </AppBar>
    )
}
