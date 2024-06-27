import { Component, createEffect, Suspense } from 'solid-js';
import { useRouteData } from '@solidjs/router';
import type { AboutDataType } from './about.data';

export default function About() {
  const name = useRouteData<AboutDataType>();

  // createEffect(() => {
  //   console.log(name());
  // });

  return (
    <section class="bg-pink-100 text-gray-700 p-8">
      <h1 class="text-2xl font-bold">About</h1>

      <p class="mt-4">A Zetamac clone which aims to test your ability to quickly factorise quadratics.</p>

      <p class="mt-4">
        This website is built with SolidJS, TailwindCSS and Typescript. 
      </p>

      {/* <p>
        <span>We love</span>
        <Suspense fallback={<span>...</span>}>
          <span>&nbsp;{name()}</span>
        </Suspense>
      </p> */}
    </section>
  );
}