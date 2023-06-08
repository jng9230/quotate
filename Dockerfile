# Stage1: frontend Build
FROM node:18 AS frontend-build
WORKDIR /usr/src
COPY frontend/ ./frontend/
RUN cd frontend && npm install && ENVIRONMENT=production npm run build

# Stage2: backend Build
FROM node:18 AS backend-build
WORKDIR /usr/src
COPY backend/ ./backend/
RUN cd backend && npm install && ENVIRONMENT=production npm run build
RUN ls

# Stage3: Packagign the app
FROM node:18
WORKDIR /root/
COPY --from=frontend-build /usr/src/frontend/build ./frontend/build
COPY --from=backend-build /usr/src/backend/dist ./backend/
RUN ls

EXPOSE 5000

CMD ["node", "./backend/api.bundle.js"]