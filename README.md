# 🚀 Microservices-Based Social Media Platform

This project is a hands-on implementation of a microservices-based architecture for a simplified social media platform. It showcases service-oriented design, asynchronous communication, containerization, and cloud-based integrations. Through this journey, I explored a wide range of technologies and architectural patterns used in modern scalable backend systems.

---

## 🧠 What I Learned

- **Microservices Architecture**: Designed loosely coupled, independently deployable services.
- **API Gateway**: Acts as a proxy to route requests to the appropriate microservice.
- **Identity Service**: Manages authentication and authorization using JWT.
- **Post Service**: Handles CRUD operations for posts.
- **Media Service**: Uploads and manages media using [Cloudinary](https://cloudinary.com/).
- **Search Service**: Enables efficient post searching with indexing.
- **Redis**: Caching layer to boost performance and reduce redundant DB calls.
- **RabbitMQ**: Message broker to facilitate async communication and service decoupling.
- **Docker**: Containerized all services for portability and scalability.

---

## 🧩 Microservices Overview

| Service         | Responsibility                                  | Tech Stack           |
|----------------|--------------------------------------------------|----------------------|
| **API Gateway** | Request routing, proxy, and aggregation         | Node.js, Express     |
| **Identity**    | User registration, login, JWT authentication    | Node.js, JWT, MongoDB|
| **Post**        | Post creation, updating, deleting               | Node.js, MongoDB     |
| **Media**       | Media upload and management via Cloudinary      | Node.js, Cloudinary  |
| **Search**      | Full-text search for posts                      | Node.js, Elasticsearch|
| **Cache**       | Caching and invalidation using Redis            | Redis                |
| **Broker**      | Messaging between services                      | RabbitMQ             |

---

## 🐳 Dockerized Setup

Each service is containerized using Docker for easy orchestration and scalability.

```bash
# Spin up all services
docker-compose up --build
