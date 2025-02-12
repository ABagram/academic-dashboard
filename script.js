function addRow(programType, programNumber) {
    // Generate a unique class name based on the program type and number
    const mainContainerClass = `${programType}-${programNumber}`;

    // Create the main-container div with the unique class name
    const mainContainer = document.createElement('div');
    mainContainer.className = `main-container ${mainContainerClass}`;
    mainContainer.style.display = 'none'; // Initially hide the container

    // Create the course-cards-container and calendar-container divs
    const courseCardsContainer = document.createElement('div');
    courseCardsContainer.className = 'course-cards-container';
    
    // Add a heading to the course-cards-container
    const heading = document.createElement('h3');
    heading.textContent = `${programType.charAt(0).toUpperCase() + programType.slice(1)} ${programNumber}`;
    courseCardsContainer.appendChild(heading);

    const calendarContainer = document.createElement('div');
    calendarContainer.className = 'calendar-container';

    // Append the containers to the main container
    mainContainer.appendChild(courseCardsContainer);
    mainContainer.appendChild(calendarContainer);

    // Append the main container to the table or desired parent element
    document.getElementById('table').appendChild(mainContainer);
}

// ...existing code...

document.getElementById('add-term-btn').addEventListener('click', function() {
    const tableBody = document.querySelector('.term-details tbody');
    const newRow = document.createElement('tr');
    const termCount = tableBody.rows.length + 1;
    newRow.innerHTML = `
        <td>${termCount}</td>
        <td><input type="month" placeholder="Start Date"></td>
        <td><input type="month" placeholder="End Date"></td>
        <td><input type="number" step="0.01" placeholder="GPA"></td>
    `;
    tableBody.appendChild(newRow);
    addContextMenuListener(newRow);
    const programType = document.getElementById('program-type').value;
    addRow(programType, termCount);
});

document.getElementById('add-course-btn').addEventListener('click', function() {
    const cardsContainer = document.getElementById('course-cards-container');
    const uniqueId = Date.now();
    const newCard = document.createElement('div');
    newCard.className = 'course-card';
    newCard.innerHTML = `
        <div class="course-details">
            <div class="course-code-section">
                <div class="editable course-code" data-placeholder="Enter course code"></div>
                <div class="editable course-section" data-placeholder="Enter course section"></div>
            </div>
            <div class="editable" data-placeholder="Enter course title"></div>
            <div class="editable" data-placeholder="Enter location"></div>
            <div class="editable" data-placeholder="Enter grade"></div>
            <div class="editable" data-placeholder="Enter unit"></div>
        </div>
        <div class="schedule-details">
            <div class="days-checkboxes">
                <input type="checkbox" id="sunday-${uniqueId}" name="days" value="Sunday"><label for="sunday-${uniqueId}">Su</label>
                <input type="checkbox" id="monday-${uniqueId}" name="days" value="Monday"><label for="monday-${uniqueId}">M</label>
                <input type="checkbox" id="tuesday-${uniqueId}" name="days" value="Tuesday"><label for="tuesday-${uniqueId}">Tu</label>
                <input type="checkbox" id="wednesday-${uniqueId}" name="days" value="Wednesday"><label for="wednesday-${uniqueId}">W</label>
                <input type="checkbox" id="thursday-${uniqueId}" name="days" value="Thursday"><label for="thursday-${uniqueId}">Th</label>
                <input type="checkbox" id="friday-${uniqueId}" name="days" value="Friday"><label for="friday-${uniqueId}">F</label>
                <input type="checkbox" id="saturday-${uniqueId}" name="days" value="Saturday"><label for="saturday-${uniqueId}">Sa</label>
            </div>
            <div>
                <label><input type="checkbox" id="same-time-checkbox-${uniqueId}"> Same time for all days</label>
            </div>
            <div id="time-inputs-${uniqueId}" class="time-inputs"></div>
        </div>
        <button class="delete-course-btn">Delete</button>
    `;
    cardsContainer.appendChild(newCard);

    const sameTimeCheckbox = newCard.querySelector(`#same-time-checkbox-${uniqueId}`);
    const dayCheckboxes = newCard.querySelectorAll('input[name="days"]');
    const timeInputsContainer = newCard.querySelector(`#time-inputs-${uniqueId}`);

    function updateTimeInputs() {
        if (sameTimeCheckbox.checked) {
            timeInputsContainer.innerHTML = '';
            const selectedDays = Array.from(dayCheckboxes).filter(checkbox => checkbox.checked).map(checkbox => checkbox.value).join(', ');
            if (selectedDays) {
                timeInputsContainer.innerHTML = `
                    <div class="time-input">
                        <span>${selectedDays}</span>
                        <input type="time" name="start-time" class="start-time">
                        <input type="time" name="end-time" class="end-time">
                        <span class="duration"></span>
                    </div>
                `;
            }
        } else {
            timeInputsContainer.innerHTML = '';
            dayCheckboxes.forEach(checkbox => {
                if (checkbox.checked) {
                    const day = checkbox.value;
                    timeInputsContainer.innerHTML += `
                        <div class="time-input">
                            <span>${day}</span>
                            <input type="time" name="${day.toLowerCase()}-start-time" class="start-time">
                            <input type="time" name="${day.toLowerCase()}-end-time" class="end-time">
                            <span class="duration"></span>
                        </div>
                    `;
                }
            });
        }
        addDurationListeners();
        updateCalendar();
    }

    function addDurationListeners() {
        const timeInputs = newCard.querySelectorAll('.time-input');
        timeInputs.forEach(input => {
            const startTimeInput = input.querySelector('.start-time');
            const endTimeInput = input.querySelector('.end-time');
            const durationSpan = input.querySelector('.duration');

            function calculateDuration() {
                const startTime = startTimeInput.value;
                const endTime = endTimeInput.value;
                if (startTime && endTime) {
                    const start = new Date(`1970-01-01T${startTime}Z`);
                    const end = new Date(`1970-01-01T${endTime}Z`);
                    const diff = (end - start) / 60000; // difference in minutes
                    const hours = Math.floor(diff / 60);
                    const minutes = diff % 60;
                    durationSpan.textContent = `${hours}h ${minutes}m`;
                } else {
                    durationSpan.textContent = '';
                }
            }

            startTimeInput.addEventListener('input', calculateDuration);
            endTimeInput.addEventListener('input', calculateDuration);
        });
    }

    sameTimeCheckbox.addEventListener('change', updateTimeInputs);
    dayCheckboxes.forEach(checkbox => {
        checkbox.addEventListener('change', updateTimeInputs);
    });

    // Make divs editable on double-click
    newCard.querySelectorAll('.editable').forEach(div => {
        div.addEventListener('dblclick', function() {
            const input = document.createElement('input');
            input.type = 'text';
            input.value = div.textContent.trim();
            input.placeholder = div.getAttribute('data-placeholder');
            input.style.fontSize = window.getComputedStyle(div).fontSize;
            input.style.fontWeight = window.getComputedStyle(div).fontWeight;
            div.textContent = '';
            div.appendChild(input);
            input.focus();

            input.addEventListener('blur', function() {
                div.textContent = input.value.trim() || input.placeholder;
                div.removeChild(input);
            });

            input.addEventListener('keypress', function(e) {
                if (e.key === 'Enter') {
                    input.blur();
                }
            });
        });
    });

    // Add right-click event to show delete button
    newCard.addEventListener('contextmenu', function(event) {
        event.preventDefault();
        const deleteBtn = newCard.querySelector('.delete-course-btn');
        deleteBtn.style.display = 'block';

        document.addEventListener('click', function hideDeleteButton(e) {
            if (!newCard.contains(e.target)) {
                deleteBtn.style.display = 'none';
                document.removeEventListener('click', hideDeleteButton);
            }
        });
    });

    // Add click event to delete button
    newCard.querySelector('.delete-course-btn').addEventListener('click', function() {
        cardsContainer.removeChild(newCard);
        updateCalendar();
        saveToLocalStorage();
    });

    updateCalendar();
    saveToLocalStorage();
});

// Add event listener to table rows to show corresponding course cards
document.querySelector('.term-details tbody').addEventListener('click', function(event) {
    let target = event.target;
    while (target && target.tagName !== 'TR') {
        target = target.parentNode;
    }
    if (target) {
        const termNumber = target.cells[0].textContent.trim();
        const programType = document.getElementById('program-type').value;

        // Hide all main containers
        document.querySelectorAll('.main-container').forEach(container => {
            container.style.display = 'none';
        });

        // Show the selected main container
        const selectedContainer = document.querySelector(`.${programType}-${termNumber}`);
        if (selectedContainer) {
            selectedContainer.style.display = 'block';
        }
    }
});

function saveProgramDetailsToLocalStorage() {
    const programName = document.getElementById('program-name').textContent.trim() || '';
    const programCode = document.getElementById('program-code').textContent.trim() || '';
    const programType = document.getElementById('program-type').value || '';
    const totalTerms = document.getElementById('total-terms').value || '';
    const programStartDate = document.getElementById('program-start-date').value || '';

    localStorage.setItem('programName', programName);
    localStorage.setItem('programCode', programCode);
    localStorage.setItem('programType', programType);
    localStorage.setItem('totalTerms', totalTerms);
    localStorage.setItem('programStartDate', programStartDate);
}

function loadProgramDetailsFromLocalStorage() {
    const programName = localStorage.getItem('programName') || '';
    const programCode = localStorage.getItem('programCode') || '';
    const programType = localStorage.getItem('programType') || 'semestral';
    const totalTerms = localStorage.getItem('totalTerms') || '';
    const programStartDate = localStorage.getItem('programStartDate') || '';

    document.getElementById('program-name').textContent = programName;
    document.getElementById('program-code').textContent = programCode;
    document.getElementById('program-type').value = programType;
    document.getElementById('total-terms').value = totalTerms;
    document.getElementById('program-start-date').value = programStartDate;
}

document.getElementById('program-name').addEventListener('blur', saveProgramDetailsToLocalStorage);
document.getElementById('program-code').addEventListener('blur', saveProgramDetailsToLocalStorage);
document.getElementById('program-type').addEventListener('change', saveProgramDetailsToLocalStorage);
document.getElementById('total-terms').addEventListener('input', saveProgramDetailsToLocalStorage);
document.getElementById('program-start-date').addEventListener('input', saveProgramDetailsToLocalStorage);

document.addEventListener('DOMContentLoaded', function() {
    loadProgramDetailsFromLocalStorage();
    loadFromLocalStorage();
    createCourseTable();
});

document.getElementById('toggle-view-btn').addEventListener('click', function() {
    const cardsContainer = document.getElementById('course-cards-container');
    const tableContainer = document.getElementById('course-table-container');
    const isCardView = cardsContainer.style.display !== 'none';

    if (isCardView) {
        cardsContainer.style.display = 'none';
        tableContainer.style.display = 'block';
        this.textContent = 'Card View';
        createCourseTable();
    } else {
        cardsContainer.style.display = 'block';
        tableContainer.style.display = 'none';
        this.textContent = 'Table View';
    }
});

function createCourseTable() {
    const tableContainer = document.getElementById('course-table-container');
    const courses = document.querySelectorAll('.course-card');
    let tableHTML = `
        <table>
            <thead>
                <tr>
                    <th>Period Type</th>
                    <th>No.</th>
                    <th>Course Code</th>
                    <th>Course Title</th>
                    <th>Course Section</th>
                    <th>Course Location</th>
                    <th>Schedule</th>
                    <th>Grade</th>
                    <th>Unit</th>
                </tr>
            </thead>
            <tbody>
    `;

    courses.forEach((course, index) => {
        const periodType = document.getElementById('program-type').value;
        const courseCode = course.querySelector('.course-code').textContent.trim();
        const courseSection = course.querySelector('.course-section').textContent.trim();
        const courseTitle = course.querySelector('.editable[data-placeholder="Enter course title"]').textContent.trim();
        const location = course.querySelector('.editable[data-placeholder="Enter location"]').textContent.trim();
        const grade = course.querySelector('.editable[data-placeholder="Enter grade"]').textContent.trim();
        const unit = course.querySelector('.editable[data-placeholder="Enter unit"]').textContent.trim();
        const schedule = Array.from(course.querySelectorAll('.days-checkboxes input:checked')).map(checkbox => checkbox.value).join(', ');

        tableHTML += `
            <tr>
                <td>${periodType}</td>
                <td>${index + 1}</td>
                <td>${courseCode}</td>
                <td>${courseTitle}</td>
                <td>${courseSection}</td>
                <td>${location}</td>
                <td>${schedule}</td>
                <td>${grade}</td>
                <td>${unit}</td>
            </tr>
        `;
    });

    tableHTML += `
            </tbody>
        </table>
    `;

    tableContainer.innerHTML = tableHTML;
}

document.addEventListener('DOMContentLoaded', function() {
    createCourseTable();
    // ...existing code...
});

document.addEventListener('DOMContentLoaded', function() {
    const tabLinks = document.querySelectorAll('.tab-link');
    const tabContents = document.querySelectorAll('.tab-content');

    function showTab(tabId) {
        tabContents.forEach(content => {
            content.style.display = content.id === tabId ? 'block' : 'none';
        });
        tabLinks.forEach(link => {
            link.classList.toggle('active', link.getAttribute('data-tab') === tabId);
        });
    }

    tabLinks.forEach(link => {
        link.addEventListener('click', function(event) {
            event.preventDefault();
            const tabId = this.getAttribute('data-tab');
            showTab(tabId);
        });
    });

    // Show the first tab by default
    showTab('home');
});

// ...existing code...
