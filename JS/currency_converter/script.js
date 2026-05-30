const API_KEY = '1d7f34c5f3cd1a66cb5cb978';
const COUNTRY_LIST_API = 'https://restcountries.com/v3.1/all?fields=name,currencies,flag';
const EXCHANGE_RATE_API = 'https://v6.exchangerate-api.com/v6';

const amountInput = document.getElementById('amount');
const fromCurrencySelect = document.getElementById('fromCurrency');
const toCurrencySelect = document.getElementById('toCurrency');
const convertBtn = document.getElementById('convertBtn');
const resultDiv = document.getElementById('result');
const errorDiv = document.getElementById('error');

let currenciesData = [];

async function fetchCurrencies() {
    try {
        const response = await fetch(COUNTRY_LIST_API);
        if (!response.ok) throw new Error('Failed to fetch currencies');
        
        const data = await response.json();
        
        const currencyMap = {};
        
        data.forEach(country => {
            if (country.currencies) {
                Object.entries(country.currencies).forEach(([code, currency]) => {
                    if (!currencyMap[code]) {
                        currencyMap[code] = {
                            code: code,
                            name: currency.name,
                            flag: country.flag // incorrect flags fetched
                                               // hence not displaying in final website
                                               // (option1 & option2 textContent)
                        };
                    }
                });
            }
        });
        
        currenciesData = Object.values(currencyMap).sort((a, b) => a.code.localeCompare(b.code));
        
        populateDropdowns();
        
    } catch (error) {
        console.error('Error fetching currencies:', error);
        showError('Failed to load currencies');
    }
}

function populateDropdowns() {
    fromCurrencySelect.innerHTML = '';
    toCurrencySelect.innerHTML = '';
    
    const defaultOption1 = document.createElement('option');
    defaultOption1.value = '';
    defaultOption1.textContent = 'Select currency';
    defaultOption1.disabled = true;
    fromCurrencySelect.appendChild(defaultOption1);
    
    const defaultOption2 = document.createElement('option');
    defaultOption2.value = '';
    defaultOption2.textContent = 'Select currency';
    defaultOption2.disabled = true;
    toCurrencySelect.appendChild(defaultOption2);
    
    currenciesData.forEach(currency => {
        const option1 = document.createElement('option');
        option1.value = currency.code;
        option1.textContent = `${currency.code} - ${currency.name}`;
        fromCurrencySelect.appendChild(option1);
        
        const option2 = document.createElement('option');
        option2.value = currency.code;
        option2.textContent = `${currency.code} - ${currency.name}`;
        toCurrencySelect.appendChild(option2);
    });
    
    if (currenciesData.length > 0) {
        fromCurrencySelect.value = 'USD';
        toCurrencySelect.value = 'INR';
    }
}

async function convertCurrency() {
    const amount = parseFloat(amountInput.value);
    const fromCurrency = fromCurrencySelect.value;
    const toCurrency = toCurrencySelect.value;
    
    if (!amount || amount <= 0) {
        showError('Please enter a valid amount');
        return;
    }
    
    if (!fromCurrency || !toCurrency) {
        showError('Please select both currencies');
        return;
    }
    
    if (fromCurrency === toCurrency) {
        showError('Please select different currencies');
        return;
    }
    
    try {
        hideError();
        
        const url = `${EXCHANGE_RATE_API}/${API_KEY}/pair/${fromCurrency}/${toCurrency}`;
        const response = await fetch(url);
        
        if (!response.ok) {
            if (response.status === 429) {
                throw new Error('Too many requests. Please wait a moment and try again.');
            }
            throw new Error('Failed to fetch exchange rate');
        }
        
        const data = await response.json();
        
        if (data.result === 'error') {
            throw new Error(data['error-type'] || 'Failed to convert currency');
        }
        
        const conversionRate = data.conversion_rate;
        const convertedAmount = (amount * conversionRate).toFixed(2);
        
        const formattedConverted = parseFloat(convertedAmount).toLocaleString('en-IN', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        });
        
        resultDiv.textContent = `${amount} ${fromCurrency} = ${formattedConverted} ${toCurrency}`;
        resultDiv.classList.add('show');
        
    } catch (error) {
        console.error('Error during conversion:', error);
        showError(error.message || 'An error occurred, please try again later');
    }
}

function showError(message) {
    errorDiv.textContent = message;
    errorDiv.classList.add('show');
    resultDiv.classList.remove('show');
}

function hideError() {
    errorDiv.classList.remove('show');
}

convertBtn.addEventListener('click', convertCurrency);

amountInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        convertCurrency();
    }
});

document.addEventListener('DOMContentLoaded', () => {
    fetchCurrencies();
});
