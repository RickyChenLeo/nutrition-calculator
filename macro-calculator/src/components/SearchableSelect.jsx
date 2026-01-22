import React, { useState, useEffect, useRef } from 'react';

export default function SearchableSelect({ options, value, onChange, placeholder }) {
    const [isOpen, setIsOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const wrapperRef = useRef(null);
    const inputRef = useRef(null);

    // Close dropdown when clicking outside
    useEffect(() => {
        function handleClickOutside(event) {
            if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [wrapperRef]);

    // Focus input when opened
    useEffect(() => {
        if (isOpen && inputRef.current) {
            inputRef.current.focus();
        }
    }, [isOpen]);

    // Filter Options
    const filteredOptions = options.filter(opt => {
        if (opt.isHeader) {
            // Only show headers if strict match or... actually better to hide headers during search?
            // Strategy: Hide headers if there is a search term, unless we implement complex grouping logic.
            return searchTerm === '';
        }
        return opt.label.toLowerCase().includes(searchTerm.toLowerCase());
    });

    // Find selected option - handle Pinned duplicates by checking value match
    const selectedOption = options.find(opt => opt.value === value && !opt.isHeader);

    return (
        <div className="relative w-full" ref={wrapperRef}>
            <div
                className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-gray-900 font-medium cursor-pointer flex justify-between items-center transition-all hover:border-gray-300"
                onClick={() => setIsOpen(!isOpen)}
            >
                <span className={selectedOption ? 'text-gray-900' : 'text-gray-400'}>
                    {selectedOption ? (
                        <span className="flex items-center gap-2">
                            <span>{selectedOption.label}</span>
                            {selectedOption.met && (
                                <span className="text-xs bg-green-100 text-apple-green px-1.5 py-0.5 rounded font-bold">
                                    MET {selectedOption.met}
                                </span>
                            )}
                        </span>
                    ) : placeholder}
                </span>
                <svg className={`w-4 h-4 text-gray-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                </svg>
            </div>

            {isOpen && (
                <div className="absolute z-50 w-full mt-1 bg-white border border-gray-100 rounded-xl shadow-xl max-h-80 overflow-hidden flex flex-col animate-in fade-in zoom-in-95 duration-200">
                    <div className="p-2 border-b border-gray-50 sticky top-0 bg-white z-10">
                        <input
                            ref={inputRef}
                            type="text"
                            placeholder="Search activity..."
                            className="w-full bg-gray-50 border-0 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-apple-green/50 placeholder:text-gray-400"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <div className="overflow-y-auto flex-1">
                        {filteredOptions.length > 0 ? (
                            filteredOptions.map((opt, index) => {
                                if (opt.isHeader) {
                                    return (
                                        <div key={`header-${index}`} className="px-4 py-1.5 text-xs font-bold text-gray-400 bg-gray-50 uppercase tracking-wider sticky top-0">
                                            {opt.label}
                                        </div>
                                    );
                                }
                                return (
                                    <div
                                        key={`${opt.value}-${index}`} // Composite key for duplicates (pinned vs list)
                                        className={`px-4 py-2.5 text-sm cursor-pointer transition-colors border-b border-gray-50 last:border-0 ${value === opt.value ? 'bg-green-50 text-apple-green font-bold' : 'text-gray-700 hover:bg-gray-50'}`}
                                        onClick={() => {
                                            onChange(opt.value);
                                            setIsOpen(false);
                                            setSearchTerm('');
                                        }}
                                    >
                                        <div className="flex justify-between items-center">
                                            <div>{opt.label}</div>
                                            {opt.met && (
                                                <div className="text-xs text-apple-green font-medium bg-green-50 px-2 py-0.5 rounded-full">
                                                    {opt.met}
                                                </div>
                                            )}
                                        </div>
                                        {opt.description && (
                                            <div className="text-xs text-gray-400 font-normal mt-0.5">{opt.description}</div>
                                        )}
                                    </div>
                                );
                            })
                        ) : (
                            <div className="px-4 py-3 text-sm text-gray-400 text-center">
                                No results found
                            </div>
                        )}
                    </div>
                </div>
            )
            }
        </div >
    );
}
