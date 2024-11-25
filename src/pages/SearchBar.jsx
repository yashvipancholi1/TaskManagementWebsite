import React from "react";

const SearchBar = ({ searchQuery, setSearchQuery, filterRole, setFilterRole, filterStatus, setFilterStatus }) => {
  return (
    <div className="flex gap-4 mb-4">
      <input
        type="text"
        placeholder="Search by name or ID"
        className="border border-gray-300 px-4 py-2 rounded w-1/3"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
      />
      <select
        className="border border-gray-300 px-4 py-2 rounded"
        value={filterRole}
        onChange={(e) => setFilterRole(e.target.value)}
      >
        <option value="All">All Roles</option>
        <option value="Read">Read</option>
        <option value="Write">Write</option>
      </select>
      <select
        className="border border-gray-300 px-4 py-2 rounded"
        value={filterStatus}
        onChange={(e) => setFilterStatus(e.target.value)}
      >
        <option value="All">All Status</option>
        <option value="Active">Active</option>
        <option value="Inactive">Inactive</option>
      </select>
    </div>
  );
};

export default SearchBar;
