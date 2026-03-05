import { shuffle } from './shuffle'

describe('shuffle', () => {
  it('returns an array of the same length', () => {
    const input = ['A', 'B', 'C', 'D']
    expect(shuffle(input)).toHaveLength(4)
  })

  it('contains all original elements', () => {
    const input = ['A', 'B', 'C', 'D']
    const result = shuffle(input)
    expect(result).toEqual(expect.arrayContaining(input))
  })

  it('does not mutate the original array', () => {
    const input = ['A', 'B', 'C', 'D']
    const original = [...input]
    shuffle(input)
    expect(input).toEqual(original)
  })

  it('produces different orderings over many runs (probabilistic)', () => {
    const input = ['A', 'B', 'C', 'D', 'E']
    const results = new Set()
    for (let i = 0; i < 20; i++) {
      results.add(JSON.stringify(shuffle(input)))
    }
    expect(results.size).toBeGreaterThan(4)
  })
})
