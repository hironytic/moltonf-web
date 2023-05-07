<!--
DayChanger.svelte

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
  import { Button, ButtonGroup } from "flowbite-svelte"
  import { getContext } from "svelte"
  import { AppContext } from "../../../AppContext"
  import { type WatchableDay, WatchingScene } from "./WatchingScene"
  import { type Readable, readable } from "svelte/store"

  const appContext = getContext<AppContext>(AppContext.Key)
  const scene$ = appContext.sceneAs$(WatchingScene)
  $: scene = $scene$
  
  let watchableDays$: Readable<WatchableDay[]>
  $: watchableDays$ = scene?.watchableDays$ ?? readable([])
  
  let currentDay$: Readable<number>
  $: currentDay$ = scene?.currentDay$ ?? readable(0)
</script>

<ButtonGroup class="overflow-x-auto">
  {#each $watchableDays$ as wday}
    <Button size="xs" color="red" class="shrink-0" on:click={() => scene?.changeCurrentDay(wday.day)} outline={wday.day !== $currentDay$}>
      {wday.text}
    </Button>
  {/each}
</ButtonGroup>
