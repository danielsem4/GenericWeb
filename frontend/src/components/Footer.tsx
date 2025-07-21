import { CONFIG } from "../config/config";

function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-background border-t border-border py-6 mt-auto">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="flex flex-col md:flex-row items-center space-y-2 md:space-y-0 md:space-x-6">
            <p className="text-sm text-muted-foreground">
              © {currentYear} {CONFIG.appName}. All rights reserved.
            </p>
            <div className="flex space-x-4 text-sm">
              <a href="#" className="text-muted-foreground hover:text-primary hover:underline">
                Privacy Policy
              </a>
              <a href="#" className="text-muted-foreground hover:text-primary hover:underline">
                Terms of Service
              </a>
              <a href={`mailto:${CONFIG.supportEmail}`} className="text-muted-foreground hover:text-primary hover:underline">
                Contact Support
              </a>
            </div>
          </div>
          <div className="mt-4 md:mt-0">
            <p className="text-sm text-muted-foreground">
              {CONFIG.appName} v{CONFIG.version}
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
