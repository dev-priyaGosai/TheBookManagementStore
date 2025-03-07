import { gql } from "apollo-server-express";

const typeDefs = gql`
type User{
    id:ID!
    name:String!
    email:String!
}

type Book{
    id:ID!
    title:String!
    author:String!
    genre:String!
    publishedYear:Int!
    userId:ID!
}

type AuthPayload{
    token:String!
    user:User!
}

type Query{
    books:[Book]
    me:User 
}

type Mutation{
    register(name:String!,email:String!,password:String!):AuthPayload
    login(email:String!,password:String!):AuthPayload
    addBook(title: String!, author: String!, genre: String!, publishedYear: Int!): Book
    updateBook(id: ID!, title: String, author: String, genre: String, publishedYear: Int): Book
    deleteBook(id: ID!): Boolean
}
`;
export default typeDefs;