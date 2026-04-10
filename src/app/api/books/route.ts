export const dynamic = 'force-dynamic';

import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { resend } from "@/lib/resend";

export async function GET() {
  try {
    const books = await prisma.book.findMany({
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json(books);
  } catch {
    return NextResponse.json({ error: "Не вдалося отримати книги" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const {
      title,
      author,
      authors,
      price,
      condition,
      language,
      isbn,
      description,
      images,
      sellerEmail,
      sellerInstagram,
      contactEmail,
      contactPhone,
    } = body;

    const resolvedAuthors = author ?? authors;
    const resolvedContactEmail = contactEmail ?? sellerEmail;

    if (!title || !resolvedAuthors || !price || !condition || !resolvedContactEmail) {
      return NextResponse.json({ error: "Заповніть усі обов'язкові поля" }, { status: 400 });
    }

    const book = await prisma.book.create({
      data: {
        title,
        authors: resolvedAuthors,
        price: Number(price),
        condition,
        language: language ?? "Українська",
        isbn: isbn ?? null,
        description: description ?? null,
        contactEmail: resolvedContactEmail,
        contactPhone: contactPhone ?? null,
        images: images ?? "",
        sellerEmail: resolvedContactEmail,
        sellerInstagram: sellerInstagram ?? "not_provided",
      },
    });

    const adminEmail = process.env.ADMIN_EMAIL;
    const siteUrl = process.env.NEXT_PUBLIC_URL ?? "http://localhost:3000";
    const validateUrl = `${siteUrl}/admin?validate=${book.validationLink}`;

    if (adminEmail) {
      await resend.emails.send({
        from: "Biblion <onboarding@resend.dev>",
        to: adminEmail,
        subject: `Нова книга для перевірки: ${book.title}`,
        html: `
          <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #18181b;">Нова книга очікує перевірки</h2>
            <table style="width: 100%; border-collapse: collapse; margin-bottom: 24px;">
              <tr><td style="padding: 8px 0; color: #71717a; width: 140px;">Назва</td><td style="padding: 8px 0; font-weight: 600;">${book.title}</td></tr>
              <tr><td style="padding: 8px 0; color: #71717a;">Автор(и)</td><td style="padding: 8px 0;">${book.authors}</td></tr>
              <tr><td style="padding: 8px 0; color: #71717a;">Ціна</td><td style="padding: 8px 0;">${book.price} грн</td></tr>
              <tr><td style="padding: 8px 0; color: #71717a;">Стан</td><td style="padding: 8px 0;">${book.condition}</td></tr>
              <tr><td style="padding: 8px 0; color: #71717a;">Email продавця</td><td style="padding: 8px 0;">${book.sellerEmail}</td></tr>
              <tr><td style="padding: 8px 0; color: #71717a;">Instagram</td><td style="padding: 8px 0;">@${book.sellerInstagram}</td></tr>
            </table>
            <a href="${validateUrl}"
               style="display: inline-block; background: #18181b; color: #fff; padding: 12px 24px;
                      border-radius: 8px; text-decoration: none; font-weight: 600;">
              ✅ Підтвердити книгу
            </a>
            <p style="margin-top: 24px; color: #a1a1aa; font-size: 13px;">
              Biblion — книжковий флімаркет
            </p>
          </div>
        `,
      });
    }

    return NextResponse.json(book, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Не вдалося додати книгу" }, { status: 500 });
  }
}
