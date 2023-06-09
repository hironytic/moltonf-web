<!--
TalkView.svelte

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
  import type { Talk } from "../../story/Talk"
  import { StoryElementTypes } from "../../story/StoryElement"
  import { TalkTypes } from "../../story/TalkType"
  import type { Avatar } from "../../story/Avatar"
  import { timeString } from "../../story/TimePart.js"
  import SpeechTail from "./SpeechTail.svelte"
  import ThoughtTail from "./ThoughtTail.svelte"
  import { graveIcon } from "./FaceIconUtils"
  import type { CharacterMap } from "../../story/CharacterMap.js"
  import type { MessageSegment } from "./MessageSegment"
  import { parseMessageSegments } from "./MessageSegment"
  import type { TalkMap, TalkWithDay } from "../../story/TalkMap"
  import { nullTalkMap } from "../../story/TalkMap"
  import MessageLine from "./MessageLine.svelte"
  import type { HistoryLocation } from "../../../History"
  import { getContext } from "svelte"
  import { AppContext } from "../../../AppContext"
  import { WatchingScene } from "./WatchingScene"

  export let talk: Talk = {
    elementId: "",
    elementType: StoryElementTypes.TALK,
    talkType: TalkTypes.PUBLIC,
    avatarId: "",
    xname: "",
    time: 0,
    talkNo: undefined,
    messageLines: []
  }
  
  export let characterMap: CharacterMap = new Map()
  export let faceIconUrlMap: Map<string | symbol, string> = new Map()
  export let talkMap: TalkMap = nullTalkMap()
  export let isTalkVisible: (day: number, talk: Talk) => boolean = (() => true)
  export let currentDay = -1

  const appContext = getContext<AppContext>(AppContext.Key)
  const scene$ = appContext.sceneAs$(WatchingScene)
  $: scene = $scene$
  
  let avatar: Avatar | undefined
  $: avatar = characterMap.get(talk.avatarId)?.avatar
  
  let faceIconUrl: string | undefined
  $: {
    if (talk.talkType === TalkTypes.GRAVE) {
      faceIconUrl = faceIconUrlMap.get(graveIcon)
    } else {
      const avatarId = avatar?.avatarId
      if (avatarId !== undefined) {
        faceIconUrl = faceIconUrlMap.get(avatarId)
      } else {
        faceIconUrl = undefined
      }
    }
  }
  
  let segmentsLines: MessageSegment[][]
  $: segmentsLines = talk.messageLines.map(line => parseMessageSegments(line, {
    currentDay,
    talkMap,
    isTalkVisible: (talk: TalkWithDay) => isTalkVisible(talk.day, talk.talk), 
  }))
  
  let location: HistoryLocation | undefined
  $: location = scene?.getLocation(currentDay, talk.elementId)
</script>

<div>
  {#if talk.talkNo !== undefined}
    <span class="time">{talk.talkNo}.</span>
  {/if}
  <span class="avatar-name">{avatar?.fullName}</span>
  <span class="time">{timeString(talk.time)}</span>
</div>
<div class="flex mt-1 items-center">
  <div class="shrink-0 w-[40px]">
    {#if faceIconUrl !== undefined}
      <img src={faceIconUrl} alt={avatar?.shortName ?? ""}/>
    {/if}
  </div>
  <div class="shrink-0 w-[16px]">
    {#if talk.talkType === TalkTypes.PUBLIC}
      <SpeechTail color="#fff"/>
    {:else if talk.talkType === TalkTypes.WOLF}
      <ThoughtTail color="#f77"/>
    {:else if talk.talkType === TalkTypes.PRIVATE}
      <ThoughtTail color="#939393"/>
    {:else if talk.talkType === TalkTypes.GRAVE}
      <ThoughtTail color="#9fb7cf"/>
    {/if}
  </div>
  <div class="grow p-2 rounded tt-{talk.talkType}">
    <p class="message">
      {#each segmentsLines as line, index}
        {#if index !== 0}
          <br/>
        {/if}
        <MessageLine segments={line} talkType={talk.talkType} {location}/>
      {/each}
    </p>
  </div>
</div>

<style>
  .message {
    font-family: "sans-serif";
    overflow-wrap: anywhere;
  }
  
  .avatar-name {
    color: #ddd;
  }
  
  .time {
    color: #666;
  }
  
  .tt-public {
    background-color: #fff;
    color: #000;
  }
  
  .tt-wolf {
    background-color: #f77;
    color: #000;
  }

  .tt-private {
    background-color: #939393;
    color: #000;
  }

  .tt-grave {
    background-color: #9fb7cf;
    color: #000;
  }
</style>
