import React, { Component } from 'react';
import axios from 'axios';
import './RandomQuote.css';
import 'bootstrap/dist/css/bootstrap.css';

// SERVICES
import userService from '../services/userService';

class RegisterModal extends Component {
    handleSubmit(event) {
        event.preventDefault();

        const nickname = event.target.nickname.value;
        const password = event.target.password.value;

        // Register the user
        const user = {
          nickname: nickname,
          password: password
        };

        userService.postRegister(user).then(status => {
            if (status === 200) {
                // Pass the nickname of the connected user to the Home component
                this.props.onSubmit(
                    nickname
                );
                // Close the modal
                document.getElementById("closeRegisterModalButton").click();
            }
            else {
                console.log("An error occured when registering a new user (CODE:  " + status + ")");
            }
        })
    }

    render() {
        return(
            <div>
                <button type="button" className="btn btn-primary btn-lg" data-toggle="modal" data-target="#registerModal">
                Sign in
                </button>

                <div className="modal" id="registerModal">
                    <div className="modal-dialog" role="document">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title">Sign in to compete with other players!</h5>
                                <button id="closeRegisterModalButton" type="button" className="close" data-dismiss="modal" aria-label="Close">
                                    <span aria-hidden="true">&times;</span>
                                </button>
                            </div>
                            <div className="modal-body">
                                <form onSubmit = {this.handleSubmit.bind(this)}>
                                    <div className="form-group">
                                        <label htmlFor="nickname">Nickname</label>
                                        <input type="text" id="nicknameRegister" name="nickname" className="form-control" />
                                    </div>
                                    <div className="form-group">
                                        <label htmlFor="password">Password</label>
                                        <input type="password" id="passwordRegister" name="password" className="form-control" />
                                    </div>
                                    <button type="submit" id="submitRegister" className="btn btn-primary btn-block">Create account</button>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default RegisterModal;
