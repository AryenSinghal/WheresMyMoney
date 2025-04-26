import './App.css';
import Sidebar from './dashboardComponents/Sidebar';
import ReceiptsGrid from './ReceiptsGrid';

function Receipts() {
  const receipts = [
    { location: "Walmart", price: "$20.00" },
    { location: "Target", price: "$35.50" },
    { location: "Best Buy", price: "$120.75" },
    { location: "Amazon", price: "$10.99" },
    { location: "Costco", price: "$45.30" },
    { location: "eBay", price: "$15.00" },
    { location: "Home Depot", price: "$200.50" }
  ];

  return (
    <>
      <Sidebar />
      <div className="bg-slate-900 min-h-screen overflow-hidden px-8"> {/* Adjusted margin/padding here */}
        <h1 className="text-white font-bold text-3xl text-left mt-18 lg:ml-15 sm:ml-16 md:ml-15 ml-15 -mb-10">
          Receipts
        </h1>
        <button className="bg-[#8200DB] text-white p-2 rounded-lg transition-all duration-300 ease-in-out hover:bg-[#6a00b3] active:bg-[#5900a1] w-40 float-right mr-15">
          Add New Receipt
        </button>
        <div className='mt-10'>
          <ReceiptsGrid receipts={receipts} />
        </div>
      </div>
    </>
  );
}

export default Receipts;
