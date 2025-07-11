import React, { useState} from "react";

// Props for Table
interface PageProps {
    className?: string; // Optional className for styling
    currentPage?: number;
    allPages: number;
    setCurrentPage: (page: number) => void;
}

const Paging: React.FC<PageProps> = ({ className, setCurrentPage, allPages, currentPage }) => {
    const [inputValue, setInputValue] = useState<string>("");

    const handlePageInput = () => {
        const targetPage = parseInt(inputValue, 10);
        if (!isNaN(targetPage) && targetPage >= 1 && targetPage <= allPages) {
            setCurrentPage(targetPage); // Update the page
            setInputValue(""); // Clear the input
        }
    };

    return (
        <div
            className={`flex flex-col md:flex-row items-center justify-between px-4 py-3 border-t border-gray-200 bg-white dark:bg-gray-800 ${className}`}
        >
            {/* Page Info */}
            <div className="text-sm text-gray-600 dark:text-gray-300 mb-2 md:mb-0">
                Page {currentPage ?? 1} of {allPages}
            </div>

            {/* Pagination Buttons */}
            <div className="flex items-center gap-2">
                {/* Previous Button */}
                <button
                    className={`px-4 py-2 text-sm font-medium border rounded-lg ${
                        currentPage === 1
                            ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                            : "bg-gray-200 hover:bg-gray-300"
                    }`}
                    disabled={(currentPage ?? 1) === 1}
                    onClick={() => setCurrentPage(Math.max(1, (currentPage ?? 1) - 1))}
                >
                    Previous
                </button>

                {/* Page Buttons */}
                {Array.from({ length: 5 })
                    .map((_, index) => (currentPage ?? 1) - 2 + index) // Create an array centered around currentPage
                    .filter((page) => page > 0 && page <= allPages) // Ensure valid page numbers
                    .map((page) => (
                        <button
                            key={page}
                            onClick={() => setCurrentPage(page)}
                            className={`px-3 py-1 text-sm font-medium border rounded ${
                                currentPage === page
                                    ? "bg-orange-400 text-white border-orange-500"
                                    : "bg-gray-200 hover:bg-gray-300 text-gray-700"
                            }`}
                        >
                            {page}
                        </button>
                    ))}

                {/* Next Button */}
                <button
                    className={`px-4 py-2 text-sm font-medium border rounded-lg ${
                        currentPage === allPages
                            ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                            : "bg-gray-200 hover:bg-gray-300"
                    }`}
                    disabled={(currentPage ?? 1) === allPages}
                    onClick={() => setCurrentPage(Math.min(allPages, (currentPage ?? 1) + 1))}
                >
                    Next
                </button>
            </div>

            {/* Page Input */}
            <div className="flex items-center gap-2 mt-2 md:mt-0">
                <input
                    type="number"
                    min="1"
                    max={allPages}
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    placeholder="Page #"
                    className="w-20 px-2 py-1 text-sm border rounded-lg dark:bg-gray-700 dark:text-gray-300"
                />
                <button
                    className="px-3 py-1 text-sm font-medium text-white bg-orange-300 hover:bg-orange-400 rounded-lg"
                    onClick={handlePageInput}
                >
                    Go
                </button>
            </div>
        </div>
    );
};

export { Paging };