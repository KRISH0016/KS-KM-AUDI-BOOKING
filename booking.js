
document.addEventListener('DOMContentLoaded', () => {
    const userId = localStorage.getItem('userId'); // Get user ID from local storage
    console.log('User Id',userId);
    const department = localStorage.getItem('department'); // Get department from local storage
    console.log('dept',department);
    const calendarEl = document.getElementById('calendar');
    const auditoriumSelect = document.getElementById('auditorium');
    const dateSelect = document.getElementById('booking-date');
    const slotSelect = document.getElementById('slot');
    const eventNameInput = document.getElementById('event-name'); 
    const events_name = eventNameInput.value.trim();
    const viewMyBookingsButton = document.getElementById('view-my-bookings-button');
    const amenitiesCheckboxes = document.querySelectorAll('input[type="checkbox"]');
    const bookButton = document.getElementById('book-button');
    const cancelButton = document.getElementById('cancel-button');
    const messageBox = document.getElementById('message-box');
    const userName = document.getElementById('userName');

    var events;

    userName.innerHTML = localStorage.getItem('username');
    console.log(localStorage.getItem('username'));

    function fetchBookings() {
        return fetch(`http://localhost:3000/bookings`)
            .then(response => response.json());
    }
    function fetchMyBookings() {
        return fetch(`http://localhost:3000/bookings/${userId}`)
            .then(response => response.json())
            .then(data => {
                console.log('Fetched bookings:', data); // Debug log
                return data;
            })
            .catch(error => {
                console.error('Error fetching bookings:', error);
            });
    }
    
    function updateCalendar(bookings) {
        events = bookings.map(booking => {
            const auditoriumLabel = booking.auditorium === 'auditorium1' ? 'KS' : 'KM';
            const slotLabel = booking.slot === 'morning' ? 'MRNG' : 'AFTN';
            const title = `${auditoriumLabel} ${slotLabel}`;

            const color = booking.status === 'approved' ?
                (booking.slot === 'morning' ? 'rgba(255,0,0,0.5)' : 'rgba(255,0,0,1)') :
                'grey';

            return {
                title: title,
                start: booking.start,
                end: booking.end,
                backgroundColor: color,
                borderColor: color
            };
        });

        $('#calendar').fullCalendar('removeEvents');
        $('#calendar').fullCalendar('addEventSource', events);
    }

    $('#calendar').fullCalendar({
        header: {
            left: 'prev,next today',
            center: 'title',
            right: 'month,agendaWeek,agendaDay'
        },
        events: fetchBookings().then(bookings => updateCalendar(bookings))
    });

    bookButton.addEventListener('click', () => {
        const auditorium = auditoriumSelect.value;
        const date = dateSelect.value;
        const slot = slotSelect.value;
        const amenities = Array.from(amenitiesCheckboxes)
            .filter(checkbox => checkbox.checked)
            .map(checkbox => checkbox.value);
        //const events=eventNameInput.value;
        if (auditorium && date && slot) {
            fetch('http://localhost:3000/book', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    userId: userId, // Include user ID
                    auditorium: auditorium,
                    date: date,
                    slot: slot,
                    title: 'Booking Request',
                    start: slot === 'morning' ? `${date}T09:00:00` : `${date}T14:15:00`,
                    end: slot === 'morning' ? `${date}T13:15:00` : `${date}T17:00:00`,
                    amenities: amenities,
                    events_name:events_name,
                    name: localStorage.getItem("username")

                })
            })
            .then(response => response.json())
            .then(data => {
                messageBox.textContent = data.message;
                fetchBookings().then(bookings => updateCalendar(bookings));
            })
            .catch(error => {
                console.error('Error:', error);
                messageBox.textContent = 'Failed to book the auditorium';
            });
        } else {
            messageBox.textContent = 'Please select all booking details';
        }
    });
    viewMyBookingsButton.addEventListener('click', () => {
        fetchMyBookings()
            .then(bookings => {
                updateCalendar(bookings);
            })
            .catch(error => {
                console.error('Error fetching bookings:', error);
                messageBox.textContent = 'Failed to fetch your bookings';
            });
    });
    
    function updateCalendar(bookings) {
        events = bookings.map(booking => {
            const auditoriumLabel = booking.auditorium === 'auditorium1' ? 'KS' : 'KM';
            const slotLabel = booking.slot === 'morning' ? 'MRNG' : 'AFTN';
            const title = `${auditoriumLabel} ${slotLabel}`;
    
            const color = booking.status === 'approved' ?
                (booking.slot === 'morning' ? 'rgba(255,0,0,0.5)' : 'rgba(255,0,0,1)') :
                'grey';
    
            return {
                title: title,
                start: booking.start,
                end: booking.end,
                backgroundColor: color,
                borderColor: color,
                id: booking.id,
                userId: booking.userId
            };
        });
    
        $('#calendar').fullCalendar('removeEvents');
        $('#calendar').fullCalendar('addEventSource', events);
    
        // Add click listener for each event to cancel booking
        $('#calendar').fullCalendar('option', 'eventClick', function(event) {
            if (event.userId == userId) { // Ensure user can only cancel their own bookings
                if (confirm('Do you want to cancel this booking?')) {
                    cancelBooking(event.id);
                }
            } else {
                alert('You can only cancel your own bookings.');
            }
        });
    }
    
    function cancelBooking(bookingId) {
        const auditorium = auditoriumSelect.value;
        const date = dateSelect.value;
        const slot = slotSelect.value;
        // const amenities= amenitiesRequired.value;
        console.log(auditorium, date, slot);
        fetch('http://localhost:3000/cancel', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                userId: userId, // Include user ID
                    auditorium: auditorium,
                    date: date,
                    slot: slot, // Include user ID to verify ownership
                    // amenities: amenities
            })
        })
        .then(response => response.json())
        .then(data => {
            messageBox.textContent = data.message;
            fetchBookings().then(bookings => updateCalendar(bookings));
        })
        .catch(error => {
            console.error('Error:', error);
            messageBox.textContent = 'Failed to cancel the booking';
        });
    }
    
    cancelButton.addEventListener('click', () => {
        var start = slotSelect.value === 'morning' ? `${dateSelect.value}T09:00:00` : `${dateSelect.value}T14:15:00`;
        var end = slotSelect.value === 'morning' ? `${dateSelect.value}T13:15:00` : `${dateSelect.value}T17:00:00`;
        console.log(start, end);
        var flag = false;
        events.forEach(element => {
            if (element.userId === localStorage.getItem("userId") && element.start === start) {
                if (confirm('Do you want to cancel this booking?')) {
                    flag = true;
                    cancelBooking(element.userId);
                }
            }
        });
        if (!flag) {
            alert('You can only cancel your own bookings.');
        }
        auditoriumSelect.value = '';
        dateSelect.value = '';
        slotSelect.value = '';
        messageBox.textContent = '';
    });
});

