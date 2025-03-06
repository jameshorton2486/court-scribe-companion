
import React from 'react';

const Footer = () => {
  return (
    <footer className="py-6 border-t">
      <div className="container mx-auto px-4">
        <p className="text-center text-sm text-muted-foreground">
          Book Processor Application &copy; {new Date().getFullYear()} - All rights reserved
        </p>
      </div>
    </footer>
  );
};

export default Footer;
