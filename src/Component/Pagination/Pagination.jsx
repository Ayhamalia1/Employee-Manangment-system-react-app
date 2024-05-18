import React, { useState } from 'react';
import ReactPaginate from 'react-paginate';
export default function ({handlePageChange,PagesCount}) {
  return (
   <>
   <ReactPaginate
   previousLabel={<svg  xmlns="http://www.w3.org/2000/svg" width={24} height={24} viewBox="0 0 24 24" fill="none">
   <path d="M15.375 5.25L8.625 12L15.375 18.75" stroke="#9A9A9A" strokeWidth="2.25" strokeLinecap="round" strokeLinejoin="round" />
 </svg>}
   nextLabel={<svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} viewBox="0 0 24 24" fill="none">
   <path d="M8.625 18.75L15.375 12L8.625 5.25" stroke="#9A9A9A" strokeWidth="2.25" strokeLinecap="round" strokeLinejoin="round" />
 </svg>}
 breakLabel={<svg  xmlns="http://www.w3.org/2000/svg" height="1em" viewBox="0 0 448 512"><path d="M8 256a56 56 0 1 1 112 0A56 56 0 1 1 8 256zm160 0a56 56 0 1 1 112 0 56 56 0 1 1 -112 0zm216-56a56 56 0 1 1 0 112 56 56 0 1 1 0-112z"/></svg>}
 pageCount={PagesCount}
 marginPagesDisplayed={2}
 onPageChange={handlePageChange}
 containerClassName={'pagination Pagination'}
 pageClassName={'page-item '}
 pageLinkClassName={'page-link'}
 previousClassName={'page-link'}
 nextClassName={'page-link'}
 breakClassName={'page-link'}
 activeClassName={'active'}
activeLinkClassName={'active'}

   />
   </>
  )
}
