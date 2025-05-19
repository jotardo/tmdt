import HighlightOffIcon from "@mui/icons-material/HighlightOff";
import authApi from "../backend/db/authApi";
import { toast } from "react-toastify";
import { useContext } from "react";

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
      const imageSrc = e.target.result;
      setNewUserData((prev) => ({
        ...prev,
        selectedImage: imageSrc,
        imageFile: file,
      }));
    };

    if (file) {
      reader.readAsDataURL(file);
    }
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

      let updatedUser = {
        ...currentUser,
        phoneNo: newUserData.phoneNo,
        gender: newUserData.gender,
      };

      // Nếu có ảnh mới được chọn
      if (newUserData.imageFile) {
        const formData = new FormData();
        formData.append("avatar", newUserData.imageFile);

        const res = await authApi.uploadAvatar(userId, formData);
        
        if (res.success) {
          toast.success("Upload ảnh thành công!");

          // Gán trực tiếp đường dẫn tạm thời từ FileReader (base64)
          updatedUser.avatar = res.imageURL;
        } else {
          toast.warning("Upload ảnh thất bại!");
        }
      }

      // Cập nhật thông tin cá nhân
      const res = await authApi.updateProfile(userId, {
        phoneNo: updatedUser.phoneNo,
        gender: updatedUser.gender,
      });

      if (res.success) {
        toast.success("Cập nhật thông tin thành công!");

        // ✅ Cập nhật state và localStorage
        setCurrentUser(updatedUser);
        setUser(updatedUser);
        localStorage.setItem("user", JSON.stringify(updatedUser));
      } else {
        toast.warning("Cập nhật thông tin thất bại!");
      }
    } catch (error) {
      toast.error("Đã xảy ra lỗi khi cập nhật thông tin.");
      console.error("Lỗi khi cập nhật:", error);
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

        <label htmlFor="dp">Tải lên ảnh: </label>
        <input
          type="file"
          accept="image/*"
          id="dp"
          name="avatar"
          onChange={handleImageUpload}
        />

        <label htmlFor="fname">Họ:</label>
        <input type="text" id="fname" value={currentUser.firstName} disabled />

        <label htmlFor="lname">Tên:</label>
        <input type="text" id="lname" value={currentUser.lastName} disabled />

        <label htmlFor="emailId">Email:</label>
        <input type="text" id="emailId" value={currentUser.email} disabled />

        <label htmlFor="mobile">Số điện thoại:</label>
        <input
          type="text"
          id="mobile"
          name="mobile"
          placeholder="Số điện thoại"
          value={newUserData.mobile || ""}
          onChange={handleInput}
        />

        <label>Giới tính:</label>
        <label htmlFor="male">
          <input
            type="radio"
            name="gender"
            id="male"
            value="Male"
            checked={newUserData.gender === "Male"}
            onChange={handleInput}
          />
          Nam
        </label>
        <label htmlFor="female">
          <input
            type="radio"
            name="gender"
            id="female"
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
