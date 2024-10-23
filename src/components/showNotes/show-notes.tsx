"use client";

import { ObjectId } from "mongoose";
import React, { useState } from "react";
import { MdDeleteOutline, MdOutlineEdit, MdSearch } from "react-icons/md";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { debounce } from "lodash";

function ShowNotes() {
  const queryClient = useQueryClient();
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState(""); // State to store search input
  const [searchInput, setSearchInput] = useState(""); // Debounced input

  // Debounce the search input to minimize re-renders
  const handleSearchChange = debounce((value) => {
    setSearchTerm(value);
  }, 500);

  // Fetching notes
  const { isLoading, isError, data } = useQuery({
    queryKey: ["notes"],
    queryFn: () => axios.get("/api/note/view-note").then((res) => res.data),
  });

  // Mutation for deleting a note
  const deleteNoteMutation = useMutation({
    mutationFn: (id: ObjectId) => {
      return axios.delete(`/api/note/delete-note?id=${id}`);
    },
    onSuccess: () => {
      // Invalidate the "notes" query to refetch the updated list
      queryClient.invalidateQueries();
      toast.success("Note deleted successfully");
    },
    onError: () => {
      toast.error("Error deleting note");
    },
  });

  // Handle delete button click
  const handleDeleteNote = (id: ObjectId) => {
    if (window.confirm("Are you sure you want to delete this note?")) {
      deleteNoteMutation.mutate(id);
    }
  };

  // Filter notes based on search term
  const filteredNotes = data?.notes?.filter((note: any) =>
    note.subjectFullname.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (isLoading) return <div>Loading...</div>;
  if (isError) return <div>Error loading notes</div>;

  return (
    <div className="relative overflow-x-auto mt-4">
      {/* Search input with icon */}
      <div className="mb-4 flex items-center justify-between">
        <input
          type="text"
          placeholder="Search by subject name"
          className="px-4 py-2 border border-gray-300 rounded-md w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={searchInput}
          onChange={(e) => {
            setSearchInput(e.target.value);
            handleSearchChange(e.target.value);
          }}
        />
        <button
          onClick={() => setSearchTerm(searchInput)}
          className="ml-2 px-4 py-2 bg-blue-500 text-white rounded-md flex items-center justify-center hover:bg-blue-600 focus:outline-none"
        >
          <MdSearch size={24} />
        </button>
      </div>

      <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
        <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
          <tr>
            <th scope="col" className="px-6 py-3">Subject Name</th>
            <th scope="col" className="px-6 py-3">Year</th>
            <th scope="col" className="px-6 py-3">Semester</th>
            <th scope="col" className="px-6 py-3">Show</th>
            <th scope="col" className="px-6 py-3">Action</th>
          </tr>
        </thead>
        <tbody>
          {filteredNotes?.length > 0 ? (
            filteredNotes.map((note: any) => (
              <tr key={note.id} className="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
                <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                  {note.subjectFullname}
                </th>
                <td className="px-6 py-4">{note.year}</td>
                <td className="px-6 py-4">{note.semister}</td>
                <td className="px-6 py-4">
                  <button className="text-blue-500 hover:underline">View</button>
                </td>
                <td className="px-6 py-4">
                  <div className="flex gap-2">
                    <button
                      onClick={() => router.push(`/admin/add-note?id=${note._id}`)}
                      className="text-blue-500 hover:underline"
                    >
                      <MdOutlineEdit size={20} />
                    </button>
                    <button
                      onClick={() => handleDeleteNote(note._id)}
                      className="text-blue-500 hover:underline"
                    >
                      <MdDeleteOutline size={20} />
                    </button>
                  </div>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td className="px-6 py-4 text-center">No notes available.</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

export default ShowNotes;
