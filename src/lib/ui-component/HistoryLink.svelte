<!--
HistoryLink.svelte

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
  import { HashHistory, HistoryLocation } from "../../History"
  import { getContext } from "svelte"
  import { AppContext } from "../../AppContext"

  const appContext = getContext<AppContext>(AppContext.Key)
  const history = appContext.history
  const isBrowserHistory = (history instanceof HashHistory)
  
  export let from = undefined as string | HistoryLocation | undefined
  export let to = "/" as string | HistoryLocation
  export let replace = false
  
  let fromLocation: HistoryLocation | undefined
  $: fromLocation = (from !== undefined) ? ((from instanceof HistoryLocation) ? from : HistoryLocation.fromPath(from)) : undefined
  
  let location: HistoryLocation
  $: location = (to instanceof HistoryLocation) ? to : HistoryLocation.fromPath(to)
  
  let href: string
  $: href = (isBrowserHistory) ? history.getHref(location) : ""

  function onClick(ev: MouseEvent) {
    function navigate() {
      ev.preventDefault()
      if (!replace && fromLocation !== undefined) {
        history.navigate(fromLocation, true, true)
      }
      history.navigate(location, replace)
    }
    
    if (isBrowserHistory) {
      // When clicked with modifier keys, leave it to the browser (because user may want to open in a separate tab or window)
      // When clicked with non-main mouse button, leave it to the browser, too.
      if (!(ev.metaKey || ev.altKey || ev.ctrlKey || ev.shiftKey) && ev.button === 0) {
        navigate()
      }
    } else {
      navigate()
    }
  }
</script>

<slot {href} {onClick}/>
