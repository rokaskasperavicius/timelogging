import React from 'react'
import ReactDOM from 'react-dom'
import { Calendar } from './Calendar'
import reportWebVitals from './reportWebVitals'

import { createMuiTheme } from '@material-ui/core'
import { ThemeProvider } from '@material-ui/styles'

import { SnackbarProvider } from 'notistack'

import { ModalProvider } from 'context'

import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect,
} from 'react-router-dom'

import 'semantic-ui-css/semantic.min.css'
import 'styles/main.scss'

const darkTheme = createMuiTheme({
  palette: {
    type: 'dark',
    primary: {
      main: '#0091ea',
    },
  },
})

ReactDOM.render(
  <ThemeProvider theme={darkTheme}>
    <SnackbarProvider
      maxSnack={3}
      anchorOrigin={{
        vertical: 'bottom',
        horizontal: 'center',
      }}
    >
      <Router>
        <ModalProvider>
          <Switch>
            <Route path='/calendar'>
              <Calendar />
            </Route>
            <Redirect
              to={{
                pathname: '/calendar',
              }}
            />
          </Switch>
        </ModalProvider>
      </Router>
    </SnackbarProvider>
  </ThemeProvider>,
  document.getElementById('root')
)

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals()
