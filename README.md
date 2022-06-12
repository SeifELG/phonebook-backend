# Phonebook Backend

This is the backend of a full stack phonebook application, created by completing the exercises of the Full Stack open 2022 course (https://fullstackopen.com/en/)

The full stack app is hosted live at https://boiling-cove-69257.herokuapp.com/


The `./build` folder contains a production ready build of the frontend, built with React.

## Full Stack Outline

- **React** frontend, initialised with `create-react-app`, using functional components and hooks.  
- **NodeJS** and **Express** backend to implement a RESTful API, including route handlers, and middleware for things like logging, error handling, and JSON parsing. Express static middleware used to host the static React single-page app once built.
- **MongoDB** with **Mongoose**, including a *Person* model defined with a schema that includes validation. Hosted on Atlas.
- **Heroku** for hosting. The app includes npm scripts to easily build the frontend and deploy the entire app.

## Features

- View phonebook entries by viewing the main page
- Create a new entry by typing a name and number
- Update an entry by typing the name you wish to update (case sensitive), and the new number
- Delete entries by clicking the delete button
- Filter entries by typing in the filter box
- API validation
  - "Name" must have a minimum length of 3
  - "Number" must have a minimum length of 8, and include only numbers


## API

The app uses a RESTful API to read and modify resources. 

- Show all phonebook entries: `GET /api/persons/`

- Show a single phonebook entry: `GET /api/persons/:id`

- See phonebook statistics: `GET /api/info`

- Delete a phonebook entry: `DELETE /api/persons/:id`

- Create a phonebook entry: `POST /api/persons/`

    Body:
    ```
    {
        "name": String,
        "number: String
    }
    ```

- Update a phonebook entry: `PUT /api/persons/:id`

    Body:
    ```
    {
        "name": String,
        "number: String
    }
    ```