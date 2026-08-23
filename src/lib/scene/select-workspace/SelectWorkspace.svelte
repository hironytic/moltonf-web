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
  import { AppContext } from "../../../AppContext.svelte"
  import { SelectWorkspaceScene } from "./SelectWorkspaceScene.svelte"
  import { Button, Listgroup, ListgroupItem, Spinner } from "flowbite-svelte"
  import HeaderTitle from "../../ui-component/HeaderTitle.svelte"
  import WorkspaceIcon from "../../icon/WorkspaceIcon.svelte"
  import DeleteIcon from "../../icon/DeleteIcon.svelte"
  import type { Workspace } from "../../workspace/Workspace"
  import { HistoryLocation } from "../../../History.svelte"
  import HistoryLink from "../../ui-component/HistoryLink.svelte"
  import Footer from "../../ui-component/Footer.svelte"

  const appContext = getContext<AppContext>(AppContext.Key)
  let scene = $derived(appContext.sceneAs(SelectWorkspaceScene))
  
  let workspaces = $derived(scene?.workspaces)
  
  async function deleteWorkspace(ev: Event, workspace: Workspace) {
    ev.stopPropagation()
    ev.preventDefault()
    
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
      scene?.deleteWorkspace(workspace)
    }
  }
</script>

<div class="h-full flex flex-col place-content-center">
  <div class="overflow-y-auto">
    <div class="flex place-content-center">
      {#if workspaces === undefined}
        <Spinner />
      {:else if workspaces.length === 0}
        <div class="bg-black max-w-[600px] p-10 rounded-md">
          <HeaderTitle class="mb-4">観戦を始めましょう！</HeaderTitle>
          
          <div class="my-12 flex justify-center">
            <Button color="red" onclick={() => scene?.createNewWorkspace()}>観戦データを作成して始める</Button>
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
        <div class="bg-black max-w-[600px] p-10 rounded-md">
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
            {#each workspaces as item (item.id)}
              {@const location = HistoryLocation.fromComponents(["/", item.id])}
              <HistoryLink to={location}  >
                {#snippet children({ href, onClick })}
                  <ListgroupItem href={href} onclick={onClick}>
                    <div class="flex items-center justify-between w-full">
                      <div class="inline-flex">
                        <WorkspaceIcon size="1.25rem" class="mr-2"/>{item.name}
                      </div>
                      <button class="hover:text-red-500" onclick={(ev) => void deleteWorkspace(ev, item)}>
                        <DeleteIcon size="1.25rem"/>
                      </button>
                    </div>
                  </ListgroupItem>
                {/snippet}
              </HistoryLink>
            {/each}
          </Listgroup>
          <div class="flex justify-end">
            <Button color="red" class="mt-2" onclick={() => scene?.createNewWorkspace()}>
              <WorkspaceIcon size="1.25rem" class="mr-2"/>
              新しい観戦データで始める
            </Button>
          </div>
        </div>
      {/if}
    </div>
    <Footer/>
  </div>
</div>
