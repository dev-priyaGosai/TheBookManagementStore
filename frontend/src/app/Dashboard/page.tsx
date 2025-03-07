"use client";

import { useState, useEffect } from "react";
import { useMutation, gql, useQuery } from "@apollo/client";
import { useRouter } from "next/navigation";
import Modal from "react-modal";
import { FaRegUser, FaSignOutAlt } from "react-icons/fa";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// GraphQL Queries & Mutations
const GET_BOOKS_QUERY = gql`
  query GetBooks {
    books {
      id
      title
      author
      genre
      publishedYear
    }
  }
`;

const ADD_BOOK_MUTATION = gql`
  mutation AddBook($title: String!, $author: String!, $genre: String!, $publishedYear: Int!) {
    addBook(title: $title, author: $author, genre: $genre, publishedYear: $publishedYear) {
      id
      title
      author
      genre
      publishedYear
    }
  }
`;

const EDIT_BOOK_MUTATION = gql`
  mutation UpdateBook($id: ID!, $title: String!, $author: String!, $genre: String!, $publishedYear: Int!) {
    updateBook(id: $id, title: $title, author: $author, genre: $genre, publishedYear: $publishedYear) {
      id
      title
      author
      genre
      publishedYear
    }
  }
`;

const DELETE_BOOK_MUTATION = gql`
  mutation DeleteBook($id: ID!) {
    deleteBook(id: $id)
  }
`;

const GET_USER_QUERY = gql`
  query GetUser {
    me {
      id
      name
    }
  }
`;

// TypeScript Types
interface Book {
  id: string;
  title: string;
  author: string;
  genre: string;
  publishedYear: number;
}

export default function Dashboard() {
  
  const router = useRouter();
  const [token, setToken] = useState<string | null>(() =>
    (typeof window !== "undefined" ? localStorage.getItem("token") : null)
  );

  const { data: userData, refetch: refetchUser } = useQuery(GET_USER_QUERY);
  const { data, loading, error, refetch: refetchBooks } = useQuery(GET_BOOKS_QUERY);
  const [addBook] = useMutation(ADD_BOOK_MUTATION, { onCompleted: refetchBooks });
  const [updateBook] = useMutation(EDIT_BOOK_MUTATION, { onCompleted: refetchBooks });
  const [deleteBook] = useMutation(DELETE_BOOK_MUTATION, { onCompleted: refetchBooks });

  const [formData, setFormData] = useState<Book>({ id: "", title: "", author: "", genre: "", publishedYear: 0 });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    if (!token) {
      router.push("/");
    }
  }, [token]);

  useEffect(() => {
    if (typeof window !== "undefined" && document.getElementById("__next")) {
      Modal.setAppElement("#__next");
    }

    refetchUser();
    refetchBooks();
  }, []);


  //Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const booksPerPage = 5;

  if (loading) return <p>Loading books...</p>;
  if (error) return <p className="text-red-500">Error: {error.message}</p>;

 
  // Pagination Logic
  const indexOfLastBook = currentPage * booksPerPage;
  const indexOfFirstBook = indexOfLastBook - booksPerPage;
  const currentBooks = data?.books?.slice(indexOfFirstBook, indexOfLastBook);
  const totalPages = Math.ceil(data?.books?.length / booksPerPage);

  const handleOpenModal = (book: Book | null = null) => {
    if (book) {
      setFormData(book);
      setIsEditing(true);
    } else {
      setFormData({ id: "", title: "", author: "", genre: "", publishedYear: 0 });
      setIsEditing(false);
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      if (isEditing) {
        await updateBook({ variables: { ...formData, publishedYear: parseInt(formData.publishedYear.toString()) } });
      } else {
        await addBook({ variables: { ...formData, publishedYear: parseInt(formData.publishedYear.toString()) } });
      }
      handleCloseModal();
    } catch (err: any) {
      toast.error(err.message); 
    }
  };

  const handleDeleteBook = async (id: string) => {
    if (confirm("Are you sure you want to delete this book?")) {
      await deleteBook({ variables: { id } });
    }
  };

  return (
    <>
      <div className="flex justify-between items-center p-5 navbar-bg">
        <h1 className="text-3xl text-white font-bold">📚 My Books</h1>
        <div className="flex items-center space-x-4">

          <ToastContainer/>
          <button className="notes-bg text-white px-6 py-2 rounded-lg" onClick={() => handleOpenModal()}>
            ➕ Add New Book
          </button>

          <div className="flex items-center gap-4 notes-bg text-white px-4 py-1 rounded-lg shadow-md">

            <FaRegUser className="text-lg" />
            <span className="text-lg font-semibold">{userData?.me?.name}</span>
            <button onClick={() => { localStorage.removeItem("token"); setToken(null); router.push("/"); }} className="bg-red-600 px-4 py-2 rounded-lg flex items-center gap-2">
              <FaSignOutAlt />
            </button>
          </div>

        </div>
      </div>
       {/* Book List (Table) */}
      <div className="min-h-screen  bg-gray-100 p-6  bg-[url(/bg13.jpg)] bg-cover">
       
        <table className="w-[85%] bg-white rounded-lg shadow-md mx-auto">
          <thead className="navbar-bg text-white">
            <tr>
              <th className="p-3">Title</th>
              <th className="p-3">Author</th>
              <th className="p-3">Genre</th>
              <th className="p-3">Year</th>
              <th className="p-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {currentBooks?.map((book: Book) => (
              <tr key={book.id} className="border-b">
                <td className="p-3 text-center">{book.title}</td>
                <td className="p-3 text-center">{book.author}</td>
                <td className="p-3 text-center">{book.genre}</td>
                <td className="p-3 text-center">{book.publishedYear}</td>
                <td className="p-3 justify-center flex space-x-2">
                  <button className="bg-yellow-500 text-white px-4 py-1 rounded-lg" onClick={() => handleOpenModal(book)}> Edit</button>
                  <button className="bg-red-500 text-white px-4 py-1 rounded-lg" onClick={() => handleDeleteBook(book.id)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="fixed bottom-4 right-4 flex items-center navbar-bg px-4 py-2 rounded-lg shadow-lg">
          <button
            className="text-white px-3 py-1 bg-gray-700 rounded-lg hover:bg-gray-600 disabled:opacity-50"
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
          >
            Prev
          </button>

          <span className="mx-4 text-white">{currentPage} / {totalPages}</span>

          <button
            className="text-white px-3 py-1 bg-gray-700 rounded-lg hover:bg-gray-600 disabled:opacity-50"
            onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
            disabled={currentPage === totalPages}
          >
            Next
          </button>
        </div>


        <Modal
          isOpen={isModalOpen}
          onRequestClose={handleCloseModal}
          contentLabel={isEditing ? "Edit Book" : "Add Book"}
          className="bg-white p-6 rounded-lg shadow-lg w-1/3 mx-auto mt-20"
          overlayClassName="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center"
        >
          <h2 className="text-2xl font-bold mb-4">{isEditing ? "Edit Book" : "Add New Book"}</h2>
          <form onSubmit={handleSubmit} className="grid gap-4">
            <input type="text" placeholder="Title" value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })} className="p-2 border rounded-lg" required />
            <input type="text" placeholder="Author" value={formData.author} onChange={(e) => setFormData({ ...formData, author: e.target.value })} className="p-2 border rounded-lg" required />
            <input type="text" placeholder="Genre" value={formData.genre} onChange={(e) => setFormData({ ...formData, genre: e.target.value })} className="p-2 border rounded-lg" required />
            <input type="number" placeholder="Published Year" value={formData.publishedYear} onChange={(e) => setFormData({ ...formData, publishedYear: parseInt(e.target.value) })} className="p-2 border rounded-lg" required />

            <div className="flex justify-between mt-4">
              <button type="submit" className="bg-green-500 text-white px-4 py-2 rounded-lg">
                {isEditing ? "Update Book" : "Add Book"}
              </button>
              <button type="button" onClick={handleCloseModal} className="bg-gray-400 text-white px-4 py-2 rounded-lg">
                Cancel
              </button>
            </div>
          </form>
        </Modal>
      </div>
    </>

  );
}
