const remarks = [
  "🦜 Profilarr? I barely know her!",
  "🦜 AWK! Remember: I'm a parrot, not a life coach. Though if I were, I'd suggest spending less time on regex patterns and more time touching grass.",
];


export function getRandomRemark(): string {
  return remarks[Math.floor(Math.random() * remarks.length)];
}