# Campus TradeHub

**Campus TradeHub** is a full-stack web application designed to facilitate the buying and selling of used products among college students. It provides a platform for students to list, browse, and manage product listings with a clean and responsive user interface.

## Features

- **User Authentication**: Secure login and registration using Passport.js with local strategy.
- **Product Listings**: Users can create, view, and manage their own product listings.
- **Image Upload**: Upload product images using Cloudinary.
- **Responsive Design**: Optimized for both desktop and mobile devices.
- **Session Management**: Secure user sessions with Express-Session.

## Technologies Used

- **Backend**: Node.js, Express.js
- **Database**: MongoDB with Mongoose
- **Authentication**: Passport.js, Passport-Local, Passport-Local-Mongoose
- **Image Storage**: Cloudinary
- **View Engine**: EJS
- **File Upload**: Multer
- **Session Management**: Express-Session
- **Environment Variables**: Dotenv


1. **Clone the Repository**:

   ```bash
   git clone https://github.com/username/campus-tradehub.git ```
## Installation

To set up the project on your local machine, follow these steps:

## Navigate to the Project Directory

 ```bash
 cd campus-tradehub
```
## Install Dependencies:

Ensure you have Node.js 18.18.2 or later installed. Then run:
```bash
MONGO_URI=your_mongodb_connection_string
CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
SESSION_SECRET=your_session_secret
```
### Run the Application:

Start the application with:
```bash
npm start
```
