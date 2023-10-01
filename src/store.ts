import { writable, type Writable, derived } from 'svelte/store';
import { MaxPat } from './maxpat2svg'
import { type DiffItem, type SideOfDiff } from './types'
import { makeTree } from './util'

export const title: Writable<string> = writable('')
export type DiffFileItem = {
  name: string,
  id: string
}

export const showInspector: Writable<boolean> = writable(false)


/**
 * Main file list in flat form.
 */
export const diffItems: Writable<DiffItem[]> = writable([])

/**
 * Directory tree style of file list. Not includes sub patcher tree.
 */
export const diffItemTree = derived(diffItems, ($diffItems) => {
  return makeTree(Object.values($diffItems).map( i => ({ path: i.filePath || [''], item: i })))
//  return makeTree($diffItems.map( i => ({ path: i.path || [''], item: i })))
})

export const diffItemIndex: Writable<{[id: string]: DiffItem}> = writable({})

export const opacityBalance: Writable<number> = writable(500)
export const diffOpacity = derived(opacityBalance, ($opacityBalance) => {
  const v = $opacityBalance / 500
  return {
    right: Math.min(1.0, Math.max(0.0, v)),
    left: Math.min(1.0, Math.max(0.0, 2.0 - v))
  }
})

export type InspectTarget = { id: string, item: unknown, childPatcher?: MaxPat }
export const selecting: Writable<boolean> = writable(false)
export const selected: Writable<{[side in SideOfDiff]?: InspectTarget}> = writable({})
export const selectedDiff: Writable<DiffItem | undefined> = writable()
