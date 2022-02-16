import { useState, useEffect } from "react";
import axios from "axios";
import NavbarComponent from "./NavbarComponent";
import Swal from "sweetalert2";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { getToken } from "../services/authorize";

const EditComponent = (props) => {
  const [state, setState] = useState({
    title: "",
    author: "",
    slug: "",
  });

  const { title, author, slug } = state;

  const [content, setContent] = useState("");

  const submitContent = (event) => {
    setContent(event);
  };

  //   ดึงข้อมูลบทความที่ต้องการแก้ไข
  useEffect(() => {
    axios
      .get(`${process.env.REACT_APP_API}/blog/${props.match.params.slug}`)
      .then((response) => {
        const { title, content, author, slug } = response.data;
        setState({ ...state, title, author, slug });
        setContent(content);
      })
      .catch((err) => alert(err));
    //eslint-disable-next-line
  }, []);

  const showUpdateForm = () => (
    <form onSubmit={submitForm}>
      <div className="form-group">
        <label>CREATE CONTENT</label>
        <input
          type="text"
          className="form-control"
          value={title}
          onChange={inputValues("title")}
        />
      </div>
      <br />
      <ReactQuill
        value={content}
        onChange={submitContent}
        theme="snow"
        className="pb-5 mb-3"
        style={{ border: "1px solid #666" }}
      />
      <br />
      <div className="form-group">
        <label>AUTHOR NAME</label>
        <textarea
          className="form-control"
          value={author}
          onChange={inputValues("author")}
        ></textarea>
      </div>
      <br />
      <input type="submit" value="อัพเดท" className="btn btn-primary" />
    </form>
  );

  // กำหนดค่าให้กับ state
  const inputValues = (name) => (event) => {
    setState({ ...state, [name]: event.target.value });
  };

  // อัพเดท api  http://localhost:5500/api/blog/data-analysis => put
  const submitForm = (e) => {
    e.preventDefault();
    console.log("API URL = ", process.env.REACT_APP_API);
    axios
      .put(
        `${process.env.REACT_APP_API}/blog/${slug}`,
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
        Swal.fire("Good job!", "อัพเดทบทความเรียบร้อย", "success");
        const { title, content, author, slug } = response.data;
        setState({ ...state, title, author, slug });
        setContent(content);
      })
      .catch((err) => {
        //   alert(err)
        Swal.fire("Oop!", err.response.data.error, "error");
      });
  };

  return (
    <div className="container p-5">
      <NavbarComponent />
      <h1>EDIT CONTENT</h1>
      {/* {JSON.stringify(state)} */}
      {showUpdateForm()}
    </div>
  );
};

export default EditComponent;
