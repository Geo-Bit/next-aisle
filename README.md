# Next Aisle

On weekly family grocery trips, we found ourselves wanting quality of life features to help make shopping quicker and more efficient. Especially things like auto-sorting by aisle and item category. This app is a work in progress with the ultimate goal to be our daily grocery list app.

## Tech stack

- **Frontend**: React, Vite
- **Backend**: Node.js, Express
- **Database**: PostgreSQL
- **Deployment**: Docker, Docker Compose

## How to run the app

1. **Create a `.env` file** in the root directory and add the following environment variables:

   ```env
   POSTGRES_USER=your_postgres_user
   POSTGRES_PASSWORD=your_postgres_password
   POSTGRES_DB=your_postgres_db
   DATABASE_URL=postgres://your_postgres_user:your_postgres_password@db:5432/your_postgres_db
   SPOONACULAR_API_KEY=your_spoonacular_api_key
   ```

2. **Build and run the app** using Docker Compose:

   ```sh
   docker-compose up --build
   ```

3. **Access the app**:
   - Frontend: `http://localhost:3000`
   - Backend: `http://localhost:4000`

## Future enhancements

- Implement user authentication and authorization
- Add more grocery store categories
- Improve UI/UX for better usability on mobile devices
- Add functionality to share lists with other users
- Integrate with more grocery APIs for better item recognition
