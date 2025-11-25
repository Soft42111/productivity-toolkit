const Footer = () => {
  return (
    <footer className="mt-auto py-8 border-t border-border backdrop-blur-sm">
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-white drop-shadow-lg">
            © {new Date().getFullYear()} Power Tools. Crafted for productivity.
          </p>
          <p className="text-xs text-white drop-shadow-lg">
            Made with precision and care
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
