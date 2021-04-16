import React from "react";
import { requestTranslation } from "@sangre-fp/i18n";
import Modal from "react-modal";
import { modalStyles, Btn, BtnGroup, ModalContent } from "./styles";
const ConfirmationModal = ({
  clearRatings,
  confirmationModal,
  confirmationModalClose,
}) => {
  return (
    <Modal isOpen={confirmationModal} style={modalStyles} ariaHideApp={false}>
      <div>
        <ModalContent>{requestTranslation("deleteAllRatesNote")}</ModalContent>
        <BtnGroup>
          <Btn
            onClick={confirmationModalClose}
            className="btn btn-lg btn-plain-gray"
          >
            {requestTranslation("cancel").toUpperCase()}
          </Btn>
          <Btn className="btn btn-lg btn-primary" onClick={clearRatings}>
            {requestTranslation("delete").toUpperCase()}
          </Btn>
        </BtnGroup>
      </div>
    </Modal>
  );
};

export default ConfirmationModal;
