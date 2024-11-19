# Getting Started with Create React App

A simple web app that generates a list of user data (including names, email addresses, and phone numbers) based on a selected country and number of records. The app leverages the faker-js library to create random data and libphonenumber-js to generate valid phone numbers for different countries.

### Features
* Country Selection: Choose from a list of countries, which will affect the generated phone numbers (with the correct international format).
* Data Generation: Generate a customizable number of records (from 1 to 1000).
* Phone Number Validation: The app generates valid phone numbers using the libphonenumber-js library, ensuring they are correctly formatted for the selected country.
* Export Data: You can download the generated data in JSON format for further use.
* Responsive: The app is fully responsive and works on both desktop and mobile devices.

### Technologies Used
* React: Frontend framework for building the user interface.
* Faker.js: For generating random names, emails, and other data.
* libphonenumber-js: For phone number validation and formatting.
* Sass: For styling the app.
* Font Awesome: For icons in the dropdown and other UI elements.

### Setup & Installation
To run this app locally:

1. Clone the repository:
```markdown
git clone https://github.com/AymanAbusura/Database_Generator.git
```

2. Install dependencies:
Navigate to the project folder and run:
```markdown
npm install
```

3. Start the development server:
```markdown
npm start
```
The app will now be running on `http://localhost:3000`.

### Usage
1. Select a country: Use the dropdown to select the country you want to generate data for.
2. Enter the number of records: Specify how many records you'd like to generate (between 1 and 1000).
3. Generate Data: Click the "Generate" button to generate random user data.
4. Download Data: After generating the data, click the "Download JSON" button to download the data as a JSON file.

### Screenshots
Main UI:
<img width="692" alt="Main-UI" src="https://github.com/user-attachments/assets/83eadafd-1303-48dd-b16f-51a523c23134">

Generated Data Table:
<img width="1471" alt="table" src="https://github.com/user-attachments/assets/c6ccbeee-74f4-4c8f-af65-2a88d3057cce">

### Contributing
Feel free to open an issue or create a pull request if you have any suggestions or improvements for this project.

### License
This project is licensed under the MIT License - see the LICENSE file for details.