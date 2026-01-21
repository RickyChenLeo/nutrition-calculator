import React from 'react';

const available_langs = [
    { code: 'en', label: 'EN' },
    { code: 'zh', label: '繁中' },
    { code: 'jp', label: '日文' }
];

export default function Header({ lang, setLang }) {
    return (
        <div className="absolute top-6 right-6 flex bg-white rounded-full p-1 shadow-sm border border-gray-200 z-10">
            {available_langs.map((l) => (
                <button
                    key={l.code}
                    onClick={() => setLang(l.code)}
                    className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all ${lang === l.code
                        ? 'bg-gray-900 text-white shadow-sm'
                        : 'text-gray-400 hover:text-gray-600'
                        }`}
                >
                    {l.label}
                </button>
            ))}
        </div>
    );
}
