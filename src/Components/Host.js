import Icon from 'react-fa';
import _ from 'lodash';
import React, {
  Component
} from 'react';
import {
  Button,
  ButtonInput,
  Grid,
  PageHeader,
  Input,
  ListGroup,
  ListGroupItem
} from 'react-bootstrap';
import Firebase from 'firebase';

const firebase = new Firebase('https://turkeylist.firebaseio.com/');

class Host extends Component {
  constructor() {
    super();
    this.state = {};
  }
  handleInputChange() {
    this.setState({
      input: this.refs.input.getValue()
    });
  }
  handleSubmit() {
    this.props.firebase.child('dishes').push({
      guest: firebase.getAuth().facebook.cachedUserProfile,
      name: this.state.input
    });
    this.setState({
      input: null
    });
  }
  handleShare(e) {
    e.preventDefault();
    FB.ui({
      method: 'send',
      link: window.location.href
    });
  }
  handleLogout() {
    this.props.firebase.unauth();
    window.location.reload();
  }
  handleRemoveDish(key, e) {
    e.preventDefault();
    this.props.firebase.child('dishes').child(key).remove();
  }
  render() {
    return (
      <Grid>
        <PageHeader>
          <img className="pull-left" src="turkey.png" height="60" />
          Thanksgiving food list
          <Button className="pull-right" onClick={this.handleLogout.bind(this)}>Logout</Button>
          <Button className="pull-right" onClick={this.handleShare.bind(this)}>Invite guests</Button>
        </PageHeader>
        <h3>Hosted by {this.props.host.first_name}</h3>
        <ListGroup>
          {_.map(this.props.dishes, (dish, key) => (
            <ListGroupItem key={key}>
              {dish.name} - {dish.guest.first_name}
              {firebase.getAuth().facebook.cachedUserProfile.id === dish.guest.id ? (
                <Button className="pull-right" bsSize="xsmall" onClick={this.handleRemoveDish.bind(this, key)}>
                  <Icon name="remove" remove/>
                </Button>
              ) : null}
            </ListGroupItem>
          ))}
        </ListGroup>
        <form>
          <Input
            type="text"
            value={this.state.input}
            placeholder="Green bean casserole perhaps?"
            label="Bringing a dish?"
            hasFeedback
            ref="input"
            groupClassName="group-class"
            labelClassName="label-class"
            onChange={this.handleInputChange.bind(this)} />
          <ButtonInput
            type="submit"
            value="Submit"
            bsSize="large"
            onClick={this.handleSubmit.bind(this)}
            disabled={!this.state.input} />
        </form>
      </Grid>
    );
  }
}

Host.defaultProps = {
  dishes: {}
};

Host.propTypes = {
  firebase: React.PropTypes.instanceOf(Firebase).isRequired,
  host: React.PropTypes.shape({
    first_name: React.PropTypes.string.isRequired,
    id: React.PropTypes.string.isRequired
  }).isRequired,
  dishes: React.PropTypes.objectOf(React.PropTypes.shape({
    name: React.PropTypes.string.isRequired,
    dish: React.PropTypes.string.isRequired
  }))
};

class FirebaseHost extends Component {
  constructor() {
    super();
    this.state = {
      value: null
    };
  }
  componentDidMount() {
    firebase.child(this.props.params.host).on('value', (snapshot) => {
      this.setState({
        value: snapshot.val()
      });
    });
  }
  componentWillReceiveProps(nextProps) {
    if (nextProps.params.host !== this.props.params.host) {
      firebase.child(this.props.params.host).off('value');
      firebase.child(nextProps.params.host).on('value', (snapshot) => {
        this.setState({
          value: snapshot.val()
        });
      });
    }
  }
  componentWillUnmount() {
    firebase.child(this.props.params.host).off('value');
  }
  render() {
    return this.state.value ? (
      <Host
        firebase={firebase.child(this.props.params.host)}
        {...this.state.value} />
    ) : null;
  }
}

FirebaseHost.propTypes = {
  params: React.PropTypes.shape({
    host: React.PropTypes.string.isRequired
  }).isRequired
};

export default FirebaseHost;
