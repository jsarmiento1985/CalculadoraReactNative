import React, { useEffect, useRef, useState } from 'react'
enum Operator {
    add = '+',
    subtract = '-',
    multiply = 'x',
    divide = '÷',
}

export const useCalculator = () => {

    const [formula, setFormula] = useState('');
    const [number, setNumber] = useState('0');
    const [prevNumber, setPrevNumber] = useState('0');

    const lastOperation = useRef<Operator>();

    useEffect(() => {
        if (lastOperation.current) {// si hay un simbolo
            const firstFormulaPart = formula.split(' ').at(0);// primera posiicion
            setFormula(`${firstFormulaPart} ${lastOperation.current} ${number}`);
        } else {
            setFormula(number);
        }



    }, [number])


    useEffect(() => {
        const subResult = calculateSubResult();
        setPrevNumber (`${ subResult }`);
    }, [formula])
    

    const clean = () => {
        setNumber('0');
        setPrevNumber('0');
        lastOperation.current = undefined;
        setFormula('');
    }
    // Borrar el ultimo numero digitado
    const deleteOperation = () => {

        let currentSign = '';
        let temporalNumber = number;

        if (number.includes('-')) {
            currentSign = '-';
            temporalNumber = number.substring(1);// quita el simbolo negativo del numero  
        }

        if (temporalNumber.length > 1) {
            return setNumber(currentSign + temporalNumber.slice(0, -1));
        }

        setNumber('0');

    }

    const toggleSign = () => {
        if (number.includes('-')) {
            return setNumber(number.replace('-', ''))
        }
        setNumber('-' + number);
    }

    const buildNumber = (numberString: string) => {

        // no mas de un punto .
        if (number.includes('.') && numberString === '.') return;

        // si inica con cero y no tiene punto decimal entonces concatena y muestra
        if (number.startsWith('0') || number.startsWith('-0')) {


            if (numberString === '.') {
                return setNumber(number + numberString);
            }


            //evaluar otro cero y no hay punto
            if (numberString === '0' && number.includes('.')) {
                return setNumber(number + numberString);
            }

            // evaluar si es diferente de cero y no hay punto decimal y es el primer numero
            if (numberString !== '0' && !number.includes('.')) {
                return setNumber(numberString);
            }

            //evaluar evitar el 000000.00 al menos que haya un punto decimal(.)
            if (numberString === '0' && !number.includes('.')) {
                return;
            }


            return setNumber(number + numberString);
        }
        setNumber(number + numberString);

    }

    const setLastNumber = () => {
        calculateResult();
        if (number.endsWith('.')) {
            setPrevNumber(number.slice(0, -1));
        } else {
            setPrevNumber(number);
        }
        setNumber('0');
    }


    const divideOperation = () => {
        setLastNumber();
        lastOperation.current = Operator.divide;
    }

    const multiplyOperation = () => {
        setLastNumber();
        lastOperation.current = Operator.multiply;
    }

    const subtractOperation = () => {
        setLastNumber();
        lastOperation.current = Operator.subtract;
    }

    const addOperation = () => {
        setLastNumber();
        lastOperation.current = Operator.add;
    }


    const calculateResult = () => {
       const result =  calculateSubResult();
       setFormula( `${result}`);
       lastOperation.current = undefined;
       setPrevNumber('0');
    }

    const calculateSubResult = (): number => {
        const [firstValue, operation, secondValue] = formula.split(' ');

        const num1 = Number(firstValue);//NaN
        const num2 = Number(secondValue);//NaN

        if (isNaN( num2 ))  return num1; // si num2 NO es un numero
        

        switch ( operation ) {

            case Operator.add:
                return num1 + num2;
          
            case Operator.subtract:
                return num1 - num2;
               
            case Operator.multiply:
                return num1 * num2;
             
            case Operator.divide:
               return num1 / num2;
               
            default:
                throw new Error("Operation not implemented");

        }

    }

    return {
        //properties
        number,
        prevNumber,
        formula,
        //methods
        buildNumber,
        toggleSign,
        clean,
        deleteOperation,
        divideOperation,
        multiplyOperation,
        subtractOperation,
        addOperation,
        calculateResult,
        calculateSubResult,

    }


}
