document.addEventListener('DOMContentLoaded', function () {
    const calendarContainer = document.getElementById('calendar');
    const confirmDateButton = document.getElementById('confirmDate');
    const monthButton = document.getElementById('monthButton');
    const datepicker = document.getElementById('datepicker');
    let selectedDate;
    let currentDate = new Date();

    function updateMonthButton(date) {
        const options = { month: 'long', year: 'numeric' };
        monthButton.textContent = date.toLocaleDateString('en-US', options);
    }

    function updateCalendar(referenceDate, keepSelected = false) {
        const daysOfWeek = ['Sat', 'Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri'];
        calendarContainer.innerHTML = ''; // Clear the current calendar items

        const startDate = new Date(referenceDate);
        startDate.setDate(startDate.getDate() - 3);
        for (let i = 0; i < 7; i++) {
            const date = new Date(startDate);
            date.setDate(startDate.getDate() + i);
            const dayName = daysOfWeek[date.getDay()];
            const newCalendarItem = document.createElement('div');
            newCalendarItem.classList.add('calendar-item');
            if (keepSelected && date.getDate() === referenceDate.getDate()) {
                newCalendarItem.classList.add('selected');
            }
            newCalendarItem.innerHTML = `${dayName}<br>${date.getDate()}`;
            newCalendarItem.dataset.date = date.toISOString().split('T')[0];
            calendarContainer.appendChild(newCalendarItem);
        }
        updateMonthButton(referenceDate);
    }

    function initializeCalendar() {
        updateCalendar(currentDate, true);

        calendarContainer.addEventListener('click', function (event) {
            if (event.target.classList.contains('calendar-item')) {
                const selectedIndex = Array.from(calendarContainer.children).indexOf(event.target);
                const selectedDateValue = parseInt(event.target.innerHTML.split('<br>')[1]);

                document.querySelectorAll('.calendar-item').forEach(item => {
                    item.classList.remove('selected');
                });
                event.target.classList.add('selected');

                let newDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), selectedDateValue);
                if (selectedIndex === 0 && selectedDateValue > currentDate.getDate()) {
                    newDate.setMonth(newDate.getMonth() - 1);
                } else if (selectedIndex === calendarContainer.children.length - 1 && selectedDateValue < currentDate.getDate()) {
                    newDate.setMonth(newDate.getMonth() + 1);
                }

                currentDate = newDate;
                selectedDate = newDate.toISOString().split('T')[0];
                datepicker.value = selectedDate;

                updateCalendar(currentDate, true);
            }
        });
    }

    function initializeDatePicker() {
        flatpickr("#datepicker", {
            defaultDate: new Date(),
            onChange: function(selectedDates) {
                selectedDate = selectedDates[0];
            }
        });
    }

    $('#dateModal').on('show.bs.modal', function () {
        initializeDatePicker();
        if (selectedDate) {
            datepicker._flatpickr.setDate(selectedDate, true);
        }
    });

    confirmDateButton.addEventListener('click', function () {
        if (selectedDate) {
            currentDate = new Date(selectedDate);
            updateCalendar(currentDate, true);
        }
        $('#dateModal').modal('hide');
    });

    initializeCalendar();
});
