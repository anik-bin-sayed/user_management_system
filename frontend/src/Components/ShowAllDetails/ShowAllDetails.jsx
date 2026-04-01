import React, { useState } from "react";
import { useSelector } from "react-redux";
import Personal from "./ShowDetailsCard/Personal/Personal";
import EditPersonal from "./ShowDetailsCard/Personal/EditPernal";
import DetailsNavbar from "../DetailsNavbar";
import { useParams } from "react-router-dom";
import EditProfessional from "./ShowDetailsCard/Professional/EditProfessional";
import ProfessionalDetails from "./ShowDetailsCard/Professional/Professional";
import Contact from "./ShowDetailsCard/Contact/Contact";
import EditContact from "./ShowDetailsCard/Contact/EditContact";
import Settings from "../Settings/Settings";
import Footer from "../Footer";
import Social from "./ShowDetailsCard/Social/Social";
import Home from "../Home/Home";
import EditSocial from "./ShowDetailsCard/Social/EditSocial";
import Media from "../Media/Media";

const ShowAllDetails = () => {
  const { info } = useParams();
  const activeTab = !info ? "home" : info;
  const { user } = useSelector((state) => state.userProfile);

  const [update, setUpdate] = useState("");
  if (!user) return null;

  const {
    personal_info,
    contact_info,
    professional_info,
    social_links,
    preferences,
    account_info,
  } = user;

  return (
    <div className="max-w-5xl mx-auto p-6 space-y-8">
      <DetailsNavbar activeTab={activeTab} />
      <div className="space-y-8">
        {activeTab == "home" && <Home />}
        {/* Personal Info */}
        {activeTab == "personal" && (
          <>
            {update == "personal" ? (
              <EditPersonal
                setUpdate={setUpdate}
                personal_info={personal_info}
              />
            ) : (
              <Personal personal_info={personal_info} setUpdate={setUpdate} />
            )}
          </>
        )}

        {info == "contact" && (
          <>
            {update == "contact" ? (
              <EditContact setUpdate={setUpdate} contact_info={contact_info} />
            ) : (
              <Contact setUpdate={setUpdate} contact_info={contact_info} />
            )}
          </>
        )}

        {info == "professional" && (
          <>
            {update == "professional_update" ? (
              <EditProfessional
                professional_info={professional_info}
                setUpdate={setUpdate}
              />
            ) : (
              <ProfessionalDetails
                setUpdate={setUpdate}
                professional_info={professional_info}
              />
            )}
          </>
        )}

        {/* Social Links */}

        {info == "social" && (
          <>
            {update == "social" ? (
              <EditSocial social_links={social_links} setUpdate={setUpdate} />
            ) : (
              <Social social_links={social_links} setUpdate={setUpdate} />
            )}
          </>
        )}

        {info == "media" && <Media />}

        {info == "settings" && <Settings />}

        <Footer account_info={account_info} preferences={preferences} />
      </div>
    </div>
  );
};

export default ShowAllDetails;
