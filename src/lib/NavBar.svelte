<!--
NavBar.svelte

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
  import { AppContext } from "../AppContext"
  import { getContext } from "svelte"
  import { WatchingScene } from "./scene/watching/WatchingScene"
  import { Button } from "flowbite-svelte"
  import DayChanger from "./scene/watching/DayChanger.svelte"
  import { SelectWorkspaceScene } from "./scene/select-workspace/SelectWorkspaceScene"
  import ChevronLeftIcon from "./icon/ChevronLeftIcon.svelte"

  const appContext = getContext<AppContext>(AppContext.Key)
  const watchingScene$ = appContext.sceneAs$(WatchingScene)
  
  let title: string | undefined
  $: title = $watchingScene$?.workspace.name
  
  function goToSelectWorkspace() {
    appContext.changeScene(new SelectWorkspaceScene(appContext))
  }
</script>

<div class="px-4 bg-black border-b-2 border-b-gray-900 flex items-center h-[6rem] shrink-0">
  <div class="flex flex-col space-y-1">
    <p class="text-lg font-medium">Moltonf</p>
    {#if $watchingScene$ !== undefined}
      <Button color="light" size="xs" on:click={() => goToSelectWorkspace()}>
          <ChevronLeftIcon size="1rem"/> 観戦データ選択
      </Button>
    {/if}
  </div>
  <div class="ml-4 grow flex flex-col items-start space-y-1">
  {#if $watchingScene$ !== undefined}
      <p class="text-lg font-medium">{title ?? ""}</p>
      <DayChanger/>
  {/if}
  </div>
</div>
