import React, { Component } from 'react';
import axios from 'axios';
import './RandomQuote.css';
import 'bootstrap/dist/css/bootstrap.css';

class LoginModal extends Component {
    handleSubmit(event) {
        event.preventDefault();

        const nickname = event.target.nickname.value;
        const password = event.target.password.value;

        // Log in the user
        const user = {
          nickname: nickname,
          password: password
        };

        axios.post('/api/user/login', { user })
          .then(() => {
            // Pass the nickname of the connected user to the Home component
            this.props.onSubmit(
                nickname
            );
          }, err => {
            console.log("An error occured when loggin in: " + err);
          });

          // Close the modal
          document.getElementById("closeLoginModalButton").click();
    }

    render() {
        return(
            <div>
                <button type="button" className="btn btn-primary btn-lg" data-toggle="modal" data-target="#loginModal">
                Log in
                </button>

                <div className="modal" id="loginModal">
                    <div className="modal-dialog" role="document">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title">Log in to keep your results!</h5>
                                <button id="closeLoginModalButton" type="button" className="close" data-dismiss="modal" aria-label="Close">
                                    <span aria-hidden="true">&times;</span>
                                </button>
                            </div>
                            <div className="modal-body">
                                <form onSubmit = {this.handleSubmit.bind(this)}>
                                    <div className="form-group">
                                        <label htmlFor="nickname">Nickname</label>
                                        <input type="text" id="nicknameLogin" name="nickname" className="form-control" />
                                    </div>
                                    <div className="form-group">
                                        <label htmlFor="password">Password</label>
                                        <input type="password" id="passwordLogin" name="password" className="form-control" />
                                    </div>
                                    <button type="submit" id="submitLogin" className="btn btn-primary btn-block">Log in</button>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default LoginModal;
