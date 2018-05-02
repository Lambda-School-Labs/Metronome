import React, { Component } from 'react';
import { Route } from 'react-router-dom';
import './App.css';

import SignUp from './components/Signup/SignUp';
import LogIn from './components/LogIn/LogIn.js';
import EnsureLoggedInContainer from './components/EnsureLoggedIn/EnsureLoggedInContainer';
import TeacherDashboard from './Containers/TeacherDashboard';

class App extends Component {
  render() {
    return (
      <div>
        <Route path="/signup" component={SignUp} />
        <Route path="/login" component={LogIn} />
        <Route path="/teacher" component={TeacherDashboard} />
      </div>
    );
  }
}

export default App;
