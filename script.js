document.getElementById('sign-in-choice').addEventListener('click', function() {
    document.getElementById('choice-container').classList.add('hidden');
    document.getElementById('sign-in-container').classList.remove('hidden');
});

document.getElementById('register-choice').addEventListener('click', function() {
    document.getElementById('choice-container').classList.add('hidden');
    document.getElementById('register-container').classList.remove('hidden');
});

document.getElementById('back-to-choice').addEventListener('click', function() {
    document.getElementById('sign-in-container').classList.add('hidden');
    document.getElementById('choice-container').classList.remove('hidden');
});

document.getElementById('back-to-choice2').addEventListener('click', function() {
    document.getElementById('register-container').classList.add('hidden');
    document.getElementById('choice-container').classList.remove('hidden');
});

document.getElementById('sign-in-form').addEventListener('submit', function(event) {
    event.preventDefault();
    const email = event.target.querySelector('input[type="email"]').value;
    const password = event.target.querySelector('input[type="password"]').value;
    
    // Example sign-in logic (replace with actual implementation)
    console.log('Sign In:', { email, password });
    
    // Simulate sign-in success (remove this in actual implementation)
    alert(`Sign In Successful!\nEmail: ${email}`);
    
    // Redirect to booking page after sign-in success
    window.location.href = '"D:\VS CODE\KS KM\booking.html"'; // Replace with actual path to booking page
});


document.getElementById('register-form').addEventListener('submit', function(event) {
    event.preventDefault();
    const name = event.target.querySelector('input[type="text"]').value;
    const email = event.target.querySelector('input[type="email"]').value;
    const password = event.target.querySelector('input[type="password"]').value;
    
    // Example register logic (replace with actual implementation)
    console.log('Register:', { name, email, password });
    
    // Simulate registration success
    alert(`Registration Successful!\nName: ${name}\nEmail: ${email}`);
    
    // Redirect to booking page (replace with actual redirection logic)
    // window.location.href = 'booking.html';
});
