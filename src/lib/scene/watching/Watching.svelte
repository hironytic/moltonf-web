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
  import { getContext, onDestroy, setContext } from "svelte"
  import { AppContext } from "../../../AppContext"
  import { WatchingScene } from "./WatchingScene"
  import type { Readable } from "svelte/store"
  import { readable } from "svelte/store"
  import type { Story } from "../../story/Story"
  import { Button, Spinner } from "flowbite-svelte"
  import WatchingElementsView from "./WatchingElementsView.svelte"
  import { WatchingContext } from "./WatchingContext"

  const unreactives = {
    lastCurrentDay: -1,
    scrollTimer: undefined as number | undefined,
  }

  const appContext = getContext<AppContext>(AppContext.Key)
  const scene$ = appContext.sceneAs$(WatchingScene)
  $: scene = $scene$

  const watchingContext = new WatchingContext()
  setContext(WatchingContext.Key, watchingContext)
  
  let story$: Readable<Story | undefined>
  $: story$ = scene?.story$ ?? readable(undefined)
  
  let scroller = undefined as HTMLDivElement | undefined
  
  function getElementIdByScrollPosition(): string | undefined {
    if (scroller === undefined) {
      return undefined
    }
    const yPosition = scroller.getBoundingClientRect().top
    return watchingContext.getElementIdByYPosition(yPosition)
  }
  
  let currentDay$: Readable<number>
  $: currentDay$ = scene?.currentDay$ ?? readable(-1)
  let currentDay: number
  $: {
    currentDay = $currentDay$
    
    // If current day has been changed, reset the scroll position to top. 
    if (currentDay !== unreactives.lastCurrentDay) {
      unreactives.lastCurrentDay = currentDay
      if (scroller !== undefined) {
        scroller.scrollTo(0, 0)
      }
    }
  }

  let focusedElementId$: Readable<string | undefined>
  $: focusedElementId$ = scene?.focusedElementId$ ?? readable(undefined)
  $: {
    const focusedElementId = $focusedElementId$
    if (focusedElementId !== undefined) {
      if (unreactives.scrollTimer !== undefined) {
        window.clearTimeout(unreactives.scrollTimer)
      }
      unreactives.scrollTimer = window.setTimeout(() => {
        unreactives.scrollTimer = undefined
        watchingContext.scrollToElement(focusedElementId)
        const location = scene?.getLocation(currentDay)
        if (location !== undefined) {
          appContext.history.navigate(location, true)
        }
      }, 200)
    }
  }
  
  let canMoveToNextDay$: Readable<boolean>
  $: canMoveToNextDay$ = scene?.canMoveToNextDay$ ?? readable(false)
  
  let moveToNextDay$: Readable<() => void>
  $: moveToNextDay$ = scene?.moveToNextDay$ ?? readable(() => { /* do nothing */ })
  function moveToNextDay() {
    ($moveToNextDay$)()
  }

  onDestroy(() => {
    if (unreactives.scrollTimer !== undefined) {
      clearTimeout(unreactives.scrollTimer)
    }
  })
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
          <WatchingElementsView/>
          {#if $canMoveToNextDay$}
            <Button color="red" class="mt-4" on:click={() => moveToNextDay()}>次の日へ</Button>
          {/if}
        </div>
      </div>
    </div>
  </div>
{/if}
