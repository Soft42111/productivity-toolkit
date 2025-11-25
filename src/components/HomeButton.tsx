import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Home } from "lucide-react";

const HomeButton = () => {
  return (
    <Link to="/" className="fixed top-6 left-6 z-50">
      <Button 
        variant="ghost" 
        size="icon"
        className="hover:bg-accent/20 hover:text-accent transition-all duration-300 hover:scale-110"
      >
        <Home className="h-5 w-5" />
      </Button>
    </Link>
  );
};

export default HomeButton;
