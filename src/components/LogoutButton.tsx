"use client";

export default function LogoutButton() {
  async function handleLogout() {
    await fetch("/api/admin/logout", { method: "POST" });
    window.location.href = "/admin/login";
  }

  return (
    <button
      type="button"
      onClick={handleLogout}
      className="rounded-lg border border-[#d1c9b8] bg-white px-4 py-1.5 text-sm text-[#1a1f3c] transition-colors hover:bg-[#f8f6f1]"
    >
      Вийти
    </button>
  );
}
