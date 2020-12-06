import Link from "next/link";
import React, { useEffect, useState } from "react";
import Layout from "../components/Layout";

function Quiz({ questions }) {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [showScore, setShowScore] = useState(false);
  const [score, setScore] = useState(0);
  const timer = 15;
  const [timeLeft, setTimeLeft] = useState(timer);
  const [lifelineExtraTime, setLifelineExtraTime] = useState(false);
  const [lifelineFifty, setLifelineFifty] = useState(false);
  const [lifelineFiftyUsed, setLifelineFiftyUsed] = useState(false);

  const correctAnswer = [questions[currentQuestion].correct_answer];
  const incorrectAnswers = questions[currentQuestion].incorrect_answers;
  const allAnswers = correctAnswer.concat(incorrectAnswers);
  const pair = correctAnswer.concat(incorrectAnswers[0]);

  const wrongAnswers = questions.length - score;
  const rightAnswers = questions.length - wrongAnswers;

  // Handle the 50/50 lifeline

  const handleLifelineFifty = () => {
    setLifelineFiftyUsed(true);
    setLifelineFifty(true);
  };

  // Handle the extra time lifeline
  const handleLifelineExtraTime = () => {
    if (lifelineExtraTime == false) {
      setTimeLeft(timeLeft + 10);
    }
    setLifelineExtraTime(true);
  };

  //Set off and handle timer
  useEffect(() => {
    if (timeLeft === 0) {
      setTimeLeft(0);
    }
    if (!timeLeft) return;

    const intervalId = setTimeout(() => {
      setTimeLeft(timeLeft - 1);
    }, 1000);

    return () => clearInterval(intervalId);
  }, [timeLeft]);

  //Check answers and move on to the next question
  const nextQuestion = currentQuestion + 1;
  const handleNextQuestion = (e) => {
    let elem = e.currentTarget;
    let corr = elem.dataset.answer;
    if (corr == correctAnswer[0]) {
      setScore(score + 1);
    }
    if (nextQuestion < questions.length) {
      setCurrentQuestion(nextQuestion);
      console.log(score);
      setTimeLeft(timer);
      setLifelineFifty(false);
    } else {
      setShowScore(true);
    }
  };

  return (
    <Layout>
      <section className="max-w-4xl mx-auto p-4">
        <div className="flex flex-row space-x-8 items-center text-4xl font-bold">
          <div className="text-green-600 p-4">
            <p>{showScore ? "Score: " + score : ""}</p>
            {showScore == true && (
              <div>
                <p>Right answers: {rightAnswers}</p>
                <p>Wrong answers: {wrongAnswers}</p>
              </div>
            )}
          </div>
        </div>
        {showScore ? (
          true
        ) : (
          <>
            <div className="flex flex-row mx-auto text-center my-8 justify-between items-center p-4">
              <div className="w-2/12 text-left text-2xl">
                {currentQuestion + 1} / {questions.length}
              </div>
              <div className="w-7/12">
                <div
                  className="text-4xl font-bold"
                  dangerouslySetInnerHTML={{
                    __html: questions[currentQuestion].question,
                  }}
                />
              </div>
              <div className="w-2/12 text-right">
                <div className="timer text-2xl">{timeLeft}</div>
              </div>
            </div>

            <div
              id="lifelines"
              className="flex flex-row justify-center space-x-8"
            >
              <button
                onClick={handleLifelineExtraTime}
                className={`bg-green-500 p-4 ${
                  lifelineExtraTime == false ? `text-white` : `text-gray-300`
                }`}
              >
                Add 10 Secs
              </button>
              <button
                disabled={lifelineFiftyUsed}
                onClick={handleLifelineFifty}
                className={`bg-green-500 p-4 ${
                  lifelineFiftyUsed == true ? `text-gray-300` : `text-white`
                }`}
              >
                50/50
              </button>
            </div>
          </>
        )}

        {showScore ? (
          true
        ) : (
          <div className="grid grid-cols-2">
            {allAnswers.map((answer, index) => {
              return (
                <button
                  disabled={timeLeft == 0 ? true : false}
                  key={index}
                  onClick={handleNextQuestion}
                  data-answer={answer}
                  className={`${
                    !pair.includes(answer) && lifelineFifty == true
                      ? `hidden`
                      : ``
                  } bg-blue-500 text-white py-4 px-4 m-4`}
                >
                  <span className={`${timeLeft == 0 ? `text-gray-600` : ``}`}>
                    <div
                      dangerouslySetInnerHTML={{
                        __html: answer,
                      }}
                    ></div>
                  </span>
                </button>
              );
            })}
          </div>
        )}
        {!showScore && (
          <div className="text-center">
            <button
              className={`${
                timeLeft == 0 && showScore == false
                  ? `text-white`
                  : `text-gray-400`
              } py-4 px-6 rounded-sm bg-gray-900  m-4`}
              onClick={handleNextQuestion}
            >
              Next
            </button>
          </div>
        )}
        {showScore == true && (
          <div className="text-center bg-gray-900 text-white m-4 p-4">
            <Link href="/">Start over</Link>
          </div>
        )}
      </section>
    </Layout>
  );
}

export async function getServerSideProps(context) {
  const res = await fetch(
    "https://opentdb.com/api.php?amount=10&type=multiple&difficulty=easy"
  );
  const json = await res.json();

  return {
    props: {
      questions: json.results,
    },
  };
}

export default Quiz;
