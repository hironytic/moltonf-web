<!--
Watching.svelte

Copyright (c) 2023-2026 Hironori Ichimiya <hiron@hironytic.com>

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
  import { getContext, setContext } from "svelte"
  import { AppContext } from "../../../AppContext.svelte"
  import { WatchingScene } from "./WatchingScene.svelte"
  import { Button, Spinner } from "flowbite-svelte"
  import WatchingElementsView from "./WatchingElementsView.svelte"
  import { WatchingContext } from "./WatchingContext"
  import Footer from "../../ui-component/Footer.svelte"

  let lastCurrentDay = -1

  const appContext = getContext<AppContext>(AppContext.Key)
  let scene = $derived(appContext.sceneAs(WatchingScene))

  const watchingContext = new WatchingContext()
  setContext(WatchingContext.Key, watchingContext)
  
  let scroller = $state(undefined as HTMLDivElement | undefined)
  let currentDay = $derived(scene?.currentDay ?? -1)
  
  $effect(() => {
    // If current day has been changed, reset the scroll position to top. 
    if (currentDay !== lastCurrentDay) {
      lastCurrentDay = currentDay
      if (scroller !== undefined) {
        scroller.scrollTo(0, 0)
      }
    }
  })

  let focusedElementId = $derived(scene?.focusedElementId ?? undefined)
  
  $effect(() => {
    let scrollTimer: number | undefined = undefined
    if (focusedElementId !== undefined) {
      scrollTimer = window.setTimeout(() => {
        scrollTimer = undefined
        watchingContext.scrollToElement(focusedElementId)
        const location = scene?.getLocation(currentDay)
        if (location !== undefined) {
          appContext.history.navigate(location, true)
        }
      }, 200)
    }
    return () => {
      if (scrollTimer !== undefined) {
        window.clearTimeout(scrollTimer)
      }
    }
  })
  
  function canMoveToNextDay(): boolean {
    return scene?.canMoveToNextDay ?? false
  }
  
  function moveToNextDay() {
    scene?.moveToNextDay()
  }
</script>

{#if scene !== undefined}
  {#if scene.story === undefined}
    <div class="h-full flex flex-col place-items-center place-content-center">
      <Spinner />
    </div>
  {:else}
    <div class="h-full flex flex-col">
      <div class="overflow-y-auto" bind:this={scroller}>
        <div class="flex place-content-center">
          <div class="bg-black text-sm max-w-[600px] p-6 rounded-md">
            <WatchingElementsView/>
            {#if canMoveToNextDay()}
              <Button color="red" class="mt-4" onclick={() => moveToNextDay()}>次の日へ</Button>
            {/if}
          </div>
        </div>
        <Footer/>
      </div>
    </div>
  {/if}
{/if}
