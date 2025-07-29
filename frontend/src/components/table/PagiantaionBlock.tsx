import { usePaginationStore } from "../../common/store/PaginationStore";

// Simple pagination block component
// This component can be used to control pagination in tables or lists

export const PaginationBlock = () => {
  const { page, pageSize, totalItems, setPage, setPageSize } =
    usePaginationStore();

  const totalPages = Math.ceil(totalItems / pageSize);

  return (
    <div className="flex items-center gap-4">
      <button disabled={page === 1} onClick={() => setPage(page - 1)}>
        Previous
      </button>
      <span>
        Page {page} of {totalPages}
      </span>
      <button disabled={page === totalPages} onClick={() => setPage(page + 1)}>
        Next
      </button>

      <select
        value={pageSize}
        onChange={(e) => setPageSize(Number(e.target.value))}
      >
        {[10, 20, 50].map((size) => (
          <option key={size} value={size}>
            {size} / page
          </option>
        ))}
      </select>
    </div>
  );
};