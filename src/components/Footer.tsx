const Footer = () => {
  return (
    <footer className="relative mt-auto py-8 border-t border-gray-300 bg-white z-50">
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-gray-900 font-medium">
            © {new Date().getFullYear()} Power Tools. Crafted for productivity.
          </p>
          <p className="text-xs text-gray-700">
            Made with precision and care
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
