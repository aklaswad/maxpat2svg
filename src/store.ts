import { writable, type Writable, derived } from 'svelte/store';
import { MaxPat } from './maxpat2svg'
import { type DiffItem } from './github'
import { makeTree } from './util'

export type MaxPatFile = {
  filename: string
  left?: MaxPat
  right?: MaxPat
}

export type DiffFileItem = {
  name: string,
  id: string
}

export const showInspector: Writable<boolean> = writable(false)

export const diffItems: Writable<{[key: string]: DiffItem[]}> = writable([])
export const diffItemTree = derived(diffItems, ($diffItems) => {
  return makeTree(Object.values($diffItems).map( i => ({ path: i.path || [''], item: i })))
})

export const opacityBalance: Writable<number> = writable(500)
export const diffOpacity = derived(opacityBalance, ($opacityBalance) => {
  const v = $opacityBalance / 1000
  return {
    right: v,
    left: 1.0 - v
  }
})
