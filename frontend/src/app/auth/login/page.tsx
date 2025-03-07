"use client";
import { useState } from "react";
import { useMutation, gql } from "@apollo/client";
import { useRouter } from "next/navigation";


const LOGIN_MUTATION = gql`
mutation Login($email:String!,$password:String!){
    login(email:$email,password:$password){
        token
        user{
            id
            name
            email
        }
    }
}`;

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [login, { loading, error }] = useMutation(LOGIN_MUTATION);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const { data } = await login({ variables: { email, password } });

      if (data?.login?.token) {
        localStorage.setItem("token", data.login.token);
        router.push("/Dashboard");
      }
    } catch (err) {
      console.error("Login failed:", err);
    }
  };

  const redirectToSignup = () => {
    router.push("auth/signup");
  }


  return (
   
    <div className="flex items-center justify-center min-h-screen login-bg">
   
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
          <h1 className="text-2xl font-bold text-center text-gray-700">Login</h1>
          <form onSubmit={handleSubmit} className="mt-4">
            <input
              type="email"
              placeholder="Email"
              value={email}
              required
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-2 mb-3 border rounded"
            />
            <input
              type="password"
              placeholder="Password"
              value={password}
              required
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-2 mb-3 border rounded"
            />
            <button type="submit" className="w-full p-2 btn-bg text-white rounded">
              {loading ? "Logging in..." : "Login"}
            </button>
            {error && <p className="text-red-500 text-center">{error.message}</p>}
            <p className="mt-3 text-sm text-center">
              Don't have an account? <a href="signup" className="text-blue-500 hover:underline">Sign Up</a>
            </p>
          </form>
        </div>
      </div>

    </div>
  </div>
  )
}