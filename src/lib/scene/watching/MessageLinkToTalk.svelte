<!--
MessageLinkToTalk.svelte

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
  import { getContext } from "svelte"
  import { AppContext } from "../../../AppContext.svelte"
  import { WatchingScene } from "./WatchingScene.svelte"
  import type { LinkToTalkSegment } from "./MessageSegment"
  import HistoryLink from "../../ui-component/HistoryLink.svelte"
  import type { TalkType } from "../../story/TalkType"
  import { TalkTypes } from "../../story/TalkType"
  import { HistoryLocation } from "../../../History.svelte"

  interface Props {
    segment?: LinkToTalkSegment
    talkType?: TalkType
    location?: HistoryLocation
  }

  let {
    segment = undefined,
    talkType = TalkTypes.PUBLIC,
    location = undefined,
  }: Props = $props()
  
  const appContext = getContext<AppContext>(AppContext.Key)
  let scene = $derived(appContext.sceneAs(WatchingScene))
  
  let linkTo = $derived.by(() => {
    if (segment !== undefined && scene !== undefined) {
      const talkWithDay = segment.talks[0]
      if (talkWithDay !== undefined) {
        return scene.getLocation(talkWithDay.day, talkWithDay.talk.elementId)
      }
    }
    return undefined
  })
</script>

{#if segment !== undefined && linkTo !== undefined}
  <HistoryLink from={location} to={linkTo}  >
    {#snippet children({ href, onClick })}
      <a class="tt-{talkType}" {href} onclick={onClick}>{segment.text}</a>
    {/snippet}
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
