import React, { Component } from 'react';
import './Home.css';

// SERVICES
import scoreService from '../services/scoreService';

const TOP_USERS_TO_SHOW = 100;

class Rankings extends Component {
    constructor() {
        super();
        this.state = {
            topUsers: []
        };
    }

    componentDidMount() {
        // Retrieve users having the best scores
        scoreService.getTop(TOP_USERS_TO_SHOW)
            .then(topUsers => {
                this.setState({ topUsers : topUsers });
            })
            .catch(err => console.log("couldn't retrieve users: " + err));
    }

    renderUser(user, rank) {
        return (
            <tr key={user._id} className="list_item user">
                <th scope="row">#{rank+1}</th>
                <td className="user_name">{user.nickname}</td>
                <td>{user.score}</td>
            </tr>
        );
    }

    render() {
        if (this.state.topUsers && this.state.topUsers.length > 0) {
            return (
                <div className="row">
                    <div className="col-12">
                        <h2>- Top {TOP_USERS_TO_SHOW} Players -</h2>
                        <table className="table table-striped table-hover table-bordered list">
                            <thead>
                                <tr>
                                    <th scope="col">Rank</th>
                                    <th scope="col">Username</th>
                                    <th scope="col">Score</th>
                                </tr>
                            </thead>
                            <tbody>
                                {this.state.topUsers.map((user, index) => this.renderUser(user, index))}
                            </tbody>
                        </table>    
                    </div>
                </div>
            );
        }
        return (
            <div className="row">
                <div className="col-12">
                    <p>No users recorded.</p>
                </div>
            </div>
        );
    }
}

export default Rankings;
