# inspek-reporting-app
Streamlining Commercial Building Inspections

## Overview
This repo is to showcase my senior project for computer science at PSU. For this project, the problem I was tasked to solve was to help improve a commercial inspection company's processes, ranging from automating tasks, writing scripts, and deploying this web app.

## Features

- **User-Friendly Interface:** Intuitive UI for easy navigation and report generation.
- **Database Integration:** Seamless connection to a database for storing inspection data and generating reports.
- **Automated Reporting:** Generate reports automatically based on user input and predefined templates.
- **Photo Uploads:** Easily upload and associate images with inspection reports for better documentation.
- **Deployment via SSH:** Simple deployment process using SSH for remote servers.

## Technologies Used

- **Node.js:** For backend server functionality.
- **React:** For building the front-end user interface.
- **PostgreSQL/MySQL:** For database management (or specify the database you're using).
- **PM2:** Process manager for Node.js applications.
- **GitHub Actions:** For continuous integration and deployment.

## Installation

1. Clone the repository:
```
    git clone git@github.com:your-github-username/inspek-reporting-app.git
    cd inspek-reporting-app
```

2. Install dependencies:
```
    Copy code
    npm install
```

3. Start the application:
```
    Copy code
    npm start
```

You should now be able to access the application through your web browser at http://localhost:3000.

## Deployment

To deploy the application to a server (e.g., DigitalOcean), follow these steps:

1. Set Up Your Server:
    Ensure you have Node.js installed on your server.
    Clone the repository to your server:
```
    git clone https://github.com/your-username/inspek-reporting-app.git
```

2. Configure SSH Access:
Ensure your SSH key is added to the server and included in the ~/.ssh/authorized_keys file for the appropriate user.

3. Start the Application:
```
    cd inspek-reporting-app
    npm install
    npm start
```

4. Use PM2 for Process Management (optional):
    Install PM2:
```
npm install -g pm2
```

Start your app with PM2:
```
pm2 start app.js --name "inspek-reporting-app"
```