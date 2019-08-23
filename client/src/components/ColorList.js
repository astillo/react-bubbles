import React, { useState } from "react";
import axios from "axios";
import { axiosWithAuth } from '../axiosWithAuth'
import { Form as Formik, Field, withFormik } from 'formik'
import { Segment, Form, Button } from 'semantic-ui-react'
const initialColor = {
  color: "",
  code: { hex: "" }
};

const ColorList = ({ colors, updateColors }) => {
  console.log(colors);
  const [editing, setEditing] = useState(false);
  const [colorToEdit, setColorToEdit] = useState(initialColor);

  const editColor = color => {
    setEditing(true);
    setColorToEdit(color);
  };

  const saveEdit = (e, color) => {
    e.preventDefault();
    // Make a put request to save your updated color
    // think about where will you get the id from...
    // where is is saved right now?
    axiosWithAuth().put(`http://localhost:5000/api/colors/${colorToEdit.id}`
      , colorToEdit)
      .then(res => console.log(res))

  };

  const deleteColor = color => {
    axiosWithAuth().delete(`http://localhost:5000/api/colors/${colorToEdit.id}`)
      .then(res => alert('deleted'))
      .catch(err => {
        alert('error check console.')
        console.log(err)
      })
  };

  return (
    <div className="colors-wrap">
      <p>colors</p>
      <ul>
        {colors.map(color => (
          <li key={color.color} onClick={() => editColor(color)}>
            <span>
              <span className="delete" onClick={() => deleteColor(color)}>
                x
              </span>{" "}
              {color.color}
            </span>
            <div
              className="color-box"
              style={{ backgroundColor: color.code.hex }}
            />
          </li>
        ))}
      </ul>
      {editing && (
        <form onSubmit={saveEdit}>
          <legend>edit color</legend>
          <label>
            color name:
            <input
              onChange={e =>
                setColorToEdit({ ...colorToEdit, color: e.target.value })
              }
              value={colorToEdit.color}
            />
          </label>
          <label>
            hex code:
            <input
              onChange={e =>
                setColorToEdit({
                  ...colorToEdit,
                  code: { hex: e.target.value }
                })
              }
              value={colorToEdit.code.hex}
            />
          </label>
          <div className="button-row">
            <button type="submit">save</button>
            <button onClick={() => setEditing(false)}>cancel</button>
            <button onClick={deleteColor}>Delete</button>
          </div>
        </form>
      )}
      <div className="spacer" />
      <div>
        <Segment raised compact>
          <Form>
            <Formik>
              <Form.Field>
                <Field type="text" name="color" placeholder="color" />
              </Form.Field>
              <Form.Field>
                <Field type="text" name="code" placeholder="color code" />
              </Form.Field>
              <Button type="submit">Add color</Button>
            </Formik>
          </Form>
        </Segment>
      </div>
    </div>
  );
};

const FormikForm = withFormik({
  mapPropsToValues(values) {
    return {
      color: values.color || '',
      code: values.code || ''
    }
  },
  handleSubmit(values, props) {
    console.log(values)
    axiosWithAuth().post(`http://localhost:5000/api/colors`, values)
      .then(res => console.log(res))
      .catch(err => console.log(err))
  }
})(ColorList)

export default FormikForm
