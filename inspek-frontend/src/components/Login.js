import React from 'react';
import './Login.css';
import { useNavigate } from 'react-router-dom'

function Login() {
  return (
    <div className="login-container">
      <div className="login-box">
      <img src="/logo_transparent.png" alt="Inspek Logo" className="logo" />
        <form>
          <input type="text" placeholder="Username" className="login-input" />
          <input type="password" placeholder="Password" className="login-input" />
          <button type="submit" className="login-button">Login</button>
        </form>
      </div>
    </div>
  );
}

export default Login;

//import './style.css'; // Import CSS file

// const Login = () => {
//   const [username, setUsername] = useState('');
//   const [password, setPassword] = useState('');
//   const [error, setError] = useState(null);

//   const handleSubmit = async (e) => {
//     e.preventDefault();
    
//     try {
//       const response = await fetch('/api/login', {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify({ username, password }),
//       });

//       if (response.ok) {
//         const data = await response.json();
//         console.log('Login successful', data);
//         // Redirect or handle login success (save token, etc.)
//       } else {
//         setError('Invalid username or password');
//       }
//     } catch (error) {
//       console.error('Error logging in:', error);
//       setError('Login failed. Please try again.');
//     }
//   };

//   return (
//     <div className="login-container">
//       <h2>Login</h2>
//       <form onSubmit={handleSubmit}>
//         <div className="form-group">
//           <label htmlFor="username">Username</label>
//           <input 
//             type="text" 
//             id="username" 
//             value={username} 
//             onChange={(e) => setUsername(e.target.value)} 
//             required 
//           />
//         </div>
//         <div className="form-group">
//           <label htmlFor="password">Password</label>
//           <input 
//             type="password" 
//             id="password" 
//             value={password} 
//             onChange={(e) => setPassword(e.target.value)} 
//             required 
//           />
//         </div>
//         <button type="submit">Login</button>
//       </form>
//     </div>
//   );
// };

// export default Login;