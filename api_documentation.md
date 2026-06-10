# Restaurant Backend API Documentation

Base URL: `http://localhost:5000/api`

**Authentication Details:**
Most routes require a JWT token in the header.
`Authorization: Bearer <your_token>`

Roles used in the system: `customer`, `admin`, `waiter`, `kitchen`, `cashier`.

---

## 1. Authentication Module

### Register a User
- **URL:** `/auth/register`
- **Method:** `POST`
- **Access:** Public
- **Request Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "role": "customer",
  "phone": "1234567890"
}
```
- **Success Response (201 Created):**
```json
{
  "message": "User registered successfully",
  "token": "eyJhbGciOi...",
  "user": {
    "id": "64abcdef...",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "customer",
    "phone": "1234567890"
  }
}
```

### Login a User
- **URL:** `/auth/login`
- **Method:** `POST`
- **Access:** Public
- **Request Body:**
```json
{
  "email": "john@example.com",
  "password": "password123"
}
```
- **Success Response (200 OK):**
```json
{
  "message": "Login successful",
  "token": "eyJhbGciOi...",
  "user": { ... }
}
```

---

## 2. Menu Module

### Get Menu Items
- **URL:** `/menu`
- **Method:** `GET`
- **Access:** Public
- **Query Params (Optional):** `?category=Mains&available=true`
- **Success Response (200 OK):**
```json
[
  {
    "_id": "64abc123...",
    "name": "Margherita Pizza",
    "description": "Classic tomato and cheese",
    "price": 12.99,
    "category": "Mains",
    "isAvailable": true,
    "imageUrl": ""
  }
]
```

### Add Menu Item
- **URL:** `/menu`
- **Method:** `POST`
- **Access:** Protected (`admin`)
- **Content-Type:** `multipart/form-data`
- **Request Body (Form Data):**
  - `name`: "Margherita Pizza" (Text)
  - `description`: "Classic tomato and cheese" (Text)
  - `price`: 12.99 (Text/Number)
  - `category`: "Mains" (Text)
  - `image`: [File] (Optional, image file)

### Update Menu Item
- **URL:** `/menu/:id`
- **Method:** `PUT`
- **Access:** Protected (`admin`)
- **Content-Type:** `multipart/form-data`
- **Request Body (Form Data):**
  - `name`: "Margherita Pizza" (Text)
  - `description`: "Classic tomato and cheese" (Text)
  - `price`: 12.99 (Text/Number)
  - `category`: "Mains" (Text)
  - `image`: [File] (Optional, image file)

### Update Item Status
- **URL:** `/menu/:id/status`
- **Method:** `PATCH`
- **Access:** Protected (`admin`, `kitchen`, `waiter`)
- **Request Body:**
```json
{
  "isAvailable": false
}
```

---

## 3. Tables Module

### Get Tables
- **URL:** `/tables`
- **Method:** `GET`
- **Access:** Public / All logged-in users
- **Query Params (Optional):** `?status=available&capacity=4`
- **Success Response (200 OK):**
```json
[
  {
    "_id": "64abc456...",
    "tableNumber": 1,
    "capacity": 4,
    "status": "available"
  }
]
```

### Add Table
- **URL:** `/tables`
- **Method:** `POST`
- **Access:** Protected (`admin`)
- **Request Body:**
```json
{
  "tableNumber": 1,
  "capacity": 4,
  "status": "available"
}
```

### Update Table Status
- **URL:** `/tables/:id/status`
- **Method:** `PATCH`
- **Access:** Protected (`admin`, `waiter`, `cashier`)
- **Request Body:**
```json
{
  "status": "occupied"
}
```
*(Valid statuses: 'available', 'reserved', 'occupied')*

---

## 4. Reservation Module

### Create Reservation
- **URL:** `/reservations`
- **Method:** `POST`
- **Access:** Protected (Logged-in users / Customers)
- **Request Body:**
```json
{
  "tableId": "64abc456...",
  "date": "2024-05-20",
  "time": "19:00",
  "guests": 3
}
```
- **Success Response (201 Created):**
```json
{
  "message": "Reservation created successfully",
  "reservation": {
    "user": "64abcdef...",
    "table": "64abc456...",
    "date": "2024-05-20T00:00:00.000Z",
    "time": "19:00",
    "status": "pending",
    "guests": 3,
    "_id": "64abc789..."
  }
}
```

### Get My Reservations
- **URL:** `/reservations/my-reservations`
- **Method:** `GET`
- **Access:** Protected (Logged-in user)

### Update Reservation Status
- **URL:** `/reservations/:id/status`
- **Method:** `PATCH`
- **Access:** Protected 
  - *Customers can only update to "cancelled".*
  - *Staff can update to "confirmed", "completed", etc.*
- **Request Body:**
```json
{
  "status": "confirmed"
}
```
*(Valid statuses: 'pending', 'confirmed', 'cancelled', 'completed')*

---

## 5. Order Module

### Place an Order
- **URL:** `/orders`
- **Method:** `POST`
- **Access:** Protected (Logged-in users)
- **Request Body:**
```json
{
  "tableId": "64abc456...",
  "items": [
    {
      "menuItem": "64abc123...",
      "quantity": 2
    }
  ]
}
```
*(Note: `totalAmount` and `price` are calculated automatically on the server based on the menu prices to prevent frontend price spoofing).*
- **Success Response (201 Created):**
```json
{
  "message": "Order placed successfully",
  "order": {
    "user": "64abcdef...",
    "table": "64abc456...",
    "items": [
      {
        "menuItem": "64abc123...",
        "quantity": 2,
        "price": 12.99
      }
    ],
    "totalAmount": 25.98,
    "status": "pending",
    "_id": "64abcdf1..."
  }
}
```

### Get All Orders
- **URL:** `/orders`
- **Method:** `GET`
- **Access:** Protected (`admin`, `waiter`, `kitchen`, `cashier`)
- **Query Params (Optional):** `?status=pending`

### Get My Orders
- **URL:** `/orders/my-orders`
- **Method:** `GET`
- **Access:** Protected (Logged-in users)

### Update Order Status
- **URL:** `/orders/:id/status`
- **Method:** `PATCH`
- **Access:** Protected (`admin`, `waiter`, `kitchen`, `cashier`)
- **Request Body:**
```json
{
  "status": "preparing"
}
```
*(Valid statuses: 'pending', 'preparing', 'ready', 'served', 'paid')*
