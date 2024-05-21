document.addEventListener('DOMContentLoaded', function () {
    const kgButton = document.getElementById('kgButton');
    const lbsButton = document.getElementById('lbsButton');
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
            updateUI('kg');
            renderGraph('kg');
        } else {
            alert('Failed to fetch data');
        }
    }

    function formatDate(date) {
        const options = { year: 'numeric', month: 'short', day: 'numeric' };
        return new Date(date).toLocaleDateString(undefined, options);
    }

    function updateUI(unit) {
        const data = weightData[unit].sort((a, b) => new Date(b.date) - new Date(a.date)); // Sort by date descending
        startWeight.textContent = data[data.length - 1].weightKg + (unit === 'kg' ? ' kg' : ' lbs');
        currentWeight.textContent = data[0].weightKg + (unit === 'kg' ? ' kg' : ' lbs');
        progress.textContent = (data[0].weightKg - data[data.length - 1].weightKg).toFixed(2) + (unit === 'kg' ? ' kg' : ' lbs');

        weightEntriesContainer.innerHTML = '';
        data.forEach(entry => {
            const entryElement = document.createElement('div');
            entryElement.className = 'list-group-item d-flex justify-content-between align-items-center';
            entryElement.innerHTML = `
                <span>${formatDate(entry.date)}</span>
                <span class="badge badge-primary badge-pill">${entry.weightKg} ${unit}</span>
                <span class="badge ${entry.change > 0 ? 'badge-danger' : 'badge-success'} badge-pill">
                    ${entry.change}% ${entry.change > 0 ? '🔺' : '🔻'}
                </span>
            `;
            weightEntriesContainer.appendChild(entryElement);
        });
    }

    function renderGraph(unit) {
        const ctx = document.getElementById('weightGraph').getContext('2d');
        const data = weightData[unit].sort((a, b) => new Date(a.date) - new Date(b.date)); // Sort by date ascending for graph
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
                            text: 'Weight'
                        }
                    }
                }
            }
        });
    }

    kgButton.addEventListener('click', () => {
        kgButton.classList.add('active');
        lbsButton.classList.remove('active');
        updateUI('kg');
        renderGraph('kg');
    });

    lbsButton.addEventListener('click', () => {
        kgButton.classList.remove('active');
        lbsButton.classList.add('active');
        updateUI('lbs');
        renderGraph('lbs');
    });

    addWeightForm.addEventListener('submit', async (event) => {
        event.preventDefault();
        const weightKg = parseFloat(weightInput.value);
        const weightLbs = (weightKg * 2.20462).toFixed(2);
        const currentDate = new Date();
        const date = new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate()).toISOString(); // Normalize to start of the day

        const newEntry = {
            date: date,
            weightKg: weightKg,
            weightLbs: weightLbs
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
            const updatedEntryLbs = { ...newEntry, weightLbs: parseFloat(newEntry.weightLbs).toFixed(2) };

            // Normalize date for comparison
            const normalizedDate = new Date(newEntry.date).setHours(0, 0, 0, 0);

            // Find and replace the existing entry for today, or add a new one
            const kgIndex = weightData.kg.findIndex(entry => new Date(entry.date).setHours(0, 0, 0, 0) === normalizedDate);
            if (kgIndex !== -1) {
                weightData.kg[kgIndex] = updatedEntryKg;
            } else {
                weightData.kg.push(updatedEntryKg);
            }

            const lbsIndex = weightData.lbs.findIndex(entry => new Date(entry.date).setHours(0, 0, 0, 0) === normalizedDate);
            if (lbsIndex !== -1) {
                weightData.lbs[lbsIndex] = updatedEntryLbs;
            } else {
                weightData.lbs.push(updatedEntryLbs);
            }

            updateUI('kg');
            renderGraph('kg');
            weightInput.value = '';
        }
    });

    // Fetch data when the weight section is displayed
    weightSection.style.display = 'block';
    fetchData();
});
