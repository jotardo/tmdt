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
      // same name instead xdx
      prop = e.target.name
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

  const handleChangeprovinceName = () => {
  };
  const handleChangedistrictName = () => {

  };
  const handleChangewardName = () => {
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
          <div className="receiverNameAdd">
            <input
              type="text"
              name="receiverName"
              id="receiverName"
              required
              placeholder="Họ và tên"
              value={addressState.receiverName}
              onChange={handleAddressInput}
            />
          </div>
          <div className="buildingAddressAdd">
            <input
              type="text"
              name="buildingAddress"
              id="buildingAddress"
              required
              placeholder="Số nhà"
              value={addressState.buildingAddress}
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
          <div className="wardNameAdd">
            <select
              type="text"
              name="wardName"
              id="wardName"
              required
              placeholder="Tên Thành Phố"
              value={addressState.wardName}
              onChange={handleAddressInput}
            >
              <option hidden selected value="">Tên Thành Phố</option>
            </select>
          </div>
          <div className="cityAdd">
            <select
              type="text"
              name="districtName"
              id="districtName"
              required
              value={addressState.districtName}
              placeholder="Tên Quận/Huyện"
              onChange={handleAddressInput}
            >
              <option hidden selected value="">Tên Quận/Huyện</option>
            </select>
          </div>
          <div className="provinceNameAdd">
            <select
              type="text"
              name="provinceName"
              id="provinceName"
              required
              value={addressState.provinceName}
              placeholder="Tên Tỉnh"
              onChange={handleAddressInput}
            >
              <option hidden selected value="">Tên Tỉnh</option>
            </select>
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
          <div className="contactNumberAdd">
            <input
              type="text"
              name="contactNumber"
              id="contactNumber"
              value={addressState.contactNumber}
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
                name="workAddress"
                id="home"
                checked={!addressState.workAddress}
                onChange={handleAddressInput}
              />
              Địa chỉ cá nhân{" "}
            </label>
            <label htmlFor="work">
              <input
                type="radio"
                name="workAddress"
                id="work"
                checked={addressState.workAddress}
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
