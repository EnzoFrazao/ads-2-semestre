import Header from "./components/Header.jsx";
import Card from "./components/Card.jsx";

function App() {
  return (
    <>
      <Header />
      <main className="cartoes">
        <Card numero={1} />
        <Card numero={2} />
        <Card numero={3} />
      </main>
    </>
  );
}

export default App;
