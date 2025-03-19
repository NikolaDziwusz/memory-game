export async function fetchEmojis(category: string) {
  return fetch(`https://emojihub.yurace.pro/api/all/category/${category}`)
}

