import React, { Component } from 'react';
import { reduxForm, Field } from 'redux-form';
import { connect } from 'react-redux';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { updateUser } from '../../../../actions';
import './userSettings.css';
import Error from '../../../Error/Error';


class UserSettings extends Component {
  // componentWillMount() {
  //   const token = window.localStorage.getItem('token');
  //   if (!token) this.props.history.push('/');
  // }

  handleFormSubmit = ({ firstName, lastName, newEmail, oldPassword, newPassword }) => {
    this.props.updateUser(
      firstName,
      lastName,
      newEmail,
      oldPassword,
      newPassword,
    );
    this.props.reset('settings');
    this.notify();
  };

  notify = () => {
    toast.info('Settings Updated', { position: toast.POSITION.TOP_LEFT });
  }

  render() {
    return (
      <div className="container" style={{ marginLeft: '40%' }}>
        <ToastContainer autoClose={3000} />
        <div className="header-con">
          <h2 className="title">USER SETTINGS</h2>
          <form onSubmit={this.props.handleSubmit(this.handleFormSubmit)} style={{ margin: '.5em', width: '300px' }}>
            <Error error={this.props.auth.error} />
            <div className="row">
              <div className="col-75">
                <Field
                  type="text"
                  name="firstName"
                  placeholder="First Name"
                  autoComplete="off"
                  component="input"
                />
              </div>
            </div>
            <div className="row">
              <div className="col-75">
                <Field
                  type="text"
                  name="lastName"
                  placeholder="Last Name"
                  autoComplete="off"
                  component="input"
                />
              </div>
            </div>
            <div className="row">
              <div className="col-75">
                <Field
                  type="email"
                  name="newEmail"
                  placeholder="New email"
                  autoComplete="off"
                  component="input"
                />
              </div>
            </div>
            <div className="row">
              <div className="col-75">
                <Field
                  type="password"
                  name="oldPassword"
                  placeholder="Old Password"
                  autoComplete="off"
                  component="input"
                />
              </div>
            </div>
            <div className="row">
              <div className="col-75">
                <Field
                  type="password"
                  name="newPassword"
                  placeholder="New Password"
                  autoComplete="off"
                  component="input"
                />
              </div>
            </div>
            <div className="row">
              <input type="submit" value="Update" style={{ width: '248px' }} />
            </div>
          </form>
        </div>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  auth: state.auth,
});

UserSettings = connect(mapStateToProps, { updateUser })(UserSettings);

export default reduxForm({
  form: 'settings',
  fields: ['firstName', 'lastName', 'newEmail', 'oldPassword', 'newPassword'],
})(UserSettings);
