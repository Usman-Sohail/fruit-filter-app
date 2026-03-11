interface Props {
  currentPage: number;
  totalItems: number;
  pageSize: number;
  pageSizeOption: string;
  onPageChange: (page: number) => void;
  onPageSizeChange: (pageSize: string) => void;
}

const PAGE_SIZE_OPTIONS = [
  { value: "10", label: "10" },
  { value: "20", label: "20" },
  { value: "50", label: "50" },
  { value: "all", label: "All" },
];

export default function Pagination({
  currentPage,
  totalItems,
  pageSize,
  pageSizeOption,
  onPageChange,
  onPageSizeChange,
}: Props) {
  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));

  if (totalItems === 0) return null;

  const startItem = (currentPage - 1) * pageSize + 1;
  const endItem = Math.min(currentPage * pageSize, totalItems);

  return (
    <nav className="pagination" aria-label="Pagination">
      <div className="pagination-meta">
        <p className="pagination-summary">
          Showing {startItem}-{endItem} of {totalItems}
        </p>
        <label className="pagination-size">
          <span>Items per page</span>
          <select value={pageSizeOption} onChange={(e) => onPageSizeChange(e.target.value)}>
            {PAGE_SIZE_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </label>
      </div>
      <div className="pagination-controls">
        <button
          type="button"
          className="pagination-btn"
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
        >
          Previous
        </button>
        <span className="pagination-page">
          Page {currentPage} of {totalPages}
        </span>
        <button
          type="button"
          className="pagination-btn"
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
        >
          Next
        </button>
      </div>
    </nav>
  );
}
