import React, { Component } from 'react';
import {
  Button,
  Jumbotron
} from 'react-bootstrap';
import { Link } from 'react-router';
import Firebase from 'firebase';

const firebase = new Firebase('https://turkeylist.firebaseio.com/');

export default class Home extends Component {
  handleAuth(authData) {
    const child = firebase.push({
      host: authData.facebook.cachedUserProfile.first_name
    });
    this.props.history.push(this.props.history.createPath(`/host/${child.key()}`));
  }
  handleClick(e) {
    const authData = firebase.getAuth();
    if (authData) {
      this.handleAuth(authData);
    } else {
      firebase.authWithOAuthPopup("facebook", function(error, authData) {
        if (!error) {
          this.handleAuth(authData);
        }
      }.bind(this));
    }
  }
  render() {
    return (
      <Button onClick={this.handleClick.bind(this)}>Hosting Thanksgiving?</Button>
    );
  }
}
