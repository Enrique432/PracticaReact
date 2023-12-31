import { useState } from "react";
import { login } from "./service";
import Button from "../shared/button";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "./context";

function LoginPage() {
  const { onLogin } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [credentials, setCredentials] = useState({
    email: "",
    password: "",
  });

  const [keepSession, setKeepSession] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();

    setIsLoading(true);
    try {
      await login(credentials, keepSession);

      setIsLoading(false);
      
      onLogin();
      /* si no hay location/state se acabo y te vuelves */
      const to = location.state?.from?.pathname || "/";
      navigate(to);
    } catch (error) {
      console.log(error);
      setError(error);
      setIsLoading(false);
    }
  };

  const handleChange = (event) => {
     if (event.target.name === "email") {
       setCredentials({ ...credentials, email: event.target.value });
       
     }
     if (event.target.name === "password") {
       setCredentials({ ...credentials, password: event.target.value });
     }
    
  };
  const handleKeepSessionChange = (event) => {
    setKeepSession(event.target.checked); //
  };

  const buttonDisabled =
    isLoading || !credentials.email || !credentials.password;

  return (
    <div>
      <h1>Log in</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label>
            Email
            <input
              type="text"
              name="email"
              onChange={handleChange}
              value={credentials.email}
            ></input>
          </label>
        </div>
        <div>
          <div>
            <label>
              {" "}
              Password
              <input
                type="password"
                name="password"
                onChange={handleChange}
                value={credentials.password}
              />
            </label>
          </div>
        </div>
        <Button type="submit" variant="relleno" disabled={buttonDisabled}>
          Log In
        </Button>
        <br></br>
        <label>
          Mantener sesión
          <input
            name="check"
            type="checkbox"
            onChange={handleKeepSessionChange}
            checked={keepSession}
          ></input>
        </label>
      </form>
      {error && <div>{error.message}</div>}
    </div>
  );
}

export default LoginPage;
