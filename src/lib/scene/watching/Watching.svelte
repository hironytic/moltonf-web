<!--
Watching.svelte

Copyright (c) 2023 Hironori Ichimiya <hiron@hironytic.com>

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.
-->

<script lang="ts">
  import { getContext } from "svelte"
  import { AppContext } from "../../../AppContext"
  import { WatchingScene } from "./WatchingScene"
  import type { Readable } from "svelte/store"
  import type { Story } from "../../story/Story"
  import { readable } from "svelte/store"
  import { Button, Spinner } from "flowbite-svelte"
  import StoryElementsView from "./WatchingElementsView.svelte"
  
  const unreactives = {
    lastCurrentDay: -1,
  }

  const appContext = getContext<AppContext>(AppContext.Key)
  const scene$ = appContext.sceneAs$(WatchingScene)
  $: scene = $scene$

  let story$: Readable<Story | undefined>
  $: story$ = scene?.story$ ?? readable(undefined)
  
  let scroller: HTMLDivElement
  let currentDay$: Readable<number>
  $: currentDay$ = scene?.currentDay$ ?? readable(-1)
  $: {
    // If current day has been changed, reset the scroll position to top. 
    if ($currentDay$ !== unreactives.lastCurrentDay) {
      unreactives.lastCurrentDay = $currentDay$
      scroller?.scrollTo(0, 0)
    }
  }
  
  let canMoveToNextDay$: Readable<boolean>
  $: canMoveToNextDay$ = scene?.canMoveToNextDay$ ?? readable(false)
</script>

{#if $story$ === undefined}
  <div class="h-full flex flex-col place-items-center place-content-center">
    <Spinner />
  </div>
{:else}
  <div class="h-full flex flex-col">
    <div class="overflow-y-auto" bind:this={scroller}>
      <div class="flex place-content-center">
        <div class="bg-black text-sm max-w-[600px] p-6 rounded-md">
          <StoryElementsView/>
          {#if $canMoveToNextDay$}
            <Button color="red" class="mt-4" on:click={() => scene?.moveToNextDay()}>次の日へ</Button>
          {/if}
        </div>
      </div>
    </div>
  </div>
{/if}
