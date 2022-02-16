import { useState } from "react";
import axios from "axios";
import NavbarComponent from "./NavbarComponent";
import Swal from "sweetalert2";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { getUser, getToken } from "../services/authorize";

const FormComponent = () => {
  const [state, setState] = useState({
    title: "",
    author: getUser(),
  });

  const { title, author } = state;

  const [content, setContent] = useState("");

  // กำหนดค่าให้กับ state
  const inputValues = (name) => (event) => {
    setState({ ...state, [name]: event.target.value });
  };

  const submitContent = (event) => {
    setContent(event);
  };

  const submitForm = (e) => {
    e.preventDefault();
    console.log("API URL = ", process.env.REACT_APP_API);
    axios
      .post(
        `${process.env.REACT_APP_API}/create`,
        {
          title,
          content,
          author,
        },
        {
          headers: {
            authorization: `Bearer ${getToken()}`,
          },
        }
      )
      .then((response) => {
        Swal.fire("Good job!", "บันทึกบทความเรียบร้อย", "success");
        setState({ ...state, title: "", author: "" });
        setContent("");
      })
      .catch((err) => {
        Swal.fire("Oop!", err.response.data.error, "error");
      });
  };

  return (
    <div className="container p-5">
      <NavbarComponent />
      <h1>เขียนบทความ</h1>
      {/* {JSON.stringify(state)} //debug value */}
      <form onSubmit={submitForm}>
        <div className="form-group">
          <label>ชื่อบทความ</label>
          <input
            type="text"
            className="form-control"
            value={title}
            onChange={inputValues("title")}
          />
        </div>
        <br />
        <div className="form-group">
          <label>รายละเอียด</label>
          <ReactQuill
            value={content}
            onChange={submitContent}
            theme="snow"
            className="pb-5 mb-3"
            placeholder="เขียนรายละเอียดบทความของคุณ"
            style={{ border: "1px solid #666" }}
          />
        </div>
        <br />
        <div className="form-group">
          <label>ชื่อผู้เขียน</label>
          <input
            type="text"
            className="form-control"
            value={author}
            onChange={inputValues("author")}
          />
        </div>
        <br />
        <input type="submit" value="บันทึก" className="btn btn-primary" />
      </form>
    </div>
  );
};

export default FormComponent;
