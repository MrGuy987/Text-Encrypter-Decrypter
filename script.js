let currentTheme = localStorage.getItem('theme') || 'dark-mode';
document.body.classList.add(currentTheme);

function toggleTheme() {
  currentTheme = currentTheme === 'dark-mode' ? 'light-mode' : 'dark-mode';
  localStorage.setItem('theme', currentTheme);
  document.body.classList.remove('dark-mode', 'light-mode');
  document.body.classList.add(currentTheme);
}

function updateInputs() {
  const mode = document.getElementById('mode').value;
  document.getElementById('vigenere-input').classList.toggle('hidden', mode !== 'vigenere');
  document.getElementById('caesar-input').classList.toggle('hidden', mode !== 'caesar');
}

function generateVigenereKey() {
  const randomKey = Math.random().toString(36).substring(2, 8);
  document.getElementById('keyword').value = randomKey;
}

function generateCaesarShift() {
  const randomShift = Math.floor(Math.random() * 25) + 1;
  document.getElementById('shift').value = randomShift;
}

function updateCharCount() {
  const text = document.getElementById('text').value;
  document.getElementById('char-count').textContent = text.length;
}

document.getElementById('text').addEventListener('input', updateCharCount);

function vigenere(text, key, decrypt = false) {
  let result = '';
  key = key.toLowerCase().replace(/[^a-z]/g, '');
  if (!key) return 'Please enter a valid keyword.';
  let j = 0;
  for (let i = 0; i < text.length; i++) {
    let c = text[i];
    if (/[a-zA-Z]/.test(c)) {
      let isUpper = c === c.toUpperCase();
      let base = isUpper ? 65 : 97;
      let keyChar = key[j % key.length].charCodeAt(0) - 97;
      if (decrypt) keyChar = -keyChar;
      let shifted = (c.charCodeAt(0) - base + keyChar + 26) % 26;
      result += String.fromCharCode(base + shifted);
      j++;
    } else {
      result += c;
    }
  }
  return result;
}

function caesar(text, shift, decrypt = false) {
  if (decrypt) shift = -shift;
  return text.replace(/[a-zA-Z]/g, c => {
    const base = c === c.toLowerCase() ? 97 : 65;
    return String.fromCharCode(((c.charCodeAt(0) - base + shift + 26) % 26) + base);
  });
}

function base64Encode(text) {
  return btoa(unescape(encodeURIComponent(text)));
}

function base64Decode(text) {
  try {
    return decodeURIComponent(escape(atob(text)));
  } catch {
    return 'Invalid Base64!';
  }
}

function rot13(text) {
  return text.replace(/[a-zA-Z]/g, c => {
    const base = c === c.toLowerCase() ? 97 : 65;
    return String.fromCharCode(((c.charCodeAt(0) - base + 13) % 26) + base);
  });
}

function atbash(text) {
  return text.replace(/[a-zA-Z]/g, c => {
    const base = c === c.toLowerCase() ? 97 : 65;
    return String.fromCharCode(155 - c.charCodeAt(0));
  });
}

function encrypt() {
  const mode = document.getElementById('mode').value;
  const text = document.getElementById('text').value;
  let result = '';

  if (mode === 'vigenere') {
    const keyword = document.getElementById('keyword').value;
    result = vigenere(text, keyword);
  } else if (mode === 'caesar') {
    const shift = parseInt(document.getElementById('shift').value);
    result = caesar(text, shift);
  } else if (mode === 'base64') {
    result = base64Encode(text);
  } else if (mode === 'rot13') {
    result = rot13(text);
  } else if (mode === 'atbash') {
    result = atbash(text);
  }

  document.getElementById('result').textContent = result;
  document.getElementById('preview').classList.remove('hidden');
  document.getElementById('preview-text').textContent = result;
}

function decrypt() {
  const mode = document.getElementById('mode').value;
  const text = document.getElementById('text').value;
  let result = '';

  if (mode === 'vigenere') {
    const keyword = document.getElementById('keyword').value;
    result = vigenere(text, keyword, true);
  } else if (mode === 'caesar') {
    const shift = parseInt(document.getElementById('shift').value);
    result = caesar(text, shift, true);
  } else if (mode === 'base64') {
    result = base64Decode(text);
  } else if (mode === 'rot13') {
    result = rot13(text);
  } else if (mode === 'atbash') {
    result = atbash(text);
  }

  document.getElementById('result').textContent = result;
  document.getElementById('preview').classList.remove('hidden');
  document.getElementById('preview-text').textContent = result;
}

function copyToClipboard() {
  const text = document.getElementById('result').textContent;
  navigator.clipboard.writeText(text).then(() => alert('Copied to Clipboard!'));
}
