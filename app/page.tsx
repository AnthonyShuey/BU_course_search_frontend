"use client";

import { useState } from 'react';
import axios from 'axios';
import Link from 'next/link';

interface Course {
    title: string;
    description: string;
    hub_units: string[];
    prerequisites?: string;
    credits?: number;
}

const hubUnitsList = [
    "HUB Scientific Inquiry I",
    "HUB Scientific Inquiry II",
    "HUB Social Inquiry I",
    "HUB Social Inquiry II",
    "HUB Writing-Intensive Course",
    "HUB Teamwork/Collaboration",
    "HUB Critical Thinking",
    "HUB Digital/Multimedia Express",
    "HUB Creativity/Innovation",
    "HUB Ethical Reasoning",
    "HUB Rsch Information Literacy",
    "HUB Quantitative Reasoning I",
    "HUB Oral Signed Communication",
    "HUB Philosophical Inquiry Life",
    "HUB Historical Consciousness",
    "HUB Aesthetic Exploration",
    "HUB Individual in Community",
    "HUB Global Citizenship",
    // Add more hub units as necessary
];

const codesList = [
    'AA', 'AH', 'AM', 'AN', 'AR', 'AS', 'BB', 'BI', 'CC', 'CG', 'CH', 'CI', 'CL', 'CN', 'CS', 'EC', 'EE', 'EI', 'EN', 'ES', 'FY', 'GE', 'HI', 'ID', 'IN', 'IR', 'JS', 'LC', 'LD', 'LE', 'LF', 'LG', 'LH', 'LI', 'LJ', 'LK', 'LM', 'LN', 'LO', 'LP', 'LR', 'LS', 'LT', 'LX', 'LY', 'LZ', 'MA', 'MB', 'ME', 'MR', 'MS', 'NE', 'NS', 'PH', 'PO', 'PS', 'PY', 'RN', 'SO', 'SY', 'TL', 'WR', 'WS', 'XL',
    // Add more codes as necessary
];

const stopWords = [
    "i", "want", "to", "learn", "about", "and", "or", "the", "a", "an", "of", "in", "on", "with",
    "for", "is", "are", "am", "was", "were", "be", "being", "been", "has", "have", "had", "do", 
    "does", "did", "can", "could", "should", "would", "might", "must", "will", "shall", "may", 
    "my", "your", "his", "her", "its", "our", "their", "there", "here", "over", "under", "across",
    "very", "really", "just", "about", "like", "such", "that", "this", "these", "those", "some",
    "all", "many", "much", "most", "more", "less", "few", "several", "each", "every", "either",
    "neither", "one", "two", "three", "first", "second", "third", "last", "next", "previous",
    "final", "good", "bad", "right", "wrong", "best", "worst", "great", "small", "big", "large",
    "huge", "tiny", "short", "long", "new", "old", "high", "low", "up", "down", "out", "in", 
    "through", "between", "within", "without", "before", "after", "during", "above", "below", 
    "around", "near", "far", "other", "another", "any", "few", "more", "such", "only", "own",
    "same", "so", "than", "too", "very", "semester", 
];

const HomePage = () => {
    const [query, setQuery] = useState<string>('');
    const [selectedHubUnits, setSelectedHubUnits] = useState<string[]>([]);
    const [selectedCodes, setSelectedCodes] = useState<string[]>([]);
    const [searchMode, setSearchMode] = useState<string>('broad');
    const [results, setResults] = useState<Course[]>([]);
    const [showHubUnits, setShowHubUnits] = useState<boolean>(false);
    const [showCodes, setShowCodes] = useState<boolean>(false);

    const handleSearch = async () => {
        try {
            const hubUnits = selectedHubUnits.join(',');
            const codes = selectedCodes.join(',');
            const filteredQuery = filterQuery(query);
            const response = await axios.get<Course[]>('https://bu-course-search-backend.vercel.app/api/courses', { params: { query: filteredQuery, hub_units: hubUnits, codes, search_mode: searchMode } });
            setResults(response.data);
        } catch (error) {
            console.error('Error fetching courses:', error);
        }
    };

    const handleKeyPress = (event: React.KeyboardEvent<HTMLInputElement>) => {
        if (event.key === 'Enter') {
            handleSearch();
        }
    };

    const filterQuery = (input: string) => {
        const words = input
            .toLowerCase()
            .split(/[\s,]+/)
            .filter(word => !stopWords.includes(word));

        const uniqueWords = words.reduce((acc, word) => {
            const singular = word.endsWith('s') ? word.slice(0, -1) : word;
            if (!acc.includes(singular) && !acc.includes(word)) {
                acc.push(word);
            }
            return acc;
        }, [] as string[]);

        return uniqueWords.join(',');
    };

    const toggleHubUnit = (hubUnit: string) => {
        setSelectedHubUnits((prevSelected) => {
            if (prevSelected.includes(hubUnit)) {
                return prevSelected.filter(unit => unit !== hubUnit);
            } else {
                return [...prevSelected, hubUnit];
            }
        });
    };

    const toggleCode = (code: string) => {
        setSelectedCodes((prevSelected) => {
            if (prevSelected.includes(code)) {
                return prevSelected.filter(c => c !== code);
            } else {
                return [...prevSelected, code];
            }
        });
    };

    const preventNavigation = (event: React.MouseEvent) => {
        event.preventDefault();
    };

    return (
        <div className="min-h-screen bg-white flex items-center justify-center p-5" onClick={preventNavigation}>
            <div className="w-full max-w-screen-2xl bg-red-50 rounded-lg shadow-lg p-6 border border-red-500 flex">
                <div className="w-1/4 p-3 text-left text-gray-700 bg-red-50 rounded-lg shadow-lg border border-red-300 mr-3">
                    <h2 className="text-xl font-semibold mb-2">How to Use the Course Search</h2>
                    <p>
                        Welcome to the Course Search Tool! Here’s how you can optimize your search for the best results:
                    </p>
                    <p>
                        <strong>1. Enter Course Information:</strong> Type in sentences, phrases, or words about what you want to learn. 
                    </p>
                    <p>
                        <strong>2. Choose Search Mode:</strong> Select the search mode that best fits your needs:
                    </p>
                    <ul>
                        <li><strong>Broad:</strong> This mode will find courses that match any of the entered keywords.</li>
                        <li><strong>Honed:</strong> This mode will find courses that match at least 70% of the entered keywords. Use this for more specific searches.</li>
                    </ul>
                    <p>
                        <strong>3. Select Course Codes (Optional):</strong> Click on the "Choose Codes" button to select specific course codes. Course codes are the highest level of search and will filter courses to only include those that match the selected codes.
                    </p>
                </div>
                <div className="w-2/4 p-3">
                    <div className="flex justify-center mb-4">
                        <Link href="/">
                            <img src="/logo.png" alt="BU Terrier Logo" className="h-16 w-16 cursor-pointer" />
                        </Link>
                    </div>
                    <h1 className="text-3xl font-bold mb-4 text-center text-red-700">Course Search</h1>
                    <p className="text-red-700 mb-6 text-center">Explore new courses by entering sentences, phrases, or words about what you want to learn! For example, "Next semester I want to learn about the holocaust, fourier transform, full-stack webdev, and Jim Crow Laws"</p>
                    <div className="mb-6">
                        <input
                            type="text"
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                            onKeyPress={handleKeyPress}
                            placeholder="Enter course information..."
                            className="w-full p-3 mb-3 border border-red-300 rounded focus:outline-none focus:ring-2 focus:ring-red-500"
                        />
                        <div className="mb-3">
                            <label className="mr-2 text-red-700">Search Mode:</label>
                            <select value={searchMode} onChange={(e) => setSearchMode(e.target.value)} className="p-2 border border-red-300 rounded focus:outline-none focus:ring-2 focus:ring-red-500">
                                <option value="broad">Broad</option>
                                <option value="honed">Honed</option>
                            </select>
                        </div>
                        <div className="flex justify-between items-center mb-3">
                            <div className="w-1/2 relative">
                                <button
                                    onClick={() => setShowCodes(!showCodes)}
                                    className="w-full p-3 bg-red-500 text-white rounded hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500"
                                >
                                    {showCodes ? "Hide Codes" : "Choose Codes"}
                                </button>
                                {showCodes && (
                                    <div className="absolute mt-1 w-full bg-white border border-red-300 rounded shadow-lg z-10">
                                        <div className="flex flex-col">
                                            {codesList.map((code) => (
                                                <button
                                                    key={code}
                                                    onClick={() => toggleCode(code)}
                                                    className={`p-2 text-left ${selectedCodes.includes(code) ? 'bg-red-500 text-white' : 'bg-white text-red-700'} hover:bg-red-100`}
                                                >
                                                    {code}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                            <div className="w-1/2 relative">
                                <button
                                    onClick={() => setShowHubUnits(!showHubUnits)}
                                    className="w-full p-3 bg-red-500 text-white rounded hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500"
                                >
                                    {showHubUnits ? "Hide Hub Units" : "Choose Hub Units"}
                                </button>
                                {showHubUnits && (
                                    <div className="absolute mt-1 w-full bg-white border border-red-300 rounded shadow-lg z-10">
                                        <div className="flex flex-col">
                                            {hubUnitsList.map((hubUnit) => (
                                                <button
                                                    key={hubUnit}
                                                    onClick={() => toggleHubUnit(hubUnit)}
                                                    className={`p-2 text-left ${selectedHubUnits.includes(hubUnit) ? 'bg-red-500 text-white' : 'bg-white text-red-700'} hover:bg-red-100`}
                                                >
                                                    {hubUnit}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                        <button
                            onClick={handleSearch}
                            className="w-full p-3 bg-red-500 text-white rounded hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500"
                        >
                            Search
                        </button>
                    </div>
                    <div>
                        {results.length > 0 ? (
                            results.map((course, index) => (
                                <div key={index} className="mb-6 p-4 border border-red-300 rounded-lg bg-white cursor-pointer" onClick={preventNavigation}>
                                    <h2 className="text-xl font-semibold text-red-700">{course.title}</h2>
                                    <p className="text-gray-800 mt-2">{course.description}</p>
                                    {course.prerequisites && (
                                        <p className="text-gray-800 mt-2"><strong>Prerequisites:</strong> {course.prerequisites}</p>
                                    )}
                                    {course.credits && (
                                        <p className="text-gray-800 mt-2"><strong>Credits:</strong> {course.credits}</p>
                                    )}
                                    {course.hub_units.length > 0 ? (
                                        <ul className="mt-2">
                                            <strong>BU Hub Units:</strong>
                                            {course.hub_units.map((unit, idx) => (
                                                <li key={idx} className="text-gray-800">- {unit}</li>
                                            ))}
                                        </ul>
                                    ) : (
                                        <p className="text-gray-800 mt-2"><strong>BU Hub Units:</strong> No BU Hub Units</p>
                                    )}
                                </div>
                            ))
                        ) : (
                            <p className="text-red-700 text-center">No courses found</p>
                        )}
                    </div>
                </div>
                <div className="w-1/4 p-3 text-left text-gray-700 bg-red-50 rounded-lg shadow-lg border border-red-300 ml-3">
    <h2 className="text-xl font-semibold mb-2">Backend Logic</h2>
    <p>
        <strong>Search Logic:</strong> The tool uses rules to find the best courses based on your input.
    </p>
    <p>
        <strong>Course Codes:</strong> The highest level of search. If you select a course code, the search will only include courses that match these codes.
    </p>
    <p>
        <strong>Search Keywords:</strong> Words or phrases you type into the search box. The tool filters out common words to focus on the most relevant terms.
    </p>
    <p>
        <strong>Search Modes:</strong>
    </p>
    <ul>
        <li><strong>Broad:</strong> Matches any of the entered keywords.</li>
        <li><strong>Honed:</strong> Matches at least 70% of the entered keywords.</li>
    </ul>
    <p>
        <strong>Hub Units:</strong> Additional filtering criteria. If selected, only courses that match these units will be included.
    </p>
    <p>
        <strong>How the Search Works:</strong> The backend logic handles different combinations of inputs to provide the most relevant results:
    </p>
    <ol>
        <li><strong>Case 1:</strong> If you type course description words, choose hub units, and select "Honed" mode, the backend will return courses that match at least 70% of the words and have at least one of the selected hub units.</li>
        <li><strong>Case 2:</strong> If you type course description words, choose hub units, and select "Broad" mode, the backend will return courses that match any of the words and have at least one of the selected hub units.</li>
        <li><strong>Case 3:</strong> If you type course description words and select "Honed" mode without choosing hub units, the backend will return courses that match at least 70% of the words.</li>
        <li><strong>Case 4:</strong> If you type course description words and select "Broad" mode without choosing hub units, the backend will return courses that match any of the words.</li>
        <li><strong>Case 5:</strong> If you choose hub units and select "Honed" mode without typing course description words, the backend will return courses that have all the selected hub units.</li>
        <li><strong>Case 6:</strong> If you choose hub units and select "Broad" mode without typing course description words, the backend will return courses that have at least one of the selected hub units.</li>
    </ol>
</div>

            </div>
        </div>
    );
};

export default HomePage;
