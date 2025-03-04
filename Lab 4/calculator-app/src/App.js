import './App.css';

import React, {useState } from 'react'


function Calculator() {
  const [input, setInput] = useState("");
  const [result, setResult] = useState("");
  const [selectedOperator, setSelectedOperator] = useState("");
  const [usedDecimal, setUsedDecimal] = useState(false);
  const [operatorInputted, setOperatorInputted] = useState(null);

  let clickedOperator = null;

  const buttons = [
    { value: '7', className: 'number'},
    { value: '8', className: 'number'},
    { value: '9', className: 'number'},
    { value: '-', className: 'operator'},

    { value: '4', className: 'number'},
    { value: '5', className: 'number'},
    { value: '6', className: 'number'},
    { value: '/', className: 'operator'},

    { value: '1', className: 'number'},
    { value: '2', className: 'number'},
    { value: '3', className: 'number'},
    { value: '*', className: 'operator'},

    { value: '0', className: 'number'},
    { value: '.', className: 'number'},
    { value: '=', className: 'equal-clear'},
    { value: '+', className: 'operator'}
  ]

  const ClearClick = () => {
    setInput(' ');
    setResult(' ');
    setUsedDecimal(false);
    setOperatorInputted(false);
    setSelectedOperator("");
  };

  const NumberClick = (value) => {
    if (value === '.'){
      if (usedDecimal) return;
      setUsedDecimal(true);
    }
    
    else if ( ['+','-','/','*'].includes(value) ){
      setUsedDecimal(false);
      // setOperatorInputted(true);
      setSelectedOperator(value);
    }
    else{
      // setOperatorInputted(true);
      setSelectedOperator("");
    }
    
    setInput( (prevInput) => prevInput + value);
  };

  const CalcClick = () => {
    try{
      const result = eval(input).toString()
      setInput(result);
      setResult(result);
      setSelectedOperator("");
    }

    catch (error){
      setResult ('Error :(');
      setResult('');
      setUsedDecimal(false);
      setOperatorInputted(false);
      setSelectedOperator("");
    }
  };

  const BuildButtons = () => {
    return buttons.map( (button) => {
      let ClickManager;

      if(button.className === 'operator'){
        if(button.value === selectedOperator){
          button.className = 'operator-onClick';
        }

      }

      if (button.value === '=') {
        ClickManager = CalcClick;
      }
      else if (button.value === 'C') {
        ClickManager = ClearClick;
      }
      else{
        ClickManager = () => NumberClick(button.value);
      }

      return(
        <button key={button.value} className={button.className} onClick={ClickManager}>
          {button.value}
        </button>
      );

    });

  }

  return (
    <div className='calculator'>
      <input type='text' value={input} readOnly className='display' />
    
      <div className='buttons'>
        <button className='clear' onClick={ClearClick}>C</button>
      </div>

      <div className='buttons'>
        {BuildButtons()}
      </div>

    </div>
  );
}

export default Calculator;

