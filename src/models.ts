export type Note =
  | {
      id: number
      timestamp: number
      kind: 'Holiday'
      budget: number
    }
  | {
      id: number
      timestamp: number
      kind: 'Event'
      address: string
    }
  | {
      id: number
      timestamp: number
      kind: 'Other'
      description: string
    }
