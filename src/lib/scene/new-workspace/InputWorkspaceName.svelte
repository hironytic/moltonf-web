<!--
InputWorkspaceName.svelte

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
  import { getContext, onMount } from "svelte"
  import { AppContext } from "../../../AppContext"
  import { NewWorkspaceScene } from "./NewWorkspaceScene"
  import HeaderTitle from "../../ui-component/HeaderTitle.svelte"
  import { Button, Input } from "flowbite-svelte"
  import ChevronLeftIcon from "../../icon/ChevronLeftIcon.svelte"
  import type { Readable, Writable } from "svelte/store"
  import { readable, writable } from "svelte/store"
  import Footer from "../../ui-component/Footer.svelte"

  const appContext = getContext<AppContext>(AppContext.Key)
  const scene$ = appContext.sceneAs$(NewWorkspaceScene)
  $: scene = $scene$
  
  let name$: Writable<string>
  $: name$ = scene?.name$ ?? writable("")
  
  let nameInput: HTMLInputElement | undefined = undefined

  let canForward$: Readable<boolean>
  $: canForward$ = scene?.canForwardFromInputNameStep$ ?? readable(false)
  
  onMount(() => {
    nameInput?.focus()
  })
</script>

<div class="overflow-y-auto">
  <div class="flex place-content-center">
    <div class="bg-black max-w-[600px] p-10 rounded-md">
      <Button color="alternative" size="xs" on:click={() => scene?.backFromInputNameStep()}>
        <ChevronLeftIcon size="1rem"/> 戻る
      </Button>
      <HeaderTitle class="mt-4">観戦データの名前</HeaderTitle>
    
      <div class="text-sm mt-4">
        <p>
          この観戦データに後で自分が見てわかりやすい名前を付けてください。
        </p>
      </div>
    
      <form
        class="flex mt-4 space-x-2"
        on:submit|preventDefault={() => scene?.forwardFromInputNameStep()}
      >
        <div class="grow">
          <Input required let:props>
            <input type="text" bind:value={$name$} bind:this={nameInput} {...props}/> 
          </Input>
        </div>
        <Button class="shrink-0" type="submit" color="red" disabled={!$canForward$}>次へ</Button>
      </form>
    </div>
  </div>
  <Footer/>
</div>
