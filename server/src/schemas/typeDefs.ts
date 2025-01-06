const typeDefs = `
    type User {
        _id: ID!
        username: String!
        email: String!
        bookCount: Int
        savedBooks: [Book]
    }

    type Book {
        bookId: String!
        title: String!
        authors: [String]
        description: String!
        image: String
        link: String
    }

    type Auth {
        token: String!
        user: User!
    }

    input BookInput {
        bookId: String!
        authors: [String]
        description: String!
        title: String!
        image: String
        link: String
    }

    input AddUserInput {
        username: String!
        email: String!
        password: String!
    }

    type Query {
        me: User
    }

    type Mutation {
        login(
            email: String!
            password: String!
        ): Auth

        addUser(input: AddUserInput!): Auth

        saveBook(input: BookInput!): User

        removeBook(bookId: String!): User
        
    }
`;

export default typeDefs;