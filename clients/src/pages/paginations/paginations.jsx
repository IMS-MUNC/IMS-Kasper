<div className="d-flex justify-content-between align-items-center p-3">
{/* <div>
  Showing {indexOfFirstItem + 1}-
  {Math.min(indexOfLastItem, filteredCategories.length)} of{" "}
  {filteredCategories.length}
</div> */}
<div className="d-flex justify-content-end align-items-center">
<label className="me-2">Items per page:</label>
<select
value={itemsPerPage}
onChange={(e) => {
setItemsPerPage(Number(e.target.value));
setCurrentPage(1); // reset to first page
}}
className="form-select w-auto"
>
<option value={10}>10</option>
<option value={25}>25</option>
<option value={50}>50</option>
<option value={100}>100</option>
</select>
</div>
<div>
  <button
    className="btn btn-light btn-sm me-2"
    onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
    disabled={currentPage === 1}
  >
    Prev
  </button>
  {Array.from({ length: totalPages }, (_, i) => (
    <button
      key={i}
      className={`btn btn-sm me-1 ${
        currentPage === i + 1 ? "btn-primary" : "btn-outline-primary"
      }`}
      onClick={() => setCurrentPage(i + 1)}
    >
      {i + 1}
    </button>
  ))}
  <button
    className="btn btn-light btn-sm"
    onClick={() =>
      setCurrentPage((prev) => Math.min(prev + 1, totalPages))
    }
    disabled={currentPage === totalPages}
  >
    Next
  </button>
</div>
</div>