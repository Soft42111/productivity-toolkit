const Footer = () => {
  return (
    <footer className="relative mt-auto py-8 border-t-2 border-white/30 bg-transparent z-50">
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-white font-medium drop-shadow-lg">
            © {new Date().getFullYear()} Power Tools. Crafted for productivity.
          </p>
          <p className="text-xs text-white/90 drop-shadow-lg">
            Made with precision and care
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
