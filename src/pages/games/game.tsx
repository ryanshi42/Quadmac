import { createEffect } from 'solid-js';
import { createSignal } from 'solid-js';
import { useParams } from "@solidjs/router";
import { onMount } from "solid-js";
import { Switch, Match } from "solid-js"
import Timer from "./timer";
import katex from 'katex';

export default function Game(props) {

  let { is_monic, duration, lrange, rrange } = props;

  const [score, setScore] = createSignal(0);
  const [left, setLeft] = createSignal("");
  const [right, setRight] = createSignal("");
  const [poly, setPoly] = createSignal('\\LaTeX');
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

    let math_input_html = document.getElementsByClassName("math-input");
    for (let i = 0; i < math_input_html.length; i++) {
      katex.render(math_input_html[i].innerHTML, math_input_html[i]); 
    }


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

    // KaTeX worked like a charm <3
    setPoly(first + second + third);
    katex.render(poly(), document.getElementById("math"));
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
          <div><b>Your score is: </b>{score()}</div>
        </Match>
        <Match when={!timerExpired()}>
          <div>
            <b>Timer:</b> <Timer seconds={timerSeconds} />
            <b>Score:</b> <div>{score()}</div>
          </div>

          <br/>
          <b>Factorise this polynomial: </b><div id="math">{poly()}</div>
          <br/>

          <div>
            <span class="math-input">( x</span><input 
              style="margin: 5px; width: 30px"
              oninput={leftHandler}
              id="leftSource"
              > 
            </input> <span class="math_input">)</span>
            <span class="math-input">( x</span><input 
              style="margin: 5px; width: 30px"
              oninput={rightHandler}
              id="rightSource"
              >
            </input> <span class="math_input">)</span>
          </div>
        </Match>
      </Switch>


    </section>
  );
}
