import { createEffect } from 'solid-js';
import { createSignal } from 'solid-js';
import { useParams } from "@solidjs/router";
import { onMount } from "solid-js";
import { Switch, Match } from "solid-js"
import Timer from "./timer";
import katex from 'katex';

// Define a type for your lists of numbers (arrays of numbers)
type NumberList = number[];

// ObjectSet capable of comparing lists accurately
class ObjectSet<NumberList> extends Set<NumberList> {
  add(elem){
    return super.add(typeof elem === 'object' ? JSON.stringify(elem) : elem);
  }
  has(elem){
    return super.has(typeof elem === 'object' ? JSON.stringify(elem) : elem);
  }
}

const gcd = function(a, b) {
  if (a < 0 && b < 0) {
    a *= -1;
    b *= -1;
  }
  if (!b) {
    return a;
  }

  return gcd(b, a % b);
}

export default function Game(props) {

  let { is_monic, duration, lrange, rrange } = props;

  const [score, setScore] = createSignal(0);
  const [left, setLeft] = createSignal("");
  const [nonMonicLeft, setNonMonicLeft] = createSignal("1");

  const [right, setRight] = createSignal("");
  const [nonMonicRight, setNonMonicRight] = createSignal("1");
  const [poly, setPoly] = createSignal('\\LaTeX');
  const [timerExpired, setTimerExpired] = createSignal(false);


  let poly_answers = new ObjectSet();


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

    if (lrange > rrange) {
      let temp = rrange;
      rrange = lrange;
      lrange = temp;
    }

    poly_answers = generatePolynomial();

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


  // Generation
  const generateAnswers = function(nml: number, l: number, nmr: number, r: number) : ObjectSet<NumberList> {
    // console.log(newLeft, newRight);
    // be careful of negative numbers!

    let answers: ObjectSet<NumberList> = new ObjectSet();

    // f for factors
    let lf = [];
    let rf = [];

    // b for base
    let nmlb = nml / gcd(nml, l);
    let lb = l / gcd(nml, l);

    let nmrb = nmr / gcd(nmr, r);
    let rb = r / gcd(nmr, r);

    let n = gcd(nml, l) * gcd(nmr, r);

    // console.log("bob", nmlb, lb, nmrb, rb, n);
    for (let i = -Math.floor(n / 2); i <= Math.ceil(n / 2); i++) {
      if (n % i === 0) {
        lf.push(i);
        rf.push(n / i);
      }
    }
    for (let i = 0; i < lf.length; i++) {
      answers.add([nmlb * lf[i], lb * lf[i], nmrb * rf[i], rb * rf[i]]);
      answers.add([nmrb * rf[i], rb * rf[i], nmlb * lf[i], lb * lf[i]]);
      answers.add([-nmlb * lf[i], -lb * lf[i], -nmrb * rf[i], -rb * rf[i]]);
      answers.add([-nmrb * rf[i], -rb * rf[i], -nmlb * lf[i], -lb * lf[i]]);
      // console.log(nmlb * lf[i], lb * lf[i], nmrb * rf[i], rb * rf[i]);
    }

    return answers;
  }

  const generatePolynomial = function(): ObjectSet<NumberList> {
    const N_ROLLS = 10;
    let newLeft = 0;
    let newNonMonicLeft = 1;
    let rolls = 0;
  
    while (newLeft === 0 && rolls < N_ROLLS) {
      newLeft = Math.floor(Math.random() * (rrange - lrange)) + lrange;
      rolls++;
    };
    if (newLeft === 0) {
      if (rrange === 0) {
        newLeft = -1;
      } else {
        newLeft = 1;
      }
    }
    rolls = 0;

    if (!is_monic) {
      while (newNonMonicLeft === 0 && rolls < N_ROLLS) {
        newNonMonicLeft = Math.floor(Math.random() * (rrange - lrange)) + lrange;
        rolls++;
      }; 
    }
    if (newNonMonicLeft === 0) {
      if (rrange === 0) {
        newNonMonicLeft = -1;
      } else {
        newNonMonicLeft = 1;
      }
    }
    rolls = 0;

    let newRight = 0;
    let newNonMonicRight = 1;
    while (newRight === 0 && rolls < N_ROLLS) {
      newRight = Math.floor(Math.random() * (rrange - lrange)) + lrange;
      rolls++;
    }
    // console.log(rolls, newRight, rrange, lrange);
    if (newRight === 0) {
      if (rrange === 0) {
        newRight = -1;
      } else {
        newRight = 1;
      }
    }
    rolls = 0;

    if (!is_monic) {
      while (newNonMonicRight === 0 && rolls < N_ROLLS) {
        newNonMonicRight = Math.floor(Math.random() * (rrange - lrange)) + lrange;
        rolls++;
      }; 
    }
    if (newNonMonicRight === 0) {
      if (rrange === 0) {
        newNonMonicRight = -1;
      } else {
        newNonMonicRight = 1;
      }
    }

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

    return generateAnswers(newNonMonicLeft, newLeft, newNonMonicRight, newRight);
  };

  const leftHandler = function(e) {
    setLeft(e.target.value);
    checkAnswer(nonMonicLeft(), left(), nonMonicRight(), right());
  };

  const nonMonicLeftHandler = function(e) {
    setNonMonicLeft(e.target.value);
    checkAnswer(nonMonicLeft(), left(), nonMonicRight(), right());
  };

  const rightHandler = function(e) {
    setRight(e.target.value);
    checkAnswer(nonMonicLeft(), left(), nonMonicRight(), right());
  };

  const nonMonicRightHandler = function(e) {
    setNonMonicRight(e.target.value);
    checkAnswer(nonMonicLeft(), left(), nonMonicRight(), right());
  };

  const checkAnswer = (nml: string, l: string, nmr: string, r: string) => {
    // Have to have pairs like (2, 2)(4, 4) or (1, 1)(8, 8) or (8, 8)(1, 1)

    // p = parsed
    let nmlp = Number(nml);
    if (nml == "-") {
      nmlp = -1;
    }
    let nmrp = Number(nmr);
    if (nml == "-") {
      nmlp = -1;
    }
    let lp = Number(l);
    let rp = Number(r);

    // console.log("smiley", nmlp, lp, nmrp, rp, poly_answers.has([nmlp, lp, nmrp, rp]));
    if (nmlp && nmrp && lp && rp && poly_answers.has([nmlp, lp, nmrp, rp])) {
      poly_answers = generatePolynomial();
      setScore(score() + 1);
      if (!is_monic) {
        (document.getElementById("nonMonicLeftSource") as HTMLInputElement).value = "";
        (document.getElementById("nonMonicRightSource") as HTMLInputElement).value = "";
        setNonMonicLeft("0");
        setNonMonicRight("0");
      }
      (document.getElementById("leftSource") as HTMLInputElement).value = "";
      (document.getElementById("rightSource") as HTMLInputElement).value = "";
      setLeft("0");
      setRight("0");

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
                  style="margin: 5px; width: 30px"
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
                  style="margin: 5px; width: 30px"
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
