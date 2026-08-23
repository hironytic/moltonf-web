<!--
OptionChooser.svelte

Copyright (c) 2023-2026 Hironori Ichimiya <hiron@hironytic.com>

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
  import classNames from "classnames"
  import { type Snippet } from "svelte"

  interface Props {
    options?: string[]
    value?: string
    class?: string
    onChoose?: (option: string) => void
    children?: Snippet<[string]>
  }

  let {
    options = [],
    value = $bindable(undefined),
    class: className,
    onChoose,
    children
  }: Props = $props()

  let clsNames: string = $derived(classNames(
    "w-full flex flex-col space-y-2",
    className ?? ""
  ))
  
  function onItemClicked(option: string) {
    value = option
    onChoose?.(option)
  }
</script>

<div class={clsNames}>
  {#each options as option (option)}
    {@const buttonClass = classNames(
      "w-full p-5 text-left rounded-lg cursor-pointer",
      "bg-gray-800 hover:bg-gray-700",
      "border-2",
      {"text-gray-400 border-gray-700 hover:text-gray-400": option !== value},
      {"text-red-500 border-red-600": option === value},
    )}
    <button class={buttonClass} onclick={() => void onItemClicked(option)}>
      {@render children?.(option)}
    </button>
  {/each}
</div>
