import { ArrowBack, ArrowForward } from "@mui/icons-material";
import { useState } from "react"
import InnerImageZoom from "react-inner-image-zoom";

/** Index starts from */
export default function ProductImageContainer({ image_urls }) {
    const [index, setIndex] = useState(0);
    const decrementIndex = () => {
        setIndex((prev) => {
            let value = prev - 1
            if (value <= 0)
                value = image_urls.length - 1
            return value
        })
    }
    const incrementIndex = () => {
        setIndex((prev) => {
            let value = prev + 1
            if (value > image_urls.length - 1)
                value = 0
            return value
        })
    }

    return (<div>
        <div>
            <InnerImageZoom 
            src={(image_urls && image_urls.length > 0) ? image_urls[index].url : "assets/empty-wishlist.png"} 
            zoomSrc={(image_urls && image_urls.length > 0) ? image_urls[index].url : "assets/empty-wishlist.png"} />
        </div>
        {
            !(image_urls && image_urls.length > 0) ? (<></>) : (<>
        <ArrowBack onClick={decrementIndex}/>
        <ArrowForward onClick={incrementIndex}/>
        <div style={{display: "flex"}}>
            {
                image_urls.map((img, index) => <img src={img.url} alt={img.id} key={img.id} style={{width: 50}} onClick={() => setIndex(index)} />)
            }
        </div>
            </>)
        }
    </div>);
}