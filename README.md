# FULLRVMOVIES
Fullrvmovies is a movie rental/return SPA manager developed using NODE, React and MONGODB.

## Running using Docker for development: 
1 - First Clone the project. 
2 - Install npm dependencies in the backend directory.
```sh
sudo npm i
```
3 - Create an .env file with the following environment variables: 
- APP_PRIVATE_KEY=YOUR_PRIVATE_KEY
- APP_ENV= development
- DEV_PORT=3001
- DEV_USING_DOCKER=true
- DEV_MONGO_CONTAINER_URL=mongodb://mongo:27017
- DEV_DATABASENAME=YOUR_DATABASE_NAME
- TESTING_DATABASENAME=YOUR_TESTING_DATABASE_NAME

4 - Install npm dependencies in the frontend directory.
```sh
sudo npm i
```
5 - Build the containers
```sh
sudo docker-compose up --build
```
## Running tests
For this project the package used for testing is Jest.

In the package.json of the backend directory the test command for npm is set as: 

```sh
APP_ENV=testing jest --watchAll --runInBand --verbose --setupFiles dotenv/config
```

If you want to run tests, change the APP_ENV variable in your .env file: APP_ENV=testing
Run the tests: 
```sh
sudo docker-compose run --rm backend npm test
```
Note: If the environment is set to testing, then the app will not connect to mongodb on startup, and will leave the connection handling to the Jest tests.

## Running migrations
If you want to populate the genres, movies and customers collections, call the function runMigrations in the app.js file of the backend directory: 

    if (process.env.APP_ENV !== 'testing') {
        connectToDB()
        runMigrations()
    }

# Project Details: 
The models are: 
- Customers
- Users
- Movies
- Genres
- Rentals

Available routes: 
- login
- register
- customers/new (GET)
- customers (GET)
- movies (GET)
- movies/new (GET)
- movies/:id (GET)
- rentals (GET)
- rentals/new (GET)
