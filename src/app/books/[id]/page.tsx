import Link from "next/link";

type Book = {
  id: string;
  title: string;
  author?: string;
  authors?: string;
  price: number;
  condition: string;
  description?: string | null;
  contactEmail?: string | null;
  contactPhone?: string | null;
};

function getConditionStyles(condition: string) {
  if (condition === "Нова") return { background: "#dcfce7", color: "#166534" };
  if (condition === "Як нова") return { background: "#dbeafe", color: "#1e40af" };
  if (condition === "Добрий") return { background: "#fef9c3", color: "#854d0e" };
  if (condition === "Задовільний") return { background: "#fee2e2", color: "#991b1b" };
  return { background: "#f3f4f6", color: "#374151" };
}

async function getBook(id: string): Promise<Book | null> {
  const baseUrl = process.env.NEXT_PUBLIC_URL || 'https://biblionn.vercel.app';
  const response = await fetch(`${baseUrl}/api/books/${id}`, { cache: 'no-store' });
  if (!response.ok) return null;
  return (await response.json()) as Book;
}

export default async function BookPage({ params }: { params: { id: string } }) {
  const book = await getBook(params.id);

  if (!book) {
    return (
      <main className="px-4 py-16 text-center">
        <h1 className="text-2xl text-[#1a1f3c]" style={{ fontFamily: '"Playfair Display", serif' }}>
          Книгу не знайдено
        </h1>
        <Link href="/" className="mt-4 inline-block text-[#1a1f3c] underline hover:no-underline">
          Повернутися до каталогу
        </Link>
      </main>
    );
  }

  const author = book.author ?? book.authors ?? "Невідомий автор";
  const badgeStyles = getConditionStyles(book.condition);

  return (
    <main className="bg-[#f5f0e8] px-4 py-8">
      <div className="mx-auto w-full max-w-[900px]">
        <Link
          href="/"
          className="mb-5 inline-block text-[0.9rem] text-[#1a1f3c] no-underline hover:underline"
        >
          ← Повернутися до каталогу
        </Link>

        <article className="flex flex-col gap-8 rounded-2xl bg-white p-8 shadow-[0_12px_32px_rgba(0,0,0,0.1)] md:flex-row">
          <section className="md:basis-[280px] md:shrink-0">
            <div className="flex h-[380px] items-center justify-center rounded-xl bg-[#1a1f3c] text-[5rem]">
              📖
            </div>
            <div
              className="mt-4 inline-block rounded-full px-3 py-1 text-[0.8rem] font-semibold"
              style={{ backgroundColor: badgeStyles.background, color: badgeStyles.color }}
            >
              {book.condition}
            </div>
          </section>

          <section className="flex-1">
            <h1
              className="mb-1 text-[2rem] text-[#1a1f3c]"
              style={{ fontFamily: '"Playfair Display", serif' }}
            >
              {book.title}
            </h1>
            <p className="mb-6 text-base text-[#6b7280]">Автор: {author}</p>
            <div className="border-t border-[#e5e0d8]" />

            <p className="my-4 text-[2.5rem] font-bold text-[#c9a84c]">{book.price} грн</p>

            {book.description ? (
              <div className="mb-6">
                <p className="mb-2 text-xs font-semibold uppercase tracking-[0.08em] text-[#1a1f3c]">
                  Про книгу
                </p>
                <p className="leading-[1.7] text-[#374151]">{book.description}</p>
              </div>
            ) : null}

            <div className="mt-6 border-l-[3px] border-[#c9a84c] pl-4">
              <h2 className="mb-2 font-semibold text-[#1a1f3c]">Зв&apos;язатися з продавцем</h2>
              {book.contactEmail || book.contactPhone ? (
                <>
                  {book.contactEmail ? (
                    <a href={`mailto:${book.contactEmail}`} className="block text-[#c9a84c] hover:underline">
                      {book.contactEmail}
                    </a>
                  ) : null}
                  {book.contactPhone ? (
                    <a href={`tel:${book.contactPhone}`} className="mt-1 block text-[#374151] hover:underline">
                      {book.contactPhone}
                    </a>
                  ) : null}
                  {book.contactEmail ? (
                    <a
                      href={`mailto:${book.contactEmail}`}
                      className="mt-4 block rounded-lg bg-[#1a1f3c] px-6 py-3 text-center text-white no-underline transition-all duration-200 hover:bg-[#c9a84c] hover:text-[#1a1f3c]"
                    >
                      Написати повідомлення
                    </a>
                  ) : null}
                </>
              ) : (
                <p className="italic text-[#6b7280]">Контактні дані не вказані</p>
              )}
            </div>
          </section>
        </article>
      </div>
    </main>
  );
}
