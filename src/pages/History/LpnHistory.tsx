
import React, {useEffect, useState} from "react";
import {getLPNLog} from "../../api/logApiService";
import {useErrorHandler} from "../../hooks/useErrorHandler";
import {LPNLog} from "../../interfaces/Log";
import Loader from "../UiElements/Loader/Loader";


const LpnHistory = () => {

    const [logs, setLogs] = useState<LPNLog[]>([]); // State to store fetched logs
    const [currentPage, setCurrentPage] = useState(0); // Current page for pagination
    const handleError = useErrorHandler();
    const [loading, setLoading] = useState<boolean>(false);

    // Fetch logs for the current page.
    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                const data = await getLPNLog(currentPage);
                setLogs(data);
            } catch (error) {
                handleError(error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [currentPage, handleError]); // Re-fetch when `currentPage` changes

    // Handle pagination
    const handleNext = () => {
        setCurrentPage(currentPage + 1);
    };

    const handlePrev = () => {
        if (currentPage > 0) setCurrentPage(currentPage - 1);
    };


    return (
        <div className="p-4">
            <h2 className="text-lg font-bold mb-4">LPN Logs</h2>

            {/* Logs Table */}
            <Loader isLoading={loading}>
                <table className="min-w-full table-auto border-collapse border border-gray-300">
                    <thead>
                    <tr className="bg-gray-100">
                        <th className="border border-gray-300 px-4 py-2">User</th>
                        <th className="border border-gray-300 px-4 py-2">Tag ID</th>
                        <th className="border border-gray-300 px-4 py-2">SKU</th>
                        <th className="border border-gray-300 px-4 py-2">Method</th>
                        <th className="border border-gray-300 px-4 py-2">Message</th>
                        <th className="border border-gray-300 px-4 py-2">Date</th>
                    </tr>
                    </thead>
                    <tbody>
                    {logs.map((log, index) => (
                        <tr key={index} className="text-center">
                            <td className="border border-gray-300 px-4 py-2 text-sm font-medium text-gray-800 dark:text-white/90">{log.user}</td>
                            <td className="border border-gray-300 px-4 py-2 text-sm font-medium text-gray-800 dark:text-white/90">{log.tagID}</td>
                            <td className="border border-gray-300 px-4 py-2 text-sm font-medium text-gray-800 dark:text-white/90">{log.sku}</td>
                            <td className="border border-gray-300 px-4 py-2 text-sm font-medium text-gray-800 dark:text-white/90">{log.method}</td>
                            <td className="border border-gray-300 px-4 py- text-sm font-medium text-gray-800 dark:text-white/902">{log.message}</td>
                            <td className="border border-gray-300 px-4 py-2 text-sm font-medium text-gray-800 dark:text-white/90">{log.logDate}</td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            </Loader>


            {/* Pagination Controls */}
            <div className="flex justify-between items-center mt-4">
                <button
                    onClick={handlePrev}
                    disabled={currentPage === 0}
                    className={`px-4 py-2 text-sm font-medium rounded ${
                        currentPage === 0
                            ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                            : "bg-blue-500 text-white hover:bg-blue-600"
                    }`}
                >
                    Previous
                </button>


                <button
                    onClick={handleNext}
                    disabled={logs.length < 30}
                    className={`px-4 py-2 text-sm font-medium rounded ${
                        logs.length < 30
                            ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                            : "bg-blue-500 text-white hover:bg-blue-600"
                    }`}
                >
                    Next
                </button>
            </div>
        </div>
    );
}

export default LpnHistory;

