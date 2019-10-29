import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { AppBar, Tabs, Tab } from '@material-ui/core'

export default ({ auth }) => {
    const [current, setCurrent] = useState(1)

    return (
        <AppBar position='static'>
            <Tabs
                value={current}
                onChange={(e, value) => setCurrent(value)}
                centered
            >
                <Tab label='Tasks' component={Link} to='/tasks'/>
                <Tab label='Scoreboard' component={Link} to='/scoreboard'/>
                {!auth && <Tab label='Login' component={Link} to='/login'/>}
            </Tabs>
        </AppBar>
    )
}
