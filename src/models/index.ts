/*
This file holds the structure of the data that will be stored in the database.

These will be output as JSON objects.
*/

export interface IUser {
    id: string;
    name: string;
    email: string;
    password: string;
    createdAt: Date;
    updatedAt: Date;
}
