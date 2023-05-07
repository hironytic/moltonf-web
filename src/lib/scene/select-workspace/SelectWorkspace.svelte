<!--
SelectWorkspace.svelte

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
  import { SelectWorkspaceScene } from "./SelectWorkspaceScene"
  import { Button, Listgroup, ListgroupItem, Spinner } from "flowbite-svelte"
  import HeaderTitle from "../../ui-component/HeaderTitle.svelte"
  import WorkspaceIcon from "../../icon/WorkspaceIcon.svelte"
  import DeleteIcon from "../../icon/DeleteIcon.svelte"
  import { readable, type Readable } from "svelte/store"
  import type { Workspace } from "../../workspace/Workspace"

  const appContext = getContext<AppContext>(AppContext.Key)
  const scene$ = appContext.sceneAs$(SelectWorkspaceScene)
  $: scene = $scene$
  
  let workspaces$: Readable<Workspace[] | undefined>
  $: workspaces$ = scene?.workspaces$ ?? readable(undefined)
  
  async function deleteWorkspace(workspace: Workspace) {
    const result = await appContext.showMessageBox({
      title: "観戦データの削除",
      message: `観戦データ「${workspace.name}」を削除します。\n\n削除したデータを復活させることはできません。\nよろしいですか？`,
      buttons: [
        {
          key: "delete",
          color: "red",
          text: "削除する！"
        },
        {
          key: "cancel",
          color: "alternative",
          text: "キャンセル"
        },
      ]
    })
    if (result === "delete") {
      scene?.deleteWorkspace(workspace.id)
    }
  }
</script>

<div class="h-full flex flex-col place-items-center place-content-center">
  {#if $workspaces$ === undefined}
    <Spinner />
  {:else if $workspaces$.length === 0}
    <div class="bg-black max-w-[600px] p-10 rounded-md overflow-y-auto">
      <HeaderTitle class="mb-4">観戦を始めましょう！</HeaderTitle>
      
      <div class="my-12 flex justify-center">
        <Button color="red" on:click={() => scene?.createNewWorkspace()}>観戦データを作成して始める</Button>
      </div>

      <div class="text-sm">
        <p>
          Moltonfでは観戦する村の情報や観戦の進行状況を<strong class="text-red-500 font-normal">観戦データ</strong>として保存します。
          このデータはブラウザが管理するローカルコンピューター上のストレージに保存されます。
        </p>
        <p class="mt-2">
          観戦データはいくつも作成できます。作成したものは簡単に削除できます。まずは1つ目の観戦データを作成してみましょう！
        </p>
      </div>
    </div>
  {:else}
    <div class="bg-black max-w-[600px] p-10 rounded-md overflow-y-auto">
      <HeaderTitle>観戦データ</HeaderTitle>

      <div class="text-sm mt-4">
        <p>
          観戦するデータを選択してください。
          観戦データはブラウザが管理するローカルコンピューター上のストレージに保存されていて、村の情報や観戦の進行状況が含まれています。
        </p>
        <p class="mt-2">
          もう使わなくなったデータは、右にあるゴミ箱アイコンで削除できます。
        </p>
      </div>
      
      <Listgroup class="mt-4" active>
        {#each $workspaces$ as item (item.id)}
          <ListgroupItem on:click={() => scene?.selectWorkspace(item)}> 
            <div class="flex items-center justify-between w-full">
              <div class="inline-flex">
                <WorkspaceIcon size="1.25rem" class="mr-2"/>{item.name}
              </div>
              <button class="hover:text-red-500" on:click|stopPropagation={() => void deleteWorkspace(item)}>
                <DeleteIcon size="1.25rem"/>
              </button>
            </div>
          </ListgroupItem>
        {/each}
      </Listgroup>
      <div class="flex justify-end">
        <Button color="red" class="mt-2" on:click={() => scene?.createNewWorkspace()}>
          <WorkspaceIcon size="1.25rem" class="mr-2"/>
          新しい観戦データで始める
        </Button>
      </div>
    </div>
  {/if}
</div>
