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
  import { Spinner } from "flowbite-svelte"
  import StoryElementsView from "./StoryElementsView.svelte"

  const appContext = getContext<AppContext>(AppContext.Key)
  const scene$ = appContext.sceneAs$(WatchingScene)
  $: scene = $scene$

  let story$: Readable<Story | undefined>
  $: story$ = scene?.story$ ?? readable(undefined)
</script>

{#if $story$ === undefined}
  <div class="h-full flex flex-col place-items-center place-content-center">
    <Spinner />
  </div>
{:else}
  <div class="h-full flex flex-col place-items-center">
    <div class="bg-black text-sm max-w-[600px] p-6 rounded-md overflow-y-auto">
      <StoryElementsView/>
    </div>
  </div>
{/if}