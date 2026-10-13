
1. Title
Home Appliance Maintenance Management Platform

2. Domain
Home Appliance Maintenance and Service Management

3. Who is the User?
1. Customer
- Registers and logs into the platform.
- Adds home appliances and their details.
- Creates maintenance/service requests.
- Tracks service status and views service history.
2. Technician
- Views assigned service requests.
- Checks appliance/service details.
- Updates repair or maintenance status.
- Adds service remarks and completion details.
- 
3. Admin
- Manages customers, technicians, appliances, and service requests.
- Assigns technicians to service requests.
- Monitors service progress and manages the overall platform.

4. What Problem Are We Solving?
Managing home appliance maintenance is often done through phone calls, WhatsApp messages, or paper records, making it difficult to track service requests and maintenance history. For example, if a customer's washing machine stops working, they may contact a service provider and have difficulty knowing when a technician will visit or what the current repair status is. Service providers may also struggle to organize customer information, technician assignments, and previous service records. This project aims to provide a centralized platform to make appliance maintenance and service management easier, organized, and trackable.

5. Proposed Solution
The Home Appliance Maintenance Management Platform will provide the following features:
Customer Features

- User registration and login
- Customer profile management
- Add and manage home appliances
- Submit maintenance/service requests
- Select appliance and describe the problem
- View request status
- View assigned technician details
- View service history

Technician Features

- Technician login
- View assigned service requests
- View customer and appliance information
- Update service status
- Add diagnosis/service remarks
- Mark service as completed

Admin Features

- Admin login
- Manage customers
- Manage technicians
- Manage appliance categories
- View and manage appliances
- View service requests
- Assign technicians
- Update/manage service status
- Monitor completed and pending services
- View service history

6. Core Entities / Database Tables
The application will use the following main database tables:
1. Users
   - user_id
   - name
   - email
   - password
   - role

2. Customers
   - customer_id
   - user_id
   - phone
   - address

3. Technicians
   - technician_id
   - name
   - phone
   - specialization

4. Appliances
   - appliance_id
   - customer_id
   - appliance_type
   - brand
   - model
   - purchase_date

5. Service_Requests
   - request_id
   - appliance_id
   - customer_id
   - problem_description
   - request_date
   - status
     
6. Technician_Assignments
   - assignment_id
   - request_id
   - technician_id
   - assigned_date

7. Service_History
   - history_id
   - request_id
   - technician_id
   - service_date
   - service_details
   - remarks

8. Appliance_Categories
   - category_id
   - category_name
   - description

7. User Roles & Permissions
Role| Permissions
Admin| Manage users, technicians, appliance categories, service requests, assignments, and service records
Customer| Register/login, manage appliances, create service requests, track status, and view service history
Technician| View assigned requests, access appliance details, update service status, and add service remarks

8. Success Criteria
The application will be considered successful if:
- A customer can register and log in successfully.
- A customer can add an appliance in under 1 minute.
- A customer can submit a service request in under 2 minutes.
- Customers can clearly view the current status of their service request.
- Admin can assign a technician to a request easily.
- Technicians can update service status and service details.
- Customers can view their previous maintenance/service history.
- All important customer, appliance, technician, and service information is stored securely in the database.
- The system reduces the need for manual service-request tracking.

9. Out of Scope
The following features will not be included in the initial version:
- Online payment gateway
- Real-time GPS technician tracking
- AI-based appliance fault diagnosis
- IoT/smart appliance integration
- Automatic spare-parts purchasing
- Video/audio calling
- E-commerce functionality for selling appliances
- Integration with external service companies
- Mobile application; the initial project will be a web application
  
These features can be considered as future enhancements if required.

10. Chosen Track
Java – Spring Boot
Proposed Technology Stack
- Frontend: HTML, CSS, JavaScript
- Backend: Java + Spring Boot
- Database: MySQL
- API: REST API
- ORM: Spring Data JPA / Hibernate
- Build Tool: Maven
- Version Control: Git + GitHub
- Development Environment: VS Code / IntelliJ IDEA
