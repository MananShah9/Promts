const { Pool } = require('pg');

const pool = new Pool({
  user: 'AutoQlik',
  host: 'localhost',
  database: 'CXODashboard_db_dev',
  password: 'AutoClick',
  port: 4432,
});

async function updateJsonbColumn(tableName, columnName, key, newValue, condition) {
  const client = await pool.connect();
  try {
    const query = `
      UPDATE ${tableName}
      SET ${columnName} = jsonb_set(${columnName}, '{${key}}', $1::jsonb)
      WHERE ${condition};
    `;
    const values = [JSON.stringify(newValue)];
    const res = await client.query(query, values);
    console.log('Update successful:', res.rowCount, 'row(s) affected.');
  } catch (err) {
    console.error('Error updating JSONB column:', err);
  } finally {
    client.release();
  }
}

const tableName = 'your_table';
const columnName = 'your_jsonb_column';
const key = 'your_key';
const newValue = { key1: 'value1', key2: 'value2' };
const condition = "id = 1";

updateJsonbColumn(tableName, columnName, key, newValue, condition);

Certainly! Let's add a "Value Created" section to each point for clarity and emphasis on the benefits provided.

---

1. **Achievement**: We are the first team in the bank to onboard to CaaS and we helped them in the pilot phase for this feature.
   - **Value Created**: Demonstrated leadership and innovation by pioneering the use of CaaS, setting a benchmark for other teams, and accelerating the adoption of modern infrastructure solutions within the bank.

2. **Resiliency**:
   - **a. High resiliency** – Daily roleswap of server and DB.
     - **Value Created**: Ensures zero downtime deployments, minimizing service interruptions and enhancing the overall reliability of the system.
   - **b. Env isolation between apps** – Maturing our service. No change in one env affects other.
     - **Value Created**: Enhances security and stability by preventing cross-environment issues, leading to more predictable and manageable deployments.
   - **c. Auto monitoring and alerting**
     - **Value Created**: Enables proactive issue detection and resolution, reducing the time to identify and fix problems, thus improving system uptime and performance.

3. **Reduced Toil**:
   - **a. Out of the box CI/CD with minimal config and bot integration**
     - **Value Created**: Streamlines the development pipeline, reducing manual intervention and accelerating the release process, leading to faster delivery of features and fixes.
   - **b. Managed envs** – OS, DB, language version patches and updates.
     - **Value Created**: Reduces the operational burden on the team, ensuring that environments are always up-to-date with the latest security patches and improvements without manual effort.
   - **c. Easy config management using repos. Example: pgmaker config and app instances config.**
     - **Value Created**: Simplifies configuration management, promoting consistency and reducing configuration errors, thus enhancing deployment reliability and speed.
   - **d. Easy Secrets management, email service, restabuild etc.**
     - **Value Created**: Ensures secure handling of sensitive information and simplifies service integration, reducing the risk of security breaches and streamlining operational processes.

**High scalability and low costs** – Autoscaling. No provisioning needed + we pay for what we use.
   - **Value Created**: Optimizes resource usage and cost efficiency, allowing the system to scale dynamically based on demand while controlling expenses.

**Out of the box SSO capabilities, with minimal config.**
   - **Value Created**: Enhances user experience and security by providing seamless and secure access to services through single sign-on, reducing the need for multiple logins.

**Helped metrics like Reduced TPAM, Increased RF, Improved resiliency**
   - **Value Created**: Tangible improvements in key performance metrics such as TPAM (Total Preventable Adverse Metrics), Release Frequency (RF), and overall system resiliency, contributing to better service delivery and customer satisfaction.

---

Feel free to add any more specific values or details that reflect the achievements and benefits accurately.





# FLOW
The local farm is a startup. 2 vendors drive trucks to societies every day from 9.30am to 2.30 pm and serve as mini supermarkets. All members of society can buy fruits vegetables and other daily items from this market. The journey is as follows
1. Admin adds societies, and products and assigns vendors to one or more society.
2. Vendor goes to the societies with products
3. Customer selects products.
4. The vendor starts a session on his app. 
5. The vendor puts the products one by one on a smart weighing scale and selects the products by clicking a button on the scale. After adding each product, the vendor scans a QR code on his app to get the price based on product and weight. There should be an option to add the product to the session. There should also be an option to remove the product from a session.
6. The vendor chooses the customer from a list of members in society.
7. The vendor saves the session and then the vendor can mark payment as done or pending.
8. If the payment is pending the amount should get added to the Customer's pending amount with all the related details with date and time.
9. The vendor should have the option to mark the payment as complete for previously pending payments.
10. Customer should be able to see all products in app with the price per kg, description and photos.
11. Customers should be able to add rating and review to the app which other users can see.
12. Customers should be able to see the previous orders with necessary details.
13. Customers should be able to whitelist products.
The app does not have a buy now feature but a request for availability tomorrow feature.
14. Admin should be able to see the raw data in a tabular format as well as interesting analytics on a summarized or per customer/society/vendor basis. 

The authentication should be possible using google sign in , apple sign in, phone number.
There is no payment gateway involved.





# Roles 
Admin Role:
Society and Product Management: Ability to add and manage societies and products in the system.
Vendor Assignment: Assign vendors to one or more societies.
Data Analysis: View raw data in a tabular format and access analytics based on customer, society, or vendor.
Vendor Role:
Product Delivery: Visit societies with a range of products.
Session Management: Start sessions for sales in the app.
Smart Weighing and Pricing: Use a smart scale for weighing products and a system to calculate prices based on weight. This includes scanning a QR code to fetch prices and options to add or remove products from the session.
Customer Selection: Choose customers from a society member list.
Session Finalization: Save session details and mark payments as done or pending.
Payment Management: Option to update the status of pending payments.
Customer Role:
Product Browsing: View products with prices, descriptions, and photos in the app.
Feedback System: Add ratings and reviews visible to other users.
Order History: Access previous orders with detailed information.
Product Whitelisting: Option to whitelist favorite products.
Availability Requests: Request product availability for the next day, without an immediate buy-now feature.
Pending Payments: View and track pending payments with date and time details.
General Features:
Authentication: Support for Google Sign-In, Apple Sign-In, and phone number authentication.
No Payment Gateway: Transactions are handled externally, not through the app.


# DB table
Users Table
CREATE TABLE Users (
    UserID SERIAL PRIMARY KEY,
    Name VARCHAR(255),
    Role VARCHAR(50),
    Email VARCHAR(255) UNIQUE,
    Phone VARCHAR(20) UNIQUE,
    PasswordHash VARCHAR(255),
    GoogleAuthID VARCHAR(255),
    AppleAuthID VARCHAR(255),
    Address VARCHAR(255), -- New field for address
    SocietyID INTEGER REFERENCES Societies(SocietyID), -- New field for SocietyID
    CreatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UpdatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

Societies Table
CREATE TABLE Societies (
    SocietyID SERIAL PRIMARY KEY,
    Name VARCHAR(255),
    Location VARCHAR(255),
    AdminID INTEGER REFERENCES Users(UserID)
);
Products Table
CREATE TABLE Products (
    ProductID SERIAL PRIMARY KEY,
    Name VARCHAR(255),
    Description TEXT,
    Price DECIMAL,
    Weight DECIMAL,
    ImageURL VARCHAR(255),
    CreatedBy INTEGER REFERENCES Users(UserID)
);
Sessions Table
CREATE TABLE Sessions (
    SessionID SERIAL PRIMARY KEY,
    VendorID INTEGER REFERENCES Users(UserID),
    SocietyID INTEGER REFERENCES Societies(SocietyID),
    StartTime TIMESTAMP,
    EndTime TIMESTAMP,
    TotalAmount DECIMAL,
    PaymentStatus VARCHAR(50),
    CreatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UpdatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
Feedbacks Table
CREATE TABLE Feedbacks (
    FeedbackID SERIAL PRIMARY KEY,
    UserID INTEGER REFERENCES Users(UserID),
    ProductID INTEGER REFERENCES Products(ProductID),
    Rating INTEGER,
    Review TEXT,
    FeedbackTime TIMESTAMP DEFAULT CURRENT_TIMESTAMP, -- Updated to include timestamp
    CreatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
Payments Table
CREATE TABLE Payments (
    PaymentID SERIAL PRIMARY KEY,
    SessionID INTEGER REFERENCES Sessions(SessionID),
    CustomerID INTEGER REFERENCES Users(UserID),
    Amount DECIMAL,
    Status VARCHAR(50),
    PaymentDateTime TIMESTAMP, -- Combined Date and Time into a single field
    CreatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

VendorSocieties Junction Table (For Many-to-Many Relationship between Vendors and Societies)
CREATE TABLE VendorSocieties (
    VendorID INTEGER REFERENCES Users(UserID),
    SocietyID INTEGER REFERENCES Societies(SocietyID),
    PRIMARY KEY (VendorID, SocietyID)
);
SessionProducts Junction Table (For Many-to-Many Relationship between Sessions and Products)
CREATE TABLE SessionProducts (
    SessionID INTEGER REFERENCES Sessions(SessionID),
    ProductID INTEGER REFERENCES Products(ProductID),
    Quantity INTEGER,
    PRIMARY KEY (SessionID, ProductID)
);
SessionCustomers Junction Table (For Many-to-Many Relationship between Sessions and Customers)
CREATE TABLE SessionCustomers (
    SessionID INTEGER REFERENCES Sessions(SessionID),
    CustomerID INTEGER REFERENCES Users(UserID),
    PRIMARY KEY (SessionID, CustomerID)
);




#API Endpoints
Admin Role APIs
Society Management

POST /api/admin/society (Create society)
PUT /api/admin/society/:id (Update society)
DELETE /api/admin/society/:id (Delete society)
Product Management

POST /api/admin/product (Add product)
PUT /api/admin/product/:id (Update product)
DELETE /api/admin/product/:id (Delete product)
Vendor Assignment

POST /api/admin/vendor/assign (Assign vendor to society)
Data Analysis

GET /api/admin/data (Fetch data for analytics)
Vendor Role APIs
Session Management

POST /api/vendor/session (Start a session)
PUT /api/vendor/session/:id (Update a session)
DELETE /api/vendor/session/:id (End a session)
Smart Weighing and Pricing

POST /api/vendor/weighing (Calculate price based on weight)
GET /api/vendor/products/:qrCode (Fetch product details using QR code)
Customer Selection

GET /api/vendor/society/:societyId/members (List society members)
POST /api/vendor/session/:sessionId/addCustomer (Add customer to session)
Session Finalization

PUT /api/vendor/session/:sessionId/finalize (Finalize session details)
Payment Management

PUT /api/vendor/payment/:paymentId (Update payment status)
Customer Role APIs
Product Browsing

GET /api/customer/products (View products list)
Feedback System

POST /api/customer/feedback (Submit feedback)
GET /api/customer/feedback/:productId (View feedback for a product)
Order History

GET /api/customer/orders (View order history)
Product Wishlisting

POST /api/customer/wishlist (Add product to wishlist)
GET /api/customer/wishlist (View wishlist)
Availability Requests

POST /api/customer/availabilityRequest (Request product availability)
Pending Payments

GET /api/customer/payments/pending (View pending payments)
General Features APIs
Authentication

POST /api/auth/signup (Register user)
POST /api/auth/login (Login user)
POST /api/auth/google (Google Sign-In)
POST /api/auth/apple (Apple Sign-In)
POST /api/auth/phone (Phone number authentication)
Common Utilities

GET /api/common/societies (List all societies)
GET /api/common/vendors (List all vendors)
