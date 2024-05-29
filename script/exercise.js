document.addEventListener('DOMContentLoaded', () => {
    fetchExerciseLogs();
  });
  
  function fetchExerciseLogs() {
    fetch('/exercises/data')
      .then(response => response.json())
      .then(data => {
        const groupedRoutines = groupRoutinesByDate(data);
        populateExerciseLogs(groupedRoutines);
      })
      .catch(error => {
        console.error('Error fetching exercise logs:', error);
      });
  }
  
  function groupRoutinesByDate(routines) {
    const grouped = {};
    routines.forEach(routine => {
      const date = new Date(routine.createdAt).toLocaleDateString();
      if (!grouped[date]) {
        grouped[date] = [];
      }
      grouped[date].push(routine);
    });
    return grouped;
  }
  
  function populateExerciseLogs(groupedRoutines) {
    const container = document.getElementById('exerciseLogContainer');
    container.innerHTML = ''; // Clear existing content
  
    const today = new Date().toLocaleDateString();
  
    Object.keys(groupedRoutines).forEach(date => {
      const routines = groupedRoutines[date];
      const dateGroup = document.createElement('div');
      dateGroup.className = 'date-group';
      const allComplete = routines.every(routine =>
        routine.exercises.every(exercise => exercise.completion === 'Yes')
      );
  
      dateGroup.innerHTML = `
        <div class="routine-header" data-bs-toggle="collapse" data-bs-target="#routine-${date.replace(/\//g, '-')}" aria-expanded="false" aria-controls="routine-${date.replace(/\//g, '-')}">
          <div class="d-flex justify-content-between align-items-center">
            <span>${date}</span>
            <span class="text-${allComplete ? 'success' : 'danger'}">${allComplete ? 'Complete' : 'Incomplete'}</span>
          </div>
        </div>
        <div id="routine-${date.replace(/\//g, '-')}" class="collapse">
          ${routines.map(routine => routine.exercises.map(exercise => `
            <div class="card mb-3">
              <div class="card-body" data-id="${exercise._id}">
                <h5 class="card-title">${exercise.name}</h5>
                <p class="card-text">${exercise.sets} Sets ${exercise.repetitions} Reps</p>
                <p class="card-text text-${exercise.completion === 'Yes' ? 'success' : 'danger'}">${exercise.completion === 'Yes' ? 'Complete' : 'Incomplete'}</p>
                ${date === today ? `<button class="btn btn-primary" onclick="editExercise('${routine._id}', '${exercise._id}')">Edit</button>` : ''}
              </div>
            </div>
          `).join('')).join('')}
        </div>
      `;
      container.appendChild(dateGroup);
  
      // Add event listener for collapsing
      document.getElementById(`routine-${date.replace(/\//g, '-')}`).addEventListener('show.bs.collapse', () => {
        const allOtherCollapses = document.querySelectorAll('.collapse');
        allOtherCollapses.forEach(collapse => {
          if (collapse !== document.getElementById(`routine-${date.replace(/\//g, '-')}`)) {
            bootstrap.Collapse.getOrCreateInstance(collapse).hide();
          }
        });
      });
    });
  }
  
  function editExercise(routineId, exerciseId) {
    fetch(`/exercises/data/${routineId}/${exerciseId}`)
      .then(response => response.json())
      .then(data => {
        const container = document.getElementById('exerciseLogContainer');
        container.innerHTML = `
          <h2>Exercises</h2>
          <form id="editExerciseForm">
            <div class="mb-3">
              <label for="exerciseName" class="form-label">Exercise</label>
              <input type="text" class="form-control" id="exerciseName" value="${data.name}" readonly>
            </div>
            <div class="mb-3">
              <label for="exerciseReps" class="form-label">Reps</label>
              <input type="number" class="form-control" id="exerciseReps" value="${data.repetitions}">
            </div>
            <div class="mb-3">
              <label for="exerciseSets" class="form-label">Sets</label>
              <input type="number" class="form-control" id="exerciseSets" value="${data.sets}">
            </div>
            <div class="mb-3">
              <label for="exerciseWeight" class="form-label">Weight (kg)</label>
              <input type="number" class="form-control" id="exerciseWeight" value="${data.weight}">
            </div>
            <div class="mb-3">
              <label for="exerciseTime" class="form-label">Time (sec)</label>
              <input type="number" class="form-control" id="exerciseTime" value="${data.time}">
            </div>
            <div class="mb-3">
              <label for="exerciseCompletion" class="form-label">Complete</label>
              <select class="form-control" id="exerciseCompletion">
                <option value="Yes" ${data.completion === 'Yes' ? 'selected' : ''}>Yes</option>
                <option value="No" ${data.completion === 'No' ? 'selected' : ''}>No</option>
              </select>
            </div>
            <button type="button" class="btn btn-primary" onclick="saveExercise('${routineId}', '${exerciseId}')">Save</button>
            <button type="button" class="btn btn-secondary" onclick="cancelEdit()">Cancel</button>
          </form>
        `;
      })
      .catch(error => {
        console.error('Error fetching exercise data:', error);
      });
  }
  
  function saveExercise(routineId, exerciseId) {
    const updatedExercise = {
      repetitions: document.getElementById('exerciseReps').value,
      sets: document.getElementById('exerciseSets').value,
      weight: document.getElementById('exerciseWeight').value,
      time: document.getElementById('exerciseTime').value,
      completion: document.getElementById('exerciseCompletion').value,
    };
  
    fetch(`/exercises/data/${routineId}/${exerciseId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(updatedExercise)
    })
      .then(response => response.json())
      .then(data => {
        console.log('Exercise updated successfully:', data);
        fetchExerciseLogs(); // Refresh the exercise logs
      })
      .catch(error => {
        console.error('Error updating exercise:', error);
      });
  }
  
  function cancelEdit() {
    fetchExerciseLogs();
  }
  