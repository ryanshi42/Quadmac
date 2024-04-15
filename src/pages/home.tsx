import { createSignal } from 'solid-js';
import { Link, useRoutes, useLocation } from '@solidjs/router';
import { Switch, Match } from "solid-js"
import Game from "./games/game"

export default function Home() {
  const [monic, setMonic] = createSignal(true);
  const [duration, setDuration] = createSignal(60);
  const [ingame, setIngame] = createSignal(false);
  const [left, setLeft] = createSignal(-10);
  const [right, setRight] = createSignal(10);

  const handleChange = () => {
    setMonic(!monic());
  };

  const handleChangeDuration = (e) => {
    setDuration(parseInt((e.target as HTMLInputElement).value, 10));
  };

  const handleChangeLeft = (e) => {
    setLeft(parseInt((e.target as HTMLInputElement).value, 10));
  };

  const handleChangeRight = (e) => {
    setRight(parseInt((e.target as HTMLInputElement).value, 10));
  };

  // console.log(ingame);

  return (
    <section class="bg-gray-100 text-gray-700 p-8">
      <h1 class="text-2xl font-bold">Quadmac</h1>
      {/* <p class="mt-4">Customise your settings here:</p> */}

      <Switch>
        <Match when={!ingame()}>

          <label>
          Monic Polynomial?
          <input
            type="checkbox"
            style="margin: 10px;"
            checked={monic()}
            onChange={handleChange}
          />
          </label>

          <br/>

          <label>
            Duration?
            <select style="margin: 10px;" id="duration" onchange={handleChangeDuration}>
              <option value="30">30 Seconds</option>
              <option value="60" selected>60 Seconds</option>
              <option value="120">120 Seconds</option>
            </select>
          </label>

          <br/>

          <label>
            Ranges of values?
            From 
            <input type="number" value="-10" style="margin: 5px; width: 40px" id="lrange" onchange={handleChangeLeft}> </input> 
            to
            <input type="number" value="10" style="margin: 5px; width: 40px" id="rrange" onchange={handleChangeRight}> </input> 
          </label>  

          <button
              class="border rounded-lg px-2 border-gray-900"
              onClick={() => setIngame(true)}
            >
            Start
          </button>
        </Match>
        <Match when={ingame()}>
          <Game 
            is_monic={monic()} 
            duration={duration()} 
            lrange={left()} 
            rrange={right()} 
          />
        </Match>

      </Switch>


      {/* <br/>
      <br/>

      <Link href={`game/`}>
        <button
          class="border rounded-lg px-2 border-gray-900"
        >
        Start
        </button>
      </Link>
             */}
      {/* <button
        class="border rounded-lg px-2 border-gray-900"
        onClick={() => setCount(count() - 1)}
      >
        -
      </button>

      <output class="p-10px">Count: {count()}</output>

      <button
        class="border rounded-lg px-2 border-gray-900"
        onClick={() => setCount(count() + 1)}
      >
        +
      </button> */}

    </section>
  );
}
