import "./contact.css";
import {toast} from 'react-toastify'
import LocationOnIcon from "@mui/icons-material/LocationOn";
import EmailTwoToneIcon from "@mui/icons-material/EmailTwoTone";
import LocalPhoneRoundedIcon from "@mui/icons-material/LocalPhoneRounded";
export default function Contact() {
  return (
    <section className="contactPage">
      <div className="heading">
        <small>Giữ liên lạc...</small>
        <h1> Liên hệ với chúng tôi</h1>
      </div>
      <div className="messageUsSection">
        <div className="textContent">
          <h3>Phản hồi đến chúng tôi</h3>
          <p>
            Lorem ipsum, dolor sit amet consectetur adipisicing elit. Facilis
            voluptates eos rerum quod nobis eaque consectetur incidunt deserunt
            odio animi.
          </p>
          <p className="location">
            <p>
              <span>
                <LocationOnIcon />
              </span>
              156 Sixth Avenue, Nashik Nagar, NN 20990
            </p>
            <p>
              {" "}
              <span>
                <EmailTwoToneIcon />
              </span>{" "}
              shringaarcontact@gmail.com
            </p>
            <p>
              <span>
                <LocalPhoneRoundedIcon />
              </span>
              +91 959595959
            </p>
          </p>
        </div>
        <div className="contactForm">
          <form
            action="https://formsubmit.co/jaianushka1056@gmail.com"
            method="POST"
          >
            <input
              type="hidden"
              name="_next"
              value="http://shringaar.netlify.app/contact"
            />
            <div className="name">
              <input type="text" name="last_name" placeholder="Họ" required/>

              <input type="text" name="first_name" placeholder="Tên" required/>
            </div>

            <input
              type="email"
              name="email"
              id="contactEmail"
              placeholder="Địa chỉ email"
              required
            />

            <textarea
              id="story"
              name="story"
              rows="5"
              cols="15"
              placeholder="Gần đây tôi được dịp ghé qua tiệm trang sức Aurora Veneris..."
            ></textarea>

            <button
              type="submit"
              onClick={() => {
                toast.success("Cảm ơn bạn đã đóng góp, chúc bạn một ngày tốt lành ", {
                  position: toast.POSITION.BOTTOM_RIGHT,
                  className: "loginToast",
                });
              }}
            >
              Send
            </button>
          </form>
        </div>
      </div>

      <iframe
        src="https://www.google.com/maps/embed?pb=!1m16!1m12!1m3!1d170797.8327653595!2d73.65696696641196!3d19.921946582207333!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!2m1!1sshringaar%20nshik!5e0!3m2!1sen!2sin!4v1685948098610!5m2!1sen!2sin"
        width="100%"
        height="450"
        allowfullscreen=""
        loading="lazy"
        referrerpolicy="no-referrer-when-downgrade"
      ></iframe>
    </section>
  );
}
