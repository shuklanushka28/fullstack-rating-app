# fullstack-rating-app
A role-based fullstack web application for managing and submitting store ratings.
This platform enables users to register, log in, and rate stores on a scale of 1 to 5. It supports three different roles — **Admin**, **Normal User**, and **Store Owner** — each with distinct functionalities.

- **Admins** can manage the entire system: add new users/stores, view analytics, apply filters on user/store data.
- **Normal Users** can search for stores, view existing ratings, and submit or update their own ratings.
- **Store Owners** can view the users who rated their stores and analyze their store’s average rating.

## Tech Stack

- **Frontend**: ReactJS
- **Backend**: ExpressJS
- **Database**: PostgreSQL
- **ORM**: Sequelize

###  Authentication
- JWT-based login and signup for users, admins, and store owners

###  Admin
- Create users and stores
- View stats (total users, stores, ratings)
- Apply filters to view user/store lists

###  Normal User
- Signup/login
- View all stores
- Search stores by name/address
- Submit or update store ratings

###  Store Owner
- View users who rated their store
- View average rating of their store
