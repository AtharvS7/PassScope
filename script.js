const COMMON_PASSWORDS = [
  'password', '123456', '12345678', 'qwerty', 'abc123', 'monkey', '1234567',
  'letmein', 'trustno1', 'dragon', 'baseball', 'iloveyou', 'master', 'sunshine',
  'ashley', 'bailey', 'passw0rd', 'shadow', '123123', '654321', 'superman',
  'qazwsx', 'michael', 'football', 'password1', 'password123', 'welcome',
  'hello', 'charlie', 'donald', 'admin', 'login', 'starwars'
];

const dictionaryWords = [
  'password', 'welcome', 'hello', 'world', 'love', 'money', 'work', 'time',
  'user', 'account', 'secure', 'access', 'login', 'admin', 'master', 'secret'
];

const passwordInput = document.getElementById('passwordInput');
const toggleVisibility = document.getElementById('toggleVisibility');
const resetBtn = document.getElementById('resetBtn');
const copyBtn = document.getElementById('copyBtn');
const strengthBar = document.getElementById('strengthBar');
const strengthText = document.getElementById('strengthText');
const scoreValue = document.getElementById('scoreValue');
const entropyValue = document.getElementById('entropyValue');
const crackTime = document.getElementById('crackTime');
const hackProbability = document.getElementById('hackProbability');
const tipsSection = document.getElementById('tipsSection');
const tipsList = document.getElementById('tipsList');
const eyeIcon = document.getElementById('eyeIcon');
const eyeOffIcon = document.getElementById('eyeOffIcon');

toggleVisibility.addEventListener('click', () => {
  const isPassword = passwordInput.type === 'password';
  passwordInput.type = isPassword ? 'text' : 'password';
  eyeIcon.classList.toggle('hidden', isPassword);
  eyeOffIcon.classList.toggle('hidden', !isPassword);
});

resetBtn.addEventListener('click', () => {
  passwordInput.value = '';
  analyzePassword('');
});

copyBtn.addEventListener('click', async () => {
  const password = passwordInput.value;
  if (!password) return;
  
  try {
    await navigator.clipboard.writeText(password);
    // Provide visual feedback
    const originalIcon = copyBtn.innerHTML;
    copyBtn.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="20 6 9 17 4 12"></polyline></svg>';
    setTimeout(() => {
      copyBtn.innerHTML = originalIcon;
    }, 2000);
  } catch (err) {
    // Fallback for older browsers
    passwordInput.select();
    document.execCommand('copy');
    passwordInput.blur();
    alert('Password copied to clipboard');
  }
});

passwordInput.addEventListener('input', (e) => {
  analyzePassword(e.target.value);
});

function analyzePassword(password) {
  const result = calculateStrength(password);
  updateUI(result, password);
}

function calculateStrength(password) {
  let score = 0;
  const tips = [];

  if (!password) {
    return { score: 0, level: 'empty', tips: [] };
  }

  if (password.length >= 12) {
    score += 20;
  } else if (password.length >= 8) {
    score += 10;
  } else {
    tips.push('Add more characters (at least 8, preferably 12+)');
  }

  if (/[A-Z]/.test(password)) {
    score += 10;
  } else {
    tips.push('Add uppercase letters');
  }

  if (/[a-z]/.test(password)) {
    score += 10;
  } else {
    tips.push('Add lowercase letters');
  }

  if (/[0-9]/.test(password)) {
    score += 10;
  } else {
    tips.push('Include numbers');
  }

  if (/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) {
    score += 10;
  } else {
    tips.push('Add special characters (!@#$%^&*)');
  }

  if (password.length >= 8) {
    const hasRepeated = /(.)\1{2,}/.test(password);
    if (hasRepeated) {
      score -= 10;
      tips.push('Avoid repeated characters');
    }
  }

  const lowerPassword = password.toLowerCase();
  const isCommon = COMMON_PASSWORDS.some(p => lowerPassword.includes(p));
  if (isCommon) {
    score -= 15;
    tips.push('Avoid common passwords');
  }

  const hasDictionaryWord = dictionaryWords.some(word => lowerPassword.includes(word));
  if (hasDictionaryWord) {
    score -= 10;
    tips.push('Avoid dictionary words');
  }

  const uniqueChars = new Set(password).size;
  if (uniqueChars < password.length * 0.5 && password.length > 5) {
    score -= 10;
    tips.push('Use more unique characters');
  }

  score = Math.max(0, Math.min(100, score));

  let level;
  if (score < 20) level = 'very-weak';
  else if (score < 40) level = 'weak';
  else if (score < 60) level = 'moderate';
  else if (score < 80) level = 'strong';
  else level = 'very-strong';

  return { score, level, tips };
}

function calculateEntropy(password) {
  if (!password) return 0;
  let charsetSize = 0;
  if (/[a-z]/.test(password)) charsetSize += 26;
  if (/[A-Z]/.test(password)) charsetSize += 26;
  if (/[0-9]/.test(password)) charsetSize += 10;
  if (/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) charsetSize += 32;
  if (charsetSize === 0) return 0;
  return Math.floor(password.length * Math.log2(charsetSize));
}

function estimateCrackTime(entropy) {
  const guessesPerSecond = 1e10;
  const totalGuesses = Math.pow(2, entropy);
  const seconds = totalGuesses / guessesPerSecond / 2;

  if (seconds < 1) return 'Instantly';
  if (seconds < 60) return `${Math.floor(seconds)} seconds`;
  if (seconds < 3600) return `${Math.floor(seconds / 60)} minutes`;
  if (seconds < 86400) return `${Math.floor(seconds / 3600)} hours`;
  if (seconds < 31536000) return `${Math.floor(seconds / 86400)} days`;
  if (seconds < 31536000 * 100) return `${Math.floor(seconds / 31536000)} years`;
  if (seconds < 31536000 * 1000000) return `${Math.floor(seconds / 31536000 / 100)} centuries`;
  return 'Virtually forever';
}

function calculateHackProbability(score) {
  const probability = Math.max(0, Math.min(100, 100 - score));
  return `${probability}%`;
}

function updateUI(result, password) {
  const { score, level, tips } = result;

  strengthBar.className = 'strength-bar';
  if (level !== 'empty') {
    strengthBar.classList.add(level);
  }
  strengthBar.style.width = level === 'empty' ? '0%' : `${score}%`;

  const levelLabels = {
    'empty': 'Enter a password',
    'very-weak': 'Very Weak',
    'weak': 'Weak',
    'moderate': 'Moderate',
    'strong': 'Strong',
    'very-strong': 'Very Strong'
  };
  strengthText.textContent = levelLabels[level];

  const colors = {
    'empty': '#64748b',
    'very-weak': '#ef4444',
    'weak': '#f97316',
    'moderate': '#eab308',
    'strong': '#84cc16',
    'very-strong': '#22c55e'
  };
  strengthText.style.color = colors[level];

  scoreValue.textContent = score;

  if (password) {
    const entropy = calculateEntropy(password);
    entropyValue.textContent = entropy;
    crackTime.textContent = estimateCrackTime(entropy);
    hackProbability.textContent = calculateHackProbability(score);
  } else {
    entropyValue.textContent = '0';
    crackTime.textContent = '--';
    hackProbability.textContent = '--';
  }

  if (tips.length > 0 && score < 80) {
    tipsSection.classList.remove('hidden');
    tipsList.innerHTML = tips.map(tip => `<li>${tip}</li>`).join('');
  } else {
    tipsSection.classList.add('hidden');
  }
}

// Help Button Functionality
const helpBtn = document.getElementById('helpBtn');
const helpTooltip = document.getElementById('helpTooltip');

let tooltipTimeout;

// Show tooltip on hover or click
const showHelpTooltip = () => {
  helpTooltip.classList.add('active');
  clearTimeout(tooltipTimeout);
};

// Hide tooltip after delay when not hovering
const hideHelpTooltip = () => {
  tooltipTimeout = setTimeout(() => {
    helpTooltip.classList.remove('active');
  }, 300);
};

// Toggle tooltip on click
helpBtn.addEventListener('click', (e) => {
  e.stopPropagation();
  helpTooltip.classList.toggle('active');
});

// Show tooltip on hover
helpBtn.addEventListener('mouseenter', showHelpTooltip);
helpBtn.addEventListener('mouseleave', hideHelpTooltip);

// Also show tooltip on focus (keyboard accessibility)
helpBtn.addEventListener('focus', showHelpTooltip);
helpBtn.addEventListener('blur', hideHelpTooltip);

// Hide tooltip when clicking outside
document.addEventListener('click', (e) => {
  if (!helpTooltip.contains(e.target) && !helpBtn.contains(e.target)) {
    helpTooltip.classList.remove('active');
  }
});

// Prevent tooltip from hiding when interacting with it
helpTooltip.addEventListener('mouseenter', () => {
  clearTimeout(tooltipTimeout);
});

helpTooltip.addEventListener('mouseleave', hideHelpTooltip);
