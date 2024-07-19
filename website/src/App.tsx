import React, { useState } from 'react';
import './App.css';

function App() {
  return (
    <div className="App">
      <Header />
      <Main />
    </div>
  );
}

function Header() {
  return (
    <header className="header">
      <h1>My Website</h1>
      <AuthBox />
    </header>
  );
}

interface AuthBoxProps {}

const AuthBox: React.FC<AuthBoxProps> = () => {
  const [isLogin, setIsLogin] = useState(true);

  return (
    <div className="auth-box">
      {isLogin ? (
        <LoginBox setIsLogin={setIsLogin} />
      ) : (
        <SignUpBox setIsLogin={setIsLogin} />
      )}
    </div>
  );
};

interface LoginBoxProps {
  setIsLogin: React.Dispatch<React.SetStateAction<boolean>>;
}

const LoginBox: React.FC<LoginBoxProps> = ({ setIsLogin }) => {
  return (
    <div className="login-box">
      <input type="text" placeholder="Username" />
      <input type="password" placeholder="Password" />
      <button>Login</button>
      <p>
        Don't have an account?{' '}
        <span onClick={() => setIsLogin(false)} className="toggle-link">
          Sign Up
        </span>
      </p>
    </div>
  );
};

interface SignUpBoxProps {
  setIsLogin: React.Dispatch<React.SetStateAction<boolean>>;
}

const SignUpBox: React.FC<SignUpBoxProps> = ({ setIsLogin }) => {
  return (
    <div className="sign-up-box">
      <input type="text" placeholder="Username" />
      <input type="password" placeholder="Password" />
      <input type="password" placeholder="Confirm Password" />
      <button>Sign Up</button>
      <p>
        Already have an account?{' '}
        <span onClick={() => setIsLogin(true)} className="toggle-link">
          Login
        </span>
      </p>
    </div>
  );
};

const Main: React.FC = () => {
  return (
    <main className="main">
      <div className="column">Column 1</div>
      <div className="column">Column 2</div>
      <div className="column">Column 3</div>
    </main>
  );
};

export default App;