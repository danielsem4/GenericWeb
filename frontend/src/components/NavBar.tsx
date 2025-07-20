const Navbar: React.FC = () => {
  return (
    <nav className="bg-gray-100 px-4 py-3 shadow-sm">
      <div className="container mx-auto flex flex-wrap items-center justify-between">
        <span className="text-xl font-bold text-black">Psychiatric</span>
        <div className="flex items-center space-x-4 text-sm text-gray-800">
          <a href="#" className="hover:underline">
            Patients
          </a>
          <a href="#" className="hover:underline">
            Medications
          </a>
          <a href="#" className="hover:underline">
            Activities
          </a>
          <span className="hidden sm:inline">Doctor6 Test1</span>
          <button className="bg-blue-500 hover:bg-blue-600 text-white text-sm px-4 py-1 rounded">
            Logout
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
