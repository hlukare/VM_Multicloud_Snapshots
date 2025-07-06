# MultiCloud VM Snapshot Backup System

This is a Node.js-based backend application that automates the creation of AWS EC2 volume snapshots and stores snapshot metadata in MongoDB. The project is currently backend-only and tested using Postman. No frontend is implemented yet.

## Features

- Create snapshots for all EBS volumes attached to an EC2 instance
- Support for multiple AWS regions
- Store snapshot metadata (Snapshot ID, Volume ID, Timestamp, Region) in MongoDB
- Secure configuration using environment variables
- Scalable structure for future enhancements including multi-cloud support

## Tech Stack

- Node.js and Express.js – REST API development
- AWS SDK (JavaScript) – EC2 and snapshot operations
- MongoDB – Metadata storage
- dotenv – Environment variable configuration
- Postman – API testing

## Project Structure
/project-root
├── server.js # Application entry point
├── routes/
│ └── snapshot.js # Route handler for snapshot logic
├── services/
│ └── awsService.js # AWS SDK operations
├── models/
│ └── Snapshot.js # Mongoose schema
├── .env # Environment variables (excluded from repo)
└── README.md # Project documentation


## Setup Instructions
```bash
1. Clone the Repository


git clone https://github.com/your-username/multicloud-snapshot-backup.git
cd multicloud-snapshot-backup

2. Install Dependencies


npm install
Create .env File

AWS_ACCESS_KEY_ID=your_aws_access_key
AWS_SECRET_ACCESS_KEY=your_aws_secret_key
MONGO_URI=your_mongodb_connection_string
AWS_REGION=us-east-1

3. Running the Server

node server.js
The server will run at http://localhost:5000 by default.

API Endpoint
POST /create-snapshot
Creates snapshots for all EBS volumes attached to the given EC2 instance.

4. Request Body:


{
  "instanceId": "i-0123456789abcdef0",
  "region": "us-west-2"
}

5. Sample Response:

{
  "success": true,
  "snapshots": [
    {
      "snapshotId": "snap-0abc123...",
      "volumeId": "vol-0abc123...",
      "startTime": "2025-07-05T10:45:00Z",
      "region": "us-west-2"
    }
  ]
}
6. MongoDB Schema Example

{
  snapshotId: String,
  volumeId: String,
  instanceId: String,
  region: String,
  startTime: Date
}
---
