# inspek-reporting-app
Streamlining Commercial Building Inspections

## Overview
This repo is to showcase my senior project for computer science at PSU. For this project, the problem I was tasked to solve was to help improve a commercial inspection company's processes, ranging from automating tasks, writing scripts, and deploying this web app.

## Features

- **User-Friendly Interface:** Intuitive UI for easy navigation and report generation.
- **Database Integration:** Seamless connection to a database for storing inspection data and generating reports. Also leverages MongoDB for efficient storage/retrieval of inspection data.
- **Automated Reporting:** Generate reports automatically based on user input and predefined templates.
- **Dynamic Proposal generation:** Automatically create detailed reports based off selected user data. 
- **Deployment via SSH:** Simple deployment process using SSH for remote servers.

## Technologies Used

- **Node.js:** For backend server functionality.
- **React:** For building the front-end user interface. (with hooks)
- **MongoDB:** For database management (scalable & flexible). It may be useful for you to use MongoDB Compass, their GUI.
- **PM2:** Process manager for Node.js applications. This must be installed on the server.
- **GitHub Actions:** For continuous integration and deployment.See the ci-cd.yml file for more.
- **Nginx:** For reverse proxy to handle incoming traffic.
- **Custom domain:** This appp is hosted on a custom domain purchased from NameCheap, but you can use whatever service you would like. 
- **SSL Certificate:** Make sure you get a valid SSL cert issued to have a secure connection on the domain.


## For debugging

- **Use VSCode's console log,** or your favorite IDE's console log
- **Use Postman** for API routes + endpoints
- **Inspect element** for CSS elements or other helpful data
- **If hosting a remote server,** make sure to check nginx error + access logs

## Getting Started

- **Prerequisites:**
- **Node.js (v16+)**
- **npm or yarn package**
- **mongoDB and connection string**
- **familiarity with API endpoints/requests**

## Installation

1. Clone the repository:
```
    git clone git@github.com:your-github-username/inspek-reporting-app.git
    cd inspek-reporting-app
```

2. Install dependencies:
```
    npm install
```

3. Start the application:
```
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

5. You will need different development variables and production variables if you would like to keep certain info safe. Store sensitive variables inside the .env file, like this:
```
NODE_ENV=development
MONGO_URI=mongodb+srv://your-mongo-uri/aka/connection-string
PORT=3001
```

6. Start the development server:
```npm start```

## Set up Python Environment

You will also need to create a virtual environment for the python scripts so they do not interfere with global packages. Before getting started, this is how you do that:
```
cd server  # Navigate to the folder containing Python scripts
python3 -m venv venv  # Create a virtual environment
source venv/bin/activate  # Activate the virtual environment
pip install -r requirements.txt  # Install Python dependencies

```

## Deploying (on DigitalOcean)

This tutorial is made with the assumption that you server is mostly already pre-configured, or you configured it yourself.

In the event it isn't, you will need things like nginx, mongoDB, and more set up for your sever configuration to serve the pages and retrieve the data.

1. Prepare the server. Install necessary dependencies.
```
git clone git@github.com:your-github-username/inspek-reporting-app.git
cd inspek-reporting-app
npm install
```

2. Set up the .env variables like in the previous section. Make sure they are SPECIFIC to the server. .env is always in the .gitignore!

3. Start the application
```
npm start
```

4. Use PM2 for process management:
First, install it:
```
npm install -g pm2
```
Then, start the app with PM2.
```
pm2 start app.js --name "inspek-reporting-app"
```
Save the process list to ensure it restarts after a server reboot.
```
pm2 save
pm2 startup
```

## Folder Structure
This is a quick overview of how I set up my folder structure, but feel free to do what feels right for you.

Frontend:

```
src/ contains React components like Login.js, ViewClientProfile.js, and others.
```
```
public/ includes static assets like index.html and CSS files.
```
Backend:

```
app.js handles Express server routing and API endpoints.
routes/ stores API route definitions.
models/ contains Mongoose schema definitions for MongoDB.
```