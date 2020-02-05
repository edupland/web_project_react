import React, { Component } from 'react';
import './QuoteGame.css';
import 'bootstrap/dist/css/bootstrap.css';

// SERVICES
import userService from '../services/userService';

class RegisterModal extends Component {
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

        // Register the user
        const user = {
          nickname: nickname,
          password: password
        };

        userService.postRegister(user).then(res => {
            if (res.status === 200) {
                // Close the modal
                document.getElementById("closeRegisterModalButton").click();
            }
            else {
                this.setState(() => ({
                    showError : true,
                    errorMsg : res.statusText
                }));
            }
        }, err => {
            console.log("An error occured when registering: " + err);
        });
    }

    render() {
        return(
            <div>
                <button type="button" className="btn-success big-btn" data-toggle="modal" data-target="#registerModal">
                    Sign up
                </button>

                <div className="modal" id="registerModal">
                    <div className="modal-dialog" role="document">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title">Sign up to compete with other players!</h5>
                                <button id="closeRegisterModalButton" type="button" className="close" data-dismiss="modal" aria-label="Close">
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
                                        <input type="text" id="nicknameRegister" name="nickname" className="form-control" />
                                    </div>
                                    <div className="form-group">
                                        <label htmlFor="password">Password</label>
                                        <input type="password" id="passwordRegister" name="password" className="form-control" />
                                    </div>
                                    <button type="submit" id="submitRegister" className="btn btn-success btn-block">Create account</button>
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
