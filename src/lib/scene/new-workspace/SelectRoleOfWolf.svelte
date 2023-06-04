<!--
SelectRoleOfWolf.svelte

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
  import { NewWorkspaceScene, type WolfRoleOption, WolfRoleOptions } from "./NewWorkspaceScene"
  import type { Readable, Writable } from "svelte/store"
  import { readable, writable } from "svelte/store"
  import { Button } from "flowbite-svelte"
  import ChevronLeftIcon from "../../icon/ChevronLeftIcon.svelte"
  import HeaderTitle from "../../ui-component/HeaderTitle.svelte"
  import OptionChooser from "./OptionChooser.svelte"

  const appContext = getContext<AppContext>(AppContext.Key)
  const scene$ = appContext.sceneAs$(NewWorkspaceScene)
  $: scene = $scene$

  let roleOptions$: Readable<WolfRoleOption[]>
  $: roleOptions$ = scene?.wolfRoleOptions$ ?? readable([])

  let role$: Writable<WolfRoleOption | undefined>
  $: role$ = scene?.wolfRole$ ?? writable(undefined)

  let canForward$: Readable<boolean>
  $: canForward$ = scene?.canForwardFromSelectRoleOfWolfStep$ ?? readable(false)
</script>

<div class="overflow-y-auto">
  <div class="flex place-content-center">
    <div class="bg-black max-w-[600px] p-10 rounded-md">
      <Button color="dark" outline size="xs" on:click={() => scene?.backFromSelectRoleOfWolfStep()}>
        <ChevronLeftIcon size="1rem"/> 戻る
      </Button>
      <HeaderTitle class="mt-4">人狼側の役職は？</HeaderTitle>

      <div class="text-sm mt-4">
        <p>人狼側の役職を選んでください。人狼側の勝利条件は残る村人の数が人狼と同数以下になることです。</p>
      </div>

      <OptionChooser class="mt-4" options={$roleOptions$} bind:value={$role$} on:choose={() => scene?.forwardFromSelectRoleOfWolfStep()} let:option>
        {#if option === WolfRoleOptions.WOLF}
          <p class="text-lg font-bold">人狼</p>
          <p class="mt-2 text-sm">正体を悟られないようにしつつ村人を襲撃する視点で観戦します。</p>
        {:else if option === WolfRoleOptions.MADMAN}
          <p class="text-lg font-bold">狂人</p>
          <p class="mt-2 text-sm">人間ながら人狼の繁栄を望む視点で観戦します。</p>
        {:else if option === WolfRoleOptions.LONGEST_SURVIVOR}
          <p class="text-lg font-bold">長く生き残った人狼</p>
          <p class="mt-2 text-sm">最も長く潜んだ人狼の視点で観戦します（狂人にはなりません）。</p>
        {:else if option === WolfRoleOptions.ANYTHING}
          <p class="text-lg font-bold">人狼側の中からおまかせ</p>
          <p class="mt-2 text-sm">観戦データ作成時にシステムがランダムに決定します。</p>
        {/if}
      </OptionChooser>
    
      <div class="mt-4 flex place-content-end">
        <Button color="red" disabled={!$canForward$} on:click={() => scene?.forwardFromSelectRoleOfWolfStep()}>次へ</Button>
      </div>
    </div>
  </div>
</div>
