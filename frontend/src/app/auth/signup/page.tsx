"use client";
import { useState } from "react";
import { useMutation, gql } from "@apollo/client";
import { useRouter } from "next/navigation";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const REGISTER_MUTATION = gql`
    mutation Register($name:String!,$email:String!,$password:String!){
        register(name:$name,email:$email,password:$password){
            user{
                id
                name
                email
            }
        }
    }
`;

export default function signup() {

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [register, { loading, error }] = useMutation(REGISTER_MUTATION);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const { data } = await register({ variables: { name, email, password } });

      if (data?.register) {

        toast("Signup Successfully!");
        setTimeout(() => {
          router.push("/");
        }, 1000);
      }
    }
    catch (error) {
      console.log("Error Occured: ", error);
    }

  }

  return (

    <div className="flex items-center justify-center min-h-screen login-bg">

      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={true}
        newestOnTop={false}
        closeOnClick={false}
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />

      <div className="flex w-full max-w-5xl h-[65vh] bg-white rounded-lg shadow-lg overflow-hidden">


        <div className="w-3/5 hidden md:block">
          <img
            src="/loginbg.jpg"
            alt="Book"
            className="w-full h-full object-cover bg-cover"
          />
        </div>


        <div className="w-full md:w-2/5 flex items-center justify-center p-8 notes-bg">
          <div className="w-full max-w-md">
            <h1 className="text-2xl font-bold text-center text-gray-700">Signup</h1>
            <form onSubmit={handleSubmit} className="mt-4">
              <input
                type="text"
                placeholder="Enter your name"
                value={name}
                required
                onChange={(e) => setName(e.target.value)}
                className="w-full p-2 mb-3 border rounded"
              />
              <input
                type="email"
                placeholder="Enter your email"
                value={email}
                required
                onChange={(e) => setEmail(e.target.value)}
                className="w-full p-2 mb-3 border rounded"
              />
              <input
                type="password"
                placeholder="Enter your password"
                value={password}
                required
                onChange={(e) => setPassword(e.target.value)}
                className="w-full p-2 mb-3 border rounded"
              />
              <button type="submit" className="w-full p-2 btn-bg text-white rounded">
                {loading ? "Signing in..." : "Signup"}
              </button>
              {error && <p className="text-red-500 text-center">{error.message}</p>}
              <p className="mt-3 text-sm text-center">
                Already have an account? <a href="/" className="text-blue-500 hover:underline">Login</a>
              </p>
            </form>
          </div>
        </div>

      </div>
    </div>
  )
}