import User from '../models/index.js';
import { signToken, AuthenticationError } from '../utils/auth.js';

interface LoginUserArgs {
    email: string;
    password: string;
}

interface AddUserArgs {
    input: {
        username: string;
        email: string;
        password: string;
    }
}

interface AddBookArgs {
    input: {
        bookId: string;
        authors?: string[];
        description: string;
        title: string;
        image?: string;
        link?: string;
    }
}

const resolvers = {
    Query: {
        me: async (_parent: any, _args: any, context: any) => {
            if (!context.user) {
                throw new AuthenticationError('Could not authenticate user.');
            }
            return User.findOne({ _id: context.user._id });
        },
    },
    Mutation: {
        login: async (_parent: any, { email, password}: LoginUserArgs) => {
            const user = await User.findOne({ email });
            if (!user) {
                throw new AuthenticationError('Could not authenticate user.');
            }

            const correctPw = await user.isCorrectPassword(password);
            if (!correctPw) {
                throw new AuthenticationError('Could not authenticate user.');
            }

            const token = signToken(user.username, user.email, user._id);
            return { token, user };
        },
        addUser: async (_parent: any, { input }: AddUserArgs) => {
            const user = await User.create({ ...input });
            const token = signToken(user.username, user.email, user._id);
            return { token, user };
        },
        saveBook: async (_parent: any, { input }: AddBookArgs, context: any) => {
            if (!context.user) {
                throw new AuthenticationError('Could not authenticate user.');
            }
            return User.findOneAndUpdate(
                { _id: context.user._id },
                {
                    $addToSet: {
                        savedBooks: { ...input },
                    }
                },
                {
                    new: true,
                    runValidators: true,
                }
            );
        },
        removeBook: async (_parent: any, { bookId }: { bookId: string }, context: any) => {
            if (!context.user) {
                throw new AuthenticationError('Could not authenticate user.');
            }
            return User.findOneAndUpdate(
                { _id: context.user._id },
                {
                    $pull: { savedBooks: { bookId } },
                },
                { new: true }
            );
        },
    },
};

export default resolvers;