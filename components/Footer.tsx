import React from 'react';
import { Link } from 'react-router-dom';

const Footer: React.FC = () => {
  const socialLinks = {
    twitter: "#",
    linkedin: "#",
    github: "#",
  };

  const SocialIcon: React.FC<{ href: string, path: string }> = ({ href, path }) => (
    <a href={href} target="_blank" rel="noopener noreferrer" className="text-white/70 hover:text-white transition-colors">
      <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
        <path d={path} />
      </svg>
    </a>
  );

  return (
    <footer className="bg-gradient-to-r from-primary-dark to-primary text-white mt-auto relative">
      <div className="absolute top-0 left-0 w-full overflow-hidden leading-none -translate-y-px">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 120" preserveAspectRatio="none" className="relative block w-[calc(100%+1.3px)] h-[60px]">
            <path d="M985.66,92.83C906.67,72,823.78,31,743.84,14.19c-82.26-17.34-168.06-16.33-250.45.39-57.84,11.73-114,31.07-172,41.86A600.21,600.21,0,0,1,0,27.35V120H1200V95.8C1132.19,118.92,1055.71,111.31,985.66,92.83Z" className="fill-current text-bg-light dark:text-bg-dark transition-colors"></path>
        </svg>
      </div>

      <div className="container mx-auto pt-24 pb-8 px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-3 gap-8 text-center md:text-left">
          <div>
            <h3 className="font-display text-xl font-bold">AI Medical Assistant</h3>
            <p className="text-sm text-white/70 mt-2">Your health, our priority.</p>
          </div>
          <div className="flex flex-col space-y-2">
             <h3 className="font-display text-xl font-bold">Quick Links</h3>
             <Link to="/about" className="text-sm text-white/70 hover:text-white">About Us</Link>
             <Link to="/contact" className="text-sm text-white/70 hover:text-white">Contact</Link>
             <Link to="/get-started" className="text-sm text-white/70 hover:text-white">Get Started</Link>
          </div>
          <div>
            <h3 className="font-display text-xl font-bold">Connect With Us</h3>
            <div className="flex justify-center md:justify-start space-x-4 mt-2">
              <SocialIcon href={socialLinks.twitter} path="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616v.064c0 2.296 1.634 4.208 3.803 4.649-.6.164-1.242.203-1.885.084.607 1.882 2.368 3.256 4.463 3.293-1.786 1.4-4.033 2.24-6.467 2.24-.42 0-.834-.025-1.242-.073 2.303 1.476 5.048 2.33 8.001 2.33 9.6 0 14.857-7.87 14.557-14.597.983-.707 1.838-1.592 2.52-2.616z" />
              <SocialIcon href={socialLinks.linkedin} path="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h--3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
              <SocialIcon href={socialLinks.github} path="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
            </div>
          </div>
        </div>
        <div className="mt-8 border-t border-white/20 pt-8">
            <p className="text-center text-sm text-white/70">
                © {new Date().getFullYear()} AI Medical Assistant. All rights reserved.
            </p>
            <p className="text-center text-xs text-white/50 mt-4 max-w-3xl mx-auto">
                Disclaimer: This service provides AI-powered guidance and is not a substitute for professional medical advice, diagnosis, or treatment. Always seek the advice of your physician or other qualified health provider with any questions you may have regarding a medical condition.
            </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;