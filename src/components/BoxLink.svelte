<script lang="ts">
  import { createEventDispatcher } from 'svelte';
  import { Box } from '../maxpat2svg'

  export let box: Box | undefined
  export let type: 'added' | 'removed' | 'modified' | undefined

  function stringifyBox () {
    let text = box?.text || box?.maxclass || box?.id || 'unknown box'
    if ( text.length > 12 ) {
      text = text.slice(0,12) + '...'
    }
    return text
  }

  const dispatch = createEventDispatcher()
  function clickBox () {
    if ( ! box ) return
    dispatch('click-box-link', {
      box: box,
      left: type !== 'added' ? box : undefined,
      right: type !== 'removed' ? box : undefined
    })
  }
</script>

{#if box}
  <button
    on:click|preventDefault|stopPropagation={clickBox}
    class={box.maxclass + ' ' + type}
  >
    {stringifyBox()}
  </button>
{/if}

<style>
  button {
    margin: 2px 4px;
    text-decoration: none;
    cursor: pointer;
    border-width: 2px;
    border-style: solid;
  }

  .added {
    color: #077a07;
    border-color: #077a07;
  }

  .removed {
    color: #d11414;
    border-color: #d11414;
  }

  .modified {
    color: #a09428;
    border-color: #a09428;
  }

  .comment {
    border-style: dotted;
  }

  .message {
    border-radius: 5px;
  }
</style>
