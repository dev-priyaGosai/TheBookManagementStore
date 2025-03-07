import userResolvers from "./userResolvers";
import bookResolvers from "./bookResolvers";

const resolvers = {
  Query: {
    ...userResolvers.Query,
    ...bookResolvers.Query,
  },
  Mutation: {
    ...userResolvers.Mutation,
    ...bookResolvers.Mutation,
  },
};

export default resolvers;
