import { chatMessage } from './driver.js';
var question;

var answer = "blank";


    
function storeFormData(event) {
    event.preventDefault();
    const form = document.getElementById('myChat');

    // Create a FormData object
    const formData = new FormData(form);

    // Convert the form data to an object
    const formObject = {};
    formData.forEach((value, key) => {
    formObject[key] = value;
    

    question = formObject[key];

    chatMessage(question)  // Assuming chatMessage returns a promise
        .then(result => {
            console.log(result);
            answer = result;
            document.getElementById("p1").textContent = answer;
        })
        .catch(error => {
            console.error('Error:', error);
        });
  });

    const formString = JSON.stringify(formObject);
    
  }

  function what_in_question(){
    console.log('the users question is', question);
  }
  

  document.getElementById('myChat').addEventListener('submit', storeFormData);