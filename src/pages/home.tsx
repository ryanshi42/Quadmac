import { createSignal } from 'solid-js';
import { Link, useRoutes, useLocation } from '@solidjs/router';
import { Switch, Match } from "solid-js"
import Game from "./game"

export default function Home() {

  function save_checkbox(monic_state){
    localStorage.setItem('monic_checkbox', monic_state);
  }

  function load_checkbox() : boolean {    
    var checked = JSON.parse(localStorage.getItem('monic_checkbox'));
    return checked;
  }

  function save_left(lrange){
    localStorage.setItem('lrange', lrange);
  }

  function load_left() : number {    
    var val = JSON.parse(localStorage.getItem('lrange'));
    return val;
  }

  function save_right(rrange){
    localStorage.setItem('rrange', rrange);
  }

  function load_right() : number {    
    var val = JSON.parse(localStorage.getItem('rrange'));
    return val;
  }

  function save_duration(duration){
    localStorage.setItem('duration', duration);
  }

  function load_duration() : number {    
    var val = JSON.parse(localStorage.getItem('duration'));
    return val;
  }
  
  const [monic, setMonic] = createSignal(load_checkbox() === null ? true : load_checkbox());
  const [duration, setDuration] = createSignal(load_duration() === null ? 60 : load_duration());
  // const [ingame, setIngame] = createSignal(false);
  const [left, setLeft] = createSignal(load_left() === null ? -10 : load_left());
  const [right, setRight] = createSignal(load_right() === null ? 10 : load_right());
  const [disabled, setDisabled] = createSignal(left() === right());
  // console.log(load_checkbox(), load_left(), load_right());

  const handleChange = () => {
    setMonic(!monic());
    save_checkbox(monic());
  };

  const handleChangeDuration = (e) => {
    setDuration(parseInt((e.target as HTMLInputElement).value, 10));
    save_duration(duration());
  };

  const handleChangeLeft = (e) => {
    setLeft(parseInt((e.target as HTMLInputElement).value, 10));
    save_left(left());
    if (left() >= right()) {
      setDisabled(true);
    } else {
      setDisabled(false);
    }
  };

  const handleChangeRight = (e) => {
    setRight(parseInt((e.target as HTMLInputElement).value, 10));
    save_right(right());
    if (left() >= right()) {
      setDisabled(true);
    } else {
      setDisabled(false);
    }
  };

  // const startGame = () => {
  //   <a href="/game" />
  //   <Game 
  //     is_monic={monic()} 
  //     duration={duration()} 
  //     lrange={left()} 
  //     rrange={right()} 
  //   />
  // }

  // console.log(ingame);

  return (
    <section class="bg-gray-100 text-gray-700 p-8">
      <h1 class="text-2xl font-bold">Quadmac</h1>

      {/* <p class="mt-4">Customise your settings here:</p> */}


      {/* <h2 class="text-xl font-bold">Settings</h2> */}

      <label>
      Monic Polynomial?
      <input
        id="monic_checkbox"
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
        <input type="number" value={left()} style="margin: 5px; width: 40px" id="lrange" onchange={handleChangeLeft}> </input> 
        to
        <input type="number" value={right()} style="margin: 5px; width: 40px" id="rrange" onchange={handleChangeRight}> </input> 
      </label>  

      <br/>
      
      <Switch>
        <Match when={!disabled()}>
          <a href="/game">
            <button
              class="border rounded-lg px-2 border-gray-900"
              style="margin-top: 10px;"
            >
            Start
            </button>
          </a>
        </Match>
        <Match when={disabled()}>
          <button
            class="border rounded-lg px-2 border-gray-900"
            style="margin-top: 10px; border: 1px solid #999999;
              background-color: #cccccc;
              color: #666666;
            "
            disabled={true}
          >
          Start
          </button>
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
