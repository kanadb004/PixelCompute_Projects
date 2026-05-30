const display = document.getElementById('display');
const equalsButton = document.getElementById('equals');
const clearButton = document.getElementById('clear');
const deleteButton = document.getElementById('delete');
const decimalButton = document.getElementById('decimal');
const remainderButton = document.getElementById('remainder');
const exponentButton = document.getElementById('exponent');

let firstNumber = null;
let operation = null;
let shouldResetDisplay = false;
let displayValue = '0';

function updateDisplay(value) {
    displayValue = String(value);
    display.textContent = displayValue;
}

function handleNumber(num) {
    if (shouldResetDisplay) {
        updateDisplay(num);
        shouldResetDisplay = false;
    } else {
        if (displayValue === '0') {
            updateDisplay(num);
        } else {
            updateDisplay(displayValue + num);
        }
    }
}

document.querySelectorAll('.number-btn:not(#decimal)').forEach(button => {
    button.addEventListener('click', () => {
        handleNumber(button.textContent);
    });
});

decimalButton.addEventListener('click', () => {
    if (shouldResetDisplay) {
        updateDisplay('0.');
        shouldResetDisplay = false;
    } else if (!displayValue.includes('.')) {
        updateDisplay(displayValue + '.');
    }
});

function handleOperation(op) {
    const currentNumber = parseFloat(displayValue);
    
    if (firstNumber === null) {
        firstNumber = currentNumber;
    } else if (operation) {
        const result = performCalculation(firstNumber, currentNumber, operation);
        updateDisplay(result);
        firstNumber = result;
    }
    
    operation = op;
    shouldResetDisplay = true;
}

document.getElementById('add').addEventListener('click', () => handleOperation('add'));
document.getElementById('subtract').addEventListener('click', () => handleOperation('subtract'));
document.getElementById('multiply').addEventListener('click', () => handleOperation('multiply'));
document.getElementById('divide').addEventListener('click', () => handleOperation('divide'));

remainderButton.addEventListener('click', () => handleOperation('remainder'));
exponentButton.addEventListener('click', () => handleOperation('exponent'));

equalsButton.addEventListener('click', () => {
    if (operation && firstNumber !== null) {
        const currentNumber = parseFloat(displayValue);

        console.log({
            firstNumber,
            currentNumber,
            displayValue,
            operation
        });

        const result = performCalculation(firstNumber, currentNumber, operation);
        updateDisplay(result);
        firstNumber = null;
        operation = null;
        shouldResetDisplay = true;
    }
});

clearButton.addEventListener('click', () => {
    updateDisplay('0');
    firstNumber = null;
    operation = null;
    shouldResetDisplay = false;
});

deleteButton.addEventListener('click', () => {
    if (displayValue.length > 1) {
        updateDisplay(displayValue.slice(0, -1));
    } else {
        updateDisplay('0');
    }
});

function performCalculation(num1, num2, op) {
    switch(op) {
        case 'add':
            return num1 + num2;
        case 'subtract':
            return num1 - num2;
        case 'multiply':
            return num1 * num2;
        case 'divide':
            return num2 !== 0 ? num1 / num2 : 0;
        case 'remainder':
            return num1 % num2;
        case 'exponent':
            return Math.pow(num1, num2);
        default:
            return num2;
    }
}
