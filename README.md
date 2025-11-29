
# Survey Management System - Angular (Frontend)

This project is the **Frontend Application** for the Survey Management System, built using **Angular**. It provides an interactive dashboard, employee and survey management screens, onboarding email UI, reminder triggering, and secure admin authentication. The frontend is fully integrated with the Spring Boot backend and uses modern UI components with responsive design.

## Backend Repository:
The Backend of this project is built using Core Java, Spring Boot, MySQL.
Backend GitHub Repo: https://github.com/ashwinii19/survey-mng-be

## Features

- ✅ **Admin Login Page** with JWT token authentication
- ✅ **Dashboard Page** with filters for Survey and Department
- ✅ **Charts & Statistics** for filled and not-filled surveys
- ✅ **Employee Management**
  - Add employee manually
  - Batch upload (Excel/CSV)
  - Get single employee details
  - Edit/Update employee
- ✅ **Survey Management**
  - Create survey form
  - View survey form
  - Edit survey form
  - Delete survey
  - View survey responses
- ✅ **Onboarding Email Trigger UI**
- ✅ **Reminder Email Trigger UI**
- ✅ **Admin Profile Page**
- ✅ **Responsive Sidebar Toggle**
- ✅ **Header with Company Logo and Admin Name**
- ✅ **Toast Notifications and Error Handling**
- ✅ **Authentication Guard for Protected Routes**
- ✅ **Reusable Components & Modular Architecture**

## Components Overview

- **LoginComponent** – Admin login page
- **DashboardComponent** – Displays analytics, stats, charts
- **EmployeeListComponent** – List all employees
- **AddEmployeeComponent** – Add single employee
- **UploadEmployeesComponent** – Upload Excel/CSV
- **EditEmployeeComponent** – Edit employee details
- **SurveyListComponent** – View available surveys
- **AddSurveyComponent** – Create new survey
- **EditSurveyComponent** – Edit existing survey
- **SurveyDetailsComponent** – View form and its structure
- **SurveyResponsesComponent** – View responses of employees
- **OnboardingMailComponent** – Trigger onboarding email
- **ReminderMailComponent** – Trigger reminder email
- **AdminProfileComponent** – View admin profile
- **SidebarComponent** – Collapsible sidebar
- **HeaderComponent** – Displays branding and user menu

## Folder Structure

src/app/ contains all Angular modules:

- **auth/** – Login, guards, auth services  
- **dashboard/** – Dashboard components & services  
- **employees/** – Employee module (CRUD, upload, update)  
- **surveys/** – Survey module (CRUD, view responses)  
- **emails/** – Onboarding & reminder email UI  
- **shared/** – Shared components, interceptors, models  
- **core/** – Auth interceptor, JWT handling, guards  
- **layout/** – Sidebar, header, main layout  

## Key Integrations

- **JWT Token Handling** in HttpInterceptor  
- **Route Guards** (AuthGuard) to protect admin modules  
- **ngx-toastr** for notifications  
- **Bootstrap & Custom CSS** for UI styling  
- **Reactive Forms** for form validations  
- **Angular Material (optional)** for UI components  
- **Dynamic Charts** for dashboard analytics  

## API Communication

Frontend communicates with backend endpoints:

- `/api/auth/login`
- `/api/employees`
- `/api/surveys`
- `/api/dashboard/*`
- `/api/email/*`
- `/api/reminders/*`


This project was generated using [Angular CLI](https://github.com/angular/angular-cli) version 20.3.6.

## Development server

To start a local development server, run:

```bash
ng serve
```

Once the server is running, open your browser and navigate to `http://localhost:4200/`. The application will automatically reload whenever you modify any of the source files.

## Code scaffolding

Angular CLI includes powerful code scaffolding tools. To generate a new component, run:

```bash
ng generate component component-name
```

For a complete list of available schematics (such as `components`, `directives`, or `pipes`), run:

```bash
ng generate --help
```

## Building

To build the project run:

```bash
ng build
```

This will compile your project and store the build artifacts in the `dist/` directory. By default, the production build optimizes your application for performance and speed.

## Running unit tests

To execute unit tests with the [Karma](https://karma-runner.github.io) test runner, use the following command:

```bash
ng test
```

## Running end-to-end tests

For end-to-end (e2e) testing, run:

```bash
ng e2e
```

Angular CLI does not come with an end-to-end testing framework by default. You can choose one that suits your needs.

## Additional Resources

For more information on using the Angular CLI, including detailed command references, visit the [Angular CLI Overview and Command Reference](https://angular.dev/tools/cli) page.
