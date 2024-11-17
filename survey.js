import { completeSurvey  } from './driver.js';
var age = 0;
var income ;
var accountType ;
var state ;
var loan ;
var formatted_string = "blank";



function storeFormData() {
    event.preventDefault();
    const form = document.getElementById('mySurvey');

    // Create a FormData object
    const formData = new FormData(form);

    // Convert the form data to an object
    const formObject = {};
      formData.forEach((value, key) => {
      formObject[key] = value;
      if(key == "age"){
        age = formObject[key];
      }
      if(key == "income"){
        income = formObject[key];
      }
      if(key == "accountType"){
        accountType = formObject[key];
      }
      if(key == "state"){
        state = formObject[key];
      }
      if(key == "loan"){
        loan = formObject[key];
      }
      
    });
    console.log(formObject);

    const formString = JSON.stringify(formObject);
    
    console.log('Form Data as String:', formString);

    completeSurvey(formObject)  //
    .then(result => {
        console.log(result);
    })
    .catch(error => {
        console.error('Error:', error);
    });
    
  }

  function display(){
    let loan_status
    if(loan == "on"){
      loan_status = "want";
    }
    else{
      loan_status = "dont want";
    }
    formatted_string = `My age is ${age}, My income is ${income}, I live in ${state}, I want an ${accountType} account, I ${loan_status} to loan`;
    console.log(formatted_string);
  }



  document.getElementById('mySurvey').addEventListener('submit', storeFormData);