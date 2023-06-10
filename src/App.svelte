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
  import { onDestroy, setContext } from "svelte"
  import SelectWorkspace from "./lib/scene/select-workspace/SelectWorkspace.svelte"
  import NewWorkspace from "./lib/scene/new-workspace/NewWorkspace.svelte"
  import Watching from "./lib/scene/watching/Watching.svelte"
  import { SelectWorkspaceScene } from "./lib/scene/select-workspace/SelectWorkspaceScene"
  import { NewWorkspaceScene } from "./lib/scene/new-workspace/NewWorkspaceScene"
  import { WatchingScene } from "./lib/scene/watching/WatchingScene"
  import MessageBox from "./lib/MessageBox.svelte"
  import NavBar from "./lib/NavBar.svelte"
  import { HashHistory } from "./History"
  import { InvalidScene } from "./lib/scene/invalid/InvalidScene"
  import Invalid from "./lib/scene/invalid/Invalid.svelte"

  const appContext = new AppContext(new HashHistory())
  setContext(AppContext.Key, appContext)

  onDestroy(() => {
    appContext.destroy()
  })

  const scene$ = appContext.scene$
</script>

<main class="h-screen">
  <div class="flex flex-col h-full">
    <NavBar/>
    <div class="grow overflow-y-clip">
      {#if $scene$ instanceof SelectWorkspaceScene}
        <SelectWorkspace/>
      {:else if $scene$ instanceof NewWorkspaceScene}
        <NewWorkspace/>
      {:else if $scene$ instanceof WatchingScene}
        <Watching/>
      {:else if $scene$ instanceof InvalidScene}
        <Invalid/>
      {/if}
    </div>
  </div>
  <MessageBox/>
</main>
