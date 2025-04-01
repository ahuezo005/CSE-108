// const API_URL = 'https://amhep.pythonanywhere.com/grades';
const API_URL = '/grades';

function displayMessage(elementId, message, className = "") {                       // Used for confirmation & error messages
    const element = document.getElementById(elementId);
    element.textContent = message;
    element.className = className; 
}

async function fetchAndValidate(url,options = {}) {                                 // moved fetch into own function 
    const response = await fetch(url, options);
    if(!response.ok){
        await handleError(response);
        return null;
    }
    const text = await response.text();
    try{
        const cleanText = text.replace(/:NaN/g, ':null');                           // fixes any incorrect values in code
        return JSON.parse(cleanText);
    }
    catch(error){
        displayMessage('fetchAndValidate', `Invalid JSON: ${error.message}`, 'error-message');
        return null;
    }
}

function getGrade() {
    const name = document.getElementById('getGradeName').value;
    
    if (name == '') {                                                                   // button clicked, no name entered
        displayMessage('gradeResult', 'Please enter a student name.', 'error-message');
        return;
    }

    fetch(`${API_URL}/${encodeURIComponent(name)}`)
        .then(response => {
            if (!response.ok) {
                return response.json().then(err => {throw new Error(`${response.status} - ${err.message || response.statusText}`)});
            }
            return response.json();
        })

        .then(data => {
            const studentName = Object.keys(data)[0];                               // student name = key
            const grade = data[studentName];                                        // grade accessed using key
        
            if (name !== undefined){
                if (grade !== undefined) { 
                    displayMessage('gradeResult', `Grade for ${studentName}: ${grade}`, 'success-message');
                } else {
                    displayMessage('gradeResult', `Student ${name} not found.`, 'error-message');
                }
            }
        })

        //displays if name not found + potential other errors
        .catch(error => {
            displayMessage('gradeResult', `Error: ${error.message}`, 'error-message');
            displayMessage('gradeResult', `Grade not found`, 'error-message');
        });
}

function toggleGradesTable() {
    const allGradesDiv = document.getElementById('allGrades');
    const button = document.querySelector('button[onclick="toggleGradesTable()"]'); // Select the button

    if (allGradesDiv.style.display === 'none') {                                    // If table hidden
        allGradesDiv.style.display = 'block';                                                             
        button.textContent = 'Hide Grades';                                         // Update button
        getAllGrades();                                                             // Call getAllGrades to show table

    } else {                                                                        // If table visible -> set hidden
        allGradesDiv.style.display = 'none';
        button.textContent = 'View All Grades';                                     // Update button
    }
}


async function getAllGrades() {
    const data = await fetchAndValidate(API_URL);
    if (data == null){
        displayMessage('allGrades', `Unable to retrieve grades: No grades in system.`, 'error-message');
    }

    const tableBody = document.querySelector('#allGradesTable tbody');
    tableBody.innerHTML = '';                                               // Clear existing table data -> prevents new table displaying above old
    if (data !== null) {                                                                                                                                   
        Object.keys(data).forEach(studentName => {                          // Iterate through the keys (names)
            const grade = data[studentName];                                
            if (grade !== undefined) {                                      // Checks all existing grades valid
                let row = tableBody.insertRow();
                let nameCell = row.insertCell();
                let gradeCell = row.insertCell();
                nameCell.textContent = studentName;                         // Name set as key
                gradeCell.textContent = grade;                              // Grade set as value
            }
        });
    }            
}

async function createStudent() {
    const name = document.getElementById('createName').value;
    const grade = parseFloat(document.getElementById('createGrade').value);

    if (name == '' || isNaN(grade)) {
        displayMessage('createResult', 'Please enter a student name and/or a valid grade.', 'error-message');
        return;
    }

    const data = await fetchAndValidate(API_URL, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ name: name, grade: grade })
    });

    if (data == null){
        displayMessage('createResult', `Error creating student: ${error.message}`, 'error-message');
        return;
    }

    displayMessage('createResult', `Student ${name} created successfully.`, 'success-message');
    document.getElementById('createName').value = '';
    document.getElementById('createGrade').value = '';
    getAllGrades();                                                            // Refresh allGrades to reflect change

    // .catch(error => {
    //     displayMessage('createResult', `Error creating student: ${error.message}`, 'error-message');
    // });
}

async function editGrade() {
    const name = document.getElementById('editName').value;
    const grade = parseFloat(document.getElementById('editGrade').value);

    if (name =='' || isNaN(grade)) {
        displayMessage('editResult', 'Please enter a student name and/or a valid grade.', 'error-message');
        return;
    }

    const data = await fetchAndValidate(`${API_URL}/${encodeURIComponent(name)}`, {
        // fetch(`${API_URL}/${encodeURIComponent(name)}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ grade: grade })
    });

    if (data == null){
        displayMessage('editResult', `Error updating grade: ${error.message}`, 'error-message');
        return;
    }

    displayMessage('editResult', `Grade for ${name} updated to ${grade}.`, 'success-message');
    document.getElementById('editGrade').value = '';
    getAllGrades();                                                             // Refresh allGrades to reflect change
}

async function deleteStudent() {
    const name = document.getElementById('deleteName').value;
    if (name == '') {
        displayMessage('deleteResult', 'Please enter a student name.', 'error-message');
        return;
    }

    const data = await fetchAndValidate(`${API_URL}/${encodeURIComponent(name)}`, {
        // fetch(`${API_URL}/${encodeURIComponent(name)}`, {
        method: 'DELETE'
    })

    // Displays if name not found OR other errors
    if(data == null){
        displayMessage('gradeResult', `Grade not found`, 'error-message');
        displayMessage('deleteResult', `Error deleting student: ${error.message}`, 'error-message');
        // return;
    }

    displayMessage('deleteResult', `Student ${name} deleted successfully.`, 'success-message');
    document.getElementById('deleteName').value = '';
    getAllGrades();                                                         // Refresh allGrades to reflect change

//     .catch(error => {
//         displayMessage('gradeResult', `Grade not found`, 'error-message');
//         displayMessage('deleteResult', `Error deleting student: ${error.message}`, 'error-message');
//     });
}

// Initial load of all grades when the page loads
getAllGrades();