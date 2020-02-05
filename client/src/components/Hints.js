import React, { Component } from 'react';
import GoogleMapReact from 'google-map-react';
import PropTypes from 'prop-types';
import 'bootstrap/dist/css/bootstrap.css';

const API_KEY = `${process.env.REACT_APP_GOOGLE_API_KEY}`;

let mapHintUsed = false;
let dateHintUsed = false;
let halfHintUsed = false;

class Hints extends Component {

    useMapHint() {
        if (!mapHintUsed) {
            mapHintUsed = true;
            this.props.increaseUsedHintsNum();
        }
        this.forceUpdate();
    }

    useDateHint() {
        if (!dateHintUsed) {
            dateHintUsed = true;
            this.props.increaseUsedHintsNum();
        }
        this.forceUpdate();
    }

    useHalfHint() {
        if (!halfHintUsed) {
            halfHintUsed = true;
            this.props.increaseUsedHintsNum();
        }
        this.props.halfAnswers();
    }

    reset() {
        mapHintUsed = false;
        dateHintUsed = false;
        halfHintUsed = false;
    }

    render() {
        return (
            <div>
                <div className="row">
                    <div className="col-md-4">
                        <button className="btn-outline-dark btn-lg" type="button" id="mapBtn" onClick={() => this.useMapHint()} data-toggle="modal" data-target="#mapModal">
                            Show birth location
                </button>
                    </div>
                    <div className="col-md-4">

                        <button className="btn-outline-dark btn-lg" type="button" id="dateBtn" onClick={() => this.useDateHint()} data-toggle="modal" data-target="#birthModal">
                            Show birth date
                </button>
                    </div>

                    <div className="col-md-4">

                        <button className="btn-outline-dark btn-lg" type="button" id="halfAnswers" onClick={() => this.useHalfHint()}>
                            50/50
                </button>
                    </div>

                </div>
                <div className="modal" id="mapModal">
                    <div className="modal-dialog modal-lg" role="document">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title">Birth location - This author is born in {this.props.authorData.birthCity}, {this.props.authorData.birthCountry}.</h5>
                                <button id="closeMapModalButton" type="button" className="close" data-dismiss="modal" aria-label="Close">
                                    <span aria-hidden="true">&times;</span>
                                </button>
                            </div>
                            <div className="modal-body">
                                <div style={{ height: '100vh', width: '100%' }}>
                                    <GoogleMapReact
                                        bootstrapURLKeys={{ key: API_KEY }}
                                        center={this.props.authorData.location}
                                        defaultZoom={12}
                                        options={function () { return { mapTypeId: "hybrid" } }}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="modal" id="birthModal">
                    <div className="modal-dialog modal-lg" role="document">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title">Birth date</h5>
                                <button id="closeMapModalButton" type="button" className="close" data-dismiss="modal" aria-label="Close">
                                    <span aria-hidden="true">&times;</span>
                                </button>
                            </div>
                            <div className="modal-body">
                                This author is born the {this.props.authorData.birthYear}.
                            </div>
                        </div>
                    </div>
                </div>

                <div className="modal" id="halfModal">
                    <div className="modal-dialog modal-lg" role="document">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title">50/50</h5>
                                <button id="closeMapModalButton" type="button" className="close" data-dismiss="modal" aria-label="Close">
                                    <span aria-hidden="true">&times;</span>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

            </div>
        );
    }
}

Hints.propTypes = {
    authorData: PropTypes.object.isRequired
};

export default Hints;
