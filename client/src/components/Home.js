import React, { Component } from 'react';
import './Home.css';
import 'bootstrap/dist/css/bootstrap.css'
import QuoteGame from './QuoteGame';
import RegisterModal from './RegisterModal'
import LoginModal from './LoginModal';
import RulesModal from './RulesModal';
import Logout from './Logout';
import Rankings from './Rankings';

/* SERVICES */
import userService from '../services/userService';
import scoreService from '../services/scoreService';

class Home extends Component {
    constructor() {
        super();
        this.state = {
            user: {},
            gotLoggedInUser: false,
            playing: false,
            rankingsDisplay: false
        };
    }

    isUserLoggedin() {
        return this.state.user.nickname !== undefined
    }

    componentDidMount() {
        /* If a user is logged in, update the state */
        userService.getLoggedInUser()
            .then(res => {
                let userNickname;
                let userScore;

                if (res.status === 200) {
                    userNickname = res.data.nickname;
                    userScore = res.data.score;
                }

                this.setState(() => ({
                    user: {
                        nickname: userNickname,
                        score: userScore
                    },
                    gotLoggedInUser: true
                }));
            })
            .catch(err => console.log("An error occured when retrieving the logged in user: " + err));
    }

    handleLoginSubmit() {
        /* If a user just logged in, update the state */
        userService.getLoggedInUser()
            .then(res => {
                if (res.status === 200) {
                    const userNickname = res.data.nickname;
                    const userScore = res.data.score;

                    this.setState(() => ({
                        user: {
                            nickname: userNickname,
                            score: userScore
                        }
                    }));
                }
            });
    }

    handleLogoutSubmit() {
        this.setState(() => ({
            user: {}
        }));
    }

    renderUserScore() {
        return (
            <div>
                <h4>Logged in as {this.state.user.nickname}</h4>
                <h5>Score: {this.state.user.score}</h5>
            </div>
        );
    }

    renderCenterContent() {
        if (!this.isUserLoggedin()) {
            return (
                <div className="container vertical-center">
                    <div className="col-12">
                        <div className="row">
                            <div className="col-12">
                                <h1 className="catchphrase">Welcome to <span id="App-title">QuoteMaps</span> !</h1>
                                <p id="rules">
                                    QuoteMaps is a quiz game where you have to find out who is the author of a given popular quote.<br />
                                    You do not have to create an account to play, but your score will not be recorded if you are not logged in!
                                </p>
                            </div>
                        </div>
                        <div className="row">
                            <div className="col-12">
                                <button type="button" className="btn-outline-success big-btn-outline" onClick={() => this.playWithoutLogIn()}>
                                    Play
                                </button>
                            </div>
                        </div>
                        <div className="row">
                            <div className="col-12">
                                <button type="button" className="btn-outline-dark btn-rankings" onClick={() => this.displayRankings()}>
                                    Display Rankings
                                </button>
                            </div>
                        </div>
                        <div className="row">
                            <div className="col-12">
                                <RulesModal />
                            </div>
                        </div>
                    </div>
                </div >
            );
        }
        return (
            <div className="container">
                <div className="col-12">
                    <div className="row">
                        <div className="col-12">
                            <button type="button" className="btn-outline-success big-btn-outline" onClick={() => this.playWithoutLogIn()}>
                                Play
                                </button>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-12">
                            <button type="button" className="btn-outline-dark btn-rankings" onClick={() => this.displayRankings()}>
                                Display Rankings
                                </button>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-12">
                            <RulesModal />
                        </div>
                    </div>
                </div>
            </div >
        );
    }

    renderLoginLogout() {
        if (!this.isUserLoggedin()) {
            return (
                <div className="row">
                    <div className="col-6">
                        <LoginModal onSubmit={this.handleLoginSubmit.bind(this)} />
                    </div>
                    <div className="col-6">
                        <RegisterModal />
                    </div>
                </div>
            );
        }
        else {
            return (
                <div>
                    <div className="row">
                        <div className="col-12">
                            <Logout onSubmit={this.handleLogoutSubmit.bind(this)} />
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-12">
                            {this.renderUserScore()}
                        </div>
                    </div>
                </div>
            );
        }
    }

    renderRules() {
        return (
            <div>
                <div className="row">
                    <div className="col-6">
                        <RulesModal />
                    </div>
                </div>
            </div>
        )

    }

    handleCorrectAnswer(awardedPoints) {
        if (this.isUserLoggedin()) {
            scoreService.postScore(awardedPoints).then(res => {
                if (res.status === 200) {
                    const newScore = res.data.newScore;

                    this.setState(() => ({
                        user: {
                            nickname: this.state.user.nickname,
                            score: newScore
                        }
                    }));
                }
                else {
                    console.log("An error occured server-side");
                }
            });
        }
    }

    renderReturnComponent() {
        return (
            <div className="row">
                <div className="col-12">
                    <button type="button" className="btn-outline-dark" onClick={() => this.goBackToHome()}>
                        Return
                    </button>
                </div>
            </div>
        );
    }

    playWithoutLogIn() {
        this.setState(() => ({
            playing: true
        }));
    }

    displayRankings() {
        this.setState(() => ({
            rankingsDisplay: true
        }));
    }

    goBackToHome() {
        this.setState(() => ({
            playing: false,
            rankingsDisplay: false
        }));
    }

    renderPage() {
        if (this.state.playing) {
            if (this.isUserLoggedin()) {
                return (
                    <div className="container">
                        {this.renderReturnComponent()}
                        <QuoteGame onCorrectAnswer={this.handleCorrectAnswer.bind(this)} isUserLoggedin={this.isUserLoggedin.bind(this)} userScore={this.state.user.score} />
                    </div>
                );
            }
            return (
                <div className="container">
                    {this.renderReturnComponent()}
                    <QuoteGame onCorrectAnswer={this.handleCorrectAnswer.bind(this)} isUserLoggedin={this.isUserLoggedin.bind(this)} />
                </div>
            );
        }
        if (this.state.rankingsDisplay) {
            return (
                <div className="container">
                    {this.renderReturnComponent()}
                    <Rankings />
                </div>
            );
        }
        if (this.state.gotLoggedInUser) {
            return (
                <div className="container">
                    <div className="container">
                        <div className="col-12">
                            {this.renderLoginLogout()}
                        </div>
                    </div>
                    {this.renderCenterContent()}
                </div >
            );
        }
    }

    render() {
        return (
            <div className="App">
                <div id="debug"> </div>
                <div className="App-header">
                    <img src={process.env.PUBLIC_URL + 'logo.png'} alt="logo" />
                </div>
                {this.renderPage()}
            </div>
        );
    }
}

export default Home;