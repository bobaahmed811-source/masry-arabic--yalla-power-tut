import React from 'react';

export default function KidsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <main className="bg-kids-bg">{children}</main>;
}
