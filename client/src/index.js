import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import {
  QueryClient,
  QueryClientProvider,
} from 'react-query'
import { ReactQueryDevtools } from 'react-query/devtools'

import cyan from "@material-ui/core/colors/cyan";
import { createMuiTheme } from "@material-ui/core";
import { ThemeProvider } from "@material-ui/styles";

import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link,
  Redirect,
} from "react-router-dom";

import About from './About'

import 'semantic-ui-css/semantic.min.css'

const queryClient = new QueryClient()

queryClient.setDefaultOptions({
  queries: {
    staleTime: 1000 * 60 * 10, // 1 minute
    cacheTime: Infinity,
  },
})

const darkTheme = createMuiTheme({
  palette: {
    type: 'dark',
    primary: {
      main: cyan['A200'],
    },
  },
});

ReactDOM.render(
    <QueryClientProvider client={queryClient}>
      <ThemeProvider theme={darkTheme}>
        <Router>
          <div>
            {/* <nav>
              <ul>
                <li>
                  <Link to="/?year=2021&month=February">February</Link>
                </li>
                <li>
                  <Link to="/?year=2021&month=March">March</Link>
                </li>
                <li>
                  <Link to="/users">Users</Link>
                </li>
              </ul>
            </nav> */}
            <Switch>
              <Route path="/calendar">       
                <App />
              </Route>
              <Redirect
                to={{
                  pathname: "/calendar",
                }}
              />
            </Switch>
          </div>
        </Router>
      </ThemeProvider>
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  ,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
