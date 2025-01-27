# Backend for Story Generation AI
Backend for AI-powered app that creates engaging stories with both text and corresponding images. Using advanced language and image generation models, the app crafts unique narratives while generating visually captivating illustrations for each section of the story.\
Frontend code can be found here: [Frontend](https://github.com/nay0101/story-gen-ai-web.git)\
Demo app can be accessed here: [Demo App](http://3.105.212.81:3000/)

## Run with Local Setup

### Prerequisite
* Node.js (v22 or later)
* PostgreSQL

### Installation
```
npm insall
```

### Prepare .env
Create .env
```
cp .env.example .env
```
Update the variables in .env
```
NODE_PORT=[port number for API]
OPENAI_API_KEY=[openai API key]
POSTGRES_USER=[postgres user name]
POSTGRES_HOST=[postgres host]
POSTGRES_DATABASE=[postgres database name]
POSTGRES_PASSWORD=[postgres password]
POSTGRES_PORT=[postgres port
```

### Run the app
Development
```
npm run dev
```
Production
```
npm run start
```

## Run with Docker
### Prepare .env
Create .env
```
cp .env.example .env
```
Update the variables in .env
```
NODE_PORT=8080
OPENAI_API_KEY=[openai API key]
POSTGRES_USER=[postgres user name]
POSTGRES_HOST="postgresdb"
POSTGRES_DATABASE=[postgres database name]
POSTGRES_PASSWORD=[postgres password]
POSTGRES_PORT=[postgres port]
```

### Run with docker compose
```bash
docker-compose up -d
```

**Now, the api can be accessed at http://localhost:8080**
