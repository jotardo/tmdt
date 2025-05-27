import { toast } from "react-toastify";
import { useAddress } from "../context/AddressContext";
import React, { useEffect, useState } from "react";
import deliveryAddressApi from "../backend/db/deliveryAddressApi";

export default function UpdateAddress({
  closeForm,
  isEditClicked,
  setIsEditClicked,
}) {
  const { addressState, setAddressState, dummyAddress, addressDispatch } = useAddress();

  const [filteredDistricts, setFilteredDistricts] = useState([]);
  const [filteredWards, setFilteredWards] = useState([]);

  const handleAddressInput = (e) => {
    const input = e.target.value;
    let prop = e.target.id;

    if (e.target.type === "radio") {
      prop = e.target.name;
      setAddressState(prev => ({ ...prev, [prop]: e.target.checked }));
    } else setAddressState(prev => ({ ...prev, [prop]: input }));
  };

  const handleAddressFormSubmit = async (e) => {
    e.preventDefault();

    if (!isEditClicked) {
      const res = await deliveryAddressApi.addNewAddress(addressState);
      if(res.success) {
        addressDispatch({ type: "ADD_ADDRESS", payload: res });
        toast.success("Địa chỉ mới đã được thêm thành công!");
      }else{
        toast.warn("Không xong rồii :((");
      }

    } else {
      // const res = await deliveryAddressApi.updateAddress(addressState);
      // addressDispatch({ type: "UPDATE_ADDRESS", payload: res });
      toast.success("Địa chỉ đã được cập nhật thành công!");
    }
    closeForm();
    if (isEditClicked) setIsEditClicked(false);
  };


  useEffect(() => {

    if (addressState.provinceName) {
      const provinceObj = provinces.find(p => p.name === addressState.provinceName);
      if (provinceObj) {
        const newDistricts = districts.filter(d => d.provinceId === provinceObj.id);
        setFilteredDistricts(newDistricts);

        // Reset district & ward nếu province thay đổi
        setAddressState(prev => ({
          ...prev,
          districtName: "",
          wardName: "",
        }));
        setFilteredWards([]);
      }
    }
  }, [addressState.provinceName]);

  useEffect(() => {
    if (addressState.districtName) {
      const districtObj = districts.find(d => d.name === addressState.districtName);
      if (districtObj) {
        const newWards = wards.filter(w => w.districtId === districtObj.id);
        setFilteredWards(newWards);

        // Reset ward nếu district thay đổi
        setAddressState(prev => ({
          ...prev,
          wardName: "",
        }));
      }
    }
  }, [addressState.districtName]);

  const provinces = [
    { id: 1, name: "Hà Nội" },
    { id: 2, name: "Hồ Chí Minh" },
  ];

  const districts = [
    { id: 1, provinceId: 1, name: "Quận Ba Đình" },
    { id: 2, provinceId: 1, name: "Quận Hoàn Kiếm" },
    { id: 3, provinceId: 2, name: "Quận 1" },
    { id: 4, provinceId: 2, name: "Quận 3" },
  ];

  const wards = [
    { id: 1, districtId: 1, name: "Phường Phúc Xá" },
    { id: 2, districtId: 1, name: "Phường Trúc Bạch" },
    { id: 3, districtId: 3, name: "Phường Bến Nghé" },
  ];

  return (
    <>
      <div className="addFormBox">
        <form className="addressForm" onSubmit={handleAddressFormSubmit}>
          <div
              className="closeAdd"
              onClick={closeForm}
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
          <div className="provinceNameAdd">
            <select
                name="provinceName"
                id="provinceName"
                required
                value={addressState.provinceName}
                onChange={handleAddressInput}
            >
              <option hidden value="">Tên Tỉnh</option>
              {provinces.map((province) => (
                  <option key={province.id} value={province.name}>
                    {province.name}
                  </option>
              ))}
            </select>
          </div>
          <div className="cityAdd">
            <select
                name="districtName"
                id="districtName"
                required
                value={addressState.districtName}
                onChange={handleAddressInput}
                disabled={!addressState.provinceName}
            >
              <option hidden value="">Tên Quận/Huyện</option>
              {filteredDistricts.map((district) => (
                  <option key={district.id} value={district.name}>
                    {district.name}
                  </option>
              ))}
            </select>
          </div>
          <div className="wardNameAdd">
            <select
                name="wardName"
                id="wardName"
                required
                value={addressState.wardName}
                onChange={handleAddressInput}
                disabled={!addressState.districtName}
            >
              <option hidden value="">Tên Phường/Xã</option>
              {filteredWards.map((ward) => (
                  <option key={ward.id} value={ward.name}>
                    {ward.name}
                  </option>
              ))}
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
