<!--
Invalid.svelte

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
  import { InvalidScene } from "./InvalidScene"
  import Footer from "../../ui-component/Footer.svelte"
  import HeaderTitle from "../../ui-component/HeaderTitle.svelte"

  const appContext = getContext<AppContext>(AppContext.Key)
  const scene$ = appContext.sceneAs$(InvalidScene)
  $: scene = $scene$
  
  let message: string
  $: message = scene?.message ?? ""
</script>

<div class="h-full flex flex-col place-content-center">
  <div class="overflow-y-auto">
    <div class="flex place-content-center">
      <div class="bg-black max-w-[600px] p-10 rounded-md">
        <HeaderTitle class="mb-4">Error</HeaderTitle>        
        <div class="text-sm">{message}</div>
      </div>
    </div>
    <Footer/>
  </div>
</div>
