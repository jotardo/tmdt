import { NavLink, useNavigate } from "react-router-dom";
import "./home.css";

import ProductCard from "../../components/ProductCard";


import { useData } from '../../'


export default function Home() {
  const { backendData, categoriesData, setFiltersUsed } = useData()
  const navigate = useNavigate()

  const trendingArray = backendData?.productsData.filter((item) => item.product_isBadge === "Trending")
  return (
    <>
      <section className="home">
        <h4>Bộ sưu tập độc quyền</h4>
        <h3>
          The New Rivaraa
          <br /> Collection
        </h3>
        <p>
          {" "}
          Cửa hàng duy nhất của bạn dành cho những món trang sức tinh tế, hoàn hảo cho mọi dịp.<br/>
          Hãy khám phá bộ sưu tập độc quyền của chúng tôi, được chế tác thủ công với những vật liệu tốt nhất để đảm bảo cả chất lượng và vẻ đẹp.<br/>
          Khám phá bộ sưu tập và tìm kiếm món trang sức hoàn hảo thể hiện cá tính của bạn.
        </p>
        <div className="mainbutton">
          <NavLink to='/browse'>
            <button>Mua Ngay</button>
          </NavLink>

        </div>
      </section>

      <section className="trending">
        <p>Trang sức nổi bật</p>
        <h3>ĐANG THỊNH HÀNH</h3>
        <div className="productsContainer">
          {trendingArray.slice(0, 6).map((item) => <ProductCard item={item} />)}
        </div>

      </section>
      <section className="showOff">
        <div className="textContent">
          <p>Trang sức độc nhất</p>
          <h3>LUÔN BẮT KỊP XU HƯỚNG</h3>
          <p >We take immense pride in offering jewelry pieces that are crafted with the utmost care and attention to detail. Each item in our collection undergoes rigorous quality checks to ensure it meets our high standards</p>
          <div className="mainbutton">
            <NavLink to='/browse'>
              <button>Mua Ngay</button>
            </NavLink>
          </div>
        </div>
        <div className="imageContent">
          <img className="bigImage" src='\assets\model2.jpg' width="400px" alt={''}/>
          <img className="smallImage" src='\assets\hands.jpg' alt="" />

        </div>
      </section>
      <section className="ShopByCategory">

        <h3>MUA HÀNG THEO DANH MỤC</h3>
        <p>Browse through your favorite categories. we have got them all!</p>
        <div className="categoryBox">
          {
            categoriesData.map(({ _id, categoryName, thumbnail }) => <div key={_id} className={categoryName}
              onClick={() => {
                setFiltersUsed({
                  type: "CLEARFILTER",
                  inputValue: "",
                });

                setFiltersUsed({ type: "CATEGORY", inputValue: categoryName });
                navigate('/browse')
              }}>
              <img src={thumbnail} alt={`${categoryName}`} />
              <p>{categoryName}</p>
            </div>
            )
          }

        </div>


      </section>
      <section className="whyUs">
        <p>TỐT NHẤT TRÊN THỊ TRƯỜNG</p>
        <h3>Tại sao nên chọn chúng tôi</h3>
        <div className="whyusContent">
          <img className="middleImage" src="\assets\model3.jpg" alt="" srcset="" />
          <div className="whyUsDescription">
            <div>
              <img src="\assets\whyUsIcons\percent-solid.svg" alt="big discount" />
              <h3>Khuyến mãi lớn</h3>
              <p>We provide higher discounts without compromising on quality or craftsmanship. Our commitment to offering affordable prices allows you to indulge in your love for exquisite jewelry while enjoying significant savings.</p>
            </div>
            <div>
              <img src="\assets\whyUsIcons\truck-fast-solid.svg" alt="fast delivery" />
              <h3>Giao hàng miễn phí</h3>
              <p>With our Free delivery service, you can shop with confidence, knowing that there are no hidden fees or additional charges. Sit back, relax, and let us take care of delivering your exquisite jewelry directly to you.</p>
            </div>
            <div>
              <img src="\assets\whyUsIcons\wallet-solid.svg" alt="big savings " />
              <h3>Thanh toán bảo mật</h3>
              <p>We ensure your peace of mind throughout your shopping experience. Your financial security is of utmost importance to us, which is why we have implemented advanced encryption and secure payment gateways.</p>
            </div>
            <div>
              <img src="\assets\whyUsIcons\boxes-packing-solid.svg" alt="big tracking order" />
              <h3>Theo dõi đơn hàng</h3>
              <p>We provide tracking order services, allowing you to stay informed and updated on the status of your purchase every step of the way.we ensure a seamless and transparent shopping experience.</p>
            </div>
          </div>
        </div>


      </section>

    </>
  );
}
