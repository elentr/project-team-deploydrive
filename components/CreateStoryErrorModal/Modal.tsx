"use client";
import React from "react";


export function Modal({ open, title, description, onClose }: { open: boolean; title: string; description?: string; onClose: () => void; }) {
if (!open) return null;
return (
<div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
<div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl">
<h3 className="text-lg font-semibold">{title}</h3>
{description ? <p className="mt-2 text-sm text-neutral-600">{description}</p> : null}
<div className="mt-6 flex justify-end gap-3">
<button onClick={onClose} className="rounded-xl border px-4 py-2 text-sm hover:bg-neutral-50">Закрити</button>
</div>
</div>
</div>
);
}