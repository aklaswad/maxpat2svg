/**
 * Merge 2 array<T> into array<R>, with looking at common identifier
 * For example, combine these 2 arrays;
 *
 *   const left = [ {id: 1, name: "Alice" }, {id: 3, name: "Chuck" }, {id: 5, name: "Eve" } ],
 *   const right = [ {id: 1, name: "Alex" }, {id: 4, name: "Dave"} ]
 *
 *   combineArray(
 *     o => o.id,
 *     (l, r, id) => ({ id: id, left: l?.name, right: r?.name }),
 *     left, right
 *   )
 * It creates a combined array like;
 *   [
 *     { id: 1, left: "Alice", right: "Alex" },
 *     { id: 3, left: "Chuck" },
 *     { id: 4, right: "Dave" },
 *     { id: 5, left: "Eve" }
 *   ]
 * @param identifier callback which returns representing string for an object<T>
 * @param merger callback which combine 2 value<T> into one object<R>
 * @param left An array<T> to be combined
 * @param right Another array<T> to be combined
 * @returns Merged array<R>
 */
export function combineArray<T,R>(
  identifier: (object: T) => string,
  merger: (leftItem: T | undefined, rightItem: T | undefined, identifier: string ) => R,
  left: T[],
  right: T[]
): R[]  {
  const lDict = Object.fromEntries( left.map( o => [identifier(o), o] ) )
  const rDict = Object.fromEntries( right.map( o => [identifier(o), o] ) )
  const mergedDict = Object.fromEntries(
    [ ...Object.keys(lDict), ...Object.keys(rDict) ].map( k => [k, 1])
  )
  return Object.keys(mergedDict).map( id => merger(lDict[id], rDict[id], id))
}

type jsonNodeType = 'array' | 'object' | 'primitive'
function getTypeOf(value: unknown): jsonNodeType {
  // Too cheap for JS values but it might be ok for values coming from JSON I think... :thinking:
  return Array.isArray(value) ? 'array'
    : value instanceof Object ? 'object'
    :                           'primitive'
    ;
}

export function deepEqual(left: any, right: any) {
  const type = getTypeOf(left)
  if (type != getTypeOf(right)) return false
  if (type === 'primitive') return left === right
  if (type === 'array') {
    return left.length === right.length && left.every((e:any, i: number) => deepEqual(e, right[i]))
  }
  return deepEqual(Object.entries(left).sort(), Object.entries(right).sort())
}