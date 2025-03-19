import { Link } from "react-router-dom";

function App() {
  return (
    <>
      <h1>This is a test page</h1>
      <br />
      <Link
        to={"/"}
        className="bg-black hover:bg-white text-white hover:text-black"
      >
        Send me back
      </Link>
    </>
  );
}

export default App;