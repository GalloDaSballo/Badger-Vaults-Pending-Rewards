import Link from "next/link";
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
      <Link href="/">
        <a>Home</a>
      </Link>
    </header>
  );
};

export default Header;
