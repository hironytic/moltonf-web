<!--
SelectRoleOfVillager.svelte

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
  import { NewWorkspaceScene, type VillagerRoleOption, VillagerRoleOptions } from "./NewWorkspaceScene"
  import type { Readable, Writable } from "svelte/store"
  import { readable, writable } from "svelte/store"
  import { Button } from "flowbite-svelte"
  import ChevronLeftIcon from "../../icon/ChevronLeftIcon.svelte"
  import HeaderTitle from "../../ui-component/HeaderTitle.svelte"
  import OptionChooser from "./OptionChooser.svelte"

  const appContext = getContext<AppContext>(AppContext.Key)
  const scene$ = appContext.sceneAs$(NewWorkspaceScene)
  $: scene = $scene$

  let roleOptions$: Readable<VillagerRoleOption[]>
  $: roleOptions$ = scene?.villagerRoleOptions$ ?? readable([])

  let role$: Writable<VillagerRoleOption | undefined>
  $: role$ = scene?.villagerRole$ ?? writable(undefined)

  let canForward$: Readable<boolean>
  $: canForward$ = scene?.canForwardFromSelectRoleOfVillagerStep$ ?? readable(false)
</script>

<div class="overflow-y-auto">
  <div class="flex place-content-center">
    <div class="bg-black max-w-[600px] p-10 rounded-md">
      <Button color="dark" outline size="xs" on:click={() => scene?.backFromSelectRoleOfVillagerStep()}>
        <ChevronLeftIcon size="1rem"/> 戻る
      </Button>
      <HeaderTitle class="mt-4">村人側の役職は？</HeaderTitle>

      <div class="text-sm mt-4">
        <p>村人側の役職を選んでください。村人側の勝利条件は全ての人狼を処刑することです。</p>
      </div>
      
      <OptionChooser class="mt-4" options={$roleOptions$} bind:value={$role$} on:choose={() => scene?.forwardFromSelectRoleOfVillagerStep()} let:option>
        {#if option === VillagerRoleOptions.INNOCENT}
          <p class="text-lg font-bold">ただの村人</p>
          <p class="mt-2 text-sm">特別な能力を持たない村人の視点で観戦します。</p>
        {:else if option === VillagerRoleOptions.SEER}
          <p class="text-lg font-bold">占い師</p>
          <p class="mt-2 text-sm">毎夜、誰かが人狼かどうかを占える視点で観戦します。</p>
        {:else if option === VillagerRoleOptions.SHAMAN}
          <p class="text-lg font-bold">霊能者</p>
          <p class="mt-2 text-sm">処刑された者が人狼かどうかを知ることのできる視点で観戦します。</p>
        {:else if option === VillagerRoleOptions.HUNTER}
          <p class="text-lg font-bold">狩人</p>
          <p class="mt-2 text-sm">誰かを人狼の襲撃から守れる視点で観戦します。</p>
        {:else if option === VillagerRoleOptions.FRATER}
          <p class="text-lg font-bold">共有者</p>
          <p class="mt-2 text-sm">もうひとりの共有者が誰かを知ることができる視点で観戦します。</p>
        {:else if option === VillagerRoleOptions.LONGEST_SURVIVOR}
          <p class="text-lg font-bold">長く生き残った人</p>
          <p class="mt-2 text-sm">村人側の人間のうち、最も長く生き残った人の視点で観戦します。</p>
        {:else if option === VillagerRoleOptions.ANYTHING}
          <p class="text-lg font-bold">村人側の中からおまかせ</p>
          <p class="mt-2 text-sm">観戦データ作成時にシステムがランダムに決定します。</p>
        {/if}
      </OptionChooser>
    
      <div class="mt-4 flex place-content-end">
        <Button color="red" disabled={!$canForward$} on:click={() => scene?.forwardFromSelectRoleOfVillagerStep()}>次へ</Button>
      </div>
    </div>
  </div>
</div>
