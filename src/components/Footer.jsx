export default function Footer({ onHelpOpen }) {
  return (
    <footer className="footer">
      <button className="footer__link" onClick={onHelpOpen}>How to play</button>
      <span className="footer__sep" aria-hidden="true">|</span>
      <a
        href="https://ko-fi.com/afranz409"
        target="_blank"
        rel="noopener noreferrer"
        className="footer__link"
        aria-label="Buy me a coffee on Ko-fi"
      >
        ☕ buy me a coffee
      </a>
    </footer>
  )
}
