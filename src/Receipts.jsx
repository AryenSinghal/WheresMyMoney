import './App.css';
import Sidebar from './dashboardComponenets/Sidebar';
import ReceiptsGrid from './ReceiptsGrid';
import capybara from './assets/capybara.jpg'; 
import walmartReceipt from './assets/walmartReceipt.jpg'

function Receipts() {
  const images = [
    capybara,
    walmartReceipt,
    capybara,
    capybara,
    capybara,
    capybara,
    walmartReceipt
  ];

  return (
    <>
      <Sidebar />
      <div className="bg-slate-900 min-h-screen overflow-hidden px-8"> {/* Adjusted margin/padding here */}
        <h1 className="text-white font-bold text-3xl text-left mt-18 lg:ml-15 sm:ml-16 md:ml-15 ml-15 -mb-10">
          Receipts
        </h1>
        <button className="bg-blue-500 text-white p-2 rounded-lg w-40  hover:bg-blue-600 active:bg-blue-900 float-right mr-15 ">
          Add New Receipt
        </button>
        <div className='mt-10'>
          <ReceiptsGrid images={images} />
        </div>
      </div>
    </>
  );
}

export default Receipts;
