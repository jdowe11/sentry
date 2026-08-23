# sentry
End-to-end encrypted messenger, with voice calls in mind.

## Tech Stack

### Frontend

- React
- Vite
- TypeScript
- Tailwind CSS
- Gemini API

### Backend

- Spring Boot
- PostgreSQL
- WebSocket
- JWT Authentication
- Security
- Validation
- Lombok
- Spring Boot Starter Web


## Setup

### Frontend

```bash
npm install
npm run dev
```

### Backend

```bash
mvn spring-boot:run
```

```bash
mvn clean spring-boot:run # clean install
```

### Database

```bash
make build-db
```

### Testing

#### Unit Testing

```bash
mvn test
```

#### Integration Testing

```bash
mvn verify
```

#### Test Coverage

```bash
mvn test -Pcoverage
```


## License

This project is licensed under the terms of the MIT license.
