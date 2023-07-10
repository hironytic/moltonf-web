<!--
SelectTeam.svelte

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
  import { NewWorkspaceScene, type TeamOption, TeamOptions } from "./NewWorkspaceScene"
  import ChevronLeftIcon from "../../icon/ChevronLeftIcon.svelte"
  import { Button } from "flowbite-svelte"
  import HeaderTitle from "../../ui-component/HeaderTitle.svelte"
  import type { Readable, Writable } from "svelte/store"
  import { readable, writable } from "svelte/store"
  import OptionChooser from "./OptionChooser.svelte"
  import Footer from "../../ui-component/Footer.svelte"

  const appContext = getContext<AppContext>(AppContext.Key)
  const scene$ = appContext.sceneAs$(NewWorkspaceScene)
  $: scene = $scene$
  
  let teamOptions$: Readable<TeamOption[]>
  $: teamOptions$ = scene?.teamOptions$ ?? readable([])
  
  let team$: Writable<TeamOption | undefined>
  $: team$ = scene?.team$ ?? writable(undefined)

  let canForward$: Readable<boolean>
  $: canForward$ = scene?.canForwardFromSelectTeamStep$ ?? readable(false)
</script>

<div class="overflow-y-auto">
  <div class="flex place-content-center">
    <div class="bg-black max-w-[600px] p-10 rounded-md">
      <Button color="dark" outline size="xs" on:click={() => scene?.backFromSelectTeamStep()}>
        <ChevronLeftIcon size="1rem"/> 戻る
      </Button>
      <HeaderTitle class="mt-4">どの視点で観戦しますか？</HeaderTitle>
    
      <div class="text-sm mt-4">
        <p>エピローグになるまでは、選んだ視点に合わせて表示されるものが変わります。例えば、村人の視点では人狼たちのささやきは表示されません。</p>
        <p>村人、人狼を選択した場合は、続けて次の画面で詳細を選択できます。</p>
      </div>
      
      <OptionChooser class="mt-4" options={$teamOptions$} bind:value={$team$} on:choose={() => scene?.forwardFromSelectTeamStep()} let:option>
        {#if option === TeamOptions.VILLAGER}
          <p class="text-lg font-bold">村人</p>
          <p class="mt-2 text-sm">村人側の視点で観戦します。</p>
        {:else if option === TeamOptions.WOLF}
          <p class="text-lg font-bold">人狼</p>
          <p class="mt-2 text-sm">人狼側の視点で観戦します。狂人もこちらに含みます。</p>
        {:else if option === TeamOptions.HAMSTER}
          <p class="text-lg font-bold">ハムスター人間</p>
          <p class="mt-2 text-sm">ハムスター人間の視点で観戦します。</p>
        {:else if option === TeamOptions.ANYTHING}
          <p class="text-lg font-bold">おまかせ</p>
          <p class="mt-2 text-sm">観戦データ作成時にシステムがランダムに決定します。</p>
        {/if}
      </OptionChooser>
      
      <div class="mt-4 flex place-content-end">
        <Button color="red" disabled={!$canForward$} on:click={() => scene?.forwardFromSelectTeamStep()}>次へ</Button>
      </div>    
    </div>
  </div>
  <Footer/>
</div>
