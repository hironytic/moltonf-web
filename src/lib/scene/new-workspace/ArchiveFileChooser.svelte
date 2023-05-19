<!--
ArchiveFileChooser.svelte

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
  import { createEventDispatcher } from "svelte"
  import FileOpenIcon from "../../icon/FileOpenIcon.svelte"
  import { Dropzone } from "flowbite-svelte"
  import StoryIcon from "../../icon/StoryIcon.svelte"

  const dispatch = createEventDispatcher()

  export let currentStory: string | undefined = undefined
  
  let className: string | undefined = undefined
  export { className as class }
  
  let files: FileList | undefined
  $: {
    const file: File | undefined = files?.[0]
    dispatch("select", file)
  }
  
  function onDragOver(ev: DragEvent) {
    ev.preventDefault()
    const dataTransfer = ev.dataTransfer ?? undefined
    if (dataTransfer !== undefined) {
      dataTransfer.dropEffect = "copy"
    }
  }

  function onDrop(ev: DragEvent) {
    ev.preventDefault()
    files = ev.dataTransfer?.files
  }
</script>

<Dropzone
  defaultClass="flex flex-col justify-center items-center w-full h-32 bg-gray-50 rounded-lg border-2 border-gray-300 border-dashed cursor-pointer dark:hover:bg-bray-800 dark:bg-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:hover:border-gray-500 dark:hover:bg-gray-600"
  class={className}
  on:dragover={onDragOver}
  on:drop={onDrop}
  bind:files
>
  <div class="flex items-center space-x-2 mb-4">
    {#if currentStory !== undefined}
      <StoryIcon size="2rem"/>
      <p class="font-medium">{currentStory}</p>
    {:else}
      <FileOpenIcon size="2rem"/>
      <p class="font-medium">村データを読み込む</p>
    {/if}
  </div>
  <div class="text-sm">
    {#if currentStory !== undefined}
      <p>別のデータに変更するには、ここをクリックしてXMLファイルを選択</p>
    {:else}
      <p>ここをクリックしてXMLファイルを選択</p>
    {/if}
    <p>または、ここにXMLファイルをドロップ</p>
  </div>
</Dropzone>
