import tocat from '../../../assets/tocat.png'
import AOS from 'aos';
import 'aos/dist/aos.css';
 // heros part and all the style part was inspierd and copied from 
//  https://youtu.be/FalSgrYdrzc?si=ukeJovGdP1HnN4kC
export default function Heros() { 

  
  AOS.init({
    duration: 1000, 
    once: true, 
  });
   
  const handleButtonClick = () => {
    
      const productsSection = document.getElementById('products-section');
      if (productsSection) {
        productsSection.scrollIntoView({ behavior: 'smooth' });
      
    }
  }
  
  return (
    <section className='min-h-screen flex flex-col md:flex-row items-center justify-center bg-[#2d2d2d] pt-20 px-4 md:px-8 overflow-hidden gap-8'>
        <div
          data-aos='zoom-in' 
          data-aos-duration='1500'
          className='relative w-full max-w-2xl rounded-2xl shadow-2xl flex flex-col items-center justify-between overflow-hidden p-8 bg-amber-200'
        >
          <div className='w-full text-center md:text-left space-y-6 z-10'>
            <p 
              data-aos='fade-down'
              data-aos-delay='300'
              data-aos-easing="ease-out-cubic" 
              className='uppercase tracking-widest text-[#8b5e34] font-semibold'
            > 
              Product
            </p>
            
            <div data-aos='fade-right' data-aos-delay='500'>
              <h1 className='text-4xl md:text-5xl font-extrabold text-gray-900 leading-tight'>
                Be Smart {""}
                <span 
                  data-aos='fade-right'
                  data-aos-delay='700'
                  className='text-[#b6723c] block md:inline'
                >
                  Make some profit!
                </span>
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
  )}
