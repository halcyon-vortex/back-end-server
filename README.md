### back-end-server
Back-end Node.js server container

### Individual Container Build
From top directory
```
docker run -d --name redis -p 6379:6379 redis
docker build -t server/node .
docker run -d --name node -p 8080 --link redis:redis server/node
```