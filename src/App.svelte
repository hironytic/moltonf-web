<!--
App.svelte

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
  import { AppContext } from "./AppContext"
  import { setContext } from "svelte"
  import SelectWorkspace from "./lib/scene/select-workspace/SelectWorkspace.svelte"
  import NewWorkspace from "./lib/scene/new-workspace/NewWorkspace.svelte"
  import Watching from "./lib/scene/watching/Watching.svelte"
  import { SelectWorkspaceScene } from "./lib/scene/select-workspace/SelectWorkspaceScene"
  import { NewWorkspaceScene } from "./lib/scene/new-workspace/NewWorkspaceScene"
  import { WatchingScene } from "./lib/scene/watching/WatchingScene"
  import MessageBox from "./lib/MessageBox.svelte"
  import { Button } from "flowbite-svelte"

  const appContext = new AppContext()
  setContext(AppContext.Key, appContext)

  const scene$ = appContext.scene$
  
  function goToSelectWorkspace() {
    appContext.changeScene(new SelectWorkspaceScene(appContext))
  }
</script>

<main class="h-screen">
  <div class="flex flex-col h-full">
    <div class="bg-black border-b-2 border-b-gray-900 flex items-center h-[60px]">
      <p class="text-lg font-medium pl-4 py-1">Moltonf</p>
      {#if $scene$ instanceof WatchingScene}
        <Button color="light" size="xs" class="ml-10" on:click={() => goToSelectWorkspace()}>観戦データ一覧へ</Button>
      {/if}
    </div>
      <div class="grow overflow-y-clip">
        {#if $scene$ instanceof SelectWorkspaceScene}
          <SelectWorkspace/>
        {:else if $scene$ instanceof NewWorkspaceScene}
          <NewWorkspace/>
        {:else if $scene$ instanceof WatchingScene}
          <Watching/>
        {/if}
      </div>
  </div>
  <MessageBox/>
</main>
