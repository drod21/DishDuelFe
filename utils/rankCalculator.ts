export function calculateRank(mmr: number): keyof typeof rankColors {
  if (mmr < 1000) return 'Unranked'
  if (mmr < 1500) return 'Bronze'
  if (mmr < 2000) return 'Silver'
  if (mmr < 2500) return 'Gold'
  if (mmr < 3000) return 'Platinum'
  if (mmr < 3500) return 'Diamond'
  return 'Quartz'
}

export const rankColors = {
  Unranked: '#808080',
  Bronze: '#CD7F32',
  Silver: '#C0C0C0',
  Gold: '#FFD700',
  Platinum: '#E5E4E2',
  Diamond: '#B9F2FF',
  Quartz: '#51484F',
}
