import EditIcon from "@mui/icons-material/Edit";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";

export default function AddressCard({
  addObj,
  handleEdit,
  setIsEditClicked,
  addressDispatch,
  isPresentinCheckout
}) {
  const {
    id,
    fullName,
    home,
    work,
    quarter,
    mobile,
    building,
    province,
    district,
    pincode,
    ward,
  } = addObj;
  return (
    <div key={id} className="addressContainer">
      <div className="addressText">
        <p className="addType">
          <small>{home ? "Cá nhân" : work ? "Văn phòng" : null}</small>
        </p>
        <p>
          <b>
            {fullName}
            <span style={{ width: "20px" }}> ... </span>
            {mobile}
          </b>
        </p>
        <p>Số nhà: {building}</p>
        <p>{quarter}</p>
        <p>
          {province},{district}
        </p>
        <p>
          {ward} - <b>{pincode}</b>
        </p>
      </div>
      <div className="buttons">
        {isPresentinCheckout ? null : (
          <button
            onClick={() => {
              handleEdit(id, true);
              setIsEditClicked(() => true);
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
