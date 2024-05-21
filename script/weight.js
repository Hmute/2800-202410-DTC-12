document.addEventListener('DOMContentLoaded', function () {
    const startWeight = document.getElementById('start-weight');
    const currentWeight = document.getElementById('current-weight');
    const progress = document.getElementById('progress');
    const weightEntriesContainer = document.getElementById('weight-entries');
    const addWeightForm = document.getElementById('addWeightForm');
    const weightInput = document.getElementById('weightInput');
    const weightSection = document.getElementById('weight-section');
    let weightData;

    async function fetchData() {
        const response = await fetch('/weight/weight-data');
        if (response.ok) {
            weightData = await response.json();
            updateUI();
            renderGraph();
        } else {
            alert('Failed to fetch data');
        }
    }

    function formatDate(date) {
        const options = { year: 'numeric', month: 'short', day: 'numeric' };
        return new Date(date).toLocaleDateString(undefined, options);
    }

    function updateUI() {
        const data = weightData.sort((a, b) => new Date(b.date) - new Date(a.date)); // Sort by date descending
        startWeight.textContent = data[data.length - 1].weightKg + ' kg';
        currentWeight.textContent = data[0].weightKg + ' kg';
        progress.textContent = (data[0].weightKg - data[data.length - 1].weightKg).toFixed(2) + ' kg';

        weightEntriesContainer.innerHTML = '';
        data.forEach(entry => {
            const entryElement = document.createElement('div');
            entryElement.className = 'list-group-item d-flex justify-content-between align-items-center';
            entryElement.innerHTML = `
                <span>${formatDate(entry.date)}</span>
                <span class="badge badge-primary badge-pill">${entry.weightKg} kg</span>
                <span class="badge ${entry.change > 0 ? 'badge-danger' : 'badge-success'} badge-pill">
                    ${entry.change}% ${entry.change > 0 ? '🔺' : '🔻'}
                </span>
            `;
            weightEntriesContainer.appendChild(entryElement);
        });
    }

    function renderGraph() {
        const ctx = document.getElementById('weightGraph').getContext('2d');
        const data = weightData.sort((a, b) => new Date(a.date) - new Date(b.date)); // Sort by date ascending for graph
        new Chart(ctx, {
            type: 'line',
            data: {
                labels: data.map(entry => formatDate(entry.date)),
                datasets: [{
                    label: 'Weight',
                    data: data.map(entry => entry.weightKg),
                    borderColor: 'orange',
                    backgroundColor: 'rgba(255,165,0,0.2)',
                    fill: true,
                }]
            },
            options: {
                responsive: true,
                scales: {
                    x: {
                        display: true,
                        title: {
                            display: true,
                            text: 'Date'
                        }
                    },
                    y: {
                        display: true,
                        title: {
                            display: true,
                            text: 'Weight (kg)'
                        }
                    }
                }
            }
        });
    }

    addWeightForm.addEventListener('submit', async (event) => {
        event.preventDefault();
        const weightKg = parseFloat(weightInput.value);
        const currentDate = new Date();
        const date = new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate()).toISOString(); // Normalize to start of the day

        const newEntry = {
            date: date,
            weightKg: weightKg
        };

        const response = await fetch('/weight/weight-data', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(newEntry)
        });

        if (response.ok) {
            const updatedEntryKg = { ...newEntry, weightKg: parseFloat(newEntry.weightKg).toFixed(2) };

            // Normalize date for comparison
            const normalizedDate = new Date(newEntry.date).setHours(0, 0, 0, 0);

            // Find and replace the existing entry for today, or add a new one
            const kgIndex = weightData.findIndex(entry => new Date(entry.date).setHours(0, 0, 0, 0) === normalizedDate);
            if (kgIndex !== -1) {
                weightData[kgIndex] = updatedEntryKg;
            } else {
                weightData.push(updatedEntryKg);
            }

            updateUI();
            renderGraph();
            weightInput.value = '';
        }
    });

    // Fetch data when the weight section is displayed
    weightSection.style.display = 'block';
    fetchData();
});
