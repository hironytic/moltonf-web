<!--
Confirm.svelte

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
  import { NewWorkspaceScene } from "./NewWorkspaceScene"
  import ChevronLeftIcon from "../../icon/ChevronLeftIcon.svelte"
  import { Button } from "flowbite-svelte"
  import HeaderTitle from "../../ui-component/HeaderTitle.svelte"
  import type { Readable } from "svelte/store"
  import { readable } from "svelte/store"
  import Footer from "../../ui-component/Footer.svelte"

  const appContext = getContext<AppContext>(AppContext.Key)
  const scene$ = appContext.sceneAs$(NewWorkspaceScene)
  $: scene = $scene$
  
  let name$: Readable<string>
  $: name$ = scene?.name$ ?? readable("")
</script>

<div class="overflow-y-auto">
  <div class="flex place-content-center">
    <div class="bg-black max-w-[600px] p-10 rounded-md">
      <Button color="dark" outline size="xs" on:click={() => scene?.backFromConfirmStep()}>
        <ChevronLeftIcon size="1rem"/> 戻る
      </Button>
      <HeaderTitle class="mt-4">観戦データの登録</HeaderTitle>
    
      <div class="text-sm mt-4">
        <p>観戦データ「{$name$}」を登録します。</p>
      </div>

      <div class="mt-8 text-center">
        <Button color="red" on:click={() => scene?.registerNewWorkspace()}>登録してプロローグへ</Button>
      </div>
      
      <div class="text-sm mt-8">
        <p>
          選択した役職に応じてあなたが着目するキャラクターが選ばれます。
          選ばれたキャラクターは、1日目の先頭で明らかになります。
          どのキャラクターになるかを楽しみにしながらプロローグをお読みください。
        </p>
      </div>
    </div>
  </div>
  <Footer/>
</div>
