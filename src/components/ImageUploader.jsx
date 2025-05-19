import HighlightOffIcon from "@mui/icons-material/HighlightOff";
import authApi from "../backend/db/authApi";
import { toast } from "react-toastify";

const ImageUploader = ({
  setIsOpenForm,
  newUserData,
  setNewUserData,
  currentUser,
  setCurrentUser,
  setUser,
}) => {
  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    const reader = new FileReader();

    reader.onload = (e) => {
      setNewUserData((prev) => ({
        ...prev,
        selectedImage: e.target.result,
        imageFile: file,
      }));
    };

    if (file) reader.readAsDataURL(file);
  };

  const handleInput = (e) => {
    const { name, value, type, checked } = e.target;
    setNewUserData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleUpdate = async () => {
    try {
      const userId = currentUser.id;
      let updatedUser = { ...currentUser };

      updatedUser.phoneNo = newUserData.phoneNo;
      updatedUser.gender = newUserData.gender;

      // Upload avatar nếu có
      if (newUserData.imageFile) {
        const formData = new FormData();
        formData.append("avatar", newUserData.imageFile);

        const res = await authApi.uploadAvatar(userId, formData);
        if (res.success) {
          toast.success("Upload ảnh thành công!");
          updatedUser.avatar = res.imageURL;
        } else {
          toast.warning("Upload ảnh thất bại!");
        }
      }

      // Cập nhật thông tin người dùng
      const res = await authApi.updateProfile(userId, {
        phoneNo: updatedUser.phoneNo,
        gender: updatedUser.gender,
      });

      if (res.success) {
        toast.success("Cập nhật thông tin thành công!");
        setCurrentUser(updatedUser);
        setUser(updatedUser);
        localStorage.setItem("user", JSON.stringify(updatedUser));
      } else {
        toast.warning("Cập nhật thất bại!");
      }
    } catch (error) {
      toast.error("Đã xảy ra lỗi khi cập nhật.");
      console.error("Lỗi cập nhật:", error);
    } finally {
      setIsOpenForm(false);
    }
  };

  return (
    <div className="formBox overlay">
      <div className="formValue">
        <div className="closeForm" onClick={() => setIsOpenForm(false)}>
          <HighlightOffIcon />
        </div>

        <label>Tải lên ảnh đại diện:</label>
        <input type="file" accept="image/*" onChange={handleImageUpload} />

        <label>Họ:</label>
        <input type="text" value={currentUser.firstName} disabled />

        <label>Tên:</label>
        <input type="text" value={currentUser.lastName} disabled />

        <label>Email:</label>
        <input type="email" value={currentUser.email} disabled />

        <label>Số điện thoại:</label>
        <input
          type="text"
          name="phoneNo"
          value={newUserData.phoneNo || ""}
          onChange={handleInput}
        />

        <label>Giới tính:</label>
        <label>
          <input
            type="radio"
            name="gender"
            value="Male"
            checked={newUserData.gender === "Male"}
            onChange={handleInput}
          />
          Nam
        </label>
        <label>
          <input
            type="radio"
            name="gender"
            value="Female"
            checked={newUserData.gender === "Female"}
            onChange={handleInput}
          />
          Nữ
        </label>

        <button onClick={handleUpdate}>Cập nhật</button>
      </div>
    </div>
  );
};

export default ImageUploader;
