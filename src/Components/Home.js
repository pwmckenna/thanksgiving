import React, { Component } from 'react';
import {
  Grid,
  Button,
  PageHeader
} from 'react-bootstrap';
import Firebase from 'firebase';

const firebase = new Firebase('https://turkeylist.firebaseio.com/');

class Home extends Component {
  onFacebookAuth(err, authData) {
    if (!err) {
      this.handleAuth(authData);
    }
  }
  handleAuth(authData) {
    const child = firebase.push({
      host: authData.facebook.cachedUserProfile
    });
    this.props.history.push(this.props.history.createPath(`/host/${child.key()}`));
  }
  handleClick() {
    const authData = firebase.getAuth();
    if (authData) {
      this.handleAuth(authData);
    } else {
      firebase.authWithOAuthPopup('facebook', this.onFacebookAuth.bind(this));
    }
  }
  render() {
    return (
      <Grid>
        <PageHeader>
          <img className="pull-left" src="turkey.png" height="60" />
          Thanksgiving food list
          <Button className="pull-right" onClick={this.handleClick.bind(this)}>Hosting Thanksgiving?</Button>
        </PageHeader>
      </Grid>
    );
  }
}

Home.propTypes = {
  history: React.PropTypes.any.isRequired
};

export default Home;
