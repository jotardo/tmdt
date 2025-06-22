import { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import SearchIcon from "@mui/icons-material/Search";
import HighlightOffIcon from "@mui/icons-material/HighlightOff";
import Badge from "@mui/material/Badge";
import LocalGroceryStoreTwoToneIcon from "@mui/icons-material/LocalGroceryStoreTwoTone";
import LoginRoundedIcon from "@mui/icons-material/LoginRounded";
import FavoriteTwoToneIcon from "@mui/icons-material/FavoriteTwoTone";
import PersonIcon from "@mui/icons-material/Person";

import { useData, useCart, useWish } from "../";
import { AdminPanelSettings } from "@mui/icons-material";
import { useAuth } from "../context/AuthContext";
import ForumHome from "../mainPages/Forum";

export default function Header() {
  const [isMenuClicked, setIsMenuClicked] = useState(false);
  const [isSearchclicked, setIsSearchedClicked] = useState(false);

  const [inputValue, setInputValue] = useState("");
  const [category, setCategory] = useState("");

  const { setFiltersUsed, categoriesData } = useData();
  const token = localStorage.getItem("jwtToken");
  const { user } = useAuth();
  const { wishlistCount } = useWish();
  const { cartCount } = useCart();
  const navigate = useNavigate();

  const handleMenu = () => {
    setIsMenuClicked(!isMenuClicked);
      window.scrollTo({top:0, left:0, behavior: "smooth"});
    
  };
  const handleCategory = (e) => {
    setCategory(() => e.target.value);
    setFiltersUsed({ type: "CATEGORY", inputValue: e.target.value });
    navigate("/shop");
  };

  return (
    <>
      <div className="headerContainer">
        <div className="logo">
          <img src="/assets/logo.jpg" alt="Logo"/>
        </div>
        <div className="categories" style={{overflow: "auto", minWidth: "40px", maxWidth: "20%"}}>
          {Array.isArray(categoriesData) && categoriesData.length > 0 ? (
              categoriesData.map((item) => (
                  <CategoryList
                      item={item}
                      navigate={navigate}
                      setFiltersUsed={setFiltersUsed}
                      key={item.id || item.name}
                  />
              ))
          ) : (
              <p>...</p>
          )}
        </div>
        <div className="headerLeft">
          <div
              className={isMenuClicked ? "expandMenu" : "menuBar"}
              onClick={handleMenu}
          >
            <span className="sideBarMenu">
              <div className="bar1"></div>
              <div className="bar2"></div>
              <div className="bar3"></div>
            </span>
          </div>
          <div className="logoContatiner" onClick={() => {
            navigate('/')
          }}>

            <h2>Aurora Veneris</h2>
            <p>Your Jewelry House</p>

          </div>
        </div>
        <div className="navbarIcons">
          <NavLink to="/about">
            <li className="NavItem">Giới thiệu</li>
          </NavLink>
          <NavLink to="contact">
            <li className="NavItem">Liên Hệ</li>
          </NavLink>
          <NavLink to={"reverse-auction"}>
            <li className={"NavItem"}>Đấu Giá Ngược</li>
          </NavLink>
          <NavLink to="/forum">
            <li className={"NavItem"}>Diễn đàn</li>
          </NavLink>

          <span className="search">
            {isSearchclicked ? (
                <div className="inputElement overlay">
                <span
                    className="closeSearch"
                    onClick={() => {
                      setIsSearchedClicked(!isSearchclicked);
                    }}
                >
                  <HighlightOffIcon/>
                </span>
                  <input
                      type="text"
                      value={inputValue}
                      placeholder="Tìm kiếm mặt hàng/nhãn hiệu/loại trang sức"
                      onChange={(e) => {
                        setInputValue(e.target.value);
                      }}
                  />
                  <SearchIcon
                      onClick={() => {
                        setFiltersUsed({type: "SEARCH", inputValue: inputValue});
                        setIsSearchedClicked(!isSearchclicked);
                        if (inputValue.length > 0) navigate("/shop");
                      }}
                  />
                </div>
            ) : (
                <SearchIcon
                    onClick={() => {
                      setIsSearchedClicked(!isSearchclicked);
                    }}
                />
            )}
          </span>
          <span className={token ? "wishList" : "hiddenElement"}>
            <Badge
                badgeContent={token ? wishlistCount : 0}
                color="secondary"
                sx={{color: "#5f3926"}}
            >
              <NavLink to="/wishlist">
                <FavoriteTwoToneIcon/>
              </NavLink>
            </Badge>
          </span>
          <span className={token ? "emptyCart" : "hiddenElement"}>
            <Badge
                badgeContent={token ? cartCount : 0}
                color="secondary"
                sx={{color: "#5f3926"}}
            >
              <NavLink to="/cart">
                <LocalGroceryStoreTwoToneIcon/>
              </NavLink>
            </Badge>
          </span>
          <span className={user?.role !== "Admin" ? "admin" : "hiddenElement"}>
                <NavLink to="/admin/dashboard">
                  <AdminPanelSettings/>
                </NavLink>
          </span>
          <span className="login">
            {token ? (
                <NavLink to="/profile">
                  <PersonIcon/>
                </NavLink>
            ) : (
                <NavLink to="/login">
                  <LoginRoundedIcon/>
                </NavLink>
            )}
          </span>
        </div>
      </div>
      {isMenuClicked && (
          <div title="Menu bar" className="sideNav">
            <ul>
              <NavLink to="/">
                <li onClick={handleMenu}>TRANG CHỦ</li>
              </NavLink>
              <NavLink to="/about">
                <li onClick={handleMenu}>VỀ CHÚNG TÔI</li>
              </NavLink>
              <NavLink to="contact">
                <li onClick={handleMenu}>LIÊN HỆ</li>
              </NavLink>

              <li>
                <select
                    value={category}
                    name="categoryChoose"
                    onChange={handleCategory}
                    id="chooseCategory"
                >
                  <option value="SHOP">DANH MỤC</option>
                  {
                    Array.isArray(categoriesData) && categoriesData.length > 0 && (
                      categoriesData.map((item) => (
                      <option value={item.name} key={item.id || item.name}>
                        {item.name}
                      </option>
                      ))
                    )
                  }
                  <option value="rings">NHẪN</option>
                  <option value="bracelet">VÒNG TAY</option>
                  <option value="earring">BÔNG TAI</option>
                  <option value="necklace">DÂY CHUYỀN</option>
              </select>
            </li>
          </ul>
        </div>
      )}
    </>
  );
}

const CategoryList = ({ item, navigate, setFiltersUsed }) => {
  return (
    <li className="NavItem"
      key={item.id}
      value={item.name}
      onClick={(e) => {
        setFiltersUsed({
          type: "CLEARFILTER",
          inputValue: "",
        });
        setFiltersUsed({ type: "CATEGORY", inputValue: item.name });
        navigate("/shop");
      }}
    >
      {item.name}
    </li>
  );
};
