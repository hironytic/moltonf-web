<!--
MessageLine.svelte

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
  import type { MessageSegment } from "./MessageSegment"
  import { MessageSegmentTypes } from "./MessageSegment"
  import MessageLinkToTalk from "./MessageLinkToTalk.svelte"
  import { type TalkType, TalkTypes } from "../../story/TalkType"
  import type { HistoryLocation } from "../../../History"

  export let segments: MessageSegment[] = []
  export let talkType: TalkType = TalkTypes.PUBLIC
  export let location = undefined as HistoryLocation | undefined
</script>

{#each segments as segment}
  {#if segment.type === MessageSegmentTypes.general}
    {segment.text}
  {:else if segment.type === MessageSegmentTypes.linkToTalk}
    <MessageLinkToTalk {segment} {talkType} {location}/>
  {/if}
{/each}
