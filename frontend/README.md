# PeopleDesk — Angular Frontend

Angular SPA for the PeopleDesk Employee Management System. Talks to the
Spring Boot backend in `../backend` over REST via Angular `HttpClient`.

See the [project root README](../README.md) for full setup instructions
(database, backend, and frontend together).

## Quick start

```bash
npm install
ng serve
```

App runs at `http://localhost:4200` and calls the backend at the URL
configured in `src/environments/environment.ts`
(`http://localhost:8080/api` by default).

## Production build

```bash
ng build
```

Output goes to `dist/employee-management-frontend/browser`. Before
building for a real deployment, update the API URL in
`src/environments/environment.prod.ts`.
