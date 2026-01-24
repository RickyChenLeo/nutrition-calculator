import React from 'react';

const Footer = () => {
    const currentYear = new Date().getFullYear();

    return (
        <footer className="w-full py-8 mt-12 border-t border-gray-200 bg-white text-gray-500 text-sm">
            <div className="max-w-7xl mx-auto px-4 text-center">
                <p className="font-medium mb-3">
                    Copyright © {currentYear} BuildFit Calculator. All rights reserved.
                </p>
                <div className="flex justify-center gap-4 flex-wrap">
                    <a
                        href="/privacy.html"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="hover:text-apple-green transition-colors"
                    >
                        Privacy Policy
                    </a>
                    <span className="text-gray-300">|</span>
                    <a
                        href="#" // Terms of Use Placeholder
                        className="hover:text-apple-green transition-colors"
                        onClick={(e) => e.preventDefault()}
                    >
                        Terms of Use
                    </a>
                    <span className="text-gray-300">|</span>
                    <a
                        href="/disclaimer.html"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="hover:text-apple-green transition-colors"
                    >
                        Medical Disclaimer
                    </a>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
