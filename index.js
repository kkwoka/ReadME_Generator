const fs = require('fs');
const util = require("util");
const inquirer = require('inquirer');
const axios = require('axios');

const writeFileSync = util.promisify(fs.writeFile);
const questions = [
  {
    type: 'input',
    name: 'userName',
    message: 'What is your GitHub username?'
  },
  {
    type: 'input',
    name: 'projectName',
    message: 'What is your project\'s name?'
  },
  {
    type: 'input',
    name: 'description',
    message: 'Please write a short description of your project:'
  },
  {
    type: 'list',
    name: 'license',
    message: 'What kind of license should your project have?',
    choices: ['Mozilla', 'Apache', 'IBM', 'MIT']
  },
  {
    type: 'input',
    name: 'dependencies',
    message: 'What command should be run to install dependencies?',
    default: 'npm i'
  },
  {
    type: 'input',
    name: 'tests',
    message: 'What command should be run to run tests?',
    default: 'npm test'
  },
  {
    type: 'input',
    name: 'userKnowledge',
    message: 'What does the user need to know about using the repo?'
  },
  {
    type: 'input',
    name: 'contributing',
    message: 'What does the user need to know about contributing to the repo?'
  }
];


function userPrompt() {
  return inquirer.prompt(questions).then(function(answers) {

  if (answers.license === 'Mozilla') {
    answersURL = 'https://img.shields.io/badge/License-MPL%202.0-brightgreen.svg'
  };
  if (answers.license === 'Apache') {
    answersURL = 'https://img.shields.io/badge/License-Apache%202.0-blue.svg'
  };
  if (answers.license === 'IBM') {
    answersURL = 'https://img.shields.io/badge/License-IPL%201.0-blue.svg'
  };
  if (answers.license === 'MIT') {
    answersURL = 'https://img.shields.io/badge/License-MIT-yellow.svg'
  };

  axios.get(`https://api.github.com/users/${answers.userName}`)
    .then((getResponse) => {
      response = getResponse.data;
      readme = generateReadme(response, answers, answersURL);
      return writeFileSync("finalReadme.md", readme);
    });
    
  }).catch(function(err) {
    console.log(err);
  });
};

function generateReadme(response, answers, answersURL) {
  return `
  # ${answers.projectName}
  [![License](${answersURL})](${response.html_url}/${answers.projectName})
  ​
  ## Description
  ​
  ${answers.description}
  ​
  ## Table of Contents 
  * [Installation](#installation)
  ​
  * [Usage](#usage)
  ​
  * [License](#license)
  ​
  * [Contributing](#contributing)
  ​
  * [Tests](#tests)
  ​
  * [Questions](#questions)
  ​
  ## Installation
  ​
  To install necessary dependencies, run the following command:
  \`\`\`
  ${answers.dependencies}
  \`\`\`
  ## Usage
  ​
  ${answers.userKnowledge}
  ​
  ## License
  ​
  This project is licensed under the ${answers.license} license.
    
  ## Contributing
  ​
  ${answers.contributing}
  ​
  ## Tests
  ​
  To run tests, run the following command:
  \`\`\`
  ${answers.tests}
  \`\`\`
 
  ## Questions
  ​
  <img src="${response.avatar_url}" alt="avatar" style="border-radius: 16px" width="30" />
  ​
  If you have any questions about the repo, contact [${response.login}](${response.html_url}).`;
};

userPrompt();