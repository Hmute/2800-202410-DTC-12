document.addEventListener("DOMContentLoaded", function() {
    const urlParams = new URLSearchParams(window.location.search);
    const saved = urlParams.get('saved');

    if (saved === 'true') {
        $('#savedModal').modal('show');
    }
});