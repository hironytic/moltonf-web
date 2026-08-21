<!--
WatchingElementView.svelte

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
  import type { CharacterMap } from "../../story/CharacterMap"
  import type { WatchingElement } from "./WatchingScene.svelte"
  import { MoltonfMessageType } from "./WatchingScene.svelte"
  import { StoryElementTypes } from "../../story/StoryElement"
  import { EventNames } from "../../story/StoryEventName"
  import TalkView from "./TalkView.svelte"
  import { TalkTypes } from "../../story/TalkType"
  import StoryEventView from "./StoryEventView.svelte"
  import MoltonfMessageView from "./MoltonfMessageView.svelte"
  import { getContext, onMount } from "svelte"
  import { WatchingContext } from "./WatchingContext"
  import type { TalkMap } from "../../story/TalkMap"
  import { nullTalkMap } from "../../story/TalkMap"
  import type { Talk } from "../../story/Talk"

  const watchingContext = getContext<WatchingContext>(WatchingContext.Key)
  
  interface Props {
    characterMap?: CharacterMap
    faceIconUrlMap?: Map<string | symbol, string>
    talkMap?: TalkMap
    isTalkVisible?: (day: number, talk: Talk) => boolean
    currentDay?: number;
    element?: WatchingElement;
  }

  let {
    characterMap = new Map(),
    faceIconUrlMap = new Map(),
    talkMap = nullTalkMap(),
    isTalkVisible = () => true,
    currentDay = -1,
    element = {
      elementId: "",
      elementType: MoltonfMessageType,
      messageLines: [],
    }
  }: Props = $props()
  
  let elementDiv: HTMLDivElement | undefined = $state(undefined)
  
  function registerElement(elementId: string) {
    if (elementDiv !== undefined) {
      if (unreactives.lastElementId !== elementId) {
        if (unreactives.lastElementId !== undefined) {
          watchingContext.removeElement(unreactives.lastElementId)
        }
        unreactives.lastElementId = elementId
        watchingContext.addElement(elementId, elementDiv)
      }
    }
  }
  
  const unreactives = {
    lastElementId: undefined as string | undefined,
  }
  
  $effect(() => {
    registerElement(element.elementId)
  })
  
  onMount(() => {
    registerElement(element.elementId)
    return () => {
      if (unreactives.lastElementId !== undefined) {
        watchingContext.removeElement(unreactives.lastElementId)
      }
    }
  })
</script>

<div class="mb-4" bind:this={elementDiv}>
  {#if element.elementType === StoryElementTypes.TALK}
    <TalkView talk={element} {characterMap} {faceIconUrlMap} {talkMap} {currentDay} {isTalkVisible}/>
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
            talkNo: undefined,
            messageLines: element.messageLines
          }} {characterMap} {faceIconUrlMap} {talkMap} {currentDay} {isTalkVisible}/>
    {:else}
      <StoryEventView storyEvent={element}/>
    {/if}
  {:else if element.elementType === MoltonfMessageType}
    <MoltonfMessageView message={element}/>
  {/if}
</div>
