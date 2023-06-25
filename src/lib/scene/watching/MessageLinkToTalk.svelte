<!--
MessageLinkToTalk.svelte

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
  import type { LinkToTalkSegment } from "./MessageSegment"
  import HistoryLink from "../../ui-component/HistoryLink.svelte"
  import type { TalkType } from "../../story/TalkType"
  import { TalkTypes } from "../../story/TalkType"
  import { HistoryLocation } from "../../../History"

  export let segment = undefined as LinkToTalkSegment | undefined
  export let talkType: TalkType = TalkTypes.PUBLIC
  
  const appContext = getContext<AppContext>(AppContext.Key)
  const scene$ = appContext.sceneAs$(WatchingScene)
  $: scene = $scene$
  
  let linkTo: HistoryLocation | undefined
  $: {
    linkTo = undefined
    if (segment !== undefined && scene !== undefined) {
      const talkWithDay = segment.talks[0]
      if (talkWithDay !== undefined) {
        linkTo = scene.getLocation(talkWithDay.day, talkWithDay.talk.elementId)
      }
    }
  }
</script>

{#if segment !== undefined && linkTo !== undefined}
  <HistoryLink to={linkTo} let:href let:onClick>
    <a class="tt-{talkType}" {href} on:click={onClick}>{segment.text}</a>
  </HistoryLink>
{/if}

<style lang="scss">
  .tt-public {
    color: #f00;
    text-decoration: underline;
    &:hover {
      text-decoration: none;
    }
  }

  .tt-wolf {
    color: #fff;
    text-decoration: underline;
    &:hover {
      text-decoration: none;
    }
  }

  .tt-private {
    color: #fff;
    text-decoration: underline;
    &:hover {
      text-decoration: none;
    }
  }

  .tt-grave {
    color: #00f;
    text-decoration: underline;
    &:hover {
      text-decoration: none;
    }
  }
</style>
