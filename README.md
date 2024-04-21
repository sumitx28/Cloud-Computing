# Cloud Computing

Welcome to the Cloud Computing repository! This repository contains assignments and projects related to cloud computing technologies and practices. Below is a brief overview of the contents of this repository:

## Folder Structure

- 🐳 **A1**: Docker Assignment
- 📂 **A2**: Compute, Network & Security
- 📂 **A3**: Serverless
- 📂 **K8s**: Kubernetes
- 📂 **TermAssignment**: PDF-Image Parsing Microservice

## A1: Docker Assignment

In the **A1** folder, you will find the Docker assignment. This assignment focuses on building and orchestrating Docker containers to create a simple microservice architecture.

### Learning Outcomes

By completing this assignment, I gained knowledge and skills in the following areas:

- 🛠 Setting up Docker and building containers
- 📦 Creating Dockerfiles and managing Docker images
- 🌐 Communicating between containers using Docker networks
- 📝 Using JSON for data interchange
- 🚀 Developing microservice architectures with Docker Compose

### Assignment Details

Build two simple web app containers that communicate with each other through a Docker network. The first container serves as an orchestrator and gatekeeper, while the second container performs calculations based on input data.

#### Container 1

The first container's role is to receive JSON input, validate it, and pass it to the second container for processing. Here are the tasks for Container 1:

1. Listen on port 6000 for JSON input via an HTTP POST request to "/calculate".
2. Validate the input JSON to ensure a file name was provided.
3. Verify that the file exists.
4. Send the file and product parameters to Container 2.
5. Return the response from Container 2.

#### Container 2

The second container's role is to perform calculations based on the input received from Container 1. Here are the tasks for Container 2:

1. Mount the host machine directory '.' to a Docker volume.
2. Listen on a defined endpoint/port for calculate requests.
3. Load the file into memory.
4. Parse the CSV file.
5. Calculate the sum of all rows matching the given product parameter.
6. Return the sum in JSON format or an error if the file is not a proper CSV file.

## A2: Compute, Network & Security

In the **A2** folder, you will find assignments related to compute, network, and security in cloud computing, focusing on AWS Elastic Compute (EC2) instances and Virtual Private Clouds (VPCs).

### Learning Outcomes

By completing this assignment, I gained knowledge and skills in the following areas:

- 🚀 Launching AWS EC2 instances
- 🔗 Connecting to EC2 instances and provisioning them for web applications
- 🛡️ Implementing secure architectures with Virtual Private Clouds (VPCs)
- 🏗️ Implementing VPCs on AWS
- 🌐 Deploying public-facing services within a VPC
- 🔒 Deploying private services within a VPC
- 💻 Working with AWS libraries for operations
- 📝 Building REST APIs and working with JSON arrays

### Requirements

Build a web application using any language or framework, deployed on an EC2 instance behind a VPC.

#### Public-Facing Service

Application running on EC2 will be public-facing and accessible through a Public IP or Elastic IP. It will listen to the following endpoints:

- `POST /store-products`: Receive and parse a JSON body, connect to an AWS RDS database server running on a private subnet inside your VPC, insert records into the products table, and return appropriate status codes.
- `GET /list-products`: Connect to the AWS RDS database and return a list of all products.

## A3: Serverless

In the **A3** folder, you will find assignment related to serverless computing using AWS Lambda, Step Functions, and API Gateway.

### Learning Outcomes

By completing this assignment, I gained knowledge and skills in the following areas:

- 🌟 Understanding the benefits of serverless computing
- 🧩 Implementing finite state machines using AWS Step Functions
- 🌐 Building serverless APIs with AWS API Gateway
- 🔐 Basic understanding of common encryption algorithms

### Assignment Details

Build REST API entry points using serverless compute mechanisms. Here's an overview of the process:

1. Create a State Machine configured with API Gateway.
2. The State Machine will evaluate input and select an option.
3. Based on this option, a Lambda function will perform a hashing operation.
4. The Lambda Function will trigger a POST request with the result to a different endpoint.
5. You can query the grade of your recent test submission by calling a POST request.

#### Endpoint Details

- **Endpoint for State Machine**: `/hashing/select`
- **Endpoint to Start Process**: `/serverless/start`
- **Endpoint to Receive State Machine Input**: `/hashing/select`
- **Endpoint to Receive Result**: `/serverless/end`

## K8s: Kubernetes

In the **K8s** folder, you will find assignment related to building a cloud-native CI/CD pipeline and deploying workloads to Google Kubernetes Engine (GKE).

### Learning Outcomes

By completing this assignment, I gained knowledge and skills in the following areas:

- 🐳 Containerizing applications using Docker
- 🚀 Building CI/CD pipelines using GCP tools
- ☸️ Understanding Kubernetes concepts and deploying applications on GKE clusters
- 💾 Attaching persistent volumes to GKE clusters and accessing data
- 🛠️ Using Kubernetes tools (e.g., kubectl) to interact with containers and diagnose cluster issues
- 🔧 Implementing application update strategies in GKE
- 🌐 Building REST APIs

### Requirements

Build two simple microservices in the programming language of your choice. These services should be able to interact with each other. You can reuse the services developed in Assignment 1 with minor changes. To deploy the services on GCP, you will create a CI/CD pipeline that deploys the service to GKE. 

#### Container 1

The role of the first container is to store files to a persistent volume in GKE and serve as a gatekeeper to calculate products from the stored file. It must:

1. Be deployed as a service in GKE to communicate with the Internet.
2. Have access to persistent volume in GKE to store and retrieve files.
3. Communicate with Container 2.
4. Validate the input JSON request.
5. Send the "file" parameter to Container 2 to calculate the product and return the response.

#### Container 2

The role of Container 2 is to listen on a defined endpoint, calculate the total product, and return the result in the appropriate JSON format. It must:

1. Have access to the persistent volume of GKE.
2. Interact with Container 1.
3. Calculate the total product.
4. Return the total in JSON format or an error if the file is not a proper CSV.

