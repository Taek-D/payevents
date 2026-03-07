export function formatKRW(amount: number): string {
  return `${amount.toLocaleString("ko-KR")}원`
}

export function calculateBenefit(
  price: number,
  discountRate: number,
  maxBenefit: number
): number {
  const calculated = Math.floor(price * (discountRate / 100))
  return Math.min(calculated, maxBenefit)
}
