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
  import { getContext, onMount } from "svelte"
  import { AppContext } from "../../../AppContext"
  import { NewWorkspaceScene } from "./NewWorkspaceScene"
  import { readable, type Readable, writable } from "svelte/store"
  import type { StoryEntry } from "../../storage/StoryStore"
  import { Button, Listgroup, ListgroupItem, Spinner } from "flowbite-svelte"
  import HeaderTitle from "../../ui-component/HeaderTitle.svelte"
  import StoryIcon from "../../icon/StoryIcon.svelte"
  import { loadStoryFromArchiveFile } from "../../story/Archive"
  import ArchiveFileChooser from "./ArchiveFileChooser.svelte"
  import ExternalSiteIcon from "../../icon/ExternalSiteIcon.svelte"
  import ChevronLeftIcon from "../../icon/ChevronLeftIcon.svelte"
  import CheckIcon from "../../icon/CheckIcon.svelte"

  const appContext = getContext<AppContext>(AppContext.Key)
  const scene$ = appContext.sceneAs$(NewWorkspaceScene)
  $: scene = $scene$

  let currentStoryEntry$: Readable<StoryEntry | undefined>
  $: currentStoryEntry$ = scene?.storyEntry$ ?? readable(undefined)
  
  const storyEntries$ = writable<StoryEntry[] | undefined>(undefined)

  async function reloadStoryEntries(): Promise<void> {
    const storyStore = await appContext.getStoryStore()
    storyEntries$.set(await storyStore.getEntries())
  }
  
  onMount(() => {
    void reloadStoryEntries()
  })

  async function onArchiveFileSelect(file: File | undefined) {
    if (file !== undefined) {
      const story = await loadStoryFromArchiveFile(file)

      const result = await appContext.showMessageBox({
        title: "村データの登録",
        message: `「${story.villageFullName}」を登録します。`,
        buttons: [
          {
            key: "ok",
            color: "red",
            text: "登録する"
          },
          {
            key: "cancel",
            color: "light",
            text: "キャンセル"
          },
        ],
      })
      
      if (result === "ok") {
        scene?.registerNewStory(story)
      }
    }
  }
</script>

{#if $storyEntries$ === undefined}
  <Spinner />
{:else if $storyEntries$.length === 0}
  <div class="bg-black max-w-[600px] p-10 rounded-md overflow-y-auto">
    <Button color="dark" outline size="xs" on:click={() => scene?.backFromSelectStoryStep()}>
      <ChevronLeftIcon size="1rem"/> 戻る
    </Button>
    <HeaderTitle class="mt-4">村データを登録</HeaderTitle>

    <div class="text-sm mt-4">
      <p>
        <a class="text-red-500 underline hover:text-gray-300 inline-flex items-baseline" href="https://wolfbbs.jp/%B6%A6%C4%CC%A5%A2%A1%BC%A5%AB%A5%A4%A5%D6%B4%F0%C8%D7%C0%B0%C8%F7%B7%D7%B2%E8.html" target="_blank" rel="noopener noreferrer">人狼BBSの共通アーカイブ<ExternalSiteIcon size="0.8rem"/></a>形式のXMLファイルを用意してください。
        そのXMLファイルを読み込んで村データとして登録します。
        村データはお使いのブラウザが管理するローカルコンピューター上のストレージに保存されます。        
      </p>
    </div>
    
    <ArchiveFileChooser class="mt-4" on:select={(ev) => onArchiveFileSelect(ev.detail ?? undefined)}/>
  </div>
{:else}
  <div class="bg-black max-w-[600px] p-10 rounded-md overflow-y-auto">
    <Button color="alternative" size="xs" on:click={() => scene?.backFromSelectStoryStep()}>
      <ChevronLeftIcon size="1rem"/> 戻る
    </Button>
    <HeaderTitle class="mt-4">村データの選択</HeaderTitle>

    <div class="text-sm mt-4">
      <p>
        過去に登録した村データを使って新しく観戦データを作ることができます。
        前回とは違った視点で観戦してみるのも面白いかもしれませんね。</p>
      <p class="mt-2">
        または、別の村データを登録して、新しく観戦することもできます。
      </p>
    </div>

    <Listgroup active class="mt-4">
      {#each $storyEntries$ as item (item.id)}
        <ListgroupItem on:click={() => scene?.selectStory(item)}>
          <div class="flex items-center space-x-2">
            <StoryIcon size="1.25rem"/>
            <span>{item.name}</span>
            {#if $currentStoryEntry$?.id === item.id}
              <CheckIcon size="1.25rem" class="text-gray-300"/>
            {/if}
          </div>
        </ListgroupItem>
      {/each}
    </Listgroup>

    <ArchiveFileChooser class="mt-4" on:select={(ev) => onArchiveFileSelect(ev.detail ?? undefined)}/>
  </div>
{/if}
