export const formatPrice = (price: string, fraction: string, thousand: string) => {
  switch (price.length) {
    case 1:
      return '0' + fraction + '0' + price
    case 2:
      return '0' + fraction + price
    case 3:
      const [d1, d2, d3] = price
      return d1 + fraction + d2 + d3
    default:
      return price
        .split('')
        .reverse()
        .reduce((acc, cur, i) => {
          if (i === 2) {
            return [...acc, fraction, cur]
          }
          if (i !== 0 && (i - 2) % 3 === 0) {
            return [...acc, thousand, cur]
          }
          return [...acc, cur]
        }, [] as string[])
        .reverse()
        .join('')
  }
}
