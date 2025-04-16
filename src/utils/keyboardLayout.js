const RUSSIAN_CONSONANTS = 'бвгджзйклмнпрстфхцчшщ'
const ENGLISH_CONSONANTS = 'bcdfghjklmnpqrstvwxyz'

const LAYOUT_MAP = {
  'й': 'q', 'ц': 'w', 'у': 'e', 'к': 'r', 'е': 't', 'н': 'y', 'г': 'u', 'ш': 'i', 'щ': 'o', 'з': 'p',
  'ф': 'a', 'ы': 's', 'в': 'd', 'а': 'f', 'п': 'g', 'р': 'h', 'о': 'j', 'л': 'k', 'д': 'l',
  'я': 'z', 'ч': 'x', 'с': 'c', 'м': 'v', 'и': 'b', 'т': 'n', 'ь': 'm',
  'q': 'й', 'w': 'ц', 'e': 'у', 'r': 'к', 't': 'е', 'y': 'н', 'u': 'г', 'i': 'ш', 'o': 'щ', 'p': 'з',
  'a': 'ф', 's': 'ы', 'd': 'в', 'f': 'а', 'g': 'п', 'h': 'р', 'j': 'о', 'k': 'л', 'l': 'д',
  'z': 'я', 'x': 'ч', 'c': 'с', 'v': 'м', 'b': 'и', 'n': 'т', 'm': 'ь'
}

const isConsonant = (char) => {
  const lowerChar = char.toLowerCase()
  return RUSSIAN_CONSONANTS.includes(lowerChar) || ENGLISH_CONSONANTS.includes(lowerChar)
}

export const hasConsecutiveConsonants = (text, count = 3) => {
  if (!text || text.length < count) return false
  
  let consecutiveCount = 0
  for (let i = 0; i < text.length; i++) {
    if (isConsonant(text[i])) {
      consecutiveCount++
      if (consecutiveCount >= count) return true
    } else {
      consecutiveCount = 0
    }
  }
  return false
}

export const suggestLayout = (text) => {
  const russianConsonantCount = text.toLowerCase().split('').filter(char => RUSSIAN_CONSONANTS.includes(char)).length
  const englishConsonantCount = text.toLowerCase().split('').filter(char => ENGLISH_CONSONANTS.includes(char)).length
  
  return russianConsonantCount > englishConsonantCount ? 'английскую' : 'русскую'
}

export const convertLayout = (text) => {
  if (!text) return ''
  
  return text.split('').map(char => {
    const lowerChar = char.toLowerCase()
    const convertedChar = LAYOUT_MAP[lowerChar]
    
    if (!convertedChar) return char
    
    return char === lowerChar ? convertedChar : convertedChar.toUpperCase()
  }).join('')
} 