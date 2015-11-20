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
import {
  Link
} from 'react-router';
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
    console.log();
    const name = firebase.getAuth().facebook.cachedUserProfile.first_name;
    this.props.firebase.child('dishes').push({
      name: name,
      dish: this.state.input
    });
    this.setState({
      input: null
    });
  }
  handleRemoveDish(key, e) {
    console.log('handleRemoveDish', key);
    this.props.firebase.child('dishes').child(key).remove();
  }
  render() {
    const {
      firebase,
      ...props
    } = this.props;
    return (
      <Grid>
        <PageHeader>Thanksgiving food list</PageHeader>
        <h3>Hosted by {this.props.host}</h3>
        <ListGroup>
          {_.map(this.props.dishes, (dish, key) => (
            <ListGroupItem key={key}>
              {dish.dish} - {dish.name}
              <a>
                <Icon name="remove" remove className="pull-right" onClick={this.handleRemoveDish.bind(this, key)}/>
              </a>
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
  host: React.PropTypes.string.isRequired,
  dishes: React.PropTypes.objectOf(React.PropTypes.shape({
    name: React.PropTypes.string.isRequired,
    dish: React.PropTypes.string.isRequired
  }))
};

export default class FirebaseHost extends Component {
  constructor() {
    super();
    this.state = {
      value: null
    };
  }
  componentDidMount() {
    firebase.child(this.props.params.host).on('value', function (snapshot) {
      this.setState({
        value: snapshot.val()
      });
    }.bind(this));
  }
  componentWillReceiveProps(nextProps) {
    if (nextProps.params.host !== this.props.params.host) {
      firebase.child(this.props.params.host).off('value');
      firebase.child(nextProps.params.host).on('value', function (snapshot) {
        this.setState({
          value: snapshot.val()
        });
      }.bind(this));
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
