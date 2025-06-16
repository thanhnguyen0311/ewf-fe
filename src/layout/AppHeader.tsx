import React, {useContext, useEffect, useRef, useState} from "react";

import { Link } from "react-router";
import { useSidebar } from "../context/SidebarContext";
import { ThemeToggleButton } from "../components/common/ThemeToggleButton";
import NotificationDropdown from "../components/header/NotificationDropdown";
import UserDropdown from "../components/header/UserDropdown";
import {AuthContext} from "../context/AuthContext";


const AppHeader: React.FC = () => {
  const [isApplicationMenuOpen, setApplicationMenuOpen] = useState(false);
  const auth = useContext(AuthContext);
  const [inputValue, setInputValue] = useState(""); // Store input value
  const [isSearchActive, setIsSearchActive] = useState(false);
  const [filteredResults, setFilteredResults] = useState<any[]>([]); // Store filtered results
  const [products, setProducts] = useState<any[]>([]); // Store product list
  const [loading, setLoading] = useState(true); // Track loading status
  const debounceTimer = useRef<NodeJS.Timeout | null>(null); // Ref for debouncing
  const [visibleProducts, setVisibleProducts] = useState<any[]>([]); // State for visible products
  const [page, setPage] = useState(0); // Current page or batch index
  const productsPerPage = 10; // Products to load per scroll

  const { isMobileOpen, toggleSidebar, toggleMobileSidebar } = useSidebar();

  const handleToggle = () => {
    if (window.innerWidth >= 991) {
      toggleSidebar();
    } else {
      toggleMobileSidebar();
    }
  };



  const toggleApplicationMenu = () => {
    setApplicationMenuOpen(!isApplicationMenuOpen);
  };

  // Fetch product data
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch(`${process.env.REACT_APP_API_URL}/api/v1/product/search/all`);
        if (!response.ok) {
          throw new Error("Failed to fetch product list.");
        }
        const data = await response.json();
        setProducts(data); // Save fetched data
        setLoading(false);
      } catch (err: any) {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setInputValue(value); // Update input value
    setIsSearchActive(true);

    if (debounceTimer.current) {
      clearTimeout(debounceTimer.current);
    }

    debounceTimer.current = setTimeout(() => {
      filterProducts(value);
    }, 300);
  };

  const filterProducts = (value: string) => {
    if (value.trim() === "") {
      setFilteredResults([]); // Reset if input is empty
      setVisibleProducts([]); // Clear visible products
      setPage(0); // Reset page
      return;
    }

    const results = products.filter((product) =>
        product.sku.toLowerCase().includes(value.toLowerCase()) ||
        product.finish?.toLowerCase().includes(value.toLowerCase())
    );

    setFilteredResults(results); // Update filtered results
    setVisibleProducts(results.slice(0, productsPerPage)); // Display the first batch
    setPage(0); // Reset page index for scrolling
  };

  // Load more products for infinite scroll
  const loadMoreProducts = () => {
    const nextPage = page + 1;
    const nextProducts = filteredResults.slice(
        0,
        (nextPage + 1) * productsPerPage
    );

    setVisibleProducts(nextProducts); // Append next batch of products
    setPage(nextPage); // Update page
  };

  // Handle scroll event
  const handleScroll = (e: React.UIEvent<HTMLUListElement>) => {
    const bottom =
        e.currentTarget.scrollHeight - e.currentTarget.scrollTop <=
        e.currentTarget.clientHeight;
    if (bottom) {
      loadMoreProducts(); // Load more when scrolling to the bottom
    }
  };

  return (
    <header className="sticky top-0 flex z-1 w-full bg-white border-gray-200 dark:border-gray-800 dark:bg-gray-900 lg:border-b">

      <div className="flex flex-col items-center justify-between flex-grow lg:flex-row lg:px-6">
        <div className="flex items-center justify-between w-full gap-2 px-3 py-3 border-b border-gray-200 dark:border-gray-800 sm:gap-4 lg:justify-normal lg:border-b-0 lg:px-0 lg:py-4">
          <button
            className="items-center justify-center w-10 h-10 text-gray-500 border-gray-200 rounded-lg z-99999 dark:border-gray-800 lg:flex dark:text-gray-400 lg:h-11 lg:w-11 lg:border"
            onClick={handleToggle}
            aria-label="Toggle Sidebar"
          >
            {isMobileOpen ? (
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M6.21967 7.28131C5.92678 6.98841 5.92678 6.51354 6.21967 6.22065C6.51256 5.92775 6.98744 5.92775 7.28033 6.22065L11.999 10.9393L16.7176 6.22078C17.0105 5.92789 17.4854 5.92788 17.7782 6.22078C18.0711 6.51367 18.0711 6.98855 17.7782 7.28144L13.0597 12L17.7782 16.7186C18.0711 17.0115 18.0711 17.4863 17.7782 17.7792C17.4854 18.0721 17.0105 18.0721 16.7176 17.7792L11.999 13.0607L7.28033 17.7794C6.98744 18.0722 6.51256 18.0722 6.21967 17.7794C5.92678 17.4865 5.92678 17.0116 6.21967 16.7187L10.9384 12L6.21967 7.28131Z"
                  fill="currentColor"
                />
              </svg>
            ) : (
              <svg
                width="16"
                height="12"
                viewBox="0 0 16 12"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M0.583252 1C0.583252 0.585788 0.919038 0.25 1.33325 0.25H14.6666C15.0808 0.25 15.4166 0.585786 15.4166 1C15.4166 1.41421 15.0808 1.75 14.6666 1.75L1.33325 1.75C0.919038 1.75 0.583252 1.41422 0.583252 1ZM0.583252 11C0.583252 10.5858 0.919038 10.25 1.33325 10.25L14.6666 10.25C15.0808 10.25 15.4166 10.5858 15.4166 11C15.4166 11.4142 15.0808 11.75 14.6666 11.75L1.33325 11.75C0.919038 11.75 0.583252 11.4142 0.583252 11ZM1.33325 5.25C0.919038 5.25 0.583252 5.58579 0.583252 6C0.583252 6.41421 0.919038 6.75 1.33325 6.75L7.99992 6.75C8.41413 6.75 8.74992 6.41421 8.74992 6C8.74992 5.58579 8.41413 5.25 7.99992 5.25L1.33325 5.25Z"
                  fill="currentColor"
                />
              </svg>
            )}
            {/* Cross Icon */}
          </button>


          <button
            onClick={toggleApplicationMenu}
            className="flex items-center justify-center w-10 h-10 text-gray-700 rounded-lg z-99999 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800 lg:hidden"
          >
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M5.99902 10.4951C6.82745 10.4951 7.49902 11.1667 7.49902 11.9951V12.0051C7.49902 12.8335 6.82745 13.5051 5.99902 13.5051C5.1706 13.5051 4.49902 12.8335 4.49902 12.0051V11.9951C4.49902 11.1667 5.1706 10.4951 5.99902 10.4951ZM17.999 10.4951C18.8275 10.4951 19.499 11.1667 19.499 11.9951V12.0051C19.499 12.8335 18.8275 13.5051 17.999 13.5051C17.1706 13.5051 16.499 12.8335 16.499 12.0051V11.9951C16.499 11.1667 17.1706 10.4951 17.999 10.4951ZM13.499 11.9951C13.499 11.1667 12.8275 10.4951 11.999 10.4951C11.1706 10.4951 10.499 11.1667 10.499 11.9951V12.0051C10.499 12.8335 11.1706 13.5051 11.999 13.5051C12.8275 13.5051 13.499 12.8335 13.499 12.0051V11.9951Z"
                fill="currentColor"
              />
            </svg>
          </button>
          {!loading &&
          <div className="lg:block">
            <form>
              <div className="relative">
                <span className="absolute -translate-y-1/2 pointer-events-none left-4 top-1/2">
                  <svg
                    className="fill-gray-500 dark:fill-gray-400"
                    width="20"
                    height="20"
                    viewBox="0 0 20 20"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      fillRule="evenodd"
                      clipRule="evenodd"
                      d="M3.04175 9.37363C3.04175 5.87693 5.87711 3.04199 9.37508 3.04199C12.8731 3.04199 15.7084 5.87693 15.7084 9.37363C15.7084 12.8703 12.8731 15.7053 9.37508 15.7053C5.87711 15.7053 3.04175 12.8703 3.04175 9.37363ZM9.37508 1.54199C5.04902 1.54199 1.54175 5.04817 1.54175 9.37363C1.54175 13.6991 5.04902 17.2053 9.37508 17.2053C11.2674 17.2053 13.003 16.5344 14.357 15.4176L17.177 18.238C17.4699 18.5309 17.9448 18.5309 18.2377 18.238C18.5306 17.9451 18.5306 17.4703 18.2377 17.1774L15.418 14.3573C16.5365 13.0033 17.2084 11.2669 17.2084 9.37363C17.2084 5.04817 13.7011 1.54199 9.37508 1.54199Z"
                      fill=""
                    />
                  </svg>
                </span>

                {/* Search Input */}

                <div className="relative">
                  <input
                      type="text"
                      value={inputValue}
                      onChange={handleInputChange}
                      placeholder="Search products..."
                      className="dark:bg-dark-900 h-11 w-full rounded-lg border border-gray-200 bg-transparent py-2.5 pl-12 pr-14 text-sm text-gray-800 shadow-theme-xs placeholder:text-gray-400 focus:border-brand-300 focus:outline-none focus:ring focus:ring-brand-500/10 dark:border-gray-800 dark:bg-gray-900 dark:bg-white/[0.03] dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-brand-800 xl:w-[430px]"
                  />
                  {inputValue && (
                      <button
                          className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 dark:text-white/50"
                          aria-label="Clear search"
                          onClick={() => {
                            setInputValue("");
                            setFilteredResults([]);
                          }}
                      >
                        ✕
                      </button>
                  )}

                  {/* Results Dropdown */}
                  {isSearchActive && filteredResults.length > 0 && (
                      <ul
                          className="absolute z-50 mt-1 w-full max-h-60 overflow-auto rounded-lg border border-gray-200 bg-white shadow-lg dark:border-gray-700 dark:bg-gray-800"
                          onScroll={handleScroll} // Bind scroll event for infinite scroll
                      >
                        {visibleProducts.map((product) => (
                            <Link to={`/product/${product.sku}`}>
                              <li
                                key={product.sku}
                                onClick={() => {
                                  setIsSearchActive(false); // Close the dropdown
                                  setFilteredResults([]);  // Optional: Clear the filtered results
                                }}
                                className="flex items-center gap-4 p-2 text-sm text-gray-800 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700"
                            >
                                {/* Product Details */}
                                  <img
                                      src={product.image}
                                      alt={product.sku}
                                      className="w-12 h-12 object-cover rounded-md" // Resized to 12x12 pixels
                                      loading="lazy"
                                  />
                                  <p className="font-medium">{product.sku}</p>
                                  <p className="text-xs text-gray-500 dark:text-gray-400">
                                    {product.finish || ""}
                                  </p>
                                  <p className="text-xs text-gray-500 dark:text-gray-400">
                                    Price: ${product.price?.toFixed(2) || "0.00"}
                                  </p>
                              </li>
                            </Link>
                        ))}
                      </ul>
                  )}

                  {/* Empty State */}
                  {isSearchActive && inputValue && filteredResults.length === 0 && (
                      <div className="absolute z-50 mt-1 w-full rounded-lg border border-gray-200 bg-white p-2 text-sm text-gray-500 shadow-lg dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300">
                        No matching products found.
                      </div>
                  )}
                </div>

              </div>
            </form>
          </div>}
        </div>
        <div
          className={`${
            isApplicationMenuOpen ? "flex" : "hidden"
          } items-center justify-between w-full gap-4 px-5 py-4 lg:flex shadow-theme-md lg:justify-end lg:px-0 lg:shadow-none`}
        >
          <div className="flex items-center gap-2 2xsm:gap-3">

            <ThemeToggleButton />
            {auth?.isLoggedIn &&
                <NotificationDropdown />
            }
          </div>
          {/* <!-- User Area --> */}
          {auth?.isLoggedIn &&
              <UserDropdown />
          }
        </div>
      </div>
    </header>
  );
};

export default AppHeader;
