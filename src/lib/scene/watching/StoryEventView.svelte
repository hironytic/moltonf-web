<!--
StoryEventView.svelte

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
  import type { StoryEvent } from "../../story/StoryEvent"
  import { StoryElementTypes } from "../../story/StoryElement"
  import { EventFamilies } from "../../story/EventFamily"
  import { EventNames } from "../../story/StoryEventName"

  export let storyEvent: StoryEvent = {
    elementId: "",
    elementType: StoryElementTypes.STORY_EVENT,
    eventFamily: EventFamilies.ANNOUNCE,
    eventName: EventNames.START_ENTRY,
    messageLines: [],
  } as StoryEvent
  
</script>

<div class="p-2 ef-{storyEvent.eventFamily}">
  <p class="message">
  {#each storyEvent.messageLines as line, index}
    {#if index !== 0}
      <br/>
    {/if}
    {line}
  {/each}
  </p>
</div> 

<style>
  .message {
    font-family: "sans-serif";
  }
  
  .ef-announce {
    border: 1px solid #ddd;
    color: #ddd;
  }

  .ef-order {
    border: 1px solid #f44;
    color: #f44;
  }

  .ef-extra {
    border: 1px solid #888;
    color: #888;
  }
</style>
