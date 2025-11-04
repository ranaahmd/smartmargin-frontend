import tocat from '../../../assets/tocat.png';
import bear from '../../../assets/bear.png'
import AOS from 'aos';
import 'aos/dist/aos.css';
import { useNavigate } from 'react-router-dom';
// heros part and all the style part was inspierd and copied from 
//  https://youtu.be/FalSgrYdrzc?si=ukeJovGdP1HnN4kC
export default function Heros() { 
  const navigate = useNavigate();
  
  AOS.init({
    duration: 1000, 
    once: true, 
  });
   
  const handleButtonClick = () => {
    const productsSection = document.getElementById('products-section');
    if (productsSection) {
      productsSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleNotesButtonClick = () => {
    navigate('/notes');
  };
  
  return (
  <body className="bg-[#2d2d2d] m-0 p-0 w-full min-h-screen overflow-x-hidden border-0 border-none">
      <section className='min-h-screen flex flex-col md:flex-row items-center justify-center pt-20 px-4 md:px-8 overflow-hidden gap-8'>
        <div
          data-aos='zoom-in' 
          data-aos-duration='1500'
          className='relative w-full max-w-2xl rounded-2xl shadow-2xl flex flex-col items-center justify-between overflow-hidden p-8 bg-amber-200'
        >
          <div className='w-full text-center md:text-left space-y-6 z-10 border-0 border-none'>
            <p 
              data-aos='fade-down'
              data-aos-delay='300'
              data-aos-easing="ease-out-cubic" 
              //this line is appers is small name in the cards
              className='uppercase tracking-widest text-[#8b5e34] font-semibold'> Product</p>
            
            <div data-aos='fade-right' data-aos-delay='500'>
              <h1 className='text-4xl md:text-5xl font-extrabold text-gray-900 leading-tight'>Be Smart {""}
                <span 
                  data-aos='fade-right'
                  data-aos-delay='700'
                  // just for design
                  className='text-[#b6723c] block md:inline' >Make some profit!</span> 
              </h1>
            </div>
            
            <p
              data-aos='fade-up'
              data-aos-delay='900'
              className='text-gray-600 text-lg'
            >
              I believe delicious, high-quality food should be accessible. My smart pricing reflects that promise.
            </p>
            
            <div data-aos='flip-up' data-aos-delay='1100'>
              <button 
                onClick={handleButtonClick}
                className='bg-[#2d2d2d] text-white px-8 py-3 rounded-full hover:bg-[#444] transition-all duration-300 hover:scale-105 shadow-lg mt-4'
              >
                Smart Pricing Now 
              </button>
            </div>
          </div>
        </div>
        
        <div 
          data-aos='fade-left'
          data-aos-delay='700'
          data-aos-duration='1500'
          data-aos-easing='ease-out-cubic'
          className='relative w-full max-w-md'
        >
          <img
            src={tocat} 
            alt='Cat'
            className='w-[350px] md:w-[660px] md:h-[740px] object-contain drop-shadow-2xl animate-ping-float'
          />
        </div>
      </section>

      <section className='min-h-screen flex flex-col md:flex-row items-center justify-center px-4 md:px-8 overflow-hidden gap-8'>
        <div
          data-aos='zoom-in' 
          data-aos-duration='1500'
          className='relative w-full max-w-2xl rounded-2xl shadow-2xl flex flex-col items-center justify-between overflow-hidden p-8 bg-amber-200'
        >
          <div className='w-full text-center md:text-left space-y-6 z-10 border-0 border-none'>
            <p 
              data-aos='fade-down'
              data-aos-delay='300'
              data-aos-easing="ease-out-cubic" 
              className='uppercase tracking-widest text-[#8b5e34] font-semibold'
            > 
              Notes
            </p>
            
            <div data-aos='fade-right' data-aos-delay='500'>
              <h1 className='text-4xl md:text-5xl font-extrabold text-gray-900 leading-tight'>
                Take notes {""}
                <span 
                  data-aos='fade-right'
                  data-aos-delay='700'
                  className='text-[#b6723c] block md:inline'
                >
                  Don't be lazy
                </span>
              </h1>
            </div>
            
            <p
              data-aos='fade-up'
              data-aos-delay='900'
              className='text-gray-600 text-lg'
            >
              As a part-time bakery hustler at a local bakery, I know firsthand the struggle of pricing goodies - keeping customers happy without going bankrupt! And even though I'm a full-stack developer trust me that doesn't make this dough-lease any easier!
            </p>
            
            <div data-aos='flip-up' data-aos-delay='1100'>
              <button 
                onClick={handleNotesButtonClick}
                className='bg-[#2d2d2d] text-white px-8 py-3 rounded-full hover:bg-[#444] transition-all duration-300 hover:scale-105 shadow-lg mt-4'
              >
                Take Notes 
              </button>
            </div>
          </div>
        </div>
        
        <div 
          data-aos='fade-left'
          data-aos-delay='700'
          data-aos-duration='1500'
          data-aos-easing='ease-out-cubic'
          className='relative w-full max-w-md'
        >
          <img
            src={bear} 
            alt='bears'
            className='w-[350px] md:w-[660px] md:h-[740px] object-contain drop-shadow-2xl animate-ping-float'
          />
        </div>
      </section>
    </body>
  );
}