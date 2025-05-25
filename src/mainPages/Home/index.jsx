import { NavLink, useNavigate } from "react-router-dom";
import "./home.css";

import ProductCard from "../../components/Cards/ProductCard";


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
          Hãy khám phá bộ sưu tập độc quyền của chúng tôi, được chế tác thủ công với những loại đá tốt nhất để đảm bảo cả chất lượng và vẻ đẹp.<br/>
          Khám phá bộ sưu tập và tìm kiếm món trang sức hoàn hảo thể hiện cá tính của bạn.
        </p>
        <div className="mainbutton">
          <NavLink to='/shop'>
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
          <p>Chúng tôi vô cùng tự hào khi mang đến những món trang sức được chế tác với sự chăm chút và tỉ mỉ tối đa. Mỗi sản phẩm trong bộ sưu tập của chúng tôi đều trải qua quy trình kiểm tra chất lượng nghiêm ngặt để đảm bảo đáp ứng tiêu chuẩn cao.</p>
          <div className="mainbutton">
            <NavLink to='/shop'>
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
            categoriesData.map(({ id:_id, name:categoryName, thumbnail }) => <div key={_id} className={categoryName}
              onClick={() => {
                setFiltersUsed({
                  type: "CLEARFILTER",
                  inputValue: "",
                });

                setFiltersUsed({ type: "CATEGORY", inputValue: categoryName });
                navigate('/shop')
              }}>
              <img src={`http://localhost:8080/api/category/${thumbnail}`} alt={`${categoryName}`} />
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
              <p>Chúng tôi cung cấp mức giảm giá cao hơn mà không ảnh hưởng đến chất lượng hay tay nghề chế tác. Cam kết mang đến giá cả phải chăng giúp bạn có thể tận hưởng niềm đam mê với trang sức tinh xảo và vẫn tiết kiệm đáng kể.</p>
            </div>
            <div>
              <img src="\assets\whyUsIcons\truck-fast-solid.svg" alt="fast delivery" />
              <h3>Giao hàng miễn phí</h3>
              <p>Với dịch vụ giao hàng miễn phí, bạn có thể mua sắm tự tin mà không lo về chi phí ẩn hay khoản phí phát sinh. Chỉ cần ngồi thư giãn, để chúng tôi lo việc giao món trang sức tuyệt đẹp đến tận tay bạn.</p>
            </div>
            <div>
              <img src="\assets\whyUsIcons\wallet-solid.svg" alt="big savings " />
              <h3>Thanh toán an toàn</h3>
              <p>Chúng tôi đảm bảo sự yên tâm của bạn trong suốt quá trình mua sắm. Bảo mật tài chính của bạn là điều vô cùng quan trọng đối với chúng tôi, vì vậy chúng tôi đã áp dụng hệ thống mã hóa tiên tiến và cổng thanh toán an toàn.</p>
            </div>
            <div>
              <img src="\assets\whyUsIcons\boxes-packing-solid.svg" alt="big tracking order" />
              <h3>Theo dõi đơn hàng</h3>
              <p>Chúng tôi cung cấp dịch vụ theo dõi đơn hàng, giúp bạn luôn được cập nhật về tình trạng mua sắm của mình từng bước một, đảm bảo trải nghiệm mua sắm minh bạch và suôn sẻ.</p>
            </div>
          </div>
        </div>


      </section>

    </>
  );
}
