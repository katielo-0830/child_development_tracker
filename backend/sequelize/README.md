# Sequelize Models and Database Schema

This directory contains the Sequelize models, migrations, seeders, and configuration for the application's database.

## Models and Tables

The following tables are defined by the Sequelize models and created/managed by migrations:

### 1. `Therapists`

Stores information about therapists.

| Column      | Data Type     | Constraints                        | Description                     |
| :---------- | :------------ | :--------------------------------- | :------------------------------ |
| `id`        | INTEGER       | Primary Key, Auto Increment, Not Null | Unique identifier for the therapist |
| `name`      | STRING        |                                    | Name of the therapist           |
| `createdAt` | DATE          | Not Null                           | Timestamp of record creation    |
| `updatedAt` | DATE          | Not Null                           | Timestamp of last record update |

**Model File:** `models/therapist.js`
**Migration File:** `migrations/YYYYMMDDHHMMSS-create-therapist.js`

### 2. `Sessions`

Stores information about therapy sessions.

| Column      | Data Type     | Constraints                        | Description                    |
| :---------- | :------------ | :--------------------------------- | :----------------------------- |
| `id`        | INTEGER       | Primary Key, Auto Increment, Not Null | Unique identifier for the session |
| `date`      | DATEONLY      | Not Null                           | Date of the session            |
| `startTime` | TIME          | Not Null                           | Start time of the session      |
| `endTime`   | TIME          | Not Null                           | End time of the session        |
| `notes`     | STRING        |                                    | Additional notes for the session |
| `createdAt` | DATE          | Not Null                           | Timestamp of record creation   |
| `updatedAt` | DATE          | Not Null                           | Timestamp of last record update|

**Model File:** `models/session.js`
**Migration File:** `migrations/YYYYMMDDHHMMSS-create-session.js`

### 3. `SessionTherapists` (Join Table)

A join table to manage the many-to-many relationship between `Sessions` and `Therapists`.

| Column       | Data Type     | Constraints                        | Description                                     |
| :----------- | :------------ | :--------------------------------- | :---------------------------------------------- |
| `id`         | INTEGER       | Primary Key, Auto Increment, Not Null | Unique identifier for the association record    |
| `sessionId`  | INTEGER       | Foreign Key (Sessions.id), Not Null | ID of the associated session                    |
| `therapistId`| INTEGER       | Foreign Key (Therapists.id), Not Null| ID of the associated therapist                  |
| `createdAt`  | DATE          | Not Null                           | Timestamp of record creation                    |
| `updatedAt`  | DATE          | Not Null                           | Timestamp of last record update                 |
|              |               | Unique (`sessionId`, `therapistId`) | Ensures a therapist is not duplicated per session |

**Model File:** `models/sessiontherapist.js`
**Migration File:** `migrations/YYYYMMDDHHMMSS-create-session-therapist.js`

## Relationships

-   **`Therapists` and `Sessions` (Many-to-Many)**:
    -   A single `Therapist` can be associated with multiple `Sessions`.
    -   A single `Session` can involve multiple `Therapists`.
    -   This relationship is implemented using the `SessionTherapists` join table.
        -   `Therapist.belongsToMany(models.Session, { through: 'SessionTherapists', foreignKey: 'therapistId', otherKey: 'sessionId' })`
        -   `Session.belongsToMany(models.Therapist, { through: 'SessionTherapists', foreignKey: 'sessionId', otherKey: 'therapistId' })`

-   **`SessionTherapists` to `Sessions` and `Therapists` (Belongs-To)**:
    -   The `SessionTherapist` model (representing the join table) has direct `belongsTo` associations with both `Session` and `Therapist`.
        -   `SessionTherapist.belongsTo(models.Session, { foreignKey: 'sessionId' })`
        -   `SessionTherapist.belongsTo(models.Therapist, { foreignKey: 'therapistId' })`

## Migrations and Seeding

-   **Migrations**: Located in the `migrations/` directory. They are used to manage database schema changes incrementally. Run migrations using `npx sequelize-cli db:migrate`.
-   **Seeders**: Located in the `seeders/` directory. They are used to populate the database with initial or test data. Run seeders using `npx sequelize-cli db:seed:all` (or specific seeders).
-   **Configuration**: Database connection details are managed in `config/config.js` (or `config/config.json`), which reads from environment variables for different environments (development, test, production).

---

*Note: Replace `YYYYMMDDHHMMSS` in migration file names with the actual timestamps from your generated migration files.*