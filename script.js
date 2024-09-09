let selectedMuseum = '';
let selectedNationality = '';
let totalAmount = 0;

const prices = {
    shivaji: {
        indian: { adult: 150, child: 35, senior: 100, student: 75, audio: 75, camera: 200 },
        foreign: { adult: 700, child: 200, audio: 75, camera: 200 }
    },
    national: {
        indian: { adult: 200, child: 85, senior: 150, student: 125, audio: 125, camera: 250 },
        foreign: { adult: 750, child: 250, audio: 125, camera: 250 }
    },
    indian: {
        indian: { adult: 300, child: 185, senior: 250, student: 225, audio: 225, camera: 350 },
        foreign: { adult: 850, child: 350, audio: 225, camera: 350 }
    }
};

// Keep track of ticket counts
let ticketCount = { adult: 0, child: 0, senior: 0, student: 0, audio: 0, camera: 0 };

// Museum Selection
document.querySelectorAll('.ticket-type-option').forEach(option => {
    option.addEventListener('click', function () {
        resetSelection(); // Reset previous selection
        selectedMuseum = option.id;
        document.getElementById('visitor-info').style.display = 'block';
        displayNationalityOptions(); // Show nationality options
    });
});

// Display nationality options (Indian or Foreign)
function displayNationalityOptions() {
    document.getElementById('visitor-info').innerHTML = `
        <h3>Are you an Indian Visitor or a Foreign Tourist?</h3>
        <div class="ticket-type-options">
            <div class="ticket-type-option" id="indian">Indian Visitor</div>
            <div class="ticket-type-option" id="foreign">Foreign Tourist</div>
        </div>
        <button id="back-to-museum" style="display: block;">Back to Museum Selection</button>
    `;
    
    // Event listeners for nationality buttons
    document.querySelectorAll('.ticket-type-option').forEach(option => {
        option.addEventListener('click', function () {
            selectedNationality = option.id;
            resetTicketCount(); // Reset ticket count when switching nationality
            displayTicketOptions(); // Display ticket options based on selected nationality
        });
    });

    // Event listener for Back button to go back to museum selection
    document.getElementById('back-to-museum').addEventListener('click', function () {
        resetSelection();  // Reset selections
        document.getElementById('visitor-info').style.display = 'none';  // Hide visitor info
    });
}

// Display ticket options based on selected nationality
function displayTicketOptions() {
    let museumPrices = prices[selectedMuseum][selectedNationality];

    // Indian visitors have more options (senior, student)
    let seniorSection = '';
    let studentSection = '';
    if (selectedNationality === 'indian') {
        seniorSection = `
            <div class="visitor-selection">
                <span>Senior Citizen (INR ${museumPrices.senior})</span>
                <button onclick="updateCount('senior', -1)">-</button>
                <span id="senior-count">0</span>
                <button onclick="updateCount('senior', 1)">+</button>
            </div>
            <div class="visitor-selection">
                <span>College Student (INR ${museumPrices.student})</span>
                <button onclick="updateCount('student', -1)">-</button>
                <span id="student-count">0</span>
                <button onclick="updateCount('student', 1)">+</button>
            </div>`;
    }

    // Build the visitor and add-on options based on nationality
    document.getElementById('visitor-info').innerHTML = `
        <h3>Select the number of visitors</h3>
        <div class="visitor-selection">
            <span>Adult (INR ${museumPrices.adult})</span>
            <button onclick="updateCount('adult', -1)">-</button>
            <span id="adult-count">0</span>
            <button onclick="updateCount('adult', 1)">+</button>
        </div>
        <div class="visitor-selection">
            <span>Child (INR ${museumPrices.child})</span>
            <button onclick="updateCount('child', -1)">-</button>
            <span id="child-count">0</span>
            <button onclick="updateCount('child', 1)">+</button>
        </div>
        ${seniorSection}
        <h3>Select Add-ons</h3>
        <div class="addon-selection">
            <span>Audio Guide (INR ${museumPrices.audio})</span>
            <button onclick="updateCount('audio', -1)">-</button>
            <span id="audio-count">0</span>
            <button onclick="updateCount('audio', 1)">+</button>
        </div>
        <div class="addon-selection">
            <span>Handheld Camera (INR ${museumPrices.camera})</span>
            <button onclick="updateCount('camera', -1)">-</button>
            <span id="camera-count">0</span>
            <button onclick="updateCount('camera', 1)">+</button>
        </div>
        <button id="next-to-details" style="display: block;">Next</button>
        <button id="back-to-nationality" style="display: block;">Back to Nationality Page</button>
    `;

    // Show the total section
    document.getElementById('total-section').style.display = 'block';

    // Event listener for Next button to go to personal details form
    document.getElementById('next-to-details').addEventListener('click', function () {
        displayPersonalDetailsForm();
    });

    // Event listener for Back button to go back to nationality selection
    document.getElementById('back-to-nationality').addEventListener('click', function () {
        displayNationalityOptions();  // Go back to nationality selection
    });
}

// Update ticket count and recalculate total
function updateCount(type, change) {
    ticketCount[type] = Math.max(0, ticketCount[type] + change);
    document.getElementById(`${type}-count`).textContent = ticketCount[type];
    calculateTotal();
}

// Calculate the total cost based on selected tickets and add-ons
function calculateTotal() {
    let museumPrices = prices[selectedMuseum][selectedNationality];
    
    totalAmount = (ticketCount.adult * museumPrices.adult) +
                  (ticketCount.child * museumPrices.child) +
                  (ticketCount.senior * museumPrices.senior || 0) +
                  (ticketCount.student * museumPrices.student || 0) +
                  (ticketCount.audio * museumPrices.audio) +
                  (ticketCount.camera * museumPrices.camera);

    document.getElementById('total-amount').textContent = totalAmount + " INR";
}

// Display personal details form
function displayPersonalDetailsForm() {
    document.getElementById('visitor-info').innerHTML = `
        <h3>Enter your personal details</h3>
        <form id="personal-details-form">
            <label for="dateOfVisit">Enter your Date of Visit *</label>
            <input type="date" id="dateOfVisit" name="dateOfVisit" required>

            <label for="name">Enter your name *</label>
            <input type="text" id="name" name="name" required>

            <label for="email">Enter your Email address *</label>
            <input type="email" id="email" name="email" required>

            <label for="phone">Enter Your phone Number *</label>
            <input type="tel" id="phone" name="phone" required>

            <button id="next-to-summary" style="display: block;">Next</button>
        </form>
    `;

    // Event listener for "Next" button to validate and show booking summary
    document.getElementById('next-to-summary').addEventListener('click', function (e) {
        e.preventDefault();
        if (validatePersonalDetails()) {
            storePersonalDetails(); // Store personal details entered by the user
            displayBookingSummary(); // Show booking summary
        }
    });
}

// Validate personal details form
function validatePersonalDetails() {
    const dateOfVisit = document.getElementById('dateOfVisit').value;
    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const phone = document.getElementById('phone').value;

    if (!dateOfVisit || !name || !email || !phone) {
        alert('Please fill in all fields to proceed.');
        return false;
    }
    return true;
}

// Store personal details entered by the user
function storePersonalDetails() {
    personalDetails = {
        dateOfVisit: document.getElementById('dateOfVisit').value,
        name: document.getElementById('name').value,
        email: document.getElementById('email').value,
        phone: document.getElementById('phone').value
    };
}

// Display the booking summary
function displayBookingSummary() {
    document.getElementById('visitor-info').innerHTML = `
        <h3>Booking Details for ${personalDetails.dateOfVisit}</h3>
        <p>Name - ${personalDetails.name}</p>
        <p>Email - ${personalDetails.email}</p>
        <p>Phone - ${personalDetails.phone}</p>
        <p>Adult x ${ticketCount.adult} - INR ${ticketCount.adult * prices[selectedMuseum][selectedNationality].adult}</p>
        <p>Child x ${ticketCount.child} - INR ${ticketCount.child * prices[selectedMuseum][selectedNationality].child}</p>
        <p>Handheld Camera x ${ticketCount.camera} - INR ${ticketCount.camera * prices[selectedMuseum][selectedNationality].camera}</p>

        <p>Total - ${totalAmount} INR</p>
        <input type="checkbox" id="agree-terms" required> I have read all the <a href="#">rules and regulations</a>
        <br>
        <button id="proceed-to-payment" style="display: block;">Proceed to Payment</button>
    `;

    // Event listener for "Proceed to Payment" button
    document.getElementById('proceed-to-payment').addEventListener('click', function () {
        if (document.getElementById('agree-terms').checked) {
            let paymentLink = getPaymentLink(selectedMuseum);
            window.location.href = paymentLink;
        } else {
            alert('Please agree to the terms and conditions.');
        }
    });
}

// Generate dummy payment link based on the selected museum
function getPaymentLink(museum) {
    switch (museum) {
        case 'shivaji':
            return 'payment_shivaji.html';
        case 'national':
            return 'payment_national.html';
        case 'indian':
            return 'payment_indian.html';
        default:
            return '#';
    }
}

// Reset all selections when switching museums
function resetSelection() {
    selectedMuseum = '';
    selectedNationality = '';
    resetTicketCount();
    totalAmount = 0;
    document.getElementById('total-amount').textContent = "0 INR";
    document.getElementById('total-section').style.display = 'none'; // Hide total section
}

// Reset ticket counts and displayed values
function resetTicketCount() {
    ticketCount = { adult: 0, child: 0, senior: 0, student: 0, audio: 0, camera: 0 };
    if (document.getElementById('adult-count')) document.getElementById('adult-count').textContent = 0;
    if (document.getElementById('child-count')) document.getElementById('child-count').textContent = 0;
    if (document.getElementById('senior-count')) document.getElementById('senior-count').textContent = 0;
    if (document.getElementById('student-count')) document.getElementById('student-count').textContent = 0;
    if (document.getElementById('audio-count')) document.getElementById('audio-count').textContent = 0;
    if (document.getElementById('camera-count')) document.getElementById('camera-count').textContent = 0;
}
