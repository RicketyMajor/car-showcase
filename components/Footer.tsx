import { footerLinks } from '@/constants';

import { LogoMark } from './icons';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer__links-container">
        <div className="footer__rights">
          <span className="footer__wordmark">
            <LogoMark />
            Milemark
          </span>
          <p className="footer__note">
            A portfolio project by Alonso Vera. Fuel-economy figures come
            from the US Department of Energy, not from a dealership.
          </p>
        </div>
        <div className="footer__links">
          {footerLinks.map((group) => (
            <div key={group.title} className="footer__link">
              <h3 className="footer__link-title">{group.title}</h3>
              {group.links.map((item) => (
                <a
                  key={item.title}
                  href={item.url}
                  target="_blank"
                  rel="noreferrer"
                  className="footer__link-item"
                >
                  {item.title}
                  <svg viewBox="0 0 16 16" aria-hidden="true" className="footer__link-icon">
                    <path
                      d="M6 3h7v7M13 3 4 12"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </a>
              ))}
            </div>
          ))}
        </div>
      </div>

      <div className="footer__copyrights">
        <p>&copy; 2026 Milemark. All rights reserved.</p>
      </div>
    </footer>
  )
}

export default Footer
