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
  const [nonMonicLeft, setNonMonicLeft] = createSignal("1");
  const [right, setRight] = createSignal("1");
  const [nonMonicRight, setNonMonicRight] = createSignal("");
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

    if (!is_monic) {
      document.getElementById("nonMonicLeftSource").focus();
    } else {
      document.getElementById("leftSource").focus();
    }
    startTimer();
  });

  const generatePolynomial = function(): [string, string] {
    let newLeft = 0;
    let newNonMonicLeft = 1;
    let hasNonMonicRolled = false;
    while (newLeft === 0) {
      newLeft = Math.floor(Math.random() * (rrange - lrange)) + lrange;
    };

    if (!is_monic) {
      while (newNonMonicLeft === 0 || hasNonMonicRolled === false) {
        newNonMonicLeft = Math.floor(Math.random() * (rrange - lrange)) + lrange;
        hasNonMonicRolled = true;
      }; 
    }

    hasNonMonicRolled = false;

    let newRight = 0;
    let newNonMonicRight = 1;
    while (newRight === 0) {
      newRight = Math.floor(Math.random() * (rrange - lrange)) + lrange;
    }

    if (!is_monic) {
      while (newNonMonicRight === 0 || hasNonMonicRolled === false) {
        newNonMonicRight = Math.floor(Math.random() * (rrange - lrange)) + lrange;
        hasNonMonicRolled = true;
      }; 
    }

    console.log(newNonMonicLeft, newNonMonicRight);

    let first = "x^2 ";
    if (newNonMonicLeft * newNonMonicRight !== 1) {
      first = String(newNonMonicLeft * newNonMonicRight) + first;
    }
    let second = "";
    
    let sum_roots = newNonMonicRight * newLeft + newNonMonicLeft * newRight;
    let prod_roots = newLeft * newRight;

    if (sum_roots != 0) {
      if (sum_roots < 0) {
        second = "- " + String(Math.abs(sum_roots)) + "x ";
      } else {
        second = "+ " + String(Math.abs(sum_roots)) + "x ";
      }
    }

    let third = "";
    if (prod_roots != 0) {
      if (prod_roots < 0) {
        third = "- " + String(Math.abs(prod_roots));
      } else {
        third = "+ " + String(Math.abs(prod_roots));
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
    checkAnswer(nonMonicLeft() + left(), nonMonicRight() + right());
  };

  const nonMonicLeftHandler = function(e) {
    setNonMonicLeft(e.target.value);
    checkAnswer(nonMonicLeft() + left(), nonMonicRight() + right());
  };

  const rightHandler = function(e) {
    setRight(e.target.value);
    checkAnswer(nonMonicLeft() + left(), nonMonicRight() + right());
  };

  const nonMonicRightHandler = function(e) {
    setNonMonicRight(e.target.value);
    checkAnswer(nonMonicLeft() + left(), nonMonicRight() + right());
  };

  const checkAnswer = (l: string, r: string) => {
    // Have to have pairs like (2, 2)(4, 4) or (1, 1)(8, 8) or (8, 8)(1, 1)
    if ((l == leftAnswer && r == rightAnswer) || (r == leftAnswer && l == rightAnswer)) {
      [leftAnswer, rightAnswer] = generatePolynomial();
      setScore(score() + 1);
      (document.getElementById("leftSource") as HTMLInputElement).value = "";
      (document.getElementById("rightSource") as HTMLInputElement).value = "";

      // Focus on left source
      if (!is_monic) {
        document.getElementById("nonMonicLeftSource").focus();
      } else {
        document.getElementById("leftSource").focus();
      }
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
            <span class="math-input">( </span>
            <Switch>
              <Match when={!is_monic}>
                <input 
                  style="margin: 5px; width: 15px"
                  oninput={nonMonicLeftHandler}
                  id="nonMonicLeftSource"
                /> 
              </Match>
            </Switch>
            <span class="math-input">x</span>
            <input 
            style="margin: 5px; width: 30px"
            oninput={leftHandler}
            id="leftSource"
            /> 
            <span class="math-input">) </span>

            <span class="math-input">( </span>
              <Switch>
              <Match when={!is_monic}>
                <input 
                  style="margin: 5px; width: 15px"
                  oninput={nonMonicRightHandler}
                  id="nonMonicRightSource"
                /> 
              </Match>
            </Switch>
            <span class="math-input">x</span>
            <input 
            style="margin: 5px; width: 30px"
            oninput={rightHandler}
            id="rightSource"
            /> 
            <span class="math-input">) </span>
          </div>
        </Match>
      </Switch>


    </section>
  );
}
