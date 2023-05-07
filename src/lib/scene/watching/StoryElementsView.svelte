<!--
StoryElementsView.svelte

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
  import { WatchingScene } from "./WatchingScene"
  import { readable, type Readable } from "svelte/store"
  import type { StoryElement } from "../../story/StoryElement"
  import { StoryElementTypes } from "../../story/StoryElement"
  import StoryEventView from "./StoryEventView.svelte"
  import TalkView from "./TalkView.svelte"
  import { EventNames } from "../../story/StoryEventName"
  import { TalkTypes } from "../../story/TalkType"
  import type { Avatar } from "../../story/Avatar"

  const appContext = getContext<AppContext>(AppContext.Key)
  const scene$ = appContext.sceneAs$(WatchingScene)
  $: scene = $scene$

  let currentStoryElements$: Readable<StoryElement[]>
  $: currentStoryElements$ = scene?.currentStoryElements$ ?? readable([])
  
  let avatarMap$: Readable<Map<string, Avatar>>
  $: avatarMap$ = scene?.avatarMap$ ?? readable(new Map())
  
  let faceIconUrlMap$: Readable<Map<string | symbol, string>>
  $: faceIconUrlMap$ = scene?.faceIconUrlMap$ ?? readable(new Map())
</script>

{#each $currentStoryElements$ as element (element.elementId)}
  <div class="mb-4">
    {#if element.elementType === StoryElementTypes.TALK}
      <TalkView talk={element} avatarMap={$avatarMap$} faceIconUrlMap={$faceIconUrlMap$}/>
    {:else if element.elementType === StoryElementTypes.STORY_EVENT}
      {#if element.eventName === EventNames.ASSAULT}
        <!-- Handle special case: ASSAULT is displayed as Wolf's Talk -->
        <TalkView talk={{
          elementId: element.elementId,
          elementType: StoryElementTypes.TALK,
          talkType: TalkTypes.WOLF,
          avatarId: element.byWhom,
          xname: element.xname,
          time: element.time,
          messageLines: element.messageLines,
        }} avatarMap={$avatarMap$} faceIconUrlMap={$faceIconUrlMap$}/>
      {:else}
        <StoryEventView storyEvent={element}/>
      {/if}
    {/if}
  </div>
{/each}
