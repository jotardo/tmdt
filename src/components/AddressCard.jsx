import EditIcon from "@mui/icons-material/Edit";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";

export default function AddressCard({
  addObj,
  handleEdit,
  setIsEditClicked,
  addressDispatch,
  isPresentinCheckout
}) {
  if (!addObj) return null;
  const {
    id,
    receiverName,
    workAddress,
    quarter,
    contactNumber,
    buildingAddress,
    provinceName,
    districtName,
    pincode,
    wardName,
  } = addObj;
  return (
    <div key={id} className="addressContainer">
      <div className="addressText">
        <p className="addType">
          <small>{!workAddress ? "Cá nhân" : "Văn phòng"}</small>
        </p>
        <p>
          <b>
            {receiverName}
            <span style={{ width: "20px" }}> ... </span>
            {contactNumber}
          </b>
        </p>
        <p>Số nhà: {buildingAddress}</p>
        <p>{quarter}</p>
        <p>
          {wardName}, {districtName}
        </p>
        <p>
          {provinceName} - <b>{pincode}</b>
        </p>
      </div>
      <div className="buttons">
        {isPresentinCheckout ? null : (
          <button
            onClick={() => {
              handleEdit(id, true);
              setIsEditClicked(() => false);
            }}
          >
            Sửa
            <EditIcon />
          </button>
        )}
        {isPresentinCheckout ? null : (
          <button
            onClick={() => {
              addressDispatch({ type: "DELETEADD", payload: id });
            }}
          >
            Xóa
            <DeleteForeverIcon />
          </button>
        )}
      </div>
    </div>
  );
}
