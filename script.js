var previousCounts = JSON.parse(localStorage.getItem("previousCounts")) || [];

// Function to handle the click on the wrapper divs and simulate radio button click
function selectExerciseType(value) {
    const radio = document.getElementById(value.toLowerCase());
    if (radio) {
        radio.checked = true;
        updateExerciseNames();
    }
}

// Define an object with predefined exercise names for each exercise type
const predefinedExercises = {
    Biceps: ["Bicep Curls", "Seated Curls", "Hammer Curls", "Barbell Curls"],
    MageSkuldre: ["Beinløft", "Sakseløft", "Situps", "Ab crunches", "Rulle", "Seated Arnold Press", "Dumbell Shoulder Raises", "Barbell Press", "Backwards Barebell Press", "High Pull", "Lateral Raise", "Dumbell Press", "Overhead Press"],
    SquatsRygg: ["Squats", "Dumbell Squats", "Barbell Squats", "Calf Raises", "Barbell Back Row", "Dumbell Reverse Fly", "Barbell Shrug", "Dumbell Shrug"],
    BrystTriceps: ["Pushups", "Dumbell Press", "Dumbell Butterflies", "Upperhead Fly", "Dumbell Bench", "Tricep Kickback", "Tricep Overhead Extension", "Tricep Flex"]
};

function updateExerciseNames() {
    const exerciseTypeRadios = document.getElementsByName("exercise-type");
    let selectedExerciseType;

    // Find the selected exercise type
    for (const radio of exerciseTypeRadios) {
        if (radio.checked) {
            selectedExerciseType = radio.value;
            break;
        }
    }

    // Update the exercise names dropdown
    const exerciseNameDropdown = document.getElementById("exercise-name");
    exerciseNameDropdown.innerHTML = "";

    predefinedExercises[selectedExerciseType].forEach(exercise => {
        const option = document.createElement("option");
        option.value = exercise;
        option.text = exercise;
        exerciseNameDropdown.appendChild(option);
    });
}

// Add event listeners to update exercise names when exercise type is changed
const exerciseTypeRadios = document.getElementsByName("exercise-type");
for (const radio of exerciseTypeRadios) {
    radio.addEventListener("change", updateExerciseNames);
}

// Call updateExerciseNames initially to populate the exercise names based on the default exercise type
updateExerciseNames();

var countTable = document.getElementById("count-table");

for (var i = 0; i < previousCounts.length; i++) {
    var row = countTable.insertRow(1);
    var exerciseNameCell = row.insertCell(0);
    var repetitionsCell = row.insertCell(1);
    var weightCell = row.insertCell(2);

    // Insert the data into the cells
    exerciseNameCell.innerHTML = previousCounts[i].exerciseName;
    repetitionsCell.innerHTML = previousCounts[i].repetitions;
    weightCell.innerHTML = previousCounts[i].weight;
}

function countRepetitions() {
    var exerciseName = document.getElementById("exercise-name").value;
    var repetitions = document.getElementById("repetitions").value;
    var weight = document.getElementById("weight").value;
    console.log("Selected weight:", weight); // Add this line for debugging
    var result = document.getElementById("result");

    if (exerciseName == "" || repetitions == "") {
        result.innerHTML = "Please enter both an exercise name and the number of repetitions.";
        result.style.backgroundColor = "#FFC1CE";
        result.style.padding = "20px";
        result.style.borderRadius = "5px";
        result.style.color = "#94344A";
    } else {
        // Add the new count to the table
        var row = countTable.insertRow(1);
        var exerciseNameCell = row.insertCell(0);
        var repetitionsCell = row.insertCell(1);
        var weightCell = row.insertCell(2);

        // Insert the data into the cells
        exerciseNameCell.innerHTML = exerciseName;
        repetitionsCell.innerHTML = repetitions;
        weightCell.innerHTML = weight;

        previousCounts.push({ exerciseName: exerciseName, repetitions: repetitions, weight: weight });

        localStorage.setItem("previousCounts", JSON.stringify(previousCounts));

        result.innerHTML = "Du gjorde " + repetitions + " repetisjoner av " + exerciseName + " med " + weight + " ";
        result.style.backgroundColor = "#D4EADD";
        result.style.padding = "20px";
        result.style.borderRadius = "5px";
        result.style.color = "#64A47C";
    }
}



function setRepetitions(value) {
    document.getElementById("repetitions").value = value;
}

function clearCounts() {
    // Clear the table
    var countTable = document.getElementById("count-table");
    for (var i = countTable.rows.length - 1; i > 0; i--) {
        countTable.deleteRow(i);
    }

    previousCounts = [];
    localStorage.removeItem("previousCounts");
}

function saveCounts() {
    const exerciseType = document.getElementById('exercise-type').value;
    const exerciseName = document.getElementById('exercise-name').value;
    const repetitions = document.getElementById('repetitions').value;
    const weight = document.getElementById('weight').value;
    const unit = document.getElementById('unit').value;

    localStorage.setItem('exerciseType', exerciseType);
    localStorage.setItem('exerciseName', exerciseName);
    localStorage.setItem('repetitions', repetitions);
    localStorage.setItem('weight', weight);
    localStorage.setItem('unit', unit);
}

window.onload = function () {
    const exerciseType = localStorage.getItem('exerciseType');
    const exerciseName = localStorage.getItem('exerciseName');
    const repetitions = localStorage.getItem('repetitions');
    const weight = localStorage.getItem('weight');
    const unit = localStorage.getItem('unit');

    if (exerciseType) {
        document.getElementById('exercise-type').value = exerciseType;
    }

    if (exerciseName) {
        document.getElementById('exercise-name').value = exerciseName;
    }

    if (repetitions) {
        document.getElementById('repetitions').value = repetitions;
    }

    if (weight) {
        document.getElementById('weight').value = weight;
    }

    if (unit) {
        document.getElementById('unit').value = unit;
    }

    document.getElementById("repetitions").value = "";

        // Load and display saved workouts on the Logg page
    const savedWorkouts = JSON.parse(localStorage.getItem('savedWorkouts')) || {};

    const loggContainer = document.getElementById('saved-workouts');

    Object.keys(savedWorkouts).forEach(exerciseType => {
        const exerciseTypeContainer = document.createElement('div');
        exerciseTypeContainer.innerHTML = `<h2>${exerciseType}</h2>`;

        savedWorkouts[exerciseType].forEach(workout => {
            const workoutElement = document.createElement('div');
            workoutElement.innerHTML = `
                <p>Exercise: ${workout.exerciseName}</p>
                <p>Repetitions: ${workout.repetitions}</p>
                <p>Weight: ${workout.weight}</p>
                <hr>
            `;
            exerciseTypeContainer.appendChild(workoutElement);
        });

        loggContainer.appendChild(exerciseTypeContainer);
    });
};

const inputFields = document.querySelectorAll('input, select');
const addButton = document.querySelector('button');

inputFields.forEach(field => {
    field.addEventListener('keydown', function (event) {
        if (event.key === "Enter") {
            addButton.click(); // Simulate click on the add button
            event.preventDefault(); // Prevent the form from submitting
        }
    });
});

function saveWorkout() {
    const workout = {
        exerciseType: document.querySelector('input[name="exercise-type"]:checked').value,
        exerciseName: document.getElementById('exercise-name').value,
        repetitions: document.getElementById('repetitions').value,
        weight: document.getElementById('weight').value,
    };

    // Retrieve saved workouts from local storage
    const savedWorkouts = JSON.parse(localStorage.getItem('savedWorkouts')) || [];

    // Add the current workout to the array
    savedWorkouts.push(workout);

    // Save the updated array back to local storage
    localStorage.setItem('savedWorkouts', JSON.stringify(savedWorkouts));

    // Optionally, you can clear the current session counts
    clearCounts();

    // Alert the user that the workout has been saved (you can customize this part)
    alert('Workout saved successfully!');
}

function showPage(pageId) {
    const pages = ['home', 'logg', 'analyse'];

    // Hide all pages
    pages.forEach(page => {
        const pageElement = document.getElementById(page);
        if (pageElement) {
            pageElement.style.display = 'none';
        }
    });

    // Show the selected page
    const selectedPage = document.getElementById(pageId);
    if (selectedPage) {
        selectedPage.style.display = 'block';
    }

    // If the selected page is 'logg', load and display saved workouts
    if (pageId === 'logg') {
        loadAndDisplaySavedWorkouts();
    }
}

function loadAndDisplaySavedWorkouts() {
    // Load and display saved workouts on the Logg page
    const savedWorkouts = JSON.parse(localStorage.getItem('savedWorkouts')) || [];
    const loggContainer = document.getElementById('saved-workouts');
    loggContainer.innerHTML = ''; // Clear previous content

    savedWorkouts.forEach((workout, index) => {
        const exerciseTypeContainer = document.createElement('div');
        exerciseTypeContainer.innerHTML = `<h2>${workout.exerciseType}</h2>`;

        workout.data.forEach(savedWorkout => {
            const workoutElement = document.createElement('div');
            workoutElement.innerHTML = `
                <p>Exercise: ${savedWorkout.exerciseName}</p>
                <p>Repetitions: ${savedWorkout.repetitions}</p>
                <p>Weight: ${savedWorkout.weight}</p>
                <hr>
            `;
            exerciseTypeContainer.appendChild(workoutElement);
        });

        loggContainer.appendChild(exerciseTypeContainer);
    });
}


// Initial setup to show the home page by default
document.addEventListener('DOMContentLoaded', function () {
    showPage('home');
});
