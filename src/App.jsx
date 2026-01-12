import Navbar from "./components/Navbar";
import Hero from "./components/Hero";

export default function App() {
  return (
    <>
      <Navbar />
      <Hero />

      {/* Placeholder for future preview section */}
      <section className="preview-placeholder">
        <div className="preview-inner">
          <span>Preview section coming soon</span>
        </div>
      </section>
    </>
  );
}
