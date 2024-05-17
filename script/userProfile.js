document.getElementById('edit-profile-btn').addEventListener('click', function() {
    document.getElementById('edit-profile-form').style.display = 'block';
    this.style.display = 'none';
});

document.getElementById('profile-picture').addEventListener('click', function() {
    document.getElementById('profile-picture-input').click();
});

document.getElementById('profile-picture-input').addEventListener('change', function(event) {
    const reader = new FileReader();
    reader.onload = function() {
        document.getElementById('profile-picture').src = reader.result;
    };
    reader.readAsDataURL(event.target.files[0]);
});

document.getElementById('sign-out-btn').addEventListener('click', function() {
    window.location.href = '/login';
});
