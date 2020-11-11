let text = '';
let input = [];

function digitsCount(n) {
    var count = 0;
    if (n >= 1){ ++count;}

    while (n / 10 >= 1) {
        n /= 10;
        ++count;
    }

    return count;
}

function calculate() {
    let initialNumbers = [];
    let number = 0;
    let initialOperations = [];
    let operation = '';
    let multiplier = 1;

    for (let i = 0; i < input.length; i++) {
        if (typeof input[i] === 'number') {
            number *= 10;
            number += input[i];
        } else if (typeof input[i] === 'string') {
            if(input[i] == '-' && (typeof input[i-1] === 'string' || i === 0)){
                multiplier = -1;
            }else{
                number *= multiplier;
                multiplier = 1;
                console.log(i);
                initialNumbers.push(number);
                number = 0;
                operation = input[i];
                initialOperations.push(operation);
            }
        }
    }

    console.log(initialNumbers);
    console.log(initialOperations);

    //add decimal numbers
    let numbers = [];
    let operations = [];
    if(initialOperations[0] !== '.'){
        numbers.push(initialNumbers[0]);
    }
    for (let k = 0; k < initialOperations.length-1; k++) {
        if(initialOperations[k] === '.'){
            const decimal = initialNumbers[k+1]/Math.pow(10,digitsCount(initialNumbers[k+1]));
            numbers.push(initialNumbers[k]+decimal);
        }else{
            if(initialOperations[k+1] !== '.'){
                numbers.push(initialNumbers[k+1]);
            }
            operations.push(initialOperations[k]);
        }
    }
    console.log(numbers);
    console.log(operations);

    // do calculation
    let total = numbers[0];
    for (let j = 0; j < operations.length; j++) {
        switch (operations[j]) {
            case '.':
                const decimal = numbers[j+1]/Math.pow(10,numbers[j+1].length);
                numbers[j+1] = numbers[j]+decimal;
                break;
            case '+':
                total += numbers[j+1];
                break;
            case '-':
                total -= numbers[j+1];
                break;
            case '*':
                total *= numbers[j+1];
                break;
            case '/':
                total /= numbers[j+1];
                break;
        }
    }

    if(digitsCount(parseFloat(total.toPrecision(9)))>9){
        text = parseFloat(total.toPrecision(9)).toExponential(4);
    }else{
        text = parseFloat(total.toPrecision(9));
    }


}

function button0(){
    text += '0';
    input.push(0);
    document.getElementById("output").innerHTML = text;
}

function button1(){
    text += '1';
    input.push(1);
    document.getElementById("output").innerHTML = text;
}

function button2(){
    text += '2';
    input.push(2);
    document.getElementById("output").innerHTML = text;
}

function button3(){
    text += '3';
    input.push(3);
    document.getElementById("output").innerHTML = text;
}

function button4(){
    text += '4';
    input.push(4);
    document.getElementById("output").innerHTML = text;
}

function button5(){
    text += '5';
    input.push(5);
    document.getElementById("output").innerHTML = text;
}

function button6(){
    text += '6';
    input.push(6);
    document.getElementById("output").innerHTML = text;
}

function button7(){
    text += '7';
    input.push(7);
    document.getElementById("output").innerHTML = text;
}

function button8(){
    text += '8';
    input.push(8);
    document.getElementById("output").innerHTML = text;
}

function button9(){
    text += '9';
    input.push(9);
    document.getElementById("output").innerHTML = text;
}

function buttonDot(){
    text += '.';
    input.push('.');
    document.getElementById("output").innerHTML = text;
}

function buttonPlus(){
    text += '+';
    input.push('+');
    document.getElementById("output").innerHTML = text;
}

function buttonMinus(){
    text += '-';
    input.push('-');
    document.getElementById("output").innerHTML = text;
}

function buttonDivide(){
    text += '/';
    input.push('/');
    document.getElementById("output").innerHTML = text;
}

function buttonMultiply(){
    text += '*';
    input.push('*');
    document.getElementById("output").innerHTML = text;
}

function buttonEquals(){
    input.push('=');
    calculate();
    document.getElementById("output").innerHTML = text;
}

function buttonClear(){
    text = '';
    input = [];
    initialNumbers = [];
    initialOperations = [];
    numbers = [];
    operations = [];
    document.getElementById("output").innerHTML = text;
}


