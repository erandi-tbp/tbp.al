export const AdminFooter = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-bg-secondary border-t border-border py-4 px-6 fixed bottom-0 right-0 left-72 z-20">
      <div className="flex items-center justify-between text-sm text-text-secondary font-body">
        <p>
          © {currentYear} Trusted Business Partners. All rights reserved.
        </p>
        <p>
          Made with ❤️ by TBP
        </p>
      </div>
    </footer>
  );
};
