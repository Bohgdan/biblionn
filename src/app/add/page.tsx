"use client";

import { FormEvent, useState } from "react";

export default function AddBookPage() {
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [price, setPrice] = useState("");
  const [description, setDescription] = useState("");
  const [condition, setCondition] = useState("Добрий");
  const [contactEmail, setContactEmail] = useState("");
  const [contactPhone, setContactPhone] = useState("");
  const [imageFile, setImageFile] = useState<string | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [validationError, setValidationError] = useState("");
  const [serverError, setServerError] = useState("");

  function handleImageChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => {
      const base64 = reader.result as string;
      setImageFile(base64);
      setImagePreview(base64);
    };
    reader.readAsDataURL(file);
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setValidationError("");
    setServerError("");

    if (!title || !author || !price || !condition || !contactEmail) {
      setValidationError("Будь ласка, заповніть всі обов'язкові поля");
      return;
    }

    setIsSubmitting(true);

    try {
      let imageUrl: string | undefined;

      if (imageFile) {
        setUploading(true);
        const uploadRes = await fetch("/api/upload", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ data: imageFile }),
        });
        const uploadData = await uploadRes.json() as { url: string };
        imageUrl = uploadData.url;
        setUploading(false);
      }

      const response = await fetch("/api/books", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          author,
          price: Number(price),
          description,
          condition,
          contactEmail,
          contactPhone,
          imageUrl,
        }),
      });

      if (!response.ok) {
        throw new Error("server error");
      }

      setIsSuccess(true);
    } catch {
      setServerError("Щось пішло не так. Спробуйте ще раз.");
    } finally {
      setIsSubmitting(false);
      setUploading(false);
    }
  }

  const labelClass = "mb-2 block text-xs font-bold uppercase tracking-wide text-[#1a1f3c]";
  const inputClass =
    "w-full rounded-[8px] border border-[#d1c9b8] px-[14px] py-[10px] text-base focus:border-[#c9a84c] focus:outline-none focus:ring-0 focus:shadow-[0_0_0_3px_rgba(201,168,76,0.15)]";

  const buttonLabel = uploading
    ? "Завантаження фото..."
    : isSubmitting
    ? "Відправляємо..."
    : "Надіслати";

  return (
    <main className="px-4 py-10">
      <section className="mx-auto max-w-[640px] rounded-2xl bg-white p-8 shadow-[0_12px_32px_rgba(0,0,0,0.1)]">
        {isSuccess ? (
          <div className="py-10 text-center">
            <div className="text-5xl">✅</div>
            <h2
              className="mt-4 text-3xl text-[#1a1f3c]"
              style={{ fontFamily: '"Playfair Display", serif' }}
            >
              Дякуємо! Ваша книга на перевірці.
            </h2>
          </div>
        ) : (
          <>
            <header className="mb-8 text-center">
              <h1
                className="text-[2rem] text-[#1a1f3c]"
                style={{ fontFamily: '"Playfair Display", serif' }}
              >
                Додати книгу
              </h1>
              <p className="mt-2 text-[0.9rem] text-gray-500">
                Заповніть форму — ми перевіримо і опублікуємо
              </p>
            </header>

            <form className="space-y-5" onSubmit={handleSubmit}>
              {serverError ? (
                <div className="rounded-md bg-red-100 px-4 py-3 text-sm text-red-700">{serverError}</div>
              ) : null}
              {validationError ? <p className="text-sm text-red-600">{validationError}</p> : null}

              <div>
                <label className={labelClass} htmlFor="title">Назва книги*</label>
                <input id="title" type="text" className={inputClass} value={title} onChange={(e) => setTitle(e.target.value)} />
              </div>

              <div>
                <label className={labelClass} htmlFor="author">Автор*</label>
                <input id="author" type="text" className={inputClass} value={author} onChange={(e) => setAuthor(e.target.value)} />
              </div>

              <div>
                <label className={labelClass} htmlFor="price">Ціна (₴)*</label>
                <input id="price" type="number" min={0} className={inputClass} value={price} onChange={(e) => setPrice(e.target.value)} />
              </div>

              <div>
                <label className={labelClass} htmlFor="description">Опис</label>
                <textarea id="description" rows={4} className={inputClass} value={description} onChange={(e) => setDescription(e.target.value)} />
              </div>

              <div>
                <label className={labelClass} htmlFor="condition">Стан книги*</label>
                <select id="condition" className={inputClass} value={condition} onChange={(e) => setCondition(e.target.value)}>
                  <option value="Нова">Нова</option>
                  <option value="Як нова">Як нова</option>
                  <option value="Добрий">Добрий</option>
                  <option value="Задовільний">Задовільний</option>
                </select>
              </div>

              <div>
                <label className={labelClass} htmlFor="contactEmail">Контактний email*</label>
                <input id="contactEmail" type="email" className={inputClass} value={contactEmail} onChange={(e) => setContactEmail(e.target.value)} />
              </div>

              <div>
                <label className={labelClass} htmlFor="contactPhone">Контактний телефон</label>
                <input id="contactPhone" type="text" className={inputClass} value={contactPhone} onChange={(e) => setContactPhone(e.target.value)} />
              </div>

              <div>
                <label className={labelClass} htmlFor="image">Фото книги</label>
                <input
                  id="image"
                  type="file"
                  accept="image/*"
                  className="w-full cursor-pointer rounded-[8px] border border-[#d1c9b8] px-[14px] py-[10px] text-base text-gray-600 file:mr-4 file:cursor-pointer file:rounded-md file:border-0 file:bg-[#1a1f3c] file:px-3 file:py-1 file:text-sm file:text-white"
                  onChange={handleImageChange}
                />
                {imagePreview ? (
                  <div className="mt-3">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={imagePreview}
                      alt="Попередній перегляд"
                      style={{ height: "200px", width: "100%", objectFit: "cover", borderRadius: "8px" }}
                    />
                  </div>
                ) : null}
              </div>

              <button
                type="submit"
                disabled={isSubmitting || uploading}
                className="w-full rounded-[8px] bg-[#1a1f3c] px-4 py-[14px] text-base uppercase tracking-[0.05em] text-white transition-all duration-200 hover:bg-[#c9a84c] hover:text-[#1a1f3c] disabled:cursor-not-allowed disabled:opacity-70"
              >
                {buttonLabel}
              </button>
            </form>
          </>
        )}
      </section>
    </main>
  );
}
