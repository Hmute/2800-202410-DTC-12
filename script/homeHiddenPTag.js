document.addEventListener("DOMContentLoaded", function() {
    var elements = document.querySelectorAll('.card-text');

    elements.forEach(function(element) {
        if (!element.textContent.trim()) {
            element.classList.add('hidden');
        }
    });
});

