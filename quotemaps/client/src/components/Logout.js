import React, { Component } from 'react';
import './RandomQuote.css';
import 'bootstrap/dist/css/bootstrap.css';

// SERVICES
import userService from '../services/userService';

class Logout extends Component {

    handleSubmit(event) {
        event.preventDefault();

        userService.getLogout().then(() => {
            this.props.onSubmit();
        }, err => {
            console.log("An error occured when loggin in: " + err);
        });
    }

    render() {
        return(
            <form onSubmit = {this.handleSubmit.bind(this)}>
                <button type="submit" className="btn btn-primary btn-lg">Log out</button>
            </form>
        );
    }
}

export default Logout;