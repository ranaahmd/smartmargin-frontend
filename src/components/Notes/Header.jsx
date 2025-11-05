import { NotebookIcon } from 'lucide-react'
import cat_note from '../../assets/cat_note.png'

export default function Header() {
  return (
    <div className="header-container">
      <div className="header-content">
        <div className="header-title">
          <NotebookIcon className="w-7 h-7 text-amber-200" />
          <span className="text-xl font-bold text-amber-100 ml-2">
            Note <span className="text-amber-200">taker</span>
          </span>
        </div>

        <div
          data-aos="fade-left"
          data-aos-delay="700"
          data-aos-duration="1500"
          data-aos-easing="ease-out-cubic"
          className="image-wrapper"
        >
          <img
            src={cat_note}
            alt="Catnotes"
            className="cat-image"
          />
        </div>
      </div>
    </div>
  )
}
