import { toast } from "react-toastify";
import { useAddress } from "../context/AddressContext";

export default function UpdateAddress({
  clickF,
  isEditClicked,
  setIsEditClicked,
}) {
  const { addressState, setAddressState, dummyAddress, addressDispatch } =
    useAddress();

  const handleAddressInput = (e) => {
    const input = e.target.value;
    let prop = e.target.id;

    if (e.target.type === "radio") {
      setAddressState(() => ({ ...addressState, [prop]: e.target.checked }));
    } else setAddressState(() => ({ ...addressState, [prop]: input }));
  };

  const handleAddressFormSubmit = (e) => {
    e.preventDefault();

    if (!isEditClicked) {
      addressDispatch({ type: "ADDRESSADD", payload: addressState });
      toast.success("Địa chỉ mới đã được thêm thành công!", {
        position: toast.POSITION.BOTTOM_RIGHT,
      });
    } else if (isEditClicked) {
      addressDispatch({ type: "EDITADD", payload: addressState });
      toast.success("Địa chỉ đã được cập nhật thành công!", {
        position: toast.POSITION.BOTTOM_RIGHT,
      });
    }
    clickF(false);
    if (isEditClicked) setIsEditClicked(false);
  };

  return (
    <>
      <div className="addFormBox">
        <form className="addressForm" onSubmit={handleAddressFormSubmit}>
          <div
            className="closeAdd"
            onClick={() => {
              setIsEditClicked(false);
              clickF(false);
            }}
          >
            X
          </div>
          <div className="fullNameAdd">
            <input
              type="text"
              name="fullName"
              id="fullName"
              required
              placeholder="Họ và tên"
              value={addressState.fullName}
              onChange={handleAddressInput}
            />
          </div>
          <div className="buildingAdd">
            <input
              type="text"
              name="building"
              id="building"
              required
              placeholder="Số nhà"
              value={addressState.building}
              onChange={handleAddressInput}
            />
          </div>
          <div className="quarter">
            <input
              type="text"
              name="quarter"
              id="quarter"
              required
              placeholder="Khu phố"
              value={addressState.quarter}
              onChange={handleAddressInput}
            />
          </div>
          <div className="wardAdd">
            <input
              type="text"
              name="ward"
              id="ward"
              required
              placeholder="Tên Thành Phố"
              value={addressState.ward}
              onChange={handleAddressInput}
            />
          </div>
          <div className="cityAdd">
            <input
              type="text"
              name="district"
              id="district"
              required
              value={addressState.district}
              placeholder="Tên Quận/Huyện"
              onChange={handleAddressInput}
            />
          </div>
          <div className="provinceAdd">
            <input
              type="text"
              name="province"
              id="province"
              required
              value={addressState.province}
              placeholder="Tên Tỉnh"
              onChange={handleAddressInput}
            />
          </div>
          <div className="pinCodeAdd">
            <input
              type="number"
              size={6}
              min={100001}
              max={999999}
              name="pincode"
              id="pincode"
              required
              placeholder="Mã ZIP"
              value={addressState.pincode}
              onChange={handleAddressInput}
            />
          </div>
          <div className="mobileAdd">
            <input
              type="text"
              name="mobile"
              id="mobile"
              value={addressState.mobile}
              required
              placeholder="Số điện thoại"
              onChange={handleAddressInput}
            />
          </div>

          <div className="addTypeAdd">
            Loại Địa Chỉ
            <label htmlFor="home">
              {" "}
              <input
                type="radio"
                name="addType"
                id="home"
                checked={addressState.home}
                onChange={handleAddressInput}
              />
              Địa chỉ cá nhân{" "}
            </label>
            <label htmlFor="work">
              <input
                type="radio"
                name="addType"
                id="work"
                checked={addressState.work}
                onChange={handleAddressInput}
              />
              Địa chỉ văn phòng{" "}
            </label>
          </div>
          <div className="buttons">
            <button type="submit">Cập nhật</button>
            <button
              onClick={(e) => {
                e.preventDefault();
                setAddressState(dummyAddress);
              }}
            >
              Địa chỉ placeholder
            </button>
          </div>
        </form>
      </div>
    </>
  );
}
