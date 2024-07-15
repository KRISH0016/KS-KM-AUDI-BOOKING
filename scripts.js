// const showSignInButton = document.getElementById('showSignIn');
// const showRegisterButton = document.getElementById('showRegister');
// const backToSelectionButtons = document.querySelectorAll('[id^="backToSelection"]');

// const selectionScreen = document.getElementById('selection-screen');
// const signInForm = document.getElementById('signInForm');
// const registerForm = document.getElementById('registerForm');

// showSignInButton.addEventListener('click', () => {
//     selectionScreen.classList.add('hidden');
//     signInForm.classList.remove('hidden');
// });

// showRegisterButton.addEventListener('click', () => {
//     selectionScreen.classList.add('hidden');
//     registerForm.classList.remove('hidden');
// });

// backToSelectionButtons.forEach(button => {
//     button.addEventListener('click', () => {
//         signInForm.classList.add('hidden');
//         registerForm.classList.add('hidden');
//         selectionScreen.classList.remove('hidden');
//     });
// });

// signInForm.addEventListener('submit', async (e) => {
//     e.preventDefault();
//     const email = document.getElementById('signInEmail').value;
//     const password = document.getElementById('signInPassword').value;
//     const department = document.getElementById('signInDepartment').value;

//     const response = await fetch('http://localhost:3000/signin', {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({ email, password, department })
//     });

//     if (response.ok) {
//         alert('Sign-in successful');
//         window.location.href = 'booking.html'; // Redirect to booking page
//     } else {
//         alert('Invalid credentials');
//     }
// });

// registerForm.addEventListener('submit', async (e) => {
//     e.preventDefault();
//     const name = document.getElementById('registerName').value;
//     const email = document.getElementById('registerEmail').value;
//     const password = document.getElementById('registerPassword').value;
//     const department = document.getElementById('registerDepartment').value;

//     const response = await fetch('http://localhost:3000/register', {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({ name, email, password, department })
//     });

//     if (response.ok) {
//         alert('User registered');
//         window.location.href = 'booking.html'; // Redirect to booking page
//     } else {
//         alert('Registration failed');
//     }
// });

const api = "http://localhost:3000"

document.getElementById('signInForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = document.getElementById('signInEmail').value;
    const password = document.getElementById('signInPassword').value;
    const department = document.getElementById('department').value;

    try {
        const response = await fetch(`${api}/signin`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password, department })
        });

        const data = await response.json();
        if (response.ok) {
            alert('Sign-in successful');
            localStorage.setItem('userId', data.userId); // Store user ID
            localStorage.setItem('department', data.department); // Store department
            localStorage.setItem('username', data.name);
            console.log(data);
            window.location.href = 'booking.html'; // Redirect to booking page
        } else {
            alert('Invalid credentials');
        }
    } catch (error) {
        console.error('Error:', error);
        alert('Failed to sign in');
    }
});

document.getElementById('registerForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const name = document.getElementById('registerName').value;
    const email = document.getElementById('registerEmail').value;
    const password = document.getElementById('registerPassword').value;
    const department = document.getElementById('registerDepartment').value; // Add department field

    try {
        const response = await fetch('http://localhost:3000/register', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name, email, password, department })
        });

        const data = await response.json();
        if (response.ok) {
            alert(`${data.name} registered`);
            localStorage.setItem('userId', data.userId); // Store user ID
            localStorage.setItem('department', data.department); // Store department
            localStorage.setItem('username', data.name);
            window.location.href = 'booking.html'; // Redirect to booking page
        } else {
            alert('Registration failed');
        }
    } catch (error) {
        console.error('Error:', error);
        alert('Failed to register');
    }
});

