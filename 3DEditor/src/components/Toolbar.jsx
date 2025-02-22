const Toolbar = ({ undo, unselect }) => {
  return (
    <div className="absolute top-2 right-2 bg-gray-800 p-4 rounded-lg shadow-lg text-white">
      <button
        className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded mr-2"
        onClick={undo}
      >
        Undo
      </button>
      <button
        className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded"
        onClick={unselect}
      >
        Unselect
      </button>
    </div>
  );
};

export default Toolbar;
