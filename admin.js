// document.addEventListener('DOMContentLoaded', () => {
//     const calendarEl = document.getElementById('calendar');
//     const bookingRequestsEl = document.getElementById('booking-requests');
//     const printButton = document.getElementById('print-button');

//     async function fetchBookings() {
//         const result = await fetch('http://localhost:3000/bookings');
//         const output = result.json();
//         console.log(output);
//         return output;
//     }

//     function updateCalendar(bookings) {
//         const events = bookings.map(booking => {
//             const color = booking.status === 'approved' ? 
//                 (booking.slot === 'morning' ? 'rgba(255,0,0,0.5)' : 'rgba(255,0,0,1)') : 
//                 'grey';
//             return {
//                 title: booking.title,
//                 start: booking.start,
//                 end: booking.end,
//                 backgroundColor: color,
//                 borderColor: color
//             };
//         });
//         $('#calendar').fullCalendar('removeEvents');
//         $('#calendar').fullCalendar('addEventSource', events);
//     }

//     function updateBookingRequests(bookings) {
//         bookingRequestsEl.innerHTML = '';
//         bookings.filter(b => b.status === 'pending').forEach(request => {
//             const listItem = document.createElement('li');
//             listItem.textContent = `${request.title} from ${request.start} to ${request.end}`;

//             const approveButton = document.createElement('button');
//             approveButton.textContent = 'Approve';
//             approveButton.addEventListener('click', () => {
//                 fetch(`http://localhost:3000/approve`, {
//                     method: 'POST',
//                     headers: { 'Content-Type': 'application/json' },
//                     body: JSON.stringify({ id: request.id })
//                 })
//                 .then(response => response.ok ? alert('Booking approved') : alert('Approval failed'))
//                 .then(() => listItem.remove());
//             });

//             const rejectButton = document.createElement('button');
//             rejectButton.textContent = 'Reject';
//             rejectButton.addEventListener('click', () => {
//                 fetch(`http://localhost:3000/reject`, {
//                     method: 'POST',
//                     headers: { 'Content-Type': 'application/json' },
//                     body: JSON.stringify({ id: request.id })
//                 })
//                 .then(response => response.ok ? alert('Booking rejected') : alert('Rejection failed'))
//                 .then(() => listItem.remove());
//             });

//             listItem.appendChild(approveButton);
//             listItem.appendChild(rejectButton);
//             bookingRequestsEl.appendChild(listItem);
//         });
//     }

//     $('#calendar').fullCalendar({
//         header: {
//             left: 'prev,next today',
//             center: 'title',
//             right: 'month,agendaWeek,agendaDay'
//         },
//         events: fetchBookings().then(bookings => updateCalendar(bookings))
//     });

//     fetchBookings().then(bookings => {
//         updateCalendar(bookings);
//         updateBookingRequests(bookings);
//     });

//     printButton.addEventListener('click', () => {
//         window.print();
//     });
// });
// admin.jsdocument.addEventListener('DOMContentLoaded', () => {
    const bookingsTable = document.getElementById('bookings-body');
    const messageBox = document.getElementById('message-box');

    function fetchBookings() {
        return fetch(`http://localhost:3000/admin/bookings`)
            .then(response => response.json());
    }

    function displayBookings(bookings) {
        bookingsTable.innerHTML = ''; // Clear existing rows

        bookings.forEach(booking => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${booking.id}</td>
                <td>${booking.name}</td>
                <td>${booking.department}</td>
                <td>${booking.userId}</td>
                <td>${booking.auditorium}</td>
                <td>${booking.date}</td>
                <td>${booking.slot}</td>
                <td>${booking.amenities}</td>
                <td>${booking.status}</td>
                <td>
                    <button class="approve-button" data-booking-id="${booking.id}">Approve</button>
                    <button class="cancel-button" data-booking-id="${booking.id}">Cancel</button>
                </td>
            `;

            // Apply status-based colors
            if (booking.status === 'approved') {
                row.style.backgroundColor = booking.slot === 'morning' ? 'rgba(255, 0, 0, 0.5)' : 'rgba(255, 0, 0, 1)';
            } else if (booking.status === 'pending') {
                row.style.backgroundColor = 'grey';
            }

            bookingsTable.appendChild(row);
        });

        attachEventListeners();
    }

    function attachEventListeners() {
        const approveButtons = document.querySelectorAll('.approve-button');
        const cancelButtons = document.querySelectorAll('.cancel-button');

        approveButtons.forEach(button => {
            button.addEventListener('click', () => {
                const bookingId = button.getAttribute('data-booking-id');
                approveBooking(bookingId);
            });
        });

        cancelButtons.forEach(button => {
            button.addEventListener('click', () => {
                const bookingId = button.getAttribute('data-booking-id');
                cancelBooking(bookingId);
            });
        });
    }

    function approveBooking(bookingId) {
        fetch('http://localhost:3000/admin/approve', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ id: bookingId })
        })
        .then(response => {
            if (response.ok) {
                console.log('Booking approved successfully');
                // Optionally, update UI or fetch updated bookings
                fetchBookings().then(bookings => updateBookingsTable(bookings));
            } else {
                console.error('Failed to approve booking');
            }
        })
        .catch(error => console.error('Error approving booking:', error));
    }
    
    
    function cancelBooking(bookingId) {
        fetch('http://localhost:3000/admin/cancel', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ id: bookingId })
        })
        .then(response => {
            if (response.ok) {
                console.log('Booking canceled successfully');
                // Optionally, update UI or fetch updated bookings
                fetchBookings().then(bookings => updateBookingsTable(bookings));
            } else {
                console.error('Failed to cancel booking');
            }
        })
        .catch(error => console.error('Error canceling booking:', error));
    }
    

    // Function to initialize full calendar
    $('#calendar').fullCalendar({
        header: {
            left: 'prev,next today',
            center: 'title',
            right: 'month,agendaWeek,agendaDay'
        },
        events: (start, end, timezone, callback) => {
            fetch('http://localhost:3000/bookings')
                .then(response => response.json())
                .then(bookings => {
                    const events = bookings.map(booking => ({
                        id: booking.id,
                        title: booking.title,
                        start: booking.start,
                        end: booking.end,
                        backgroundColor: booking.status === 'approved' ? 'green' : 'grey',
                        borderColor: booking.status === 'approved' ? 'green' : 'grey'
                    }));
                    callback(events);
                })
                .catch(error => console.error('Error fetching bookings for calendar:', error));
        },
        editable: true, // Enable dragging and resizing of events
        eventClick: (calEvent, jsEvent, view) => {
            console.log('Event clicked:', calEvent);
            // Implement logic to handle event click (e.g., show details, cancel booking, etc.)
        }
    });
    
    function fetchBookings() {
        return fetch('http://localhost:3000/bookings')
            .then(response => response.json())
            .catch(error => console.error('Error fetching bookings:', error));
    }
    function updateBookingsTable(bookings) {
        const bookingsTable = document.getElementById('bookings-table');
        // Clear existing rows
        bookingsTable.innerHTML = '';
    
        // Populate table with new data
        bookings.forEach(booking => {
            const row = `<tr>
                            <td>${booking.id}</td>
                            <td>${booking.name}</td>
                            <td>${booking.department}</td>
                            <td>${booking.auditorium}</td>
                            <td>${booking.date}</td>
                            <td>${booking.slot}</td>
                            <td>${booking.status}</td>
                            <td>${booking.department}</td>
                            <td>${booking.title}</td>
                            <td>${booking.start}</td>
                            <td>${booking.end}</td>
                            <td>${booking.amenities}</td>
                            <td><button onclick="approveBooking('${booking.id}')">Approve</button></td>
                            <td><button onclick="cancelBooking('${booking.id}')">Cancel</button></td>
                        </tr>`;
            bookingsTable.insertAdjacentHTML('beforeend', row);
        });
    }
    $('#calendar').fullCalendar({
        header: {
            left: 'prev,next today',
            center: 'title',
            right: 'month,agendaWeek,agendaDay'
        },
        events: fetchBookings().then(bookings => {
            return bookings.map(booking => ({
                title: booking.title,
                start: booking.start,
                end: booking.end,
                backgroundColor: booking.status === 'approved' ? 'green' : 'grey',
                borderColor: booking.status === 'approved' ? 'green' : 'grey'
            }));
        })
    });
    
    

    // Initial fetch and display bookings
    fetchBookings().then(bookings => {
        displayBookings(bookings);
        initializeCalendar(); // Initialize calendar after bookings are displayed
    });

