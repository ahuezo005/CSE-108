const display = document.getElementById('display');
const buttons = document.querySelectorAll('.buttons button');

let currentInput = '0';
let operator = null;
let previousValue = null;
let lastOperator = null;
let previousTotal = null;
let clickedOperator = null;

function updateDisplay() {
    display.value = currentInput;
}


function handleNumberClick(value) {
    if (currentInput === '0' || currentInput === '-0') {
        currentInput = value;
    } else {
        currentInput += value;
    }

    if (clickedOperator){   //removes operator glow
        clickedOperator.classList.remove('operator-onClick');
    }
    updateDisplay();
}

function handleOperatorClick(op) {
    if (clickedOperator){   //removes operator glow
        clickedOperator.classList.remove('operator-onClick');
    }

    if (operator && previousValue !== null) {
        calculateResult(); // Perform calculation if theres one to b made
    }
    previousValue = currentInput;
    operator = op;
    currentInput = '0'; // Reset display for next number

    clicked = document.querySelector(`.buttons button[value="${op}"]`); //sets operator glow
    if (clicked){
        clicked.classList.add('operator-onClick');
        clickedOperator = clicked;
    }
}

function handleEqualClick() {
    if (operator) {         //inital click
        calculateResult();
    }

    else if (lastOperator){ //additional clicks if no new num clicked
        current = parseFloat(currentInput);
        pastTotal = previousTotal;
        let result;

        switch (lastOperator){
            case '+':
                result = current + pastTotal;
                break;
            case '-':
                result = current - pastTotal;
                break;
            case '*':
                result = current * pastTotal;
                break;
            case '/':
                result = current / pastTotal;
                break;
            case '%':
                result = current % pastTotal;
                break;
            default:
                return; // If no operator or invalid operator, exit            
        }
        currentInput = String(result);
        updateDisplay();
    }

    if (clickedOperator){   //removes operator glow
        clickedOperator.classList.remove('operator-onClick');
    }
}

function calculateResult() {
    let result;
    const prev = parseFloat(previousValue);
    const current = parseFloat(currentInput);

    if (isNaN(prev) || isNaN(current)) return; // If values are invalid, exit

    lastOperator = operator;
    previousTotal = current;

    switch (operator) {
        case '+':
            result = prev + current;
            break;
        case '-':
            result = prev - current;
            break;
        case '*':
            result = prev * current;
            break;
        case '/':
            result = prev / current;
            break;
        case '%':
            result = prev % current;
            break;
        default:
            return; // If no operator or invalid operator, exit
    }
    currentInput = String(result); // Convert result back to string for display
    previousValue = null; // Clear previous value after calculation
    operator = null;
    updateDisplay();
}

function handleClearClick() {
    currentInput = '0';
    operator = null;
    previousValue = null;
    updateDisplay();

    if (clickedOperator){   //removes operator glow
        clickedOperator.classList.remove('operator-onClick');
    }
}

function handlePercentageClick() {
    const currentValue = parseFloat(currentInput);
    if (!isNaN(currentValue)) {
        currentInput = String(currentValue / 100);
        updateDisplay();
    }
}

function handlePlusMinusClick() {
    if (currentInput !== '0' && currentInput !== '-0') {
        if (currentInput.startsWith('-')) {
            currentInput = currentInput.substring(1); //num is neg alr
        } else {
            currentInput = '-' + currentInput; // make num neg
        }
        updateDisplay();
    }
}


function handleDecimalClick() {
    if (!currentInput.includes('.')) {
        currentInput += '.';
        updateDisplay();
    }
}



//MAIN
buttons.forEach(button => {
    button.addEventListener('click', function() {
        const value = this.value;
        if (isNaN(value)) { // Operator or function button
            switch (value) {
                case 'C':
                    handleClearClick();
                    break;
                case '=':
                    handleEqualClick();
                    break;
                case '%':
                    handlePercentageClick();
                    break;
                case '+/-':
                    handlePlusMinusClick();
                    break;
                case '.':
                    handleDecimalClick();
                    break;
                default: // Operators (+, -, *, /)
                    handleOperatorClick(value);
            }
        } else { // Number button
            handleNumberClick(value);
        }
    });
});