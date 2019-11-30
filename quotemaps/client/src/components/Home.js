import React, { Component } from 'react';
import './Home.css';
import 'bootstrap/dist/css/bootstrap.css'
import RandomQuote from './RandomQuote';
import RegisterModal from './RegisterModal'
import LoginModal from './LoginModal'
import Logout from './Logout'

// SERVICES
import userService from '../services/userService';

function isEmpty(obj) {
  return Object.keys(obj).length === 0;
}

class Home extends Component {
  constructor() {
    super();
    this.state = { 
      usersList: [],
      user: {}
    };
  }

  componentDidMount() {
    // Retrieve all users
    if (this.state.usersList !== []) {
      userService.getAll()
        .then(usersList => {
          this.setState( { usersList });
        })
        .catch(err => console.log("couldn't retrieve users: " + err));
    }

    // If a user is logged in, update the state
    userService.getLoggedInUser()
      .then (user => {
        if (user !== undefined) {
          this.setState(() => ({
            usersList: this.state.usersList,
            user: { nickname: user.nickname}
          }));
        }
    });
  };

  handleLoginSubmit(nickname) {
    // If a user just logged in, update the state
    this.setState(() => ({
      usersList: this.state.usersList,
      user: { nickname: nickname}
    }));
  }

  handleLogoutSubmit() {
    this.setState(() => ({
        usersList: this.state.usersList,
        user: {}
    }));
  }

  // Add the new registered user to the list displayed
  handleRegisterSubmit(nickname) {
    const newUser = {
      _id: this.state.usersList.length,
      nickname
    }

    this.setState({ usersList: [...this.state.usersList, newUser] })
  }

  renderUser(user) {
    return (
      <li key={user._id} className="list_item user">
        <h3 className="user_name">{user.nickname}</h3>
      </li>
    );
  };

  renderWelcomeMsg() {
    if (!isEmpty(this.state.user)) {
      return(
        <h4> Welcome {this.state.user.nickname}!</h4>
      )
    }
  }

  renderLoginLogout() {
    if (isEmpty(this.state.user)) {
        return <LoginModal
            onSubmit = { this.handleLoginSubmit.bind(this) }
        />
    }
    else {
        return <Logout
            onSubmit = { this.handleLogoutSubmit.bind(this) }
        />
    }
  }

  render() {
    return (
      <div className="App">
        <div id="debug"> </div>
        <div className="App-header">
          <h2>Welcome to QuoteMaps</h2>
        </div>
        <div className="App-intro">
          QuoteMaps is a great app!
        </div>
        {this.renderWelcomeMsg()}
        <div className="container">
          <div className="row">
            <div className="col-6">
            {this.renderLoginLogout()}
            </div>
            <div className="col-6">
              <RegisterModal
                onSubmit = { this.handleRegisterSubmit.bind(this) }
              />
            </div>
          </div>
          <div className="row">
            <div className="col-12">
              Liste des utilisateurs enregistrés :
              <ul className="list">
                {(this.state.usersList && this.state.usersList.length > 0) ? (
                  this.state.usersList.map(user => this.renderUser(user))
                ) : (
                    <p>Pas d'utilisateurs enregistrés</p>
                  )}
              </ul>
            </div>
          </div>
        </div>
        <RandomQuote/>
      </div>
    );
  }
}

export default Home;