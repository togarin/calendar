import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect,
} from 'react-router-dom'
import { EventsPage } from './Pages/EventsPage'
import { EventAddEditPage } from './Pages/EventAddEditPage'
import { Paper } from '@material-ui/core'

function App() {
  return (
    <Paper elevation={3}>
      <Router>
        <Switch>
          <Route exact path="/events" component={EventsPage} />
          <Route path="/add/:timestamp" component={EventAddEditPage} />
          <Route path="/edit/:id" component={EventAddEditPage} />
          <Redirect to="/events" />
        </Switch>
      </Router>
    </Paper>
  )
}

export default App
