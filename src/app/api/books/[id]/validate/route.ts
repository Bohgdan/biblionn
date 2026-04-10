export const dynamic = 'force-dynamic';

import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { resend } from "@/lib/resend";

export async function POST(req: Request) {
  try {
    const { validationLink } = await req.json();

    if (!validationLink) {
      return NextResponse.json({ error: "validationLink обов'язковий" }, { status: 400 });
    }

    const book = await prisma.book.findUnique({
      where: { validationLink },
    });

    if (!book) {
      return NextResponse.json({ error: "Книгу не знайдено" }, { status: 404 });
    }

    if (book.isValidated) {
      return NextResponse.json({ message: "Книга вже підтверджена", book });
    }

    const validated = await prisma.book.update({
      where: { validationLink },
      data: { isValidated: true },
    });

    const siteUrl = process.env.NEXT_PUBLIC_URL ?? "http://localhost:3000";
    const bookUrl = `${siteUrl}/books/${validated.id}`;

    await resend.emails.send({
      from: "Biblion <onboarding@resend.dev>",
      to: validated.sellerEmail,
      subject: "Твою книгу прийнято на Biblion!",
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #18181b;">Вітаємо! 🎉</h2>
          <p style="font-size: 16px; color: #3f3f46; line-height: 1.6;">
            Книга <strong>«${validated.title}»</strong> успішно перевірена
            і вже доступна на сайті.
          </p>
          <a href="${bookUrl}"
             style="display: inline-block; background: #18181b; color: #fff; padding: 12px 24px;
                    border-radius: 8px; text-decoration: none; font-weight: 600; margin-top: 8px;">
            Переглянути оголошення
          </a>
          <p style="margin-top: 32px; color: #a1a1aa; font-size: 13px;">
            Biblion — книжковий флімаркет
          </p>
        </div>
      `,
    });

    return NextResponse.json({ message: "Книгу підтверджено", book: validated });
  } catch {
    return NextResponse.json({ error: "Не вдалося підтвердити книгу" }, { status: 500 });
  }
}
