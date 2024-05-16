document.addEventListener("DOMContentLoaded", function () {
  const calendarContainer = document.getElementById("calendar");
  const confirmDateButton = document.getElementById("confirmDate");
  const monthButton = document.getElementById("monthButton");
  const datepicker = document.getElementById("datepicker");
  let selectedDate = new Date();
  let currentDate = new Date();

  function updateMonthButton(date) {
    const options = { month: "long", year: "numeric" };
    monthButton.textContent = date.toLocaleDateString("en-US", options);
  }

  function updateCalendar(referenceDate) {
    const daysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    calendarContainer.innerHTML = ""; // Clear the current calendar items

    const startDate = new Date(referenceDate);
    startDate.setDate(startDate.getDate() - 3);
    for (let i = 0; i < 7; i++) {
      const date = new Date(startDate);
      date.setDate(startDate.getDate() + i);
      const dayName = daysOfWeek[date.getDay()];
      const newCalendarItem = document.createElement("div");
      newCalendarItem.classList.add("calendar-item");
      if (date.toDateString() === referenceDate.toDateString()) {
        newCalendarItem.classList.add("selected");
      }
      newCalendarItem.innerHTML = `${dayName}<br>${date.getDate()}`;
      newCalendarItem.dataset.date = date.toISOString().split("T")[0];
      calendarContainer.appendChild(newCalendarItem);
    }
    updateMonthButton(referenceDate);
  }

  function initializeCalendar() {
    updateCalendar(currentDate);

    calendarContainer.addEventListener("click", function (event) {
      if (event.target.classList.contains("calendar-item")) {
        const clickedDate = new Date(event.target.dataset.date);

        document.querySelectorAll(".calendar-item").forEach((item) => {
          item.classList.remove("selected");
        });
        event.target.classList.add("selected");

        // Update the current date and selected date
        currentDate = clickedDate;
        selectedDate = clickedDate;

        if (datepicker._flatpickr) {
          datepicker._flatpickr.setDate(selectedDate, true);
        }

        // Refresh the calendar to shift dates
        updateCalendar(currentDate);
      }
    });
  }

  function initializeDatePicker() {
    if (!datepicker._flatpickr) {
      flatpickr("#datepicker", {
        defaultDate: new Date(),
        onChange: function (selectedDates) {
          selectedDate = selectedDates[0];
        },
      });
    }
  }

  $("#dateModal").on("show.bs.modal", function () {
    initializeDatePicker();
    if (selectedDate && datepicker._flatpickr) {
      datepicker._flatpickr.setDate(selectedDate, true);
    }
  });

  confirmDateButton.addEventListener("click", function () {
    if (selectedDate) {
      currentDate = new Date(selectedDate);
      updateCalendar(currentDate);
    }
    $("#dateModal").modal("hide");
  });

  initializeCalendar();
});
