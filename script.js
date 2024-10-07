// Load previously saved workouts from localStorage
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
    MageSkuldre: ["Situps", "Seated Arnold Press", "Dumbell Shoulder Raises", "Ab Crunches"],
    SquatsRygg: ["Squats", "Dumbell Squats", "Barbell Back Row", "Calf Raises"],
    BrystTriceps: ["Pushups", "Dumbell Press", "Tricep Kickback", "Dumbell Butterflies"]
};

// Updates the exercise dropdown when switching between muscle groups
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

// Add event listener to each cell in the table for editing
countTable.addEventListener("click", function (event) {
    var target = event.target;

    // Check if the clicked element is a cell within the table
    if (target.tagName === "TD") {
        // Create an input element for editing
        var inputElement = document.createElement("input");
        inputElement.type = "text";
        inputElement.value = target.innerHTML;

        // Replace the cell content with the input element
        target.innerHTML = "";
        target.appendChild(inputElement);

        // Focus on the input element
        inputElement.focus();

        // Add blur event to handle saving the edited content
        inputElement.addEventListener("blur", function () {
            target.innerHTML = inputElement.value;
        });

        // Add keydown event to handle saving the edited content on Enter key
        inputElement.addEventListener("keydown", function (event) {
            if (event.key === "Enter") {
                target.innerHTML = inputElement.value;
            }
        });
    }
});

// Restore previously saved workouts
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

// Handles adding workout data to the table
function countRepetitions() {
    var exerciseName = document.getElementById("exercise-name").value;
    var repetitions = document.getElementById("repetitions").value;
    var weight = document.getElementById("weight").value;
    var result = document.getElementById("result");

    if (exerciseName === "" || repetitions === "") {
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

// Pre-populate the repetitions input
function setRepetitions(value) {
    document.getElementById("repetitions").value = value;
}

// Clears the saved workout data
function clearCounts() {
    const confirmation = confirm("Are you sure you want to clear the workout data? This action is irreversible.");
    if (confirmation) {
        var countTable = document.getElementById("count-table");
        for (var i = countTable.rows.length - 1; i > 0; i--) {
            countTable.deleteRow(i);
        }

        previousCounts = [];
        localStorage.removeItem("previousCounts");
    }
}

// Save workout based on the muscle group
function saveWorkout(muscleGroup) {
    const workout = {
        exerciseName: document.getElementById('exercise-name').value,
        repetitions: document.getElementById('repetitions').value,
        weight: document.getElementById('weight').value,
        date: new Date().toLocaleString(),
    };

    const savedWorkouts = JSON.parse(localStorage.getItem('savedWorkouts')) || {};
    if (!savedWorkouts[muscleGroup]) {
        savedWorkouts[muscleGroup] = [];
    }

    savedWorkouts[muscleGroup].push(workout);
    localStorage.setItem('savedWorkouts', JSON.stringify(savedWorkouts));

    alert('Workout saved successfully!');
}

// Display saved workouts
function loadAndDisplaySavedWorkouts() {
    const savedWorkouts = JSON.parse(localStorage.getItem('savedWorkouts')) || {};
    const loggContainer = document.getElementById('saved-workouts');
    loggContainer.innerHTML = ''; // Clear previous content

    Object.keys(savedWorkouts).forEach(muscleGroup => {
        const exerciseTypeContainer = document.createElement('div');
        exerciseTypeContainer.innerHTML = `<h2>${muscleGroup}</h2>`;

        savedWorkouts[muscleGroup].forEach(workout => {
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
}

// Handle the 'Enter' key to trigger the add button
const inputFields = document.querySelectorAll('input, select');
const addButton = document.querySelector('button');

inputFields.forEach(field => {
    field.addEventListener('keydown', function (event) {
        if (event.key === "Enter") {
            addButton.click();
            event.preventDefault();
        }
    });
});
