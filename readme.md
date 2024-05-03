Certainly! Here's the content in a single file:

```markdown
# Social Network API

This project is a Social Network API built using MongoDB, Mongoose, and Express. It allows users to perform various operations such as creating, deleting, and updating users, adding and removing friends, adding and removing thoughts, as well as adding and removing reactions to thoughts.

# Screen Shot
![Screenshot](https://github.com/LorenzoRiosWeb/social-network-api/blob/main/assets/100882991/190623c0-ac25-48c2-a511-60b46dd21852.png)


## Table of Contents

- [Features](#features)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
  - [Running the Server](#running-the-server)
- [Endpoints](#endpoints)
- [Usage](#usage)
- [Contributing](#contributing)
- [License](#license)

## Features

- **User Management**: Users can be created, updated, and deleted. They can also add and remove friends.
- **Thought Management**: Users can create, delete, and update thoughts. They can also add and remove reactions to thoughts.
- **Scalable**: The API is built using MongoDB and Mongoose, making it scalable and capable of handling large amounts of data.

## Getting Started

### Prerequisites

Before running the server, ensure you have the following installed on your machine:

- Node.js
- MongoDB

### Installation

1. Clone the repository:

```bash
git clone https://github.com/your-username/social-network-api.git
```

2. Install dependencies:

```bash
cd social-network-api
npm install
```

### Running the Server

1. Start MongoDB:

```bash
mongod
```

2. Start the server:

```bash
npm start
```

The server should now be running on http://localhost:3001.

## Endpoints

Here are the available endpoints:

- `GET /api/users`: Get all users.
- `GET /api/users/:id`: Get a user by ID.
- `POST /api/users`: Create a new user.
- `PUT /api/users/:id`: Update a user.
- `DELETE /api/users/:id`: Delete a user.
- `POST /api/users/:userId/friends/:friendId`: Add a friend.
- `DELETE /api/users/:userId/friends/:friendId`: Remove a friend.
- `GET /api/thoughts`: Get all thoughts.
- `GET /api/thoughts/:id`: Get a thought by ID.
- `POST /api/thoughts`: Create a new thought.
- `PUT /api/thoughts/:id`: Update a thought.
- `DELETE /api/thoughts/:id`: Delete a thought.
- `POST /api/thoughts/:thoughtId/reactions`: Add a reaction to a thought.
- `DELETE /api/thoughts/:thoughtId/reactions/:reactionId`: Remove a reaction from a thought.

## Usage

To use the API, you can send HTTP requests to the specified endpoints using tools like Insomnia or Postman.

## Contributing

Contributions are welcome! Feel free to open a pull request or submit an issue.
