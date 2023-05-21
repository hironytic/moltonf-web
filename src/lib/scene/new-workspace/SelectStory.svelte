<!--
SelectStory.svelte

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
  import { Button } from "flowbite-svelte"
  import HeaderTitle from "../../ui-component/HeaderTitle.svelte"
  import { loadStoryFromArchiveFile } from "../../story/Archive"
  import ArchiveFileChooser from "./ArchiveFileChooser.svelte"
  import ExternalSiteIcon from "../../icon/ExternalSiteIcon.svelte"
  import ChevronLeftIcon from "../../icon/ChevronLeftIcon.svelte"
  import type { Readable } from "svelte/store"
  import { readable } from "svelte/store"
  import type { Story } from "../../story/Story"

  const appContext = getContext<AppContext>(AppContext.Key)
  const scene$ = appContext.sceneAs$(NewWorkspaceScene)
  $: scene = $scene$

  let currentStory$: Readable<Story | undefined>
  $: currentStory$ = scene?.story$ ?? readable(undefined)
  let currentStoryName: string | undefined
  $: currentStoryName = $currentStory$?.villageFullName
  
  async function onArchiveFileSelect(file: File | undefined) {
    if (file !== undefined) {
      try {
        const story = await loadStoryFromArchiveFile(file)
        scene?.setStory(story)
      } catch (e) {
        console.error(e)
        await appContext.showMessageBox({
          title: "村データの読み込み",
          message: "指定されたファイルから、村データを読み込めませんでした。",
          buttons: [
            {
              key: "ok",
              color: "red",
              text: "OK"
            }
          ]
        })
      }
    }
  }
</script>

<div class="bg-black max-w-[600px] p-10 rounded-md">
  <Button color="dark" outline size="xs" on:click={() => scene?.backFromSelectStoryStep()}>
    <ChevronLeftIcon size="1rem"/> 戻る
  </Button>
  <HeaderTitle class="mt-4">村データの読み込み</HeaderTitle>

  <div class="text-sm mt-4">
    <p>
      <a class="text-red-500 underline hover:text-gray-300 inline-flex items-baseline" href="https://wolfbbs.jp/%B6%A6%C4%CC%A5%A2%A1%BC%A5%AB%A5%A4%A5%D6%B4%F0%C8%D7%C0%B0%C8%F7%B7%D7%B2%E8.html" target="_blank" rel="noopener noreferrer">人狼BBSの共通アーカイブ<ExternalSiteIcon size="0.8rem"/></a>形式のXMLファイルを用意してください。
      そのXMLファイルの村データを読み込みます。
      読み込んだデータはブラウザが管理するローカルコンピューター上のストレージに保存されます
      （観戦データが作成された後は、ここで選択したXMLファイルはもう参照しません）。
    </p>
  </div>
  
  <ArchiveFileChooser class="mt-4" currentStory={currentStoryName} on:select={(ev) => onArchiveFileSelect(ev.detail ?? undefined)}/>
</div>
