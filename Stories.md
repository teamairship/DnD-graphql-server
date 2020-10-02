## Story-1 

#### Description
A user wants to be able to create a new D&D character on the Characters home page.

#### Engineering Detail
* Making a `POST` request to the Json-Server at `localhost:3004/characters` will create a new character in the `./data/db.json` file.
* TIP: Only pass in an array of integers for the `classes` property on the `createCharacter` mutation.

#### Acceptance Criteria

- [ ] A user should be able to call the `createCharacter` by passing in a `name`, `level`, and `classes` array and create a new character.