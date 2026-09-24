import Link from "next/link";

// The navbar is chalk-on-graphite and floats over whatever the route renders
// first. Next's default 404 is white, so the wordmark vanished on it. An
// unknown URL gets the same stage as the home page instead.
export default function NotFound() {
  return (
    <main className="stage">
      <div className="stage__inner">
        <div className="stage__copy">
          <h1 className="hero__title type-display">This page does not exist.</h1>
          <Link href="/" className="custom-btn btn-primary mt-10 w-fit">
            Back to the catalogue
          </Link>
        </div>
      </div>
    </main>
  );
}
