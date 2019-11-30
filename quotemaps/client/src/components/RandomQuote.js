import React, { Component } from 'react';
import './RandomQuote.css';
import 'bootstrap/dist/css/bootstrap.css';
const url = "https://quote-garden.herokuapp.com/quotes/random";

let rightAnswer = "";

function getRandomQuote() {
    fetch(url)
        .then((resp) => resp.json())
        .then((json) => displayQuote(json))
        .catch((err) => console.log("Fetch Error " + err));
}

function checkAnswer(place) {
    let answerSelected = document.getElementById("place" + place).textContent;

    if (answerSelected === rightAnswer) {
        document.getElementById("helper").textContent = "Congratulations! That's right!";
    } else {
        document.getElementById("helper").textContent = "No, that's wrong...";
    }

    for (let i = 1; i <= 4; ++i) {
        document.getElementById("btn" + i).disabled = true;
    }
}

function displayQuote(json) {
    console.log(json);
    let quoteText = json.quoteText;
    let quoteAuthor = json.quoteAuthor;
    rightAnswer = quoteAuthor;

    /* Prevent to display a quote with no author known. */
    if (quoteAuthor === "") {
        getRandomQuote();
        return;
    }

    document.getElementById("quote-div").textContent = quoteText;
    document.getElementById("helper").textContent = "Who said that?";
    let rightAnswerPlace = Math.floor(Math.random() * Math.floor(4)) + 1;
    console.log("rightAnswerPlace: " + rightAnswerPlace);

    for (let i = 1; i <= 4; ++i) {
        document.getElementById("btn" + i).disabled = false;
        if (i === rightAnswerPlace) {
            document.getElementById("place" + i).textContent = quoteAuthor;
        }
        else {
            fetch(url)
                .then((resp) => resp.json())
                .then((json) => setWrongAnswer(json, i))
                .catch((err) => console.log("Fetch Error " + err));
        }
    }
}

function setWrongAnswer(json, place) {
    if (json.quoteAuthor === "") {
        fetch(url)
            .then((resp) => resp.json())
            .then((newJson) => setWrongAnswer(newJson, place))
            .catch((err) => console.log("Fetch Error " + err));
        return;
    }

    let isUnique = true;
    for (let i = 1; i < place; ++i) {
        let prevAnswer = document.getElementById("place" + i).textContent;
        if (json.quoteAuthor === prevAnswer) {
            isUnique = false;
        }
    }
    if (!isUnique) {
        fetch(url)
            .then((resp) => resp.json())
            .then((newJson) => setWrongAnswer(newJson, place))
            .catch((err) => console.log("Fetch Error " + err));
        return;
    }
    document.getElementById("place" + place).textContent = json.quoteAuthor;
}

class RandomQuote extends Component {
    render() {
        return (
            <div className="container">
                <div className="row">
                    <div className="col-12">
                        <button className="btn btn-success btn-lg" type="button" onClick={getRandomQuote}>Gimme a quote!</button>
                    </div>
                </div>

                <div className="row">
                    <div className="col-12">
                        <div id="quote-div"></div>
                    </div>
                </div>

                <div className="row">
                    <div className="col-12">
                        <h3 id="helper"></h3>
                    </div>
                </div>

                <div className="row justify-content-center">
                    <div className="col-8">
                        <div className="row">
                            <div className="col-6">
                                <button className="btn btn-warning btn-lg" type="button" id="btn1" onClick={() => checkAnswer(1)}><div id="place1">-</div></button>
                            </div>
                            <div className="col-6">
                                <button className="btn btn-warning btn-lg" type="button" id="btn2" onClick={() => checkAnswer(2)}><div id="place2">-</div></button>
                            </div>
                        </div>
                        <div className="row">
                            <div className="col-6">
                                <button className="btn btn-warning btn-lg" type="button" id="btn3" onClick={() => checkAnswer(3)}><div id="place3">-</div></button>
                            </div>
                            <div className="col-6">
                                <button className="btn btn-warning btn-lg" type="button" id="btn4" onClick={() => checkAnswer(4)}><div id="place4">-</div></button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default RandomQuote;