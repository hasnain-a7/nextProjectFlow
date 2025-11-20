import { FaLinkedin, FaGithub } from "react-icons/fa";

const LayoutFooter = () => {
  return (
    <div>
      <footer className="w-full h-9 flex flex-wrap items-center justify-center gap-2 text-xs text-muted-foreground border-t bg-background px-2">
        <span>© {new Date().getFullYear()} Developed by Hasnain</span>

        <div className="hidden sm:flex items-center gap-2">
          <a
            href="https://www.linkedin.com/in/hasnain7"
            target="_blank"
            rel="noopener noreferrer"
            className="flex gap-1"
          >
            <FaLinkedin
              size={16}
              className="text-muted-foreground hover:text-primary cursor-pointer"
            />
            Linkedin
          </a>

          <a
            href="https://github.com/hasnain-a7"
            target="_blank"
            rel="noopener noreferrer"
            className="flex gap-1"
          >
            <FaGithub
              size={16}
              className="text-muted-foreground hover:text-primary cursor-pointer"
            />
            Repo
          </a>
        </div>
      </footer>
    </div>
  );
};

export default LayoutFooter;
