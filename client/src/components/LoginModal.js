import React, { Component } from 'react';
import PropTypes from 'prop-types';
import './QuoteGame.css';
import './Home.css';
import 'bootstrap/dist/css/bootstrap.css';

// SERVICES
import userService from '../services/userService';

class LoginModal extends Component {
    constructor() {
        super();
        this.state = { 
            showError : false,
            errorMsg : ""
        };
    }

    handleCloseErrorMessage(event) {
        event.preventDefault();

        this.setState(() => ({
            showError : false
        }));
    }

    handleSubmit(event) {
        event.preventDefault();

        const nickname = event.target.nickname.value;
        const password = event.target.password.value;

        // Log in the user
        const userCredentials = {
          nickname: nickname,
          password: password
        };

        userService.postLogin(userCredentials).then(res => {
            if (res.status === 200) {
                // Close the modal
                document.getElementById("closeLoginModalButton").click();

                // Calls handleLoginSubmit from the parent component Home
                this.props.onSubmit();
            }
            else {
                this.setState(() => ({
                    showError : true,
                    errorMsg : res.statusText
                }));
            }
            
        }, err => {
            console.log("An error occured when loggin in: " + err);
        });
    }

    render() {
        return(
            <div>
                <button type="button" className="btn-success big-btn" data-toggle="modal" data-target="#loginModal">
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

                            {
                                this.state.showError && 
                                <div className="alert alert-dismissible alert-danger">{this.state.errorMsg}
                                    <button type="button" className="close" onClick={this.handleCloseErrorMessage.bind(this)}>&times;</button>
                                </div>
                            }

                            <div className="modal-body">
                                <form onSubmit = {this.handleSubmit.bind(this)}>
                                    <div className="form-group">
                                        <label htmlFor="nickname">Username</label>
                                        <input type="text" id="nicknameLogin" name="nickname" className="form-control" />
                                    </div>
                                    <div className="form-group">
                                        <label htmlFor="password">Password</label>
                                        <input type="password" id="passwordLogin" name="password" className="form-control" />
                                    </div>
                                    <button type="submit" id="submitLogin" className="btn btn-success btn-block">Log in</button>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

LoginModal.propTypes = {
    onSubmit: PropTypes.func.isRequired
};

export default LoginModal;
