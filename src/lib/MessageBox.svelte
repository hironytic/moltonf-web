<!--
MessageBox.svelte

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
  import type { ExtendedMessageBoxItem, MessageBoxItemButton } from "./MessageBoxItem"
  import { Button, Modal } from "flowbite-svelte"
  import { getContext } from "svelte"
  import { AppContext } from "../AppContext"

  const appContext = getContext<AppContext>(AppContext.Key)
  const messageBoxItems$ = appContext.messageBoxItems$
  
  let messageBoxItem: ExtendedMessageBoxItem | undefined = undefined
  let open = false
  
  $: {
    if (!open && messageBoxItem !== undefined) {
      appContext.onMessageBoxClosed()
    }
    
    const itemsLength = $messageBoxItems$.length
    if (itemsLength === 0) {
      messageBoxItem = undefined
    } else {
      messageBoxItem = $messageBoxItems$[itemsLength - 1]
    }
    open = messageBoxItem !== undefined
  }
  
  function onButtonClicked(button: MessageBoxItemButton) {
    if (messageBoxItem !== undefined) {
      messageBoxItem.selected = button.key
    }
    open = false
  }
</script>

<Modal bind:open size="xs">
  {#if messageBoxItem !== undefined}
    {@const messageLines = messageBoxItem.message.split("\n")}
    <div class="text-center">
      <h2 class="mb-4 text-xl font-medium text-gray-300">{messageBoxItem.title}</h2>
      <div class="mb-4">
        {#each messageLines as line}
          {#if line === ""}
            <p><br></p>
          {:else}
            <p>{line}</p>
          {/if}
        {/each}
      </div>
      {#each messageBoxItem.buttons as button (button.key)}
        <Button color={button.color} class="first:ml-0 ml-2" on:click={() => onButtonClicked(button)}>{button.text}</Button>
      {/each}
    </div>
  {/if}
</Modal>
