const passwordInput = document.getElementById('passwordInput');
const copyButton = document.getElementById('copyButton');
const passwordSlider = document.getElementById('passwordSlider');
const lengthValue = document.getElementById('lengthValue');
const includeNumbers = document.getElementById('includeNumbers');
const includeLetters = document.getElementById('includeLetters');
const includeMixedCase = document.getElementById('includeMixedCase');
const includePunctuation = document.getElementById('includePunctuation');
const clipboardAlert = document.getElementById('clipboardAlert');
const optionsAlert = document.getElementById('optionsAlert');

const numbers = '0123456789';
const lowercase = 'abcdefghijklmnopqrstuvwxyz';
const uppercase = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
const punctuation = '!@#$%^&*()_+-=[]{}|;:,.<>?';

let clipboardTimeoutId = null;
let optionsTimeoutId = null;

passwordSlider.addEventListener('input', (e) => {
    lengthValue.textContent = e.target.value;
});

copyButton.addEventListener('click', () => {
    const password = passwordInput.value;
    
    if (password) {
        navigator.clipboard.writeText(password).then(() => {
            showAlert(clipboardAlert, clipboardTimeoutId);
        }).catch(() => {
            const textarea = document.createElement('textarea');
            textarea.value = password;
            document.body.appendChild(textarea);
            textarea.select();
            document.execCommand('copy');
            document.body.removeChild(textarea);
            showAlert(clipboardAlert, clipboardTimeoutId);
        });
    }
});

function showAlert(alertElement, existingTimeoutId) {
    if (existingTimeoutId) {
        clearTimeout(existingTimeoutId);
    }
    
    alertElement.classList.add('show');
    
    if (alertElement === clipboardAlert) {
        clipboardTimeoutId = setTimeout(() => {
            alertElement.classList.remove('show');
        }, 3000);
    } else if (alertElement === optionsAlert) {
        optionsTimeoutId = setTimeout(() => {
            alertElement.classList.remove('show');
        }, 3000);
    }
}

function generatePassword() {
    const length = parseInt(passwordSlider.value);
    let characterPool = '';
    
    if (includeNumbers.checked) {
        characterPool += numbers;
    }
    if (includeLetters.checked) {
        characterPool += lowercase;
    }
    if (includeMixedCase.checked) {
        characterPool += uppercase;
    }
    if (includePunctuation.checked) {
        characterPool += punctuation;
    }
    
    if (characterPool.length === 0) {
        passwordInput.value = '';
        showAlert(optionsAlert, optionsTimeoutId);
        return;
    }
    
    let password = '';
    for (let i = 0; i < length; i++) {
        const randomIndex = Math.floor(Math.random() * characterPool.length);
        password += characterPool[randomIndex];
    }
    
    passwordInput.value = password;
}

includeNumbers.addEventListener('change', generatePassword);
includeLetters.addEventListener('change', generatePassword);
includeMixedCase.addEventListener('change', generatePassword);
includePunctuation.addEventListener('change', generatePassword);
passwordSlider.addEventListener('change', generatePassword);

document.addEventListener('DOMContentLoaded', generatePassword);
