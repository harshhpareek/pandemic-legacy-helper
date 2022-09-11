export function cumSum (arr: number[]): number[] {
  const newArr = new Array<number>(arr.length)
  arr.reduce((prev, curr, i) => (newArr[i] = prev + curr), 0)
  return newArr
}
