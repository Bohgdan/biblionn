"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

import BookCard from "@/components/BookCard";

type Book = {
  id: string;
  title: string;
  authors: string;
  price: number;
  condition: string;
  language: string;
  images: string;
};

function SkeletonCard() {
  return (
    <div className="overflow-hidden rounded-xl border bg-white">
      <div className="aspect-[3/4] w-full animate-pulse bg-zinc-200" />
      <div className="space-y-2 p-4">
        <div className="h-5 w-4/5 animate-pulse rounded bg-zinc-200" />
        <div className="h-4 w-3/5 animate-pulse rounded bg-zinc-200" />
        <div className="h-5 w-2/5 animate-pulse rounded bg-zinc-200" />
      </div>
    </div>
  );
}

export default function BookList() {
  const [books, setBooks] = useState<Book[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadBooks() {
      try {
        const res = await fetch("/api/books", { cache: "no-store" });
        if (!res.ok) throw new Error("Не вдалося отримати книги");
        const data = (await res.json()) as Book[];
        setBooks(data);
      } catch {
        setBooks([]);
      } finally {
        setIsLoading(false);
      }
    }

    loadBooks();
  }, []);

  if (isLoading) {
    return (
      <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
        {Array.from({ length: 8 }).map((_, index) => (
          <SkeletonCard key={index} />
        ))}
      </div>
    );
  }

  if (books.length === 0) {
    return (
      <div className="rounded-xl border bg-white p-10 text-center">
        <p className="text-lg text-zinc-700">Поки немає книг. Будь першим!</p>
        <Link href="/add" className="mt-3 inline-block font-medium text-zinc-900 underline underline-offset-4">
          Додати книгу
        </Link>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
      {books.map((book) => (
        <BookCard key={book.id} {...book} />
      ))}
    </div>
  );
}
