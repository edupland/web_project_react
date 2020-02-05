import React, { Component } from 'react';
import Hints from './Hints';
import './QuoteGame.css';
import 'bootstrap/dist/css/bootstrap.css';
import PropTypes from 'prop-types';

const url = "https://quote-garden.herokuapp.com/quotes/random";

let quote = "";
let rightAnswer = "";
let answerSelected = "";
let answers = ["", "", "", ""];

let disabled = true;
let justAnswered = false;
let searching = false;
let initialized = false;

const AWARDED_POINTS_NO_HINT = 10;
const AWARDED_POINTS_ONE_HINT = 5;
const AWARDED_POINTS_TWO_HINTS = 2;
const AWARDED_POINTS_THREE_HINTS = 0;

let usedHintsNum = 0;

let authorData = {
    location: { lat: 59.95, lng: 30.33 },
    birthCity: "",
    birthCountry: "",
    birthYear: ""
}

class SPARQLQueryDispatcher {
    constructor(endpoint) {
        this.endpoint = endpoint;
    }

    async query(sparqlQuery) {
        const fullUrl = this.endpoint + '?query=' + encodeURIComponent(sparqlQuery);
        const headers = { 'Accept': 'application/sparql-results+json' };

        return await fetch(fullUrl, { headers }).then(body => body.json());
    }
}

class QuoteGame extends Component {

    async initializeGame() {
        quote = "";
        rightAnswer = "";
        answerSelected = "";
        answers = ["", "", "", ""];
        searching = true;
        disabled = true;
        initialized = false;
        usedHintsNum = 0;

        if (this.refs.hintsComp !== undefined) {
            this.refs.hintsComp.reset();
        }

        this.forceUpdate();

        await fetch(url)
            .then((resp) => resp.json())
            .then((json) => this.checkIfAuthorIsValid(json))
            .catch((err) => console.log("Fetch Error " + err));
    }

    async checkIfAuthorIsValid(json) {
        rightAnswer = json.quoteAuthor;
        quote = json.quoteText;

        let isValid = await this.getBirthLoc();

        if (!isValid) {
            this.initializeGame();
        }
        else {
            this.getRandomQuote();
        }
    }

    async getRandomQuote() {
        /* Prevent to display a quote with no author known. */
        if (rightAnswer === "") {
            this.initializeGame();
            return;
        }

        let rightAnswerPlace = Math.floor(Math.random() * Math.floor(4));
        answers[rightAnswerPlace] = rightAnswer;

        for (let i = 0; i <= 3; ++i) {
            if (i !== rightAnswerPlace) {
                await fetch(url)
                    .then((resp) => resp.json())
                    .then((json) => this.setWrongAnswer(json, i))
                    .catch((err) => console.log("Fetch Error " + err));
            }
        }

        disabled = false;
        searching = false;
        initialized = true;
        this.forceUpdate();
    }

    async setWrongAnswer(json, place) {
        /* Prevent to set a wrong answer which is an empty string. */
        if (json.quoteAuthor === "" || json.quoteAuthor === rightAnswer) {
            await fetch(url)
                .then((resp) => resp.json())
                .then((newJson) => this.setWrongAnswer(newJson, place))
                .catch((err) => console.log("Fetch Error " + err));
            return;
        }

        /* Check if the wrong answer is not already set. */
        let isUnique = true;
        for (let i = 0; i < place; ++i) {
            if (json.quoteAuthor === answers[i] && i !== place) {
                isUnique = false;
            }
        }

        /* Prevent to set a duplicated wrong answer. */
        if (!isUnique) {
            await fetch(url)
                .then((resp) => resp.json())
                .then((newJson) => this.setWrongAnswer(newJson, place))
                .catch((err) => console.log("Fetch Error " + err));
            return;
        }

        answers[place] = json.quoteAuthor;
    }

    async getBirthLoc() {
        const endpointUrl = 'https://query.wikidata.org/sparql';
        const wikidataRequestAuthor = `SELECT DISTINCT ?item  ?coordinates ?birthLocationLabel ?countryLabel  ?birthYear WHERE {
            ?item (wdt:P31|wdt:P101|wdt:P106)/wdt:P279* wd:Q482980 ;
            rdfs:label "` + rightAnswer + `"@en ;
            wdt:P19 ?birthLocation .
            ?birthLocation wdt:P625 ?coordinates.
            ?birthLocation wdt:P17 ?country.
            ?item wdt:P569 ?birthYear .
            SERVICE wikibase:label { bd:serviceParam wikibase:language "en". }
        }`

        const wikidataRequestGeneral = `SELECT DISTINCT  ?item ?coordinates ?birthLocationLabel ?countryLabel ?birthYear  WHERE {
            ?item 
            rdfs:label "` + rightAnswer + `"@en ;
            wdt:P19 ?birthLocation .
            ?birthLocation wdt:P625 ?coordinates.
            ?birthLocation wdt:P17 ?country.
            ?item wdt:P569 ?birthYear .
            SERVICE wikibase:label { bd:serviceParam wikibase:language "en". }
        }`

        let queryDispatcher = new SPARQLQueryDispatcher(endpointUrl);
        let promiseValue;

        await queryDispatcher.query(wikidataRequestAuthor)
            .then(function (val) { promiseValue = val; })
            .catch(err => console.warn(err));

        /* If no 'author' found on Wikidata, try finding a 'human'. */
        if (promiseValue.results.bindings[0] === undefined) {
            queryDispatcher = new SPARQLQueryDispatcher(endpointUrl);
            await queryDispatcher.query(wikidataRequestGeneral)
                .then(function (val) { promiseValue = val; })
                .catch(err => console.warn(err));
        }

        /* Restart game if author name cannot be found on Wikidata. */
        if (promiseValue.results.bindings[0] === undefined) {
            return false;
        }

        /* Check if there is only one 'human' found. */
        if (promiseValue.results.bindings.length > 1) {
            let currentAutor = promiseValue.results.bindings[0].item.value;
            for (let i = 1; i < promiseValue.results.bindings.length; ++i) {
                /* Restart game if there are more than one 'human'. */
                if (currentAutor !== promiseValue.results.bindings[i].item.value) {
                    return false;
                }
            }
        }

        let coord = promiseValue.results.bindings[0].coordinates.value;
        coord = coord.substring(6, coord.length - 1);
        coord = coord.split(" ");

        authorData.birthCity = promiseValue.results.bindings[0].birthLocationLabel.value;
        authorData.birthCountry = promiseValue.results.bindings[0].countryLabel.value;
        authorData.location.lat = Number(coord[1]);
        authorData.location.lng = Number(coord[0]);
        let months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
        let month;
        let day;
        let year;
        let test = promiseValue.results.bindings[0].birthYear.value.split("T");

        if (test[0].substring(0, 1) === "-") {
            year = test[0].substring(0, 5);
            month = months[Number(test[0].substring(6, 8)) - 1];
            day = test[0].substring(9);

        }
        else {
            test = test[0].split("-");
            year = test[0];
            month = months[Number(test[1]) - 1];
            day = test[2];
        }

        authorData.birthYear = day + " " + month + " " + year;


        return true;
    }

    halfAnswers() {
        let rand = Math.floor(Math.random() * Math.floor(2))
        let cpt = 2;
        if (rand === 0) {
            for (let i = 0; i < answers.length; i++) {
                if (rightAnswer !== answers[i] && cpt > 0) {
                    document.getElementById("btn" + i).hidden = true;
                    cpt--;
                }
            }
        }

        else {
            for (let i = answers.length - 1; i > 0; i--) {
                if (rightAnswer !== answers[i] && cpt > 0) {
                    document.getElementById("btn" + i).hidden = true;
                    cpt--;
                }
            }
        }
        document.getElementById("halfAnswers").textContent = " ̶5̶0̶/̶5̶0̶";
        document.getElementById("halfAnswers").disabled = true;
        this.forceUpdate();
    }

    increaseUsedHintsNum() {
        ++usedHintsNum;
    }

    checkAnswer(place) {
        justAnswered = true;
        answerSelected = answers[place];
        disabled = true;
        this.forceUpdate();
    }

    getAwardedPoints(usedHintsNum) {
        switch (usedHintsNum) {
            case 0:
                return AWARDED_POINTS_NO_HINT;

            case 1:
                return AWARDED_POINTS_ONE_HINT;

            case 2:
                return AWARDED_POINTS_TWO_HINTS;

            default:
                return AWARDED_POINTS_THREE_HINTS;
        }
    }

    renderHints() {
        if (!initialized) {
            return (<div></div>);
        }
        return (<Hints
            ref="hintsComp"
            authorData={authorData}
            increaseUsedHintsNum={this.increaseUsedHintsNum.bind(this)}
            halfAnswers={this.halfAnswers.bind(this)}
        />);
    }

    renderQuoteMsg() {
        if (!initialized) {
            return (<div> </div>);
        }
        return (<div id="quote">{quote}</div>);
    }

    renderHelperMsg() {
        if (searching) {
            return (<h3>Looking for a good quote...</h3>);
        }
        if (!initialized) {
            return (<h3>-</h3>);
        }
        if (answerSelected === "") {
            return (<h3>Who said that?</h3>);
        }
        if (answerSelected === rightAnswer) {
            let points = this.getAwardedPoints(usedHintsNum);
            if (justAnswered) {
                this.props.onCorrectAnswer(points);
                justAnswered = false;
            }

            let congratulateMsg = <h3>Congratulations! That{'\''}s right!</h3>;
            if (this.props.isUserLoggedin()) {
                congratulateMsg = <h3>Congratulations! That{'\''}s right!<br />You won... {points} points!</h3>;
            }
            return (congratulateMsg);
        }
        return (<h3>No, that{'\''}s wrong...<br />The answer was... {rightAnswer}!</h3>);
    }

    renderAnswersBtn() {
        if (!initialized) {
            return (<div className="col-8"><div className="row"></div></div>);
        }
        return (
            <div className="col-8">
                <div className="row">
                    <div className="col-6">
                        <button className="btn btn-warning btn-answer" id="btn0" type="button" onClick={() => this.checkAnswer(0)} disabled={disabled}>{answers[0]}</button>
                    </div>
                    <div className="col-6">
                        <button className="btn btn-warning btn-answer" id="btn1" type="button" onClick={() => this.checkAnswer(1)} disabled={disabled}>{answers[1]}</button>
                    </div>
                </div>
                <div className="row">
                    <div className="col-6">
                        <button className="btn btn-warning btn-answer" id="btn2" type="button" onClick={() => this.checkAnswer(2)} disabled={disabled}>{answers[2]}</button>
                    </div>
                    <div className="col-6">
                        <button className="btn btn-warning btn-answer" id="btn3" type="button" onClick={() => this.checkAnswer(3)} disabled={disabled}>{answers[3]}</button>
                    </div>
                </div>
                <div className="row">
                    <div className="col-12">
                        <h3>- Hints -</h3>
                    </div>
                </div>
            </div>
        );
    }

    render() {
        let score;
        if (this.props.isUserLoggedin()) {
            score = <h4>Your score: {this.props.userScore}</h4>;
        }
        return (
            <div className="container">

                <div className="row" className="col-12">{score}<br /></div>

                <div className="row">
                    <div className="col-12">
                        <button className="btn btn-success btn-lg" type="button" onClick={() => this.initializeGame()}>Gimme a quote!</button>
                    </div>
                </div>

                <div id="framed">

                    <div className="row">
                        <div className="col-12">
                            {this.renderQuoteMsg()}
                        </div>
                    </div>

                    <div className="row">
                        <div className="col-12">
                            {this.renderHelperMsg()}
                        </div>
                    </div>

                    <div className="row justify-content-center">
                        {this.renderAnswersBtn()}
                    </div>

                    {this.renderHints()}
                </div>
            </div>
        );
    }
}

QuoteGame.propTypes = {
    onCorrectAnswer: PropTypes.func.isRequired,
    isUserLoggedin: PropTypes.func.isRequired
};

export default QuoteGame;
