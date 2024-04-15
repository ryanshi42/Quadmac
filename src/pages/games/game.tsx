import { Component, createEffect, Suspense } from 'solid-js';
import { useRouteData } from '@solidjs/router';
import { createSignal } from 'solid-js';
import { useParams } from "@solidjs/router";
import { onMount } from "solid-js";
import { Switch, Match } from "solid-js"
import Timer from "./timer";

export default function Game(props) {

  let { is_monic, duration, lrange, rrange } = props;

  const [score, setScore] = createSignal(0);
  const [left, setLeft] = createSignal("");
  const [right, setRight] = createSignal("");
  const [poly, setPoly] = createSignal("");
  const [timerExpired, setTimerExpired] = createSignal(false);

  let leftAnswer = "";
  let rightAnswer = "";

  let timerInterval: number;

  const [timerSeconds, setTimerSeconds] = createSignal(duration);

  const startTimer = () => {
    timerInterval = setInterval(() => {
        setTimerSeconds(timerSeconds() - 1);
    }, 1000);
  };

  const stopTimer = () => {
    clearInterval(timerInterval);
  };

  createEffect(() => {
    if (timerSeconds() <= 0) {
      setTimerExpired(true);
      stopTimer();
    }
  });

  onMount(() => {

    if (lrange < rrange) {
      let temp = rrange;
      rrange = lrange;
      lrange = temp;
    }

    [leftAnswer, rightAnswer] = generatePolynomial();

    document.getElementById("leftSource").focus();
    startTimer();
  });

  const generatePolynomial = function(): [string, string] {
    let newLeft = 0;
    while (newLeft === 0) {
      newLeft = Math.floor(Math.random() * (rrange - lrange)) + lrange;
    };
    let newRight = 0;
    while (newRight === 0) {
      newRight = Math.floor(Math.random() * (rrange - lrange)) + lrange;
    }
    let first = "x^2 ";
    let second = "";
    if (newLeft + newRight != 0) {
      if (newLeft + newRight < 0) {
        second = "- " + String(Math.abs(newLeft + newRight)) + "x ";
      } else {
        second = "+ " + String(Math.abs(newLeft + newRight)) + "x ";
      }
    }
    let third = "";
    if (newLeft * newRight != 0) {
      if (newLeft * newRight < 0) {
        third = "- " + String(Math.abs(newLeft * newRight));
      } else {
        third = "+ " + String(Math.abs(newLeft * newRight));
      }
    }
    setPoly(first + second + third);
    // console.log(newLeft, newRight);
    let leftStr = String(newLeft);
    let rightStr = String(newRight);
    if (newLeft > 0) {
      leftStr = "+" + leftStr;
    }
    if (newRight > 0) {
      rightStr = "+" + rightStr;
    }
    return [leftStr, rightStr];
  };

  const leftHandler = function(e) {
    setLeft(e.target.value);
    checkAnswer(left(), right());
  };

  const rightHandler = function(e) {
    setRight(e.target.value);
    checkAnswer(left(), right());
  };

  const checkAnswer = (l: string, r: string) => {
    if ((l == leftAnswer && r == rightAnswer) || (r == leftAnswer && l == rightAnswer)) {
      [leftAnswer, rightAnswer] = generatePolynomial();
      setScore(score() + 1);
      (document.getElementById("leftSource") as HTMLInputElement).value = "";
      (document.getElementById("rightSource") as HTMLInputElement).value = "";

      // Focus on left source
      document.getElementById("leftSource").focus();
    }
  };

  return (
    
    <section class="bg-gray-100 text-gray-700 p-8">
      <Switch>
        <Match when={timerExpired()}>
          <div>Your score is: {score()}</div>
        </Match>
        <Match when={!timerExpired()}>
          <div>
            Timer: <Timer seconds={timerSeconds} />
            Score: <div>{score()}</div>
          </div>

          <br/>
          Factorise this polynomial: {poly()}
          <br/>

          <div>
            ( x<input 
              style="margin: 5px; width: 30px"
              oninput={leftHandler}
              id="leftSource"
              > 
            </input> )
            ( x<input 
              style="margin: 5px; width: 30px"
              oninput={rightHandler}
              id="rightSource"
              >
            </input> )
          </div>
        </Match>
      </Switch>


    </section>
  );
}
