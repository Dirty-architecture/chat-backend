 interface ICursor<T> {
  items: T[]
  hasNext: boolean
  /** Курсор для следующей страницы (например, id последнего элемента текущей страницы) */
  cursor: string | null
}

export type {ICursor}