"use client";

import { useState, useEffect, useCallback } from "react";
import type { NextPage } from "next";
import React from "react";
import Image from "next/image";

interface CardProps {
  title: string;
  imageSrc: string;
  description: string;
  pdflink: string;
}

const Card: React.FC<CardProps> = ({
  title,
  imageSrc,
  description,
  pdflink,
}) => {
  const handleOpenPdf = () => {
    window.open(pdflink, "_blank");
  };

  return (
    <div className="bg-recommended rounded-xl shadow-lg flex flex-col justify-center sm:p-4 p-2 w-48 sm:w-60 mx-2">
      <div className="h-48 w-full bg-gray-200 rounded-md mb-4 relative">
        <Image
          src={imageSrc}
          alt={title}
          layout="fill"
          className="rounded-md"
          objectFit="cover"
        />
      </div>
      <h2 className="sm:text-xl font-bold text-base mb-2">{title}</h2>
      <p className="text-gray-700 text-sm sm:text-base mb-4">{description}</p>
      <a
        onClick={handleOpenPdf}
        className="bg-[#843ab1] text-white sm:px-4 py-1 rounded-full hover:bg-[#b864c8] text-center transition duration-500 cursor-pointer"
      >
        Open PDF
      </a>
    </div>
  );
};

interface Note {
  subjectFullName: string;
  subjectsortname: string;
  pdflink: string;
  credit: string;
}

const fetchNotes = async (year: number): Promise<Note[]> => {
  const response = await fetch(`/api/note/view-note?year=${year}`);
  if (!response.ok) {
    throw new Error("Failed to fetch notes");
  }
  const data = await response.json();
  return data.notes;
};

const Home = ({ year }: { year: number }) => {
  const [notes, setNotes] = useState<Note[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchAndSetNotes = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const fetchedNotes = await fetchNotes(year);
      setNotes(fetchedNotes);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "An unknown error occurred"
      );
    } finally {
      setLoading(false);
    }
  }, [year]); // Ensure year is included in dependencies

  useEffect(() => {
    fetchAndSetNotes();
  }, [fetchAndSetNotes]);

  return (
    <div
      className="w-auto h-full overflow-x-auto border py-5 rounded-xl border-gray-300"
      style={{ scrollbarWidth: "none" }}
    >
      <div className="bg-[#f8e9f48c] sm:h-96 sm:py-5 flex items-center">
        <main className="flex space-x-4">
          {loading && <p>Loading...</p>}
          {error && <p className="text-red-500">{error}</p>}
          {notes.length === 0 ? "No Record" : notes.slice(0, 3).map((item, index) => (
            <Card
              key={index}
              title={item.subjectFullName}
              imageSrc="" // Replace with actual image path if available
              description={`${item.subjectsortname} (credit: ${item.credit})`}
              pdflink={item.pdflink}
            />
          ))}
        </main>
      </div>
    </div>
  );
};

export default Home;
