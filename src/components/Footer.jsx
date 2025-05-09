import FacebookOutlinedIcon from '@mui/icons-material/FacebookOutlined';
import TwitterIcon from "@mui/icons-material/Twitter";
import GitHubIcon from "@mui/icons-material/GitHub";
import LinkedInIcon from "@mui/icons-material/LinkedIn";
import { NavLink } from 'react-router-dom';

export default function Footer(){
  return <footer>
         <h6>Kết nối với chúng tôi</h6>
         <div className="socialMedia">
          <NavLink to=""><span className="facebook"><FacebookOutlinedIcon/></span></NavLink>
          <NavLink to="">
          <span className="twitter"><TwitterIcon/></span></NavLink>
          <NavLink to="">
          <span className="github"><GitHubIcon/></span>
          </NavLink>
          <NavLink to="">
          <span className="linkedin"><LinkedInIcon/></span>
          </NavLink>
         </div>
         <p>Team Aurora Veneris</p>
         
  </footer>
}