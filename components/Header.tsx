import { useLogin, useUser } from "../context/UserContext";

const Header: React.FC = () => {
  const user = useUser();
  const login = useLogin();

  return (
    <header>
      {!user && (
        <button type="button" onClick={() => login()}>
          Login with Metamask
        </button>
      )}
    </header>
  );
};

export default Header;
