  import Book from "../Models/books";
  import { AuthenticationError, UserInputError } from "apollo-server-express";

  const bookResolvers = {
    Query: {
      //Get all books for current user
      books: async (_: any, __: any, { user }: any) => {
        if (!user) {
          throw new AuthenticationError("Not authenticated");
        }
        return await Book.find({ userId: user.id });
      },
    },

    Mutation: {
      // Create new book
      addBook: async (_: any, { title, author, genre, publishedYear }: any, { user }: any) => {
        if (!user) {
          throw new AuthenticationError("Not authenticated");
        }

        await validateBookInput(title, user.id);

        const newBook = new Book({ title, author, genre, publishedYear, userId: user.id });
        await newBook.save();
        return newBook; 
      },

      // Update book
      updateBook: async (_: any, { id, title, author, genre, publishedYear }: any, { user }: any) => {
        if (!user) {
          throw new AuthenticationError("Not authenticated");
        }

        await validateBookInput(title, user.id);

        const updatedBook = await Book.findOneAndUpdate(
          { _id: id, userId: user.id },
          { title, author, genre, publishedYear },
          { new: true }
        );

        if (!updatedBook) {
          throw new Error("Book not found or unauthorized");
        }

        return updatedBook;
      },

      // Delete book
      deleteBook: async (_: any, { id }: any, { user }: any) => {
        if (!user) {
          throw new AuthenticationError("Not authenticated");
        }

        const book = await Book.findOneAndDelete({ _id: id, userId: user.id });

        if (!book) {
          throw new Error("Book not found or unauthorized");
        }

        return true;
      },
    },
  };

  const validateBookInput = async (title: string, userId: string, bookId?: string) => {
    // Title length validation
    if (title.length < 3 || title.length > 60) {
      throw new UserInputError("Book title must be between 3 and 60 characters long");
    }
  
    //Duplicate title check 
    const existingBook = await Book.findOne({ title, userId, _id: { $ne: bookId } });
    if (existingBook) {
      throw new UserInputError("A book with this title already exists");
    }
  };

  export default bookResolvers;
