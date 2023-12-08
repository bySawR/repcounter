// archive.js
document.addEventListener("DOMContentLoaded", function () {
    loadAndDisplaySavedWorkouts();
});

function loadAndDisplaySavedWorkouts() {
    const savedWorkouts = JSON.parse(localStorage.getItem('savedWorkouts')) || {};
    const loggContainer = document.getElementById('saved-workouts');
    loggContainer.innerHTML = '';

    Object.keys(savedWorkouts).forEach(exerciseType => {
        const exerciseTypeContainer = document.createElement('div');
        exerciseTypeContainer.innerHTML = `<h2>${exerciseType}</h2>`;

        savedWorkouts[exerciseType].forEach(savedWorkout => {
            const workoutElement = document.createElement('div');
            workoutElement.innerHTML = `
                <p>Exercise: ${savedWorkout.exerciseName}</p>
                <p>Repetitions: ${savedWorkout.repetitions}</p>
                <p>Weight: ${savedWorkout.weight}</p>
                <p>Date: ${savedWorkout.date}</p>
                <hr>
            `;
            exerciseTypeContainer.appendChild(workoutElement);
        });

        loggContainer.appendChild(exerciseTypeContainer);
    });
}

function clearWorkouts() {
    const confirmation = window.confirm("Are you sure you want to delete your archived workouts?");
    if (confirmation) {
        localStorage.removeItem('savedWorkouts');
        loadAndDisplaySavedWorkouts(); // Reload and display empty workouts
    }
}
