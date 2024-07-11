import React from "react";
import ReactDom from "react-dom";

const MODAL_STYLES = {
  position: "fixed",
  top: "50%",
  left: "50%",
  width: "95%",
  transform: "translate(-50%, -50%)",
  backgroundColor: "#FFF",
  padding: "50px",
  zIndex: 1000,
};

const OVERLAY_STYLE = {
  position: "fixed",
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  backgroundColor: "rgba(0,0,0,.7)",
  zIndex: 1000,
};

export default function Modal({
  open,
  children,
  onClose,
  setDescription,
  description,
  updateDescription,
  e,
}) {
  if (!open) return null;
  return ReactDom.createPortal(
    <>
      <div style={OVERLAY_STYLE} />
      <div style={MODAL_STYLES}>
        <input
          type="text"
          className="form-control"
          defaultValue={description}
          onChange={(e) => setDescription(e.target.value)}
        ></input>
        <button
          type="button"
          class="btn btn-warning btn-sm"
          onClick={(e) => updateDescription(e)}
        >
          Save
        </button>
        <button onClick={onClose} class="btn btn-danger btn-sm">
          Close
        </button>
        {children}
      </div>
    </>,
    document.getElementById("portal")
  );
}
