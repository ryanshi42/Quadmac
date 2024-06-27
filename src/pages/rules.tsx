import { Component, createEffect, Suspense } from 'solid-js';
import { useRouteData } from '@solidjs/router';
import type { AboutDataType } from './about.data';

export default function Rules() {

    // createEffect(() => {
    //   console.log(name());
    // });

    return (
    <section class="bg-blue-100 text-gray-700 p-8">
        <h1 class="text-2xl font-bold">Rules</h1>

        <p class="mt-4">You must type the minus or plus symbol, e.g. if you wish to type (x - 1) then you must type "-1". Do not write the x.</p>
        
        <p class="mt-4">
            Use tab and shift-tab to quickly go forward and backward respectively between boxes.
        </p>

        <p class="mt-4">
            Your answer will be <i>automagically</i> checked upon entering!
        </p>

        <p class="mt-4">
            If there are multiple answers, any valid answer will be accepted.
        </p>
        
        </section>
    );
}

