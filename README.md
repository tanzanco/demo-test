@@@ frontend
npm i
npm run dev

- add backend url in NEXT_PUBLIC_API_ROUTE in .env file
  env files are included for demo purpose

@@@ Backend
run docker compose to start postgres in docker container
npm i
npm run start:watch
add frontend url in corsOptions in app.module.ts to allow frontend to access backend
