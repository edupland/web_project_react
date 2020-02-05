import React, { Component } from 'react';
import './QuoteGame.css';
import 'bootstrap/dist/css/bootstrap.css';


class RulesModal extends Component {
    constructor() {
        super();
        this.state = {
            showError: false
            //errorMsg: ""
        };
    }

    handleCloseErroMessage(event) {
        event.preventDefault();

        this.setState(() => ({
            showError: false
        }));
    }

    render() {
        return (
            <div>
                <button type="button" className="btn-outline-dark btn-rankings" data-toggle="modal" data-target="#rulesModal">
                    Rules
                </button>
                <div className="modal" id="rulesModal">
                    <div className="modal-dialog" role="document">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title">Rules of the game</h5>
                                <button id="closeRulesModalButton" type="button" className="close" data-dismiss="modal" aria-label="Close">
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
                                <p>The rules are very simple.<br/>
                                A famous quote is displayed and you have to guess the author of that quote from a list of four authors.<br/><br/>
                                For every correct answer without using any hint, you receive 10 points.<br/><br/>
                                If you use one hint, you receive 5 points, and if you use two hints, you only receive 2 points. 
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default RulesModal;