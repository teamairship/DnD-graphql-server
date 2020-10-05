## Story-1 

#### Description
A user wants to be able to create a new D&D character on the Characters home page.

#### Engineering Detail
* Making a `POST` request to the Json-Server at `localhost:3004/characters` will create a new character in the `./data/db.json` file.
* TIP: Only pass in an array of integers for the `classes` property on the `createCharacter` mutation.

#### Acceptance Criteria

- [ ] A user can submit a form that calls the `createCharacter` mutation by passing in a `name`, `level`, and `classes` array.
- [ ] BONUS: A server-admin should see a new log whenever the client calls the `createCharacter` mutation.