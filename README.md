# Child Development Tracker

## Overview
The Child Development Tracker is a web application designed to help parents and caregivers monitor and support the developmental milestones of children. This application provides an easy-to-use interface for tracking various aspects of child development.

## Project Structure
The project is designed to run as a set of containerized services orchestrated by Docker Compose. The main components, as defined and managed by `docker-compose.yml`, are:

- **Backend Application Service**:
  - **Description**: An Express.js application that serves as the API backend for the project.
  - **Source Code**: The implementation for this service is located in the `express.js/` directory.
    - **`express.js/src/app.js`**: The entry point of the Express application, setting up the server, middleware, and routes.
    - **`express.js/package.json`**: Configuration file for npm, listing dependencies and scripts for the Express application.
    - **`express.js/README.md`**: Documentation specific to the Express application, including setup instructions and usage details.
    - **`express.js/sequelize/`**: This sub-directory contains the Sequelize models and configurations for database interaction.
      - **`models/`**: Defines the database schemas.
      - **`config/config.json`**: Database connection configurations (primarily for Sequelize CLI and local development outside Docker).
      - **`migrations/`**: Database migration files.
      - **`seeders/`**: Database seed files.

- **Database Service**:
  - **Description**: A relational database (e.g., PostgreSQL, MySQL) that stores all application data. This service is managed by Docker Compose.
  - **Configuration**: Defined in `docker-compose.yml`, including the database image, environment variables, and data persistence volumes.

- **Orchestration File (`docker-compose.yml`)**:
  - **Role**: This YAML file is crucial as it defines all the services (Backend, Database), their configurations, networks, and volumes. It allows the entire multi-container application to be started and managed with a single command (`docker-compose up`).

## Setup Instructions
1. Clone the repository to your local machine.
2. Navigate to the `child_development_tracker` directory.
3. Ensure you have Docker and Docker Compose installed on your machine.
4. Create a `.env` file by copying the example file:
   ```bash
   cp .env.example .env
   ```
5. Open the `.env` file and update the placeholder values with your specific configuration, especially for the database credentials.
6. Run the following command to start the application:
   ```bash
   docker-compose up
   ```
7. Access the application in your web browser at `http://localhost:3000`.

## Usage
Once the application is running, you can use it to track and monitor the developmental milestones of children. Follow the instructions in the `express.js/README.md` for more details on how to interact with the API and utilize the features of the application.

## Contributing
Contributions are welcome! Please feel free to submit a pull request or open an issue for any enhancements or bug fixes.

## License
This project is licensed under the MIT License. See the LICENSE file for more details.