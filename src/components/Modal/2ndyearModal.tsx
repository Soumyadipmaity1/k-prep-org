import { FC } from 'react';
import { createPortal } from 'react-dom';
import { useRouter } from 'next/navigation';
import { FaTimes } from 'react-icons/fa';
import { denkOne } from '@/app/font';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  yearPath: string;
}

const Modal: FC<ModalProps> = ({ isOpen, onClose, title, yearPath }) => {
  const router = useRouter();

  if (!isOpen) return null;

  const navigateToScheme = (scheme: string) => {
    router.push(`${yearPath}/${scheme}`);
    onClose();
  };

  return createPortal(
    <div className={denkOne.className}>
    <div className="fixed inset-0  bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-[#f8e9f4] w-[380px] sm:w-auto rounded-lg p-8 text-center relative">
        <button
        title = "Close"
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 transition"
        >
          <FaTimes size={24} />
        </button>
        <p className=" mb-8 text-scheme sm:p-5 p-4 text-3xl">Please select your scheme.</p>
        <div className='flex justify-evenly '>         
        <div className='bg-[#fbd6ff] bg-schemeA  rounded-lg border-2 border-[#843ab1] '>        
    <button
            onClick={() => navigateToScheme('3rdSem')}
            className=" text-schemeB px-6 sm:px-8 py-4  transition"
          >
            3rd Semester
            </button></div>
<div className='bg-[#fbd6ff] bg-schemeA rounded-lg  border-2 border-[#843ab1] '>        
    <button
            onClick={() => navigateToScheme('4thSem')}
            className=" text-schemeB sm:px-8 px-6  py-4  transition"
          >
            4th Semester
          </button></div>
        </div>
      </div>
    </div>
   </div>,
    document.body
  );
};

export default Modal;
