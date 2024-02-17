// pageFunctions.js

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
    const savedWorkouts = JSON.parse(localStorage.getItem('savedWorkouts')) || {};
    const loggContainer = document.getElementById('saved-workouts');
    loggContainer.innerHTML = ''; // Clear previous content

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
}

// Initial setup to show the home page by default
document.addEventListener('DOMContentLoaded', function () {
    showPage('home');
});
