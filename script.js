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
        <td class="start-date"><input type="month" placeholder="Start Date"></td>
        <td class="end-date"><input type="month" placeholder="End Date"></td>
        <td class="units"><input type="number" step="0.01" placeholder="Units"></td>
        <td class="gpa"><input type="number" step="0.01" placeholder="GPA"></td>
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

const optionMenu = document.querySelector(".select-menu"),
        selectBtn = optionMenu.querySelector(".select-btn"),
        options = optionMenu.querySelectorAll(".option"),
        sBtn_text = optionMenu.querySelector(".sBtn-text");

selectBtn.addEventListener("click", () => optionMenu.classList.toggle("active"));

options.forEach(option => {
    option.addEventListener("click", () => {
        let selectedOption = option.querySelector(".option-text").innerText;
        sBtn_text.innerText = selectedOption;
        
        optionMenu.classList.remove("active");
    });
});

document.getElementById('add-academic-period-btn').addEventListener('click', function() {
    const container = document.getElementById('academic-periods-container');
    const periodCount = container.children.length + 1;
    const periodId = `period-${Date.now()}`;
    const newPeriod = document.createElement('div');
    newPeriod.className = 'academic-period';
    newPeriod.innerHTML = `
        <div class="period-header">
            <h3>Academic Period ${periodCount}</h3>
            <button class="delete-period-btn">Delete</button>
        </div>
        <nav>
            <ul>
                <li><a href="#${periodId}-calendar" class="tab-link" data-tab="${periodId}-calendar">Academic Calendar</a></li>
                <li><a href="#${periodId}-courses" class="tab-link" data-tab="${periodId}-courses">Courses</a></li>
            </ul>
        </nav>
        <div class="tab-content" id="${periodId}-calendar">
            <h3>Academic Calendar</h3>
            <table class="week-table">
                <thead>
                    <tr>
                        <th>Week No.</th>
                        <th>Start</th>
                        <th>End</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td>1</td>
                        <td><input type="date" class="week-start"></td>
                        <td><input type="date" class="week-end"></td>
                    </tr>
                    <!-- Additional rows can be added dynamically -->
                </tbody>
            </table>
            <button class="add-week-btn">Add Week</button>
        </div>
        <div class="tab-content" id="${periodId}-courses">
            <h3>Courses</h3>
            <table class="courses-table">
                <thead>
                    <tr>
                        <th>Course Code</th>
                        <th>Course Title</th>
                        <th>Course Section</th>
                        <th>Professor</th>
                        <th>Units</th>
                        <th>Grade</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td><input type="text" class="course-code" placeholder="Course Code"></td>
                        <td class="course-title"></td>
                        <td><input type="text" placeholder="Course Section"></td>
                        <td><input type="text" placeholder="Professor"></td>
                        <td class="units"></td>
                        <td><input type="number" step="0.01" placeholder="Grade"></td>
                    </tr>
                    <!-- Additional rows can be added dynamically -->
                </tbody>
            </table>
            <button class="add-course-btn">Add Course</button>
        </div>
    `;
    container.appendChild(newPeriod);

    // Add event listeners to the new tabs
    newPeriod.querySelectorAll('.tab-link').forEach(link => {
        link.addEventListener('click', function(event) {
            event.preventDefault();
            const tabId = this.getAttribute('data-tab');
            showTab(tabId, newPeriod);
        });
    });

    // Show the first tab by default
    showTab(`${periodId}-calendar`, newPeriod);

    // Add event listener to delete button
    newPeriod.querySelector('.delete-period-btn').addEventListener('click', function() {
        container.removeChild(newPeriod);
        updatePeriodNumbers();
        updateAcademicPeriodTabs();
    });

    // Add event listener to add week button
    newPeriod.querySelector('.add-week-btn').addEventListener('click', function() {
        const weekTableBody = newPeriod.querySelector('.week-table tbody');
        const newRow = document.createElement('tr');
        const weekCount = weekTableBody.rows.length + 1;
        newRow.innerHTML = `
            <td>${weekCount}</td>
            <td><input type="date" class="week-start"></td>
            <td><input type="date" class="week-end"></td>
        `;
        weekTableBody.appendChild(newRow);
    });

    // Add event listener to add course button
    newPeriod.querySelector('.add-course-btn').addEventListener('click', function() {
        const coursesTableBody = newPeriod.querySelector('.courses-table tbody');
        const newRow = document.createElement('tr');
        newRow.innerHTML = `
            <td><input type="text" class="course-code" placeholder="Course Code"></td>
            <td class="course-title"></td>
            <td><input type="text" placeholder="Course Section"></td>
            <td><input type="text" placeholder="Professor"></td>
            <td class="units"></td>
            <td><input type="number" step="0.01" placeholder="Grade"></td>
        `;
        coursesTableBody.appendChild(newRow);

        // Add event listener to populate course title and units based on course code
        newRow.querySelector('.course-code').addEventListener('input', function() {
            const courseCode = this.value.trim();
            const courseTitleCell = newRow.querySelector('.course-title');
            const unitsCell = newRow.querySelector('.units');
            const courseInfo = getCourseInfo(courseCode);
            courseTitleCell.textContent = courseInfo.title || '';
            unitsCell.textContent = courseInfo.units || '';
        });
    });

    // Add event listener to populate course title and units based on course code for the initial row
    newPeriod.querySelector('.course-code').addEventListener('input', function() {
        const courseCode = this.value.trim();
        const courseTitleCell = newPeriod.querySelector('.course-title');
        const unitsCell = newPeriod.querySelector('.units');
        const courseInfo = getCourseInfo(courseCode);
        courseTitleCell.textContent = courseInfo.title || '';
        unitsCell.textContent = courseInfo.units || '';
    });

    updateAcademicPeriodTabs();
});

function getCourseInfo(courseCode) {
    const courseTables = document.querySelectorAll('#program-flowchart .course-table');
    for (const table of courseTables) {
        const rows = table.querySelectorAll('tbody tr');
        for (const row of rows) {
            const codeCell = row.querySelector('.course-code input');
            if (codeCell && codeCell.value.trim() === courseCode) {
                const titleCell = row.querySelector('.course-title input');
                const unitsCell = row.querySelector('.units input');
                return {
                    title: titleCell ? titleCell.value.trim() : '',
                    units: unitsCell ? unitsCell.value.trim() : ''
                };
            }
        }
    }
    return {};
}

function showTab(tabId, periodElement) {
    periodElement.querySelectorAll('.tab-content').forEach(content => {
        content.style.display = content.id === tabId ? 'block' : 'none';
    });
    periodElement.querySelectorAll('.tab-link').forEach(link => {
        link.classList.toggle('active', link.getAttribute('data-tab') === tabId);
    });
}

function updatePeriodNumbers() {
    const periods = document.querySelectorAll('.academic-period');
    periods.forEach((period, index) => {
        period.querySelector('h3').textContent = `Academic Period ${index + 1}`;
    });
}

function updateAcademicPeriodTabs() {
    const tabList = document.getElementById('academic-period-tab-list');
    tabList.innerHTML = '';
    const periods = document.querySelectorAll('.academic-period');
    periods.forEach((period, index) => {
        const tab = document.createElement('li');
        tab.innerHTML = `<a href="#" class="academic-period-tab" data-period-index="${index + 1}">Period ${index + 1}</a>`;
        tabList.appendChild(tab);
    });

    // Add event listeners to the new tabs
    document.querySelectorAll('.academic-period-tab').forEach(tab => {
        tab.addEventListener('click', function(event) {
            event.preventDefault();
            const periodIndex = this.getAttribute('data-period-index');
            showAcademicPeriod(periodIndex);
        });
    });

    // Show the first period by default
    if (periods.length > 0) {
        showAcademicPeriod(1);
    }
}

function showAcademicPeriod(index) {
    document.querySelectorAll('.academic-period').forEach((period, i) => {
        period.style.display = (i + 1) == index ? 'block' : 'none';
    });
    document.querySelectorAll('.academic-period-tab').forEach(tab => {
        tab.classList.toggle('active', tab.getAttribute('data-period-index') == index);
    });
}

// ...existing code...

document.querySelector('.add-course-btn').addEventListener('click', function() {
    const coursesTableBody = document.querySelector('#course-tables-container tbody');
    const newRow = document.createElement('tr');
    newRow.innerHTML = `
        <td><input type="text" class="term-taken" placeholder="Term Taken"></td>
        <td><input type="text" class="course-code" placeholder="Course Code"></td>
        <td><input type="text" class="course-title" placeholder="Course Title"></td>
        <td><input type="text" class="course-section" placeholder="Course Section"></td>
        <td><input type="text" class="professor" placeholder="Professor"></td>
        <td><input type="number" class="units" step="0.01" placeholder="Units"></td>
        <td><input type="number" class="grade" step="0.01" placeholder="Grade"></td>
    `;
    coursesTableBody.appendChild(newRow);
});

// ...existing code...

document.getElementById('add-all-courses-btn').addEventListener('click', function() {
    const coursesTableBody = document.querySelector('#course-tables-container tbody');
    const newRow = document.createElement('tr');
    newRow.innerHTML = `
        <td><input type="text" class="term-taken" placeholder="Term Taken"></td>
        <td><input type="text" class="flowchart" placeholder="Flowchart"></td>
        <td><input type="text" class="course-code" placeholder="Course Code"></td>
        <td><input type="text" class="course-title" placeholder="Course Title"></td>
        <td><input type="number" class="units" step="0.01" placeholder="Units"></td>
    `;
    coursesTableBody.appendChild(newRow);
});

// ...existing code...

document.getElementById('add-all-courses-btn').addEventListener('click', function() {
    const coursesTableBody = document.querySelector('#course-tables-container tbody');
    const newRow = document.createElement('tr');
    newRow.innerHTML = `
        <td><input type="text" class="term-taken" placeholder="Term Taken"></td>
        <td><input type="text" class="flowchart" placeholder="Flowchart"></td>
        <td><input type="text" class="course-code" placeholder="Course Code"></td>
        <td><input type="text" class="course-title" placeholder="Course Title"></td>
        <td><input type="number" class="units" step="0.01" placeholder="Units"></td>
    `;
    coursesTableBody.appendChild(newRow);
});

// ...existing code...

document.getElementById('add-all-courses-btn').addEventListener('click', function() {
    const coursesTableBody = document.querySelector('#course-tables-container tbody');
    const newRow = document.createElement('tr');
    const previousCourses = Array.from(coursesTableBody.querySelectorAll('tr')).map(row => 
        row.querySelector('.course-code input')?.value || row.querySelector('.course-code')?.textContent.trim());

    newRow.innerHTML = `
        <td class="editable-cell term-taken"><span></span><input type="text" placeholder="Term Taken"></td>
        <td class="editable-cell flowchart"><span></span><input type="text" placeholder="Flowchart"></td>
        <td class="editable-cell course-code"><span></span><input type="text" placeholder="Course Code"></td>
        <td class="editable-cell course-title"><span></span><input type="text" placeholder="Course Title"></td>
        <td class="editable-cell units"><span></span><input type="number" step="0.01" placeholder="Units"></td>
        <td>
            <select class="pre-requisite-type">
                <option value="S">S</option>
                <option value="H">H</option>
                <option value="C">C</option>
            </select>
        </td>
        <td>
            <select class="pre-requisites">
                <option value="">None</option>
                ${previousCourses.map(course => course ? `<option value="${course}">${course}</option>` : '').join('')}
            </select>
        </td>
    `;
    coursesTableBody.appendChild(newRow);
    addEditableCellListeners(newRow);
});

function addEditableCellListeners(row) {
    row.querySelectorAll('.editable-cell').forEach(cell => {
        const span = cell.querySelector('span');
        const input = cell.querySelector('input');

        // Initially hide input
        input.style.display = 'none';

        // Show input on cell click
        cell.addEventListener('click', () => {
            span.style.display = 'none';
            input.style.display = '';
            input.focus();
        });

        // Update span and hide input on blur
        input.addEventListener('blur', () => {
            span.textContent = input.value;
            span.style.display = '';
            input.style.display = 'none';
        });

        // Update on enter key
        input.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                input.blur();
            }
        });
    });
}

// Add listeners to existing rows
document.querySelectorAll('#course-tables-container tbody tr').forEach(row => {
    addEditableCellListeners(row);
});

// Ensure the pre-requisites dropdown is updated when a new course is added
document.querySelector('#course-tables-container tbody').addEventListener('DOMNodeInserted', function(event) {
    const rows = Array.from(document.querySelectorAll('#course-tables-container tbody tr'));
    rows.forEach((row, index) => {
        const preReqSelect = row.querySelector('.pre-requisites');
        const previousCourses = rows.slice(0, index).map(r => r.querySelector('.course-code input')?.value || r.querySelector('.course-code')?.textContent.trim());
        preReqSelect.innerHTML = `
            <option value="">None</option>
            ${previousCourses.map(course => `<option value="${course}">${course}</option>`).join('')}
        `;
    });
});

// ...existing code...
