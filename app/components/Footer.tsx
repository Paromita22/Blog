export default function Footer() {
  return (
    <footer className="border-t border-[var(--line)] px-8 md:px-16 py-12 flex flex-col md:flex-row justify-between items-center gap-4 font-mono text-xs text-[var(--muted)] tracking-wider">
      <p>© {new Date().getFullYear()} PCJ Blogs. All thoughts untouched.</p>
      <p>Built with Next.js, Prisma, and stubbornness.</p>
    </footer>
  );
}
