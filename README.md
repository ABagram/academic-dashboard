### [Academic Dashboard 2.0 (Jan 18, 2023)](https://docs.google.com/spreadsheets/d/1SxjXTeSXzOYb1t91mA8AsTBOW4BXsIfOarhyKMMw7wM/edit?usp=drivesdk) by @ABagram
- A combination of Google Sheets and Google Apps Script, with the latter being previously developed with the help of ChatGPT, multiple test cases and issue reporting through direct human intervention.
- This file shows the functionalities that are to be implemented in the website. Ideally, the website is a more dynamic, responsive, and advanced version of this.
- [Academic Dashboard 1.0](https://docs.google.com/spreadsheets/d/1Pbw0RsVnruKKMqW18h_ivpUrV4u9TOhC9CXc5rQQPr8/edit?usp=sharing)

### About
- This is a project that attempts to limit test the capabilities of AI in web development as well as understanding human language (English). That said, the website is being developed primarily by AI (Copilot) while the design, features, and functionality are being customized by @ABagram. In later backend developments, the creator may need to intervene to improve the site's reliability.

## Planned Features (Initial Website Structure)

### Home
This tab allows users to view the current academic period's calendar (week no.) and class schedule (with indicators that update according to the current time), and requirements.

### Program Overview 
This tab is distinct from the Program Flowchart, wherein the flowchart is based on the curriculum provided by the school while the program overview shows the summary of all courses that the student **has taken**.

Users type the course code taken for each term then the backend will look for the corresponding Course Title and Units.

Users can indicate their course section, professors, and grades.

The academic calendar for each academic period will also be placed here.

### Program Flowchart
The Program Flowchart allows users to list all courses that they have to take according to the curriculum given.

It makes use of the contents in the Program Overview to be able to calculate what academic period was a course taken. (Later developments will account for subjects that were taken twice (such as due to failure).) 

Users can choose to specify the pre-requisites for each course, and classify them either as a hard requisite (has to be taken prior and passed), soft requisite (has to be taken prior but not necessarily passed), or co-requisite (to be taken together with another course).